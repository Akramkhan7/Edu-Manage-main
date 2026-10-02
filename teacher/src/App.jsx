import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import TeacherLayout from "./components/layouts/TeacherLayout";

import Dashboard from "./components/pages/Dashboard";
import Assignments from "./components/pages/Assignments";
import AssignmentDetails from "./components/pages/AssignmentDetails";
import Announcements from "./components/pages/Announcements";
import Profile from "./components/pages/Profile";
import PlagiarismReport from "./Plagiarism/PlagiarismReport";
import { useSelector } from "react-redux";
import Auth from "./components/pages/Auth";
import Subjects from "./components/pages/Subjects";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Auth />}
      />

      <Route
        element={
          isAuthenticated ? <TeacherLayout /> : <Navigate to="/auth" replace />
        }
      >
        <Route path="/" element={<Dashboard />} />

        <Route path="/assignments" element={<Assignments />} />

        <Route path="/assignments/:id" element={<AssignmentDetails />} />

        <Route
          path="/assignments/review/:assignmentId/:studentId"
          element={<PlagiarismReport />}
        />

        <Route path="/announcements" element={<Announcements />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/subjects" element={<Subjects />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/auth"} replace />}
      />
    </Routes>
  );
}

export default App;
