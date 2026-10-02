import { useParams, useNavigate } from "react-router-dom";
import StudentSubmissionTable from "../teacherComponent/StudentSubmissionTable";
import { useSelector } from "react-redux";
import { FileDown, CalendarDays, Award, ArrowLeft, FileText } from "lucide-react";

export default function AssignmentDetails() {
  const navigate = useNavigate();
  const assignments = useSelector((state) => state.assignment?.assignments || []);
  const { id } = useParams();

  const assignment = assignments.find((item) => item.id === id);

  if (!assignment) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-8">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-indigo-100 border-t-indigo-600" />
        <p className="text-sm font-semibold text-slate-500">Loading assignment details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20 ring-inset">
            Active Assignment
          </span>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-600/10">
              <FileText size={24} />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {assignment?.title}
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                Assignment Overview & Submissions
              </p>
            </div>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 sm:text-sm">
            <FileDown size={17} />
            <span>Download Question PDF</span>
          </button>
        </div>

        {assignment?.description && (
          <div className="mt-6 border-t border-slate-100 pt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Description & Instructions
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {assignment.description}
            </p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-2 sm:p-5">
          <div className="flex items-center gap-3.5 rounded-lg bg-white p-3.5 shadow-xs ring-1 ring-slate-200/60">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <CalendarDays size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Due Date
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-900">
                {assignment?.dueDate || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-lg bg-white p-3.5 shadow-xs ring-1 ring-slate-200/60">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Award size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Marks
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-900">
                {assignment?.totalMarks ? `${assignment.totalMarks} Points` : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <StudentSubmissionTable assignment={assignment} />
    </div>
  );
}