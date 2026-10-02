import { Bell, Search } from "lucide-react";
import { useSelector } from "react-redux";

export default function Header() {
  const profile = useSelector((state) => state.auth.profile);

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-5">
      <div className="relative w-96">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:bg-white"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative rounded-xl bg-gray-100 p-3 transition hover:bg-gray-200">
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white">
             {profile?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              Prof. {profile?.name}
            </h3>

            <p className="text-sm capitalize text-gray-500">
              {profile?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}