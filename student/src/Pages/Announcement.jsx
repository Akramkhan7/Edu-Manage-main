import { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  CalendarDays,
  GraduationCap,
  Megaphone,
  Bell,
  Sparkles,
} from "lucide-react";
import { useSelector } from "react-redux";

const filters = ["All", "Assignment", "Event", "Academic"];

const typeStyles = {
  Assignment: {
    bg: "bg-blue-50 text-blue-700 ring-blue-200",
    iconBg: "bg-blue-100 text-blue-600",
    icon: BookOpen,
  },
  Event: {
    bg: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    iconBg: "bg-emerald-100 text-emerald-600",
    icon: Calendar,
  },
  Academic: {
    bg: "bg-purple-50 text-purple-700 ring-purple-200",
    iconBg: "bg-purple-100 text-purple-600",
    icon: GraduationCap,
  },
  default: {
    bg: "bg-slate-50 text-slate-700 ring-slate-200",
    iconBg: "bg-slate-100 text-slate-600",
    icon: Megaphone,
  },
};

export default function Announcement() {
  const [filter, setFilter] = useState("All");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const subjects = useSelector((state) => state.subject?.subjects) || [];

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;
      const res = await fetch(`${db_url}/announcements.json`);
      const data = await res.json();
      let loadedData = [];

      for (const key in data) {
        loadedData.push({
          id: key,
          ...data[key],
        });
      }
      setAnnouncements(loadedData.reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements =
    filter === "All"
      ? announcements
      : announcements.filter((item) => item.type === filter);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Announcements
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
            Latest updates, events, and circulars from your department.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-all duration-200 focus:outline-none ${
              filter === item
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-slate-50 hover:text-indigo-600 shadow-sm"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-100" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-1/4 rounded bg-slate-100" />
                    <div className="h-3 w-1/3 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="h-12 w-full rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="mb-3 rounded-full bg-slate-100 p-3.5">
              <Bell size={24} className="text-slate-400" />
            </div>
            <p className="text-sm font-extrabold text-slate-700">
              No announcements found
            </p>
            <p className="text-xs text-slate-400 mt-1">
              There are no updates available under "{filter}".
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((item) => {
            const style = typeStyles[item.type] || typeStyles.default;
            const Icon = style.icon;
            const displayDate = item.eventDate || item.createdAt;

            const matchedSubject = subjects.find(
              (sub) => sub.id === item.subjectId
            );

            return (
              <div
                key={item.id}
                className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md space-y-3"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-100 transition-transform duration-200 group-hover:scale-105 ${style.iconBg}`}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ring-inset ${style.bg}`}
                        >
                          <Icon size={11} />
                          {item.type}
                        </span>

                        {matchedSubject && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 border border-slate-200">
                            {matchedSubject.name}
                          </span>
                        )}
                      </div>

                      <h2 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                        {item.announcementTitle}
                      </h2>

                      {item.teacherName && (
                        <p className="text-xs font-bold text-indigo-600">
                          Prof. {item.teacherName}
                        </p>
                      )}
                    </div>
                  </div>

                  {displayDate && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 shrink-0 self-start pt-1">
                      <CalendarDays size={13} className="text-slate-400" />
                      <span>{displayDate}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-600 pl-0 sm:pl-[58px]">
                  {item.description}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}