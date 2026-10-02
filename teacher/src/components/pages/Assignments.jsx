import { Plus, BookOpen, AlertCircle } from "lucide-react";
import { useState } from "react";
import { assignmentActions } from "../../Store/assignmentSlice";
import SubjectTabs from "../teacherComponent/ SubjectTabs";
import AssignmentItem from "../teacherComponent/ AssignmentItem";
import CreateAssignmentModal from "../Modal/AssignmentModal";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function Assignments() {
  const subjects = useSelector((state) => state.subject.subjects || []);
  const assignments = useSelector((state) => state.assignment.assignments || []);
  const teacherId = useSelector((state) => state.auth.teacherId);

  const [activeSubject, setActiveSubject] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;
  const teacherSubjects = subjects.filter(
    (subject) => subject.teacherId === teacherId,
  );
  const activeSubjectId = teacherSubjects.some(
    (subject) => subject.id === activeSubject,
  )
    ? activeSubject
    : teacherSubjects[0]?.id || "";
  const currentSubject = subjects.find(
    (subject) => subject.id === activeSubjectId,
  );

  const addAssignment = async () => {
    if (!activeSubjectId || !currentSubject) {
      toast.error("Please select a subject first.");
      return;
    }

    setLoading(true);

    const newAssignment = {
      teacherId,
      subjectId: currentSubject.id,
      title: `${currentSubject.name} Assignment ${filteredAssignments.length + 1}`,
      unlocked: false,
      createdAt: Date.now(),
    };

    try {
      const res = await fetch(`${db_url}/assignments.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAssignment),
      });

      const data = await res.json();

      dispatch(
        assignmentActions.addAssignment({
          id: data.name,
          ...newAssignment,
        })
      );
      toast.success("Assignment added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create assignment.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(
    (assignment) => assignment.subjectId === activeSubjectId,
  );

  const handleOpen = (assignment) => {
    setSelectedAssignment(assignment);
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
            <BookOpen size={24} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Assignments
            </h1>
            <p className="mt-1 text-base text-gray-500">
              Unlock and manage assignments for your selected subject.
            </p>
          </div>
        </div>

        <button
          onClick={addAssignment}
          disabled={loading || !activeSubjectId}
          className="group flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Adding...
            </>
          ) : (
            <>
              <Plus
                size={18}
                className="transition-transform group-hover:rotate-90"
              />
              Create Assignment
            </>
          )}
        </button>
      </div>

      <SubjectTabs
        subjects={subjects}
        activeSubject={activeSubjectId}
        setActiveSubject={setActiveSubject}
      />

      {/* Warning Alert if no subject selected */}
      {!activeSubjectId ? (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <AlertCircle size={20} className="shrink-0 text-amber-600" />
          <p className="text-sm font-medium">
            No subject selected. Please select or create a subject to view assignments.
          </p>
        </div>
      ) : (
        <AssignmentItem assignments={filteredAssignments} onOpen={handleOpen} />
      )}

      <CreateAssignmentModal
        open={showModal}
        onClose={() => setShowModal(false)}
        assignment={selectedAssignment}
      />
    </div>
  );
}