import {
  LayoutDashboard,
  BookOpen,
  Megaphone,
  User,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../Store/authSlice";

const menu = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Assignments",
    path: "/assignments",
    icon: BookOpen,
  },
  {
    name: "Announcements",
    path: "/announcements",
    icon: Megaphone,
  },
  {
    name: "Subjects",
    path: "/subjects",
    icon: GraduationCap,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOutHandler = () => {
    dispatch(authActions.logout());
    navigate("/auth");
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-100 bg-white ">
      <div className="border-b border-gray-100 px-6 py-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-indigo-600">
          EduManage
        </h1>

        <p className=" mt-2 text-xs text-gray-500">
          Teacher Dashboard
        </p>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`
              }
            >
              <Icon
                size={20}
                className="transition-transform duration-300 group-hover:scale-110"
              />

              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 p-4">
        <button
          onClick={logOutHandler}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-all duration-300 hover:bg-red-600 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}