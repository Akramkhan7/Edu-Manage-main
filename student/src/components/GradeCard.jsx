const gradeColor = (marks) => {
  if (marks >= 90) return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (marks >= 75) return "text-blue-700 bg-blue-50 border-blue-200";
  if (marks >= 50) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-rose-700 bg-rose-50 border-rose-200";
};

export default function GradeCard({ grades = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
            Recent Grades
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Your latest assignment evaluations
          </p>
        </div>

        <button
          type="button"
          className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none"
        >
          View All
        </button>
      </div>

      {grades.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
          <p className="text-xs font-bold text-slate-600">No grades recorded yet</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Evaluated assignments will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {grades.map((grade) => (
            <div
              key={grade.id || grade.subject}
              className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-4 transition-all hover:border-indigo-200 hover:shadow-sm"
            >
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {grade.subject}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {grade.assignmentTitle || "Assignment Grade"}
                </p>
              </div>

              <span
                className={`rounded-full border px-3.5 py-1 text-xs font-black shadow-xs ${gradeColor(
                  grade.marks
                )}`}
              >
                {grade.marks}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}