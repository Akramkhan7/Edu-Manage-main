import { db } from "../config/firebase.js";

export const saveAssignment = async ({ studentId, studentName, subject, rawText, plagiarismResult }) => {
  const ref = db.ref("assignments").push();
  await ref.set({
    id: ref.key,
    studentId,
    studentName,
    subject,
    rawText,
    plagiarismScore: plagiarismResult.plagiarismScore,
    isPlagiarized: plagiarismResult.isPlagiarized,
    createdAt: Date.now(),
  });
  return ref.key;
};

export const getOldAssignments = async (subject, studentId) => {
  const snapshot = await db.ref("assignments").orderByChild("subject").equalTo(subject).once("value");
  const data = snapshot.val();
  if (!data) return [];

  return Object.values(data)
    .filter((item) => item.studentId !== studentId)
    .map((item) => ({
      id: item.id,
      studentName: item.studentName,
      rawText: item.rawText,
    }));
};

export const getSubmissionPlagiarism = async (assignmentId, studentId) => {
  const snapshot = await db
    .ref(`submissions/${assignmentId}/${studentId}`)
    .once("value");
  const submission = snapshot.val();

  if (!submission || typeof submission.plagiarism !== "number") return null;

  return {
    plagiarismScore: submission.plagiarism,
    isPlagiarized: submission.plagiarismDetails?.isPlagiarized || false,
    matchedSources: submission.plagiarismDetails?.matchedSources || [],
  };
};

export const updateSubmissionPlagiarism = async (assignmentId, studentId, plagiarismResult) => {
  const matchedSources = plagiarismResult.allResults
    .filter((r) => r.plagiarismScore > 0)
    .map((r) => ({
      source: `${r.againstStudentName} — submission (this class)`,
      similarity: r.plagiarismScore,
    }));

  await db.ref(`submissions/${assignmentId}/${studentId}`).update({
    plagiarism: plagiarismResult.plagiarismScore,
    plagiarismDetails: {
      score: plagiarismResult.plagiarismScore,
      isPlagiarized: plagiarismResult.isPlagiarized,
      matchedSources,
      checkedAt: Date.now(),
    },
  });
};