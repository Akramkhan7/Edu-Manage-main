import { Award } from "lucide-react";

const badgeColor = (marks) => {
  if (marks >= 16) return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (marks >= 12) return "bg-indigo-50 text-indigo-700 ring-indigo-200";
  if (marks >= 8)  return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-rose-50 text-rose-700 ring-rose-200";
};

export default function RecentGradeCard({ grades = [], onViewAll }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:border-slate-300">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            Recent Grades
          </h2>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            Your latest evaluated assignments
          </p>
        </div>

       
      </div>

      {!grades || grades.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <div className="mb-2 rounded-full bg-slate-100 p-2.5">
            <Award size={18} className="text-slate-400" />
          </div>
          <p className="text-xs font-bold text-slate-600">No grades evaluated yet</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Evaluated work will appear here once reviewed.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {grades.map((item) => (
            <div
              key={item.assignmentId || item.id}
              className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-4 transition-all duration-200 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {item.assignmentTitle || item.title}
                </h3>

                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                  <span>
                    Grade: <span className="font-extrabold text-indigo-600">{item.grade || "N/A"}</span>
                  </span>
                  {item.submittedAt && (
                    <>
                      <span>•</span>
                      <span className="text-slate-400">{item.submittedAt}</span>
                    </>
                  )}
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold ring-1 ring-inset ${badgeColor(
                  item.totalMarks
                )}`}
              >
                {item.totalMarks} / 20
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}