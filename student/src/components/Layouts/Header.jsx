import { Bell, Search, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";

export default function Header() {
  const profile = useSelector((state) => state.auth.profile);
  return (
    <header className="fixed left-64 right-0 top-0 z-20 flex h-20 items-center justify-between border-b border-gray-100 bg-white/90 px-8 ">
      <div>
        <p className="mt-1 text-md text-gray-500">
          Welcome back, have a productive day 👋
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative rounded-2xl border border-gray-200 bg-gray-50 p-3 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
          <Bell size={20} />

          <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500"></span>
        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-gray-900">
              {profile?.name}
            </h4>

            <p className="mt-0.5 text-xs capitalize text-gray-500">
              {profile?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
