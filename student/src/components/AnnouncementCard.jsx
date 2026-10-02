import {
  CalendarDays,
  Megaphone,
  BookOpen,
  Calendar,
  GraduationCap,
  Bell,
} from "lucide-react";

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

export default function AnnouncementCard({ announcements = [], onViewAll }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:border-slate-300">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            Latest Announcements
          </h2>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            Stay updated with your latest academic activities
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

      {!announcements || announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <div className="mb-2 rounded-full bg-slate-100 p-2.5">
            <Bell size={18} className="text-slate-400" />
          </div>
          <p className="text-xs font-bold text-slate-600">
            No announcements yet
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            You're all caught up on your class updates!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((item) => {
            const type = item.type || "default";
            const style = typeStyles[type] || typeStyles.default;
            const Icon = style.icon;
            const displayTitle = item.title || item.announcementTitle;
            const displayDate = item.date || item.eventDate || item.createdAt;

            return (
              <div
                key={item.id}
                className="group rounded-xl border border-slate-200/80 bg-white p-4 transition-all duration-200 hover:border-indigo-200 hover:shadow-md space-y-3"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 transition-transform duration-200 group-hover:scale-105 ${style.iconBg}`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.type && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ring-inset ${style.bg}`}
                          >
                            <Icon size={11} />
                            {item.type}
                          </span>
                        )}

                        {item.subject && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-blue-600 border border-slate-200">
                            {item.subject}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                        {displayTitle}
                      </h3>

                      {item.teacherName && (
                        <p className="text-xs font-bold text-indigo-600">
                          Prof. {item.teacherName}
                        </p>
                      )}
                    </div>
                  </div>

                  {displayDate && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 shrink-0 self-start pt-0.5">
                      <CalendarDays size={13} className="text-slate-400" />
                      <span>{displayDate}</span>
                    </div>
                  )}
                </div>

                {item.description && (
                  <p className="text-xs font-medium leading-relaxed text-slate-600 pl-0 sm:pl-[52px] line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}