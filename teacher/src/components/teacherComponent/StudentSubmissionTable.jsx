import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkPlagiarism } from "../../api/plagiarism";
import { FileText, Mail, User, ShieldAlert, BadgeCheck, Clock } from "lucide-react";

function StudentSubmissionTable({ assignment }) {
  const navigate = useNavigate();
  const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;
  const [students, setStudents] = useState([]);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let isActive = true;

    const runPlagiarismChecks = async (studentList) => {
      const pending = studentList.filter(
        (student) => (student.plagiarism === "" || student.plagiarism == null) && student.fileUrl,
      );
      if (pending.length === 0) return;

      setChecking(true);
      try {
        for (const student of pending) {
          if (!isActive) break;
          try {
            const result = await checkPlagiarism({
              fileUrl: student.fileUrl,
              studentId: student.studentId,
              studentName: student.profile?.name,
              subject: assignment.subjectId,
              assignmentId: assignment.id,
            });

            if (isActive && result.success) {
              setStudents((prev) =>
                prev.map((item) =>
                  item.id === student.id
                    ? { ...item, plagiarism: result.plagiarism.plagiarismScore }
                    : item,
                ),
              );
            }
          } catch (err) {
            console.log(`Plagiarism check failed for ${student.id}:`, err);
          }
        }
      } finally {
        if (isActive) setChecking(false);
      }
    };

    const fetchingSubmission = async () => {
      try {
        const res = await fetch(`${db_url}/submissions/${assignment.id}.json`);
        const data = await res.json();

        if (!data) {
          if (isActive) {
            setStudents([]);
            setChecking(false);
          }
          return;
        }

        const loadedStudents = [];
        for (const key in data) {
          loadedStudents.push({
            id: key,
            ...data[key],
          });
        }

        if (!isActive) return;
        setStudents(loadedStudents);
        setChecking(false);
        runPlagiarismChecks(loadedStudents);
      } catch (err) {
        console.log(err);
      }
    };

    if (assignment?.id) fetchingSubmission();

    return () => {
      isActive = false;
    };
  }, [assignment?.id, assignment?.subjectId, db_url]);

  return (
   <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-200">
  {checking && (
    <div className="flex items-center gap-2.5 border-b border-indigo-100 bg-indigo-50/60 px-6 py-3.5 text-xs font-bold text-indigo-700">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      <span>Checking submissions for plagiarism...</span>
    </div>
  )}

  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead className="border-b border-slate-100 bg-slate-50/70">
        <tr>
          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Student
          </th>
          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Enrollment
          </th>
          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Plagiarism
          </th>
          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Marks
          </th>
          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Status
          </th>
          <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
            Action
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {students.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-6 py-16 text-center">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-200/60">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    No submissions yet
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Student submissions will appear here once submitted.
                  </p>
                </div>
              </div>
            </td>
          </tr>
        ) : (
          students.map((student) => (
            <tr
              key={student.id}
              className="group transition-colors duration-150 hover:bg-slate-50/60"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600 ring-1 ring-indigo-600/10">
                    <User size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900">
                      {student?.profile?.name || "N/A"}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Mail size={12} className="text-slate-400" />
                      <span>{student?.profile?.email || "No email"}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-700">
                  <BadgeCheck size={14} className="text-slate-400" />
                  {student?.profile?.rollNo || "N/A"}
                </span>
              </td>
              <td className="px-6 py-4">
                {typeof student.plagiarism === "number" ? (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${
                      student.plagiarism > 10
                        ? "bg-rose-50 text-rose-700 ring-rose-600/20"
                        : "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                    }`}
                  >
                    <ShieldAlert
                      size={12}
                      className={
                        student.plagiarism > 10
                          ? "text-rose-600"
                          : "text-emerald-600"
                      }
                    />
                    {student.plagiarism}%
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-400">
                    --
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                {student.totalMarks ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <BadgeCheck size={14} className="text-emerald-600" />
                    {student.totalMarks} Points
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 ring-1 ring-amber-600/20 ring-inset">
                    <Clock size={12} className="text-amber-600" />
                    Pending
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${
                    student.status === "Reviewed"
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                      : "bg-amber-50 text-amber-700 ring-amber-600/20"
                  }`}
                >
                  {student.status === "Reviewed" ? (
                    <BadgeCheck size={12} className="text-emerald-600" />
                  ) : (
                    <Clock size={12} className="text-amber-600" />
                  )}
                  {student.status || "Unreviewed"}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() =>
                    navigate(
                      `/assignments/review/${assignment.id}/${student.studentId}`,
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                >
                  <span>Review</span>
                  <FileText size={14} />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>
  );
}

export default StudentSubmissionTable;