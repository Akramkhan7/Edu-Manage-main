import { CalendarDays, ArrowRight, Clock, BookOpen } from "lucide-react";

export default function UpcomingAssignments({ deadlines = [], onViewAll }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:border-slate-300">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            Upcoming Deadlines
          </h2>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            Assignments due in the coming days
          </p>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none"
          >
            View All
          </button>
        )}
      </div>

      {!deadlines || deadlines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <div className="mb-2 rounded-full bg-slate-100 p-2.5">
            <Clock size={18} className="text-slate-400" />
          </div>
          <p className="text-xs font-bold text-slate-600">No upcoming deadlines</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            You're all caught up with your submissions!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {deadlines.map((item) => (
            <div
              key={item.id || item.assignmentId}
              className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-4 transition-all duration-200 hover:border-indigo-200 "
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.title || item.assignmentTitle}
                  </h3>

                  {item.subjectName && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-blue-600 border border-slate-200">
                      <BookOpen size={10} />
                      {item.subjectName}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1">
                    <CalendarDays size={13} className="text-slate-400" />
                    <span>Due: {item.dueDate}</span>
                  </div>

                  {item.totalMarks && (
                    <>
                      <span>•</span>
                      <span className="text-slate-400">
                        Marks: {item.totalMarks}
                      </span>
                    </>
                  )}
                </div>
              </div>

            
            </div>
          ))}
        </div>
      )}
    </div>
  );
}