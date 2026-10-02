import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { fetchSubjects } from "../../Store/subjectSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  assignmentActions,
  fetchAssignments,
} from "../../Store/assignmentSlice";
import { fetchSubmissions } from "../../Store/submissionSlice";

export default function StudentLayout() {
  const dispatch = useDispatch();
  const studentId = useSelector((state) => state.auth.studentId);
  const loading = useSelector((state) => state.assignment.loading);

useEffect(() => {
  if (!studentId) return;

  dispatch(fetchAssignments())
  dispatch(fetchSubjects());
  dispatch(fetchSubmissions(studentId));
}, [studentId, dispatch]);


  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="ml-64 p-8 pt-24">
        {loading ? (
          <div className="flex min-h-[calc(100vh-96px)] items-center justify-center">
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
  );
}
