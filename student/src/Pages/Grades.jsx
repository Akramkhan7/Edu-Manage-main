import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Award,
} from "lucide-react";
import { fetchSubmissions } from "../Store/submissionSlice";

const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000";
const EMPTY_LIST = [];

const markColor = (obtained, total) => {
  if (!total) return "text-slate-900";
  const percentage = (obtained / total) * 100;
  if (percentage >= 15) return "text-emerald-600";
  if (percentage >= 10) return "text-indigo-600";
  if (percentage >= 6) return "text-amber-600";
  return "text-rose-600";
};

export default function Grades() {
  const dispatch = useDispatch();

  const assignments = useSelector((state) => state.assignment?.assignments) || EMPTY_LIST;
  const submissions = useSelector((state) => state.submission?.submissions) || EMPTY_LIST;
  const subjects = useSelector((state) => state.subject?.subjects) || EMPTY_LIST;
  const studentId = useSelector((state) => state.auth?.studentId);
  const studentName = useSelector((state) => state.auth?.profile?.name);

  const [openSubject, setOpenSubject] = useState("");
  const [plagiarismScores, setPlagiarismScores] = useState({});


  useEffect(() => {
    const handleFocus = () => {
      if (studentId) dispatch(fetchSubmissions(studentId));
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [dispatch, studentId]);

  useEffect(() => {
    let isActive = true;

    const fetchMissingScores = async () => {
      for (const submission of submissions) {
        const savedScore =
          submission.plagiarismDetails?.score ?? submission.plagiarism;
        if (typeof savedScore === "number" || !submission.fileUrl) continue;

        const assignment = assignments.find(
          (item) => item.id === submission.assignmentId,
        );
        if (!assignment || !studentId) continue;

        try {
          const res = await fetch(`${API_BASE}/api/evaluate/by-url`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileUrl: submission.fileUrl,
              studentId,
              studentName: studentName || "Student",
              subject: assignment.subjectId,
              assignmentId: assignment.id,
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
              [assignment.id]: data.plagiarism.plagiarismScore,
            }));
          }
        } catch (err) {
          if (isActive) console.error("Could not load plagiarism score:", err);
        }
      }
    };

    fetchMissingScores();

    return () => {
      isActive = false;
    };
  }, [assignments, submissions, studentId, studentName]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Grades & Feedback
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            View marks, grades, plagiarism analysis, and teacher feedback.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="mb-3 rounded-full bg-slate-100 p-3">
              <BookOpen size={22} className="text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-700">No subjects found</p>
            <p className="text-xs text-slate-400 mt-1">
              Your registered subjects will appear here.
            </p>
          </div>
        ) : (
          subjects.map((subject) => {
            const isOpen = openSubject === subject.id;

            const subjectAssignments = assignments.filter(
              (item) => item.subjectId === subject.id
            );

            const items = subjectAssignments
              .map((assignment) => {
                const submission = submissions.find(
                  (sub) => sub.assignmentId === assignment.id
                );
                return { assignment, submission };
              })
              .filter(({ submission }) => Boolean(submission));

            const reviewed = items.filter(
              ({ submission }) => submission.status === "Reviewed"
            ).length;

            return (
              <div
                key={subject.id}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "border-indigo-200 bg-white shadow-lg shadow-slate-200/50"
                    : "border-slate-200/80 bg-white shadow-sm hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenSubject(isOpen ? "" : subject.id)}
                  className="flex w-full flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between text-left transition-colors hover:bg-slate-50/80 focus:outline-none"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isOpen
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {isOpen ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <BookOpen size={20} />
                    </div>

                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 leading-snug">
                        {subject.name}
                      </h2>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        Semester {subject.semester} • {subject.branch}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>
                        {reviewed} / {items.length} Evaluated
                      </span>
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-6 space-y-3">
                    {items.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center bg-white rounded-xl border border-dashed border-slate-200">
                        <div className="mb-2 rounded-full bg-slate-100 p-3">
                          <FileText size={22} className="text-slate-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-600">
                          No submissions recorded
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Submitted work for this subject will display grade results here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {items.map(({ assignment, submission }) => {
                          const isReviewed = submission.status === "Reviewed";
                          const storedPlagiarismScore =
                            submission.plagiarismDetails?.score ??
                            submission.plagiarism;
                          const plagiarismScore =
                            typeof storedPlagiarismScore === "number"
                              ? storedPlagiarismScore
                              : plagiarismScores[assignment.id];
                          const isPassed =
                            submission.totalMarks >= assignment.totalMarks * 0.4;

                          return (
                            <div
                              key={assignment.id}
                              className="rounded-xl border border-slate-200/80 bg-white p-5 transition-all duration-200 hover:border-indigo-200 hover:shadow-md space-y-4"
                            >
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                                      {assignment.title}
                                    </h3>

                                    {isReviewed ? (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                        <CheckCircle2 size={11} />
                                        Reviewed
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-inset ring-amber-200">
                                        <Clock size={11} />
                                        Under Review
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-0.5">
                                    <div className="flex items-center gap-1">
                                      <CalendarDays
                                        size={13}
                                        className="text-slate-400"
                                      />
                                      <span>
                                        Submitted: {submission.submittedAt}
                                      </span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                      <Award
                                        size={13}
                                        className="text-slate-400"
                                      />
                                      <span>
                                        Max Marks: {assignment.totalMarks}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {isReviewed && (
                                <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
                                  {/* Marks Card */}
                                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                      Marks
                                    </p>
                                    <h4
                                      className={`mt-1 text-xl font-black ${markColor(
                                        submission.totalMarks,
                                        assignment.totalMarks
                                      )}`}
                                    >
                                      {submission.totalMarks}
                                      <span className="text-xs text-slate-400 font-semibold">
                                        /{assignment.totalMarks}
                                      </span>
                                    </h4>
                                  </div>

                                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                      Grade
                                    </p>
                                    <h4 className="mt-1 text-xl font-black text-indigo-600">
                                      {submission.grade || "N/A"}
                                    </h4>
                                  </div>

                                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 flex flex-col justify-between">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                      Status
                                    </p>
                                    <div>
                                      <span
                                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-black uppercase tracking-wider ${
                                          isPassed
                                            ? "bg-emerald-100 text-emerald-800"
                                            : "bg-rose-100 text-rose-800"
                                        }`}
                                      >
                                        {!isPassed && (
                                          <AlertTriangle size={12} />
                                        )}
                                        {isPassed ? "PASS" : "RESUBMIT"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 sm:max-w-48">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                  Plagiarism
                                </p>
                                <h4
                                  className={`mt-1 text-xl font-black ${
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
                                </h4>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}