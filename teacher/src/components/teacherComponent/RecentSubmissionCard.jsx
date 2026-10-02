import { CheckCircle2, Clock3 } from "lucide-react";

export default function RecentSubmissionCard({ submissions }) {
 
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Submissions
        </h2>

        <button className="text-sm font-medium text-indigo-600 hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {submissions.map((item) => (
          console.log(item),
          <div
            key={item.id}
            className="flex items-start gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-indigo-300"
          >
            <div className="rounded-lg bg-green-100 p-2.5">
              <CheckCircle2
                size={18}
                className="text-green-600"
              />
            </div>

 <div className="flex-1">
  <div className="flex items-start justify-between">
    <div>
      <h3 className="font-semibold text-gray-900">
        {item.profile.name}
      </h3>

      <p className="mt-1 text-sm text-indigo-600">
        {item.profile.rollNo}
      </p>

      <div className="mt-3 space-y-1 text-sm text-gray-500">
       

        <p>
          📄 <span className="font-medium">File:</span>{" "}
          {item.fileName}
        </p>
      </div>
    </div>

    <div className="text-right">
      <div className="flex items-center justify-end gap-1 text-xs text-gray-400">
        <Clock3 size={14} />
        {item.submittedAt}
      </div>

      <span
        className="mt-3 inline-flex rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-medium"
      >
        Submitted
      </span>
    </div>
  </div>
</div>
          </div>
        ))}
      </div>
    </div>
  );
}