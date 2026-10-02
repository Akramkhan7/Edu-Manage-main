import {
  LayoutDashboard,
  BookOpen,
  UploadCloud,
  GraduationCap,
  Bell,
  User,
  LogOut,
} from "lucide-react";
import {useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux';
import { NavLink } from "react-router-dom";
import { authActions } from "../../Store/authSlice";

const menus = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Assignments",
    path: "/assignments",
    icon: BookOpen,
  },
  {
    title: "Grades",
    path: "/grades",
    icon: GraduationCap,
  },
  {
    title: "Announcements",
    path: "/announcements",
    icon: Bell,
  },
  {
    title: "Profile",
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
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-indigo-600">EduManage</h1>

        <p className="mt- text-xs text-gray-500">Student Panel</p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`
              }
            >
              <Icon size={19} />
              {item.title}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <button onClick={logOutHandler} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
