import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Loader2,
  ArrowLeft,
  CalendarDays,
  Eye,
  CheckCircle2,
  CircleCheckBig,
  Upload,
  BadgeCheck,
  Clock3,
  X,
  FileText,
  FileUp,
  AlertCircle,
} from "lucide-react";
import { submissionActions } from "../../Store/submissionSlice";

const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000";

export default function AssignmentDetails() {
  const { subjectId, assignmentId } = useParams();
  const [uploading, setUploading] = useState(false);
  const [showQuestionPaper, setShowQuestionPaper] = useState(false);
  const [file, setFile] = useState(null);
  const [plagiarismScores, setPlagiarismScores] = useState({});

  const subjects = useSelector((state) => state.subject.subjects);
  const assignments = useSelector((state) => state.assignment.assignments);
  const submissions = useSelector((state) => state.submission.submissions);
  const studentId = useSelector((state) => state.auth.studentId);
  const profile = useSelector((state) => state.auth.profile);

  const submission = submissions.find(
    (item) => item.assignmentId === assignmentId
  );

  const subject = subjects.find((item) => item.id === subjectId);
  const assignment = assignments.find((item) => item.id === assignmentId);
  const questionPaper = assignment?.pdf;

  const dispatch = useDispatch();
  const storedPlagiarismScore =
    submission?.plagiarismDetails?.score ?? submission?.plagiarism;
  const plagiarismScore =
    typeof storedPlagiarismScore === "number"
      ? storedPlagiarismScore
      : plagiarismScores[assignmentId];

  useEffect(() => {
    let isActive = true;

    const fetchPlagiarismScore = async () => {
      if (
        !submission?.fileUrl ||
        typeof storedPlagiarismScore === "number" ||
        !assignment?.subjectId ||
        !studentId
      ) {
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/evaluate/by-url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileUrl: submission.fileUrl,
            studentId,
            studentName: profile?.name || "Student",
            subject: assignment.subjectId,
            assignmentId,
          }),
          signal: AbortSignal.timeout(60000),
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Could not load plagiarism score.");
        }

        if (
          isActive &&
          typeof data.plagiarism?.plagiarismScore === "number"
        ) {
          setPlagiarismScores((prev) => ({
            ...prev,
            [assignmentId]: data.plagiarism.plagiarismScore,
          }));
        }
      } catch (err) {
        if (isActive) console.error("Could not load plagiarism score:", err);
      }
    };

    fetchPlagiarismScore();

    return () => {
      isActive = false;
    };
  }, [
    assignment?.id,
    assignment?.subjectId,
    assignmentId,
    profile?.name,
    studentId,
    storedPlagiarismScore,
    submission?.fileUrl,
  ]);

  const submitAssignment = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();

      const newSubmission = {
        studentId,
        profile,
        assignmentId,
        fileUrl: uploadData.secure_url,
        fileName: file.name,
        status: "Pending",
        submittedAt: new Date().toLocaleString(),
        obtainedMarks: null,
        grade: "",
        plagiarism: "",
        feedback: "",
      };

      const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;
      const res = await fetch(
        `${db_url}/submissions/${assignmentId}/${studentId}.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSubmission),
        }
      );

      if (res.ok) {
        dispatch(
          submissionActions.addSubmission({
            assignmentId,
            studentId,
            ...newSubmission,
          })
        );
      }
      toast.success("Assignment submitted successfully");
      setFile(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const statusStyles = {
    Submitted: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    Graded: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Back Link */}
      <Link
        to="/assignments"
        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm border border-slate-200/80 transition-all hover:bg-slate-50 hover:text-indigo-600"
      >
        <ArrowLeft size={15} />
        <span>Back to Assignments</span>
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-200/30">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  {subject?.name}
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {assignment?.title}
                </h1>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${
                  statusStyles[assignment?.status] ??
                  "bg-slate-100 text-slate-700 ring-slate-200"
                }`}
              >
                {assignment?.status ?? "Active"}
              </span>
            </div>

            {/* Metrics Ribbon */}
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50/80 p-4 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm border border-slate-100">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Due Date</p>
                  <p className="text-sm font-bold text-slate-900">{assignment?.dueDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm border border-slate-100">
                  <BadgeCheck size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Marks</p>
                  <p className="text-sm font-bold text-slate-900">{assignment?.totalMarks} Points</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Instructions & Description</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {assignment?.description}
              </p>
            </div>

  
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
              <button
                onClick={() => setShowQuestionPaper(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
              >
                <Eye size={16} className="text-slate-500" />
                <span>View Question Paper</span>
              </button>

              <input
                type="file"
                id="assignmentFile"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />

              <button
                type="button"
                disabled={!!submission || uploading}
                onClick={() =>
                  !submission &&
                  !uploading &&
                  document.getElementById("assignmentFile").click()
                }
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all ${
                  submission
                    ? "cursor-not-allowed bg-emerald-600 shadow-emerald-600/20"
                    : uploading
                      ? "cursor-not-allowed bg-indigo-400"
                      : "bg-indigo-600 shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95"
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : submission ? (
                  <>
                    <CircleCheckBig className="h-4 w-4" />
                    <span>Submitted</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload Solution</span>
                  </>
                )}
              </button>
            </div>

            {/* Selected File Stage Box */}
            {file && (
              <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-600 p-2.5 text-white shadow-sm">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="max-w-xs truncate text-xs font-bold text-slate-900">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-slate-500">Ready to submit</p>
                    </div>
                  </div>

                  {!uploading && (
                    <button
                      onClick={() => setFile(null)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <button
                  onClick={submitAssignment}
                  disabled={uploading}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white shadow-md transition-all ${
                    uploading
                      ? "cursor-not-allowed bg-emerald-400"
                      : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 active:scale-95"
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Finalizing Upload...</span>
                    </>
                  ) : (
                    <>
                      <CircleCheckBig className="h-4 w-4" />
                      <span>Confirm & Submit Assignment</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Status Box */}
        <div className="lg:col-span-1">
          {!submission ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-7 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <FileUp size={26} />
              </div>
              <h2 className="mt-4 text-base font-extrabold text-slate-900">
                Submission Pending
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Upload your assignment prior to the due date for instructor evaluation.
              </p>
            </div>
          ) : submission.status === "Pending" ? (
            <div className="rounded-3xl border border-amber-200/80 bg-amber-50/40 p-6 shadow-xl shadow-amber-500/5">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                  <Clock3 size={20} />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 text-base">
                    Under Evaluation
                  </h2>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Your file has been uploaded and is waiting to be reviewed.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-amber-200/60 bg-white p-4 text-xs space-y-1.5 shadow-sm">
                <p className="text-slate-500">
                  <span className="font-bold text-slate-800">File:</span>{" "}
                  {submission.fileName}
                </p>
                <p className="text-slate-400 text-[11px]">
                  Submitted on {submission.submittedAt}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-emerald-200/80 bg-white p-6 shadow-xl shadow-emerald-500/5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      Evaluated
                    </h2>
                    <p className="text-[11px] text-slate-500">Review complete</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Score</p>
                  <p className="mt-1 text-2xl font-extrabold text-indigo-600">
                    {submission.totalMarks}
                    <span className="text-xs font-medium text-slate-400">
                      /{assignment?.totalMarks}
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Grade</p>
                  <p className="mt-1 text-2xl font-extrabold text-emerald-600">
                    {submission.grade || "A"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 text-center flex flex-col justify-center items-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Result</p>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                      submission.totalMarks >= assignment?.totalMarks * 0.4
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {submission.totalMarks >= assignment?.totalMarks * 0.4
                      ? "Passed"
                      : "Resubmit"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {submission && (
            <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Plagiarism
              </p>
              <p
                className={`mt-1 text-xl font-extrabold ${
                  typeof plagiarismScore === "number"
                    ? plagiarismScore > 10
                      ? "text-rose-600"
                      : "text-emerald-600"
                    : "text-slate-400"
                }`}
              >
                {typeof plagiarismScore === "number"
                  ? `${plagiarismScore}%`
                  : "Pending"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PDF Modal Viewer */}
      {showQuestionPaper && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowQuestionPaper(false)}
        >
          <div
            className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  {assignment?.title}
                </h2>
                <p className="text-xs text-slate-500">Question Document Viewer</p>
              </div>
              <button
                onClick={() => setShowQuestionPaper(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="h-[75vh] bg-slate-100">
              {questionPaper ? (
                <iframe
                  src={questionPaper}
                  title="Question Paper"
                  className="h-full w-full border-none"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                  <AlertCircle size={36} />
                  <p className="text-sm font-semibold text-slate-600">No Document Attached</p>
                  <p className="text-xs">There is no question paper uploaded for this assignment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}