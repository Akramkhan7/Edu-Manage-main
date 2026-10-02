import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAssignments } from "../../Store/assignmentSlice";

import StatCard from "../teacherComponent/StatCard";
import RecentSubmissionCard from "../teacherComponent/RecentSubmissionCard";
import UpcomingDeadlineCard from "../teacherComponent/UpcomingDeadlineCard";

export default function Dashboard() {
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.auth.profile);
  const assignments = useSelector((state) => state.assignment.assignments);
  const subjects = useSelector((state) => state.subject.subjects);

  const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;

  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const recentSubmissions = [...submissions]
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    )
    .slice(0, 5);

  const subjectMap = subjects.reduce((acc, subject) => {
    acc[subject.id] = subject.name;
    return acc;
  }, {});

  const upcomingDeadlines = [...assignments]
    .map((assignment) => ({
      ...assignment,
      subjectName: subjectMap[assignment.subjectId] || "Unknown Subject",
    }))
    .filter((assignment) => assignment.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  useEffect(() => {
    let isActive = true;

    const fetchAllStudents = async () => {
      try {
        const res = await fetch(`${db_url}/students.json`);
        const data = await res.json();

        const loadedStudents = [];

        for (const key in data) {
          loadedStudents.push({
            id: key,
            ...data[key],
          });
        }

        if (isActive) setStudents(loadedStudents);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllStudents();

    return () => {
      isActive = false;
    };
  }, [db_url]);

  useEffect(() => {
    if (profile?.id) {
      dispatch(fetchAssignments(profile.id));
    }
  }, [dispatch, profile?.id]);

  useEffect(() => {
    let isActive = true;

    const fetchAllSubmissions = async (assignmentIds) => {
      try {
        const res = await fetch(`${db_url}/submissions.json`);
        const data = await res.json();

        if (!data) {
          if (isActive) setSubmissions([]);
          return;
        }

        const loadedSubmissions = [];

        for (const assignmentId in data) {
          if (!assignmentIds.includes(assignmentId)) continue;

          for (const submissionId in data[assignmentId]) {
            loadedSubmissions.push({
              id: submissionId,
              assignmentId,
              ...data[assignmentId][submissionId],
            });
          }
        }

        if (isActive) setSubmissions(loadedSubmissions);
      } catch (err) {
        console.log(err);
      }
    };

    if (assignments.length > 0) {
      fetchAllSubmissions(assignments.map((item) => item.id));
    }

    return () => {
      isActive = false;
    };
  }, [assignments, db_url]);

  const totalStudents = students.length;

  const totalSubmissions = submissions.length;

  const reviewedSubmissions = submissions.filter(
    (item) => item.status === "Reviewed",
  ).length;

  const pendingSubmissions = submissions.filter(
    (item) => item.status === "Pending",
  ).length;

  const gradedSubmissions = submissions.filter(
    (item) => typeof item.totalMarks === "number",
  );

  const avgScore =
    gradedSubmissions.length > 0
      ? Math.round(
          gradedSubmissions.reduce((sum, item) => sum + item.totalMarks, 0) /
            gradedSubmissions.length,
        )
      : 0;

  const plagiarismCases = submissions.filter(
    (item) => item.plagiarismDetails?.isPlagiarized,
  ).length;

  const stats = [
    {
      id: 1,
      title: "Total Students",
      value: totalStudents,
    },
    {
      id: 2,
      title: "Average Score",
      value: `${avgScore}%`,
    },
    {
      id: 3,
      title: "Total Submissions",
      value: totalSubmissions,
    },
    {
      id: 4,
      title: "Pending Review",
      value: pendingSubmissions,
    },
    {
      id: 5,
      title: "Reviewed",
      value: reviewedSubmissions,
    },
    {
      id: 6,
      title: "Plagiarism Cases",
      value: plagiarismCases,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome Back, {profile?.name} 👋</h1>

        <p className="mt-2 text-gray-500">
          Manage all your assigned courses and track student progress.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((item) => (
          <StatCard key={item.id} item={item} value={item.value} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentSubmissionCard submissions={recentSubmissions} />
        <UpcomingDeadlineCard deadlines={upcomingDeadlines} />
      </div>
    </div>
  );
}
