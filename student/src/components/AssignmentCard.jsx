import { CalendarDays, ArrowRight, BookOpen } from "lucide-react";

const statusColor = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200/80",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200/80",
  Submitted: "bg-indigo-50 text-indigo-700 ring-indigo-200/80",
  Locked: "bg-slate-100 text-slate-600 ring-slate-200/80",
};

const AssignmentCard = ({ assignments }) => {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-200/40">
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
            Recent Assignments
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Stay on top of your upcoming tasks and deadlines
          </p>
        </div>
        <button className="group inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 transition-all hover:bg-indigo-100 hover:text-indigo-700">
          <span>View All</span>
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>

      <div className="space-y-3.5">
        {assignments?.map((assignment) => (
          <div
            key={assignment.id}
            className="group rounded-2xl border border-slate-200/80 bg-white p-4.5 transition-all duration-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/60 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <BookOpen size={18} />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                      {assignment.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Instructor: {assignment.teacher}
                    </p>
                  </div>
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ring-inset ${
                  statusColor[assignment.status] ?? "bg-slate-100 text-slate-700 ring-slate-200"
                }`}
              >
                {assignment.status}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100/80 pt-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <CalendarDays size={14} className="text-slate-400" />
                <span>Due: {assignment.dueDate}</span>
              </div>

              <button className="group/btn inline-flex items-center gap-1.5 font-bold text-indigo-600 transition-all hover:text-indigo-700">
                <span>View Details</span>
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover/btn:translate-x-0.5"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentCard;