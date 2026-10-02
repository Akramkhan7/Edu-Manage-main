/**
 * PLAGIARISM DETECTION ENGINE
 * Structure:
 * 1. Preprocessing (Clean & Prepare)
 * 2. Comparison (Calculate Similarity Metrics)
 * 3. Verdict (Score & Decide)
 */

// ==========================================
// STEP 1: PREPROCESSING (Clean & Prepare)
// ==========================================

function preprocess(text) {
  // Fix: Handle null/undefined inputs to prevent TypeError
  const safeText = (text || "").toString();

  const clean = safeText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ") // Remove special chars
    .replace(/\s+/g, " ")         // Collapse whitespace
    .trim();
    
  const tokens = clean.split(" ").filter(Boolean);
  
  return {
    text: clean,
    tokens: tokens,
    wordSet: new Set(tokens)
  };
}

function getNgrams(tokens, n = 5) {
  const grams = new Set();
  for (let i = 0; i <= tokens.length - n; i++) {
    grams.add(tokens.slice(i, i + n).join(" "));
  }
  return grams;
}

// Helper for TF-IDF Vectorization
function getVector(tokens, vocab, idf) {
  const tf = {};
  tokens.forEach(w => tf[w] = (tf[w] || 0) + 1);
  const maxFreq = Math.max(...Object.values(tf)) || 1;
  
  return vocab.map(w => {
    const tfVal = (tf[w] || 0) / maxFreq;
    return tfVal * (idf[w] || 0);
  });
}

function cosineSimilarity(vecA, vecB) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }
  return (magA && magB) ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
}

// ==========================================
// STEP 2: COMPARISON (Calculate Metrics)
// ==========================================

function calculateMetrics(docA, docB) {
  // A. N-Gram Overlap (Exact Phrase Matching)
  const n = 5;
  if (docA.tokens.length < n || docB.tokens.length < n) return { ngram: 0, tfidf: 0, jaccard: 0 };
  
  const setA = getNgrams(docA.tokens, n);
  const setB = getNgrams(docB.tokens, n);
  let intersection = 0;
  setA.forEach(g => { if (setB.has(g)) intersection++; });
  const ngramSim = intersection / Math.min(setA.size, setB.size);

  // B. Jaccard Similarity (Word Overlap)
  const union = new Set([...docA.wordSet, ...docB.wordSet]);
  const intersectWords = [...docA.wordSet].filter(x => docB.wordSet.has(x));
  const jaccardSim = union.size ? intersectWords.length / union.size : 0;

  // C. TF-IDF Similarity (Structural/Content)
  // Build mini-corpus vocabulary
  const vocab = Array.from(union);
  const docCount = 2;
  const idf = {};
  
  vocab.forEach(word => {
    let count = 0;
    if (docA.wordSet.has(word)) count++;
    if (docB.wordSet.has(word)) count++;
    idf[word] = Math.log(docCount / (count + 1)); // Simple IDF
  });

  const vecA = getVector(docA.tokens, vocab, idf);
  const vecB = getVector(docB.tokens, vocab, idf);
  const tfidfSim = cosineSimilarity(vecA, vecB);

  return {
    ngram: ngramSim,
    jaccard: jaccardSim,
    tfidf: tfidfSim
  };
}

// ==========================================
// STEP 3: VERDICT (Score & Decide)
// ==========================================

function getVerdict(metrics) {
  const { ngram, jaccard, tfidf } = metrics;
  const reasons = [];
  let score = 0;

  // Weighted Scoring
  // N-gram (40%): Direct copying
  if (ngram > 0.3) {
    score += ngram * 40;
    reasons.push("Significant exact phrase overlap detected.");
  }
  // TF-IDF (40%): Structural similarity
  if (tfidf > 0.75) {
    score += tfidf * 40;
    reasons.push("Document structure and key terms are highly similar.");
  }
  // Jaccard (20%): Vocabulary reuse
  if (jaccard > 0.6) {
    score += jaccard * 20;
    reasons.push("High usage of identical vocabulary.");
  }

  // Normalize score to 0-100
  score = Math.min(100, Math.round(score));

  // Threshold Logic
  const isPlagiarized = score >= 50 || (ngram > 0.35 && tfidf > 0.8);

  if (!isPlagiarized && score > 20) {
    reasons.push("Moderate similarity found, likely same topic.");
  } else if (reasons.length === 0) {
    reasons.push("No significant plagiarism detected.");
  }

  return { isPlagiarized, score, reasons };
}

// ==========================================
// PUBLIC EXPORTS
// ==========================================

export function compareAssignments(newTextRaw, oldTextRaw) {
  // 1. Preprocess
  const docA = preprocess(newTextRaw);
  const docB = preprocess(oldTextRaw);

  // 2. Compare
  const metrics = calculateMetrics(docA, docB);

  // 3. Decide
  const verdict = getVerdict(metrics);

  return {
    ngramScore: parseFloat(metrics.ngram.toFixed(2)),
    tfidfSimilarity: parseFloat(metrics.tfidf.toFixed(2)),
    jaccardSimilarity: parseFloat(metrics.jaccard.toFixed(2)),
    isPlagiarized: verdict.isPlagiarized,
    plagiarismScore: verdict.score,
    reasons: verdict.reasons
  };
}

export function checkAgainstAllAssignments(newTextRaw, oldAssignments = []) {
  const results = oldAssignments.map(old => {
    // Ensure we are passing a valid string, even if old.text is undefined
    const result = compareAssignments(newTextRaw, old.rawText);
    return {
      againstId: old.id,
      againstStudentName: old.studentName,
      ...result
    };
  });

  // Sort by highest score first
  results.sort((a, b) => b.plagiarismScore - a.plagiarismScore);
  const mostSuspicious = results[0] || null;

  return {
    isPlagiarized: mostSuspicious ? mostSuspicious.isPlagiarized : false,
    plagiarismScore: mostSuspicious ? mostSuspicious.plagiarismScore : 0,
    mostSuspicious,
    allResults: results
  };
}