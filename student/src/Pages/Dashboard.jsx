import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen, CircleCheckBig, Clock3, Trophy } from "lucide-react";

import StatCard from "../components/StatCard";
import UpcomingDeadlineCard from "../components/UpcomingDeadlineCard";
import RecentGradeCard from "../components/RecentGradeCard";
import AnnouncementCard from "../components/AnnouncementCard";

import { fetchSubmissions } from "../Store/submissionSlice";

export default function Dashboard() {
  const dispatch = useDispatch();

  const studentId = useSelector((state) => state.auth.studentId);

  const assignments = useSelector((state) => state.assignment.assignments);

  const submissions = useSelector((state) => state.submission.submissions);

  const subjects = useSelector((state) => state.subject.subjects);

  useEffect(() => {
    if (studentId) {
      dispatch(fetchSubmissions(studentId));
    }
  }, [dispatch, studentId]);

  const stats = useMemo(() => {
    const reviewed = submissions.filter((item) => item.status === "Reviewed");

    const averageMarks =
      reviewed.length > 0
        ? Math.round(
            reviewed.reduce((sum, item) => sum + item.totalMarks, 0) /
              reviewed.length,
          )
        : 0;

    return [
      {
        id: 1,
        title: "Total Assignments",
        value: assignments.length,
        icon: <BookOpen size={22} />,
        color: "bg-blue-100",
        text: "text-blue-600",
      },
      {
        id: 2,
        title: "Completed",
        value: reviewed.length,
        icon: <CircleCheckBig size={22} />,
        color: "bg-green-100",
        text: "text-green-600",
      },
      {
        id: 3,
        title: "Pending",
        value: submissions.filter((item) => item.status === "Pending").length,
        icon: <Clock3 size={22} />,
        color: "bg-yellow-100",
        text: "text-yellow-600",
      },
      {
        id: 4,
        title: "Average Marks",
        value: `${averageMarks}%`,
        icon: <Trophy size={22} />,
        color: "bg-purple-100",
        text: "text-purple-600",
      },
    ];
  }, [assignments, submissions]);

  const subjectMap = useMemo(() => {
    return subjects.reduce((acc, subject) => {
      acc[subject.id] = subject.name;
      return acc;
    }, {});
  }, [subjects]);

  const upcomingDeadlines = useMemo(() => {
    return assignments
      .map((assignment) => ({
        ...assignment,
        subjectName: subjectMap[assignment.subjectId] || "Unknown Subject",
      }))
      .filter((assignment) => new Date(assignment.dueDate) >= new Date())
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  }, [assignments, subjectMap]);

  const recentGrades = useMemo(() => {
    return submissions
      .filter((item) => item.status === "Reviewed")
      .map((item) => {
        const assignment = assignments.find((a) => a.id === item.assignmentId);

        return {
          ...item,
          assignmentTitle: assignment?.title || "Assignment",
        };
      })
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, 5);
  }, [submissions, assignments]);

  const announcements = useMemo(() => {
    const list = [];

    const pending = submissions.filter(
      (item) => item.status === "Pending",
    ).length;

    if (pending > 0) {
      list.push({
        id: 1,
        type: "Review",
        subject: "-",
        date: new Date().toLocaleDateString(),
        title: "Assignments Under Review",
        description: `${pending} assignment(s) are currently under teacher review.`,
      });
    }

    if (upcomingDeadlines.length > 0) {
      list.push({
        id: 2,
        type: "Deadline",
        subject: upcomingDeadlines[0].subjectName,
        date: upcomingDeadlines[0].dueDate,
        title: upcomingDeadlines[0].title,
        description:
          "Don't forget to submit your assignment before the deadline.",
      });
    }

    if (recentGrades.length > 0) {
      const latest = recentGrades[0];

      const assignment = assignments.find(
        (item) => item.id === latest.assignmentId,
      );

      list.push({
        id: 3,
        type: "Result",
        subject: assignment ? subjectMap[assignment.subjectId] : "-",
        date: latest.submittedAt,
        title: "New Grade Published",
        description: `Your assignment "${
          assignment?.title || ""
        }" has been evaluated.`,
      });
    }

    return list;
  }, [submissions, assignments, recentGrades, upcomingDeadlines, subjectMap]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.id} item={item} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <UpcomingDeadlineCard deadlines={upcomingDeadlines} />

        <RecentGradeCard grades={recentGrades} />
      </div>

      <AnnouncementCard announcements={announcements} />
    </div>
  );
}
