import { CalendarDays, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function UpcomingDeadlineCard({ deadlines }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Upcoming Deadlines
        </h2>

        <CalendarDays className="text-indigo-600" size={22} />
      </div>

      {deadlines.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-500">
          No upcoming deadlines.
        </div>
      ) : (
        <div className="space-y-4">
          {deadlines.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-200 p-4 transition hover:border-indigo-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {item.subjectName}
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                    <span>
                      📅 Due: {item.dueDate}
                    </span>

                    <span>
                      📝 {item.totalMarks} Marks
                    </span>
                  </div>
                </div>

                <Link
                  to={`/assignments/${item.id}`}
                  className="rounded-lg bg-indigo-50 p-2 text-indigo-600 transition hover:bg-indigo-100"
                >
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}