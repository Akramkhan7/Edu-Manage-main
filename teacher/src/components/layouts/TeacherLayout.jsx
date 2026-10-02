import { Outlet } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAssignments } from "../../Store/assignmentSlice";
import { fetchSubjects } from "../../Store/subjectSlice";

export default function TeacherLayout() {
  const dispatch = useDispatch();
  const teacherId = useSelector((state) => state.auth.teacherId);
  const loading = useSelector(
  (state) => state.assignment.loading
);

  useEffect(() => {
    if (!teacherId) return;
    dispatch(fetchAssignments(teacherId));
    dispatch(fetchSubjects());
  }, [teacherId, dispatch]);


  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

         <main className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>

                <p className="text-sm text-slate-500">
                  Loading your workspace...
                </p>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
