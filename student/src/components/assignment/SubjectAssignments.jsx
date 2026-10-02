import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Lock, CalendarDays } from "lucide-react";

const statusColor = {
  Submitted: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Locked: "bg-gray-100 text-gray-600",
};

 function SubjectAssignments() {
  const { subjectId } = useParams();
  const subjects = useSelector((state)=> state.subject.subjects);

  const subject = subjects.find((item) => item.id === subjectId);

  const subjectAssignments = assignments[subjectId] || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/assignments"
            className="mb-4 inline-flex items-center gap-2 text-indigo-600 hover:underline"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          <h1 className="text-3xl font-bold">
            {subject?.name}
          </h1>

          <p className="mt-2 text-gray-500">
            {subject?.teacher}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {subjectAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {assignment.title}
                </h2>

                <p className="mt-1 text-gray-500">
                  {assignment.topic}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  statusColor[assignment.status]
                }`}
              >
                {assignment.status}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} />
                {assignment.dueDate}
              </div>

              <div>
                {assignment.totalMarks} Marks
              </div>
            </div>

            <div className="mt-6">
              {assignment.unlocked ? (
                <Link
                  to={`/assignments/${subjectId}/${assignment.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700"
                >
                  View Details
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-gray-200 px-5 py-3 font-medium text-gray-500"
                >
                  <Lock size={18} />
                  Locked
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default SubjectAssignments;