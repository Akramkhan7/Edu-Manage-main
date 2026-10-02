import { Eye, Unlock, Lock, FolderOpen, Calendar, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AssignmentItem({ assignments, onOpen }) {
  const navigate = useNavigate();

  if (!assignments || assignments.length === 0) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200/60">
          <FolderOpen size={22} />
        </div>
        <h3 className="mt-4 text-sm font-bold text-slate-900">
          No assignments available
        </h3>
        <p className="mt-1 text-xs font-medium text-slate-500">
          There are no assignments created for this subject yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => {
        const unlocked = assignment.unlocked;

        return (
          <div
            key={assignment.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${
                      unlocked
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                        : "bg-amber-50 text-amber-700 ring-amber-600/20"
                    }`}
                  >
                    {unlocked ? (
                      <Unlock size={12} className="text-emerald-600" />
                    ) : (
                      <Lock size={12} className="text-amber-600" />
                    )}
                    {unlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600 sm:text-lg">
                  {assignment.title}
                </h3>

                {(assignment.dueDate || assignment.totalMarks) && (
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                    {assignment.dueDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        Due: {assignment.dueDate}
                      </span>
                    )}
                    {assignment.totalMarks && (
                      <span className="flex items-center gap-1.5">
                        <Award size={13} className="text-slate-400" />
                        {assignment.totalMarks} Marks
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end pt-2 sm:pt-0">
                {unlocked ? (
                  <button
                    onClick={() => navigate(`/assignments/${assignment.id}`)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 sm:w-auto sm:text-sm"
                  >
                    <Eye size={16} />
                    <span>View Assignment</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onOpen(assignment)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-amber-600 hover:shadow-amber-500/20 focus:outline-none focus:ring-2 focus:ring-amber-500/20 sm:w-auto sm:text-sm"
                  >
                    <Unlock size={16} />
                    <span>Unlock Assignment</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AssignmentItem;
