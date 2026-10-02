import { X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { assignmentActions } from "../../Store/assignmentSlice";

export default function CreateAssignmentModal({ open, onClose, assignment }) {
  const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;

  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [totalMarks, setTotalMarks] = useState(20);
  const [pdf, setPdf] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  if (!open) return null;

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!description.trim() || !dueDate.trim() || !pdf) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      let pdfUrl = "";

      if (pdf) {
        const formData = new FormData();

        formData.append("file", pdf);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        );

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/raw/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadData.error.message);
        }

        pdfUrl = uploadData.secure_url;
      }

      const assignmentData = {
        description,
        dueDate,
        totalMarks: Number(totalMarks),
        pdf: pdfUrl,
        unlocked: true,
      };

      await fetch(`${db_url}/assignments/${assignment.id}.json`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignmentData),
      });

     dispatch(
  assignmentActions.updateAssignment({
    id: assignment.id,
    description,
    dueDate,
    totalMarks,
    pdf,
    unlocked: true,
  })
);


    

      toast.success("Assignment created successfully.");
      onClose();
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-bold">Create Assignment</h2>

            <p className="mt-1 text-sm text-gray-500">{assignment?.title}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Title</label>

            <input
              value={assignment?.title}
              readOnly
              type="text"
              placeholder="Assignment title"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Assignment description..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Due Date</label>

              <input
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                type="date"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                totalMarks
              </label>

              <input
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                type="number"
                placeholder="100"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Upload Question PDF
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdf(e.target.files[0])}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Unlocking...
                </>
              ) : (
                "Unlock"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
