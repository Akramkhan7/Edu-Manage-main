import {
  Users,
  TrendingUp,
  ShieldAlert,
  Award,
  Clock,
  FileText,
  CheckCircle,
} from "lucide-react";

const icons = {
  "Total Students": Users,
  "Average Score": Award,
  "Total Submissions": FileText,
  "Pending Review": Clock,
  Reviewed: CheckCircle,
  "Plagiarism Cases": ShieldAlert,
};

const colors = {
  "Total Students": "bg-blue-100 text-blue-600",
  "Average Score": "bg-green-100 text-green-600",
  "Total Submissions": "bg-cyan-100 text-cyan-600",
  "Pending Review": "bg-yellow-100 text-yellow-600",
  Reviewed: "bg-emerald-100 text-emerald-600",
  "Plagiarism Cases": "bg-red-100 text-red-600",
};

export default function StatCard({ item, value }) {
  const Icon = icons[item.title] || FileText;
  const color = colors[item.title] || "bg-gray-100 text-gray-600";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{item.title}</p>

          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}
        >
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}