import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Search,
  BookOpen,
  CircleCheckBig,
  Clock3,
  Lock,
  ArrowRight,
  CalendarDays,
  FileCheck2,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function Assignments() {
  const [search, setSearch] = useState("");
  const [openSubject, setOpenSubject] = useState("");

  const assignments = useSelector((state) => state.assignment.assignments);
  const subjects = useSelector((state) => state.subject.subjects);
  const submissions = useSelector((state) => state.submission.submissions);

  const filteredSubjects = subjects?.filter((subject) =>
    subject.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleSubject = (id) => {
    setOpenSubject(openSubject === id ? "" : id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            My Assignments
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Browse and manage your assignments subject-wise.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredSubjects?.map((subject) => {
          const isOpen = openSubject === subject.id;
          const subjectAssignments = assignments.filter(
            (assignment) => assignment.subjectId === subject.id,
          );
          const totalAssignments = subjectAssignments.length;

const completed = subjectAssignments.filter((assignment) =>
  submissions.some((sub) => sub.assignmentId === assignment.id)
).length;

const pending = totalAssignments - completed;

const pendingReview = subjectAssignments.filter((assignment) =>
  submissions.some(
    (sub) =>
      sub.assignmentId === assignment.id &&
      sub.status === "Pending"
  )
).length;

const reviewed = subjectAssignments.filter((assignment) =>
  submissions.some(
    (sub) =>
      sub.assignmentId === assignment.id &&
      sub.status === "Reviewed"
  )
).length;

          return (
            <div
              key={subject.id}
              className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                isOpen
                  ? "border-indigo-200 bg-white shadow-lg shadow-slate-200/50"
                  : "border-slate-200/80 bg-white shadow-sm hover:border-slate-300 hover:shadow-md"
              }`}
            >
              <button
                onClick={() => toggleSubject(subject.id)}
                className="flex w-full flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between text-left transition-colors hover:bg-slate-50/80"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isOpen
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isOpen ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <BookOpen size={20} />
                  </div>

                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 leading-snug">
                      {subject.name} Assignment
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      Semester {subject.semester} • {subject.branch}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                  <div className="text-left sm:text-center">
                    <p className="text-base font-black text-slate-800">
                      {totalAssignments}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Total
                    </p>
                  </div>

                  <div className="text-left sm:text-center">
                    <p className="text-base font-black text-emerald-600">
                      {completed}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Completed
                    </p>
                  </div>

                  <div className="text-left sm:text-center">
                    <p className="text-base font-black text-amber-600">
                      {pendingReview}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Pending Review
                    </p>
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-6 space-y-3">
                  {subjectAssignments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center bg-white rounded-xl border border-dashed border-slate-200">
                      <div className="mb-2 rounded-full bg-slate-100 p-3">
                        <BookOpen size={22} className="text-slate-400" />
                      </div>
                      <p className="text-xs font-bold text-slate-600">
                        No assignments available
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        New tasks for this subject will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {subjectAssignments.map((assignment) => {
                        const submission = submissions?.find(
                          (item) => item.assignmentId === assignment.id,
                        );

                        return (
                          <div
                            key={assignment.id}
                            className="group flex flex-col justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4 transition-all duration-200 hover:border-indigo-200 hover:shadow-md sm:flex-row sm:items-center"
                          >
                            <div className="flex items-start gap-4">
                              <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <BookOpen size={18} />
                              </div>

                              <div className="space-y-1.5 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-extrabold text-slate-900 text-sm truncate max-w-xs sm:max-w-md">
                                    {assignment.title}
                                  </h3>

                                  {!assignment.unlocked ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 border border-slate-200">
                                      <Lock size={11} />
                                      Locked
                                    </span>
                                  ) : !submission ? (
                                    <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 ring-1 ring-inset ring-rose-200">
                                      Not Submitted
                                    </span>
                                  ) : submission.status === "Pending" ? (
                                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-inset ring-amber-200">
                                      Under Review
                                    </span>
                                  ) : (
                                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                      Reviewed
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                  {assignment.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
                                  <div className="flex items-center gap-1 text-slate-600">
                                    <CalendarDays
                                      size={13}
                                      className="text-slate-400"
                                    />
                                    <span>{assignment.dueDate}</span>
                                  </div>

                                  <span>•</span>

                                  <div className="text-slate-700 font-bold">
                                    {assignment.totalMarks} Marks
                                  </div>

                                  {submission && (
                                    <>
                                      <span>•</span>
                                      <div className="flex items-center gap-1 font-bold text-indigo-600">
                                        <FileCheck2 size={13} />
                                        <span>Submitted</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0 self-end sm:self-center">
                              {!assignment.unlocked ? (
                                <button
                                  disabled
                                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 cursor-not-allowed"
                                >
                                  <Lock size={16} />
                                </button>
                              ) : (
                                <Link
                                  to={`/assignments/${subject.id}/${assignment.id}`}
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-700 hover:gap-2 active:scale-95"
                                >
                                  <span>View Task</span>
                                  <ArrowRight size={14} />
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
