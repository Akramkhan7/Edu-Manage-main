import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import StudentLayout from "./components/Layouts/StudentLayout";
import Dashboard from "./Pages/Dashboard";
import Assignments from "./Pages/Assignments";
import Grades from "./Pages/Grades";
import Announcement from "./Pages/Announcement";
import Profile from "./Pages/Profile";
import SubjectAssignments from "./components/assignment/SubjectAssignments";
import AssignmentDetails from "./components/assignment/AssignmentDetails";
import Auth from "./Pages/Auth";

export default function App() {
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Auth />
          )
        }
      />

      <Route
        element={
          isAuthenticated ? (
            <StudentLayout />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route
          path="/assignments/:subjectId"
          element={<SubjectAssignments />}
        />
        <Route
          path="/assignments/:subjectId/:assignmentId"
          element={<AssignmentDetails />}
        />
        <Route path="/grades" element={<Grades />} />
        <Route path="/announcements" element={<Announcement />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? "/dashboard" : "/auth"}
            replace
          />
        }
      />
    </Routes>
  );
}