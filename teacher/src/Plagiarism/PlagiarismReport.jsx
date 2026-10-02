import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CircleAlert,
  CircleCheck,
  FileText,
  User,
  CalendarDays,
  Send,
  AlertTriangle,
  ArrowLeft,
  Mail,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";
import { checkPlagiarism } from "../api/plagiarism";

export default function PlagiarismReport() {
  const { assignmentId, studentId } = useParams();
  const navigate = useNavigate();
  const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;

  const [submission, setSubmission] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [marks, setMarks] = useState("");
  const [grade, setGrade] = useState("A+");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      try {
        const [subRes, assignRes] = await Promise.all([
        fetch(`${db_url}/submissions/${assignmentId}/${studentId}.json`),
        fetch(`${db_url}/assignments/${assignmentId}.json`),
        ]);
        const subData = await subRes.json();
        const assignData = await assignRes.json();
        let reportSubmission = subData;

        if (
          subData?.fileUrl &&
          assignData?.subjectId &&
          typeof subData.plagiarism !== "number" &&
          typeof subData.plagiarismDetails?.score !== "number"
        ) {
          try {
            const result = await checkPlagiarism({
              fileUrl: subData.fileUrl,
              studentId,
              studentName: subData.profile?.name || "Student",
              subject: assignData.subjectId,
              assignmentId,
            });

            if (result.success) {
              const plagiarism = result.plagiarism;
              reportSubmission = {
                ...subData,
                plagiarism: plagiarism.plagiarismScore,
                plagiarismDetails: {
                  ...subData.plagiarismDetails,
                  score: plagiarism.plagiarismScore,
                  isPlagiarized: plagiarism.isPlagiarized,
                  matchedSources: plagiarism.matchedSources || [],
                },
              };
            }
          } catch (err) {
            console.error("Error fetching plagiarism result:", err);
          }
        }

        if (isActive) {
          setSubmission(reportSubmission);
          setAssignment(assignData);
          setMarks(reportSubmission?.totalMarks !== undefined ? String(reportSubmission.totalMarks) : "");
          setGrade(reportSubmission?.grade || "A+");
        }
      } catch (err) {
        if (isActive) {
          console.error("Error fetching submission report:", err);
          toast.error("Failed to load report details.");
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [assignmentId, studentId, db_url]);

  const handleSave = async (publish) => {
    if (marks.trim() === "") {
      toast.error("Please fill the marks field.");
      return;
    }

    setSaving(true);
    const updatedStatus = publish ? "Reviewed" : "Pending";
    const numericMarks = Number(marks);

    const updatePayload = {
      totalMarks: numericMarks,
      grade,
      status: updatedStatus,
    };

    try {
      const res = await fetch(
        `${db_url}/submissions/${assignmentId}/${studentId}.json`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!res.ok) throw new Error("Failed to save evaluation.");

      setSubmission((prev) => ({
        ...prev,
        ...updatePayload,
      }));

      toast.success(
        submission?.status === "Reviewed"
          ? "Evaluation updated successfully!"
          : "Grade & evaluation published successfully!"
      );
    } catch (err) {
      console.error("Error saving evaluation:", err);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-8">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-indigo-100 border-t-indigo-600" />
        <p className="text-sm font-semibold text-slate-500">
          Loading plagiarism report...
        </p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-200/60">
          <FileText size={22} />
        </div>
        <h3 className="text-sm font-bold text-slate-900">
          Submission not found
        </h3>
        <p className="text-xs font-medium text-slate-500">
          We couldn't retrieve the requested student submission.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition-all duration-200 hover:bg-slate-50"
        >
          <ArrowLeft size={14} />
          <span>Back to Submissions</span>
        </button>
      </div>
    );
  }

  const score =
    submission.plagiarismDetails?.score ?? submission.plagiarism ?? null;
  const matchedSources = submission.plagiarismDetails?.matchedSources || [];
  const isHigh = score !== null && score > 10;
  const angle = Math.round(((score ?? 0) / 100) * 360);
  const isReviewed = submission?.status === "Reviewed";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${
              isReviewed
                ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                : "bg-amber-50 text-amber-700 ring-amber-600/20"
            }`}
          >
            {isReviewed ? "Reviewed" : "Pending Review"}
          </span>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-600/10">
              <FileText size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {assignment?.title || "Assignment"}
              </p>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Plagiarism & Evaluation Report
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 sm:px-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white font-bold text-indigo-600 shadow-xs ring-1 ring-slate-200/60">
                <User size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {submission.profile?.name || "Student"}
                </p>
                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <Mail size={12} className="text-slate-400" />
                  <span>{submission.profile?.email || "No email"}</span>
                </div>
              </div>
            </div>

            <div className="hidden h-8 w-px bg-slate-200/80 sm:block" />

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <CalendarDays size={14} className="text-slate-400" />
              <span>{submission.submittedAt || "Submitted"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200 sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="relative flex h-44 w-44 shrink-0 items-center justify-center self-center sm:h-48 sm:w-48">
            <div
              className="absolute inset-0 rounded-full transition-all duration-500"
              style={{
                background: `conic-gradient(${
                  isHigh ? "#f43f5e" : "#10b981"
                } 0deg ${angle}deg, #f1f5f9 ${angle}deg 360deg)`,
              }}
            />
            <div className="absolute inset-5 rounded-full bg-white shadow-xs" />
            <div className="relative text-center">
              <h2
                className={`text-4xl font-extrabold tracking-tight sm:text-5xl ${
                  score === null
                    ? "text-slate-500"
                    : isHigh
                      ? "text-rose-600"
                      : "text-emerald-600"
                }`}
              >
                {score === null ? "Not checked" : `${score}%`}
              </h2>
              <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                Similarity
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  isHigh
                    ? "bg-rose-50 text-rose-600 ring-1 ring-rose-600/10"
                    : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/10"
                }`}
              >
                {isHigh ? <CircleAlert size={20} /> : <CircleCheck size={20} />}
              </div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                {score === null
                  ? "Plagiarism result unavailable"
                  : isHigh
                    ? "High similarity detected"
                    : "No significant plagiarism"}
              </h2>
            </div>

            <p className="max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm">
              {score === null
                ? "No plagiarism result is available yet."
                : matchedSources.length > 0
                ? `Matched against ${matchedSources.length} source${
                    matchedSources.length > 1 ? "s" : ""
                  } in this class.`
                : "No matching submissions or internet sources found for this paper."}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-emerald-700 hover:shadow-emerald-600/20 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                <CircleCheck size={16} />
                <span>
                  {saving
                    ? "Saving..."
                    : isReviewed
                    ? "Update Grade"
                    : "Accept & Quick Grade"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {matchedSources.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-200">
          <div className="border-b border-slate-100 p-6 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-600/10">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Matched Sources
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  {matchedSources.length} similarity match
                  {matchedSources.length > 1 ? "es" : ""} flagged
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-100 bg-slate-50/70">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Source
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                    Similarity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matchedSources.map((item, index) => (
                  <tr
                    key={index}
                    className="transition-colors duration-150 hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-4 text-xs font-bold text-slate-800 sm:text-sm">
                      {item.source}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${
                          item.similarity > 30
                            ? "bg-rose-50 text-rose-700 ring-rose-600/20"
                            : "bg-amber-50 text-amber-700 ring-amber-600/20"
                        }`}
                      >
                        {item.similarity}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-600/10">
            <Award size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              Teacher Review & Evaluation
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              Grade assignment and provide student feedback
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Marks Awarded
            </label>
            <input
              type="number"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              placeholder="Enter marks e.g. 15"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all hover:border-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 sm:text-sm"
            >
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="Fail">Fail</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-6">
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          >
            <Send size={15} />
            <span>
              {saving
                ? "Publishing..."
                : isReviewed
                ? "Update Evaluation"
                : "Publish Grade"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}