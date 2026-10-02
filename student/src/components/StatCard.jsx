import React from "react";

export default function StatCard({ item }) {
  const Icon = item.icon;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {item.title}
        </span>

        {Icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 transition-transform duration-200 group-hover:scale-105 ${
              item.bg || "bg-slate-50"
            }`}
          >
            {typeof Icon === "function" ? (
              <Icon size={20} className={item.text || "text-slate-600"} />
            ) : (
              <span className={`text-base font-black ${item.text || "text-slate-600"}`}>
                {Icon}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          {item.value}
        </h2>

        {item.badge && (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
              item.badgeStyle || "bg-slate-100 text-slate-600"
            }`}
          >
            {item.badge}
          </span>
        )}
      </div>

      {item.description && (
        <p className="mt-1.5 text-xs font-semibold text-slate-500">
          {item.description}
        </p>
      )}
    </div>
  );
}