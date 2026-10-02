const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000";

export const checkPlagiarism = async ({ fileUrl, studentId, studentName, subject, assignmentId }) => {
  const cacheKey = `plagiarism:${assignmentId}:${studentId}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const savedResult = JSON.parse(cached);
      if (savedResult.fileUrl === fileUrl) return savedResult.result;
    }
  } catch {
    localStorage.removeItem(cacheKey);
  }

  const res = await fetch(`${API_BASE}/api/evaluate/by-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileUrl, studentId, studentName, subject, assignmentId }),
    signal: AbortSignal.timeout(60000),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Plagiarism check failed.");
  }

  try {
    localStorage.setItem(cacheKey, JSON.stringify({ fileUrl, result: data }));
  } catch (err) {
    console.warn("Could not cache plagiarism result.", err);
  }

  return data;
};