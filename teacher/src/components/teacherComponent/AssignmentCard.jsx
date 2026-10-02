import {
  CalendarDays,
  Eye,
  FileText,
} from "lucide-react";

const statusStyle = {
  Graded: "bg-green-100 text-green-700",
  Unlocked: "bg-blue-100 text-blue-700",
  Locked: "bg-red-100 text-red-700",
};

export default function AssignmentCard({ assignment }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <span className="rounded-md bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
            {assignment.code}
          </span>

          <h2 className="mt-3 text-lg font-semibold text-gray-900">
            {assignment.title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {assignment.subject}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            statusStyle[assignment.status]
          }`}
        >
          {assignment.status}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <CalendarDays size={16} />
            <span>Due Date</span>
          </div>

          <span className="font-medium text-gray-800">
            {assignment.dueDate}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <FileText size={16} />
            <span>Submissions</span>
          </div>

          <span className="font-medium text-gray-800">
            {assignment.submissions}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Total Marks
          </span>

          <span className="font-medium text-gray-800">
            {assignment.totalMarks}
          </span>
        </div>
      </div>

      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700">
        <Eye size={18} />
        View Details
      </button>
    </div>
  );
}