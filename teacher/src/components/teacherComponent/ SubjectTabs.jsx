import { useEffect } from "react";
import { useSelector } from "react-redux";

function SubjectSelect({
  subjects,
  activeSubject,
  setActiveSubject,
}) {
  const teacherId = useSelector((state) => state.auth.teacherId);

  const teacherSubjects = subjects.filter(
    (subject) => subject.teacherId === teacherId
  );

  useEffect(() => {
    if (teacherSubjects.length > 0 && !activeSubject) {
      setActiveSubject(teacherSubjects[0].id);
    }
  }, [teacherSubjects, activeSubject, setActiveSubject]);

  useEffect(() => {
    if (activeSubject) {
      localStorage.setItem("activeSubject", activeSubject);
    }
  }, [activeSubject]);

 const teacherSubject = subjects.find(
  (subject) => subject.teacherId === teacherId
);

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 md:w-64">
      {teacherSubject ? teacherSubject.name : "No Subject"}
    </div>
  );
}

export default SubjectSelect;