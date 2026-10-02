import { extractTextFromPDF, extractTextFromPDFUrl } from "../utils/pdfParser.js";
import { checkAgainstAllAssignments } from "../utils/plagiarismChecker.js";
import {
  saveAssignment,
  getOldAssignments,
  getSubmissionPlagiarism,
  updateSubmissionPlagiarism,
} from "../utils/assignmentStore.js";

export const evaluateAssignment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No PDF file uploaded" });
    }

    const { studentId, studentName, subject } = req.body;
    if (!studentId || !studentName || !subject) {
      return res.status(400).json({ success: false, message: "studentId, studentName, and subject are required" });
    }

    const text = await extractTextFromPDF(req.file.buffer);
    const oldAssignments = await getOldAssignments(subject, studentId);
    const plagiarismResult = checkAgainstAllAssignments(text, oldAssignments);
    const savedId = await saveAssignment({ studentId, studentName, subject, rawText: text, plagiarismResult });

    res.status(200).json({ success: true, submissionId: savedId, text, plagiarism: plagiarismResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Used by the teacher dashboard: checks a submission already stored in Firebase (has a fileUrl)
export const evaluateAssignmentByUrl = async (req, res) => {
  try {
    const { fileUrl, studentId, studentName, subject, assignmentId } = req.body;

    if (!fileUrl || !studentId || !studentName || !subject || !assignmentId) {
      return res.status(400).json({
        success: false,
        message: "fileUrl, studentId, studentName, subject, and assignmentId are required",
      });
    }

    const existingResult = await getSubmissionPlagiarism(assignmentId, studentId);
    if (existingResult) {
      return res.status(200).json({ success: true, plagiarism: existingResult });
    }

    console.log(`Checking plagiarism for ${studentName} (${studentId})`);

    const text = await extractTextFromPDFUrl(fileUrl);
    const oldAssignments = await getOldAssignments(subject, studentId);
    const plagiarismResult = checkAgainstAllAssignments(text, oldAssignments);

    // Add this submission to the historical corpus so future submissions compare against it too
    await saveAssignment({ studentId, studentName, subject, rawText: text, plagiarismResult });

    // Write the score onto the submission record so the teacher table can display it
    
    await updateSubmissionPlagiarism(assignmentId, studentId, plagiarismResult);

    res.status(200).json({ success: true, plagiarism: plagiarismResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};