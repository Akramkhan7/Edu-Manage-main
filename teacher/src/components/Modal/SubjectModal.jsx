import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { fetchSubjects } from "../../Store/subjectSlice";

export default function SubjectModal({ open, onClose }) {
  const dispatch = useDispatch();

  const teacherId = useSelector((state) => state.auth.teacherId);
  const token = useSelector((state) => state.auth.token);
  const subjects = useSelector((state) => state.subject.subjects) || [];

  const [name, setName] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [saving, setSaving] = useState(false);

  const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;

  if (!open) return null;

  const hasSubject = subjects.some((s) => s.teacherId === teacherId);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (hasSubject) {
      toast.error("You can create only one subject.");
      return;
    }

    setSaving(true);
    try {
      if (!token) throw new Error("Please sign in again");

      const res = await fetch(`${db_url}/subjects.json?auth=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          semester: Number(semester),
          branch,
          teacherId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.error?.message ||
            errorData?.error ||
            `Failed to create subject (${res.status})`,
        );
      }

       dispatch(fetchSubjects());
      toast.success("Subject Added");

      setName("");
      setSemester("");
      setBranch("");
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-2xl font-bold">Add Subject</h2>

        {hasSubject && (
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
            You have already created a subject.
          </p>
        )}

        <div className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Subject Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-600"
            required
          />

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-600"
            required
          >
            <option value="">Select Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <option key={item} value={item}>
                Semester {item}
              </option>
            ))}
          </select>

          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-600"
            required
          >
            <option value="">Select Branch</option>
            {["CSE", "IT", "ECE", "EEE", "ME", "CE"].map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-5 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || hasSubject}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Subject"}
          </button>
        </div>
      </form>
    </div>
  );
}