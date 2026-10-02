import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Plus,
  AlertTriangle,
  BookOpen,
  Layers,
  GraduationCap,
  Lock,
} from "lucide-react";

import SubjectModal from "../Modal/SubjectModal";

export default function Subjects() {
  const [open, setOpen] = useState(false);

  const subjects = useSelector((state) => state.subject.subjects);
  const teacherId = useSelector((state) => state.auth.teacherId);

  const teacherSubjects = subjects.filter(
    (subject) => subject.teacherId === teacherId
  );

  const hasSubject = teacherSubjects.length > 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Subjects Management
          </h1>
          <p className="text-xs font-semibold text-slate-500 sm:text-sm">
            Overview and controls for the subjects you teach.
          </p>
        </div>

        <button
          onClick={() => !hasSubject && setOpen(true)}
          disabled={hasSubject}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-200 sm:text-sm ${
            hasSubject
              ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 shadow-none"
              : "bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 hover:shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
          }`}
        >
          <Plus size={16} />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Locked Subject Notice Banner */}
      {hasSubject && (
        <div className="flex items-start gap-3.5 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 sm:p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100/80 text-amber-700 ring-1 ring-amber-600/10">
            <AlertTriangle size={18} />
          </div>

          <div className="space-y-1 pt-0.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 sm:text-sm">
              Subject Capacity Reached
            </h3>
            <p className="text-xs font-medium leading-relaxed text-amber-800/90 sm:text-sm">
              You have already created your active subject. Subject details
              cannot be edited or replaced, and each teacher account is limited
              to one primary subject.
            </p>
          </div>
        </div>
      )}

      {/* Subjects Display / Empty State */}
      {teacherSubjects.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-xs ring-1 ring-slate-200/60">
            <BookOpen size={22} />
          </div>
          <h3 className="mt-4 text-sm font-bold text-slate-900">
            No Subject Created
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Create your teaching subject to start organizing coursework and
            assignments.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-600/20"
          >
            <Plus size={15} />
            <span>Create Subject</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {teacherSubjects.map((subject) => (
            <div
              key={subject.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-600/10">
                  <BookOpen size={22} />
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200 ring-inset">
                  <Lock size={12} className="text-slate-400" />
                  Active Course
                </span>
              </div>

              <div className="mt-5 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Subject Name
                </p>
                <h2 className="text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600 sm:text-lg">
                  {subject.name}
                </h2>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <Layers size={13} className="text-slate-400" />
                    Semester
                  </div>
                  <p className="text-xs font-bold text-slate-800 sm:text-sm">
                    {subject.semester ? `Semester ${subject.semester}` : "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <GraduationCap size={13} className="text-slate-400" />
                    Branch
                  </div>
                  <p className="text-xs font-bold text-slate-800 sm:text-sm">
                    {subject.branch || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subject Modal Integration */}
      {!hasSubject && (
        <SubjectModal open={open} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}