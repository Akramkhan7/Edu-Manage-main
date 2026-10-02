import { CircleCheckBig, Clock3, Trophy } from "lucide-react";

const ProgressBar = () => {
  const progress = 60;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Overall Progress
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your assignment completion status
          </p>
        </div>

        <span className="rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-600">
          {progress}%
        </span>
      </div>

      <div className="mt-8 h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          style={{ width: `${progress}%` }}
          className="h-full rounded-full bg-indigo-600 transition-all duration-700"
        />
      </div>

      <div className="mt-8 grid grid-cols-3 gap-5">
        <div className="rounded-xl bg-green-50 p-4">
          <CircleCheckBig className="mb-3 text-green-600" size={22} />

          <h3 className="text-2xl font-bold">3</h3>

          <p className="text-sm text-gray-500">
            Completed
          </p>
        </div>

        <div className="rounded-xl bg-yellow-50 p-4">
          <Clock3 className="mb-3 text-yellow-600" size={22} />

          <h3 className="text-2xl font-bold">2</h3>

          <p className="text-sm text-gray-500">
            Pending
          </p>
        </div>

        <div className="rounded-xl bg-purple-50 p-4">
          <Trophy className="mb-3 text-purple-600" size={22} />

          <h3 className="text-2xl font-bold">84%</h3>

          <p className="text-sm text-gray-500">
            Average Marks
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;