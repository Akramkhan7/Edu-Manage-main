import { useState } from "react";
import { X, Bell } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function AnnouncementModal({
  showModal,
  closeModal,
  editingAnnouncement,
  onSaved,
}) {
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState(editingAnnouncement?.type || "Assignment");
  const [assignmentId, setAssignmentId] = useState(editingAnnouncement?.assignmentId || "");
  const [announcementTitle, setAnnouncementTitle] = useState(editingAnnouncement?.announcementTitle || "");
  const [description, setDescription] = useState(editingAnnouncement?.description || "");
  const [eventDate, setEventDate] = useState(editingAnnouncement?.eventDate || "");
  const [venue, setVenue] = useState(editingAnnouncement?.venue || "");

  const assignments = useSelector((state) => state.assignment.assignments);
  const teacherProfile = useSelector((state) => state.auth.profile);
  const teacherId = useSelector((state) => state.auth.teacherId);
  const subjects = useSelector((state) => state.subject.subjects);
  const teacherSubject = subjects.find((item) => item.teacherId === teacherId);

  const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;

   const resetForm = () => {
    setType("Assignment");
    setAssignmentId("");
    setAnnouncementTitle("");
    setDescription("");
    setEventDate("");
    setVenue("");
  };
  
  if (!showModal) return null;

 

  const onSubmitHandler = async (e) => {
    e.preventDefault();
if (type === "Event") {
    if (!announcementTitle || !eventDate || !venue || !description) {
      return toast.error("Please fill all required fields.");
    }
  } else {
    if (!announcementTitle || !description) {
      return toast.error("Please fill all required fields.");
    }
  }
    setLoading(true);

    const payload = {
      teacherId,
      teacherName: teacherProfile?.name,
      subjectId: teacherSubject?.id,
      type,
      assignmentId,
      announcementTitle,
      description,

      eventDate,
      venue,
    };

    try {
      if (editingAnnouncement) {
        await fetch(`${db_url}/announcements/${editingAnnouncement.id}.json`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("Announcement updated!");
      } else {
        await fetch(`${db_url}/announcements.json`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, createdAt: Date.now() }),
        });
        toast.success("Announcement published!");
      }

      onSaved?.();
      resetForm();
      closeModal();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-indigo-100 p-3">
              <Bell className="text-indigo-600" size={22} />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {editingAnnouncement ? "Edit Announcement" : "Create Announcement"}
              </h2>
              <p className="text-sm text-gray-500">
                {editingAnnouncement
                  ? "Update this announcement."
                  : "Publish an announcement to your students."}
              </p>
            </div>
          </div>

          <button onClick={()=>closeModal()} className="rounded-lg p-2 hover:bg-gray-100">
            <X />
          </button>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-6 p-8">
          <div>
            <label className="mb-2 block text-sm font-medium">Announcement Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-600"
            >
              <option value="Assignment">Assignment</option>
              <option value="Academic">Academic</option>
              <option value="Event">Event</option>
            </select>
          </div>

          {type === "Assignment" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium">Assignment</label>
                <select
                  value={assignmentId}
                  onChange={(e) => setAssignmentId(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3"
                >
                  <option value="">Select Assignment</option>
                  {assignments.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Announcement Title
                </label>
                <input
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="Assignment Released"
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Message</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Write instructions..."
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>
            </>
          )}

       
          {type === "Academic" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Announcement Title
                </label>
                <input
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="Holiday Notice"
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder="Write the announcement..."
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>
            </>
          )}

          {type === "Event" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium">Event Name</label>
                <input
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="Coding Contest"
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Venue</label>
                  <input
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Auditorium"
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Describe the event..."
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 border-t pt-6">
            <button
              type="button"
             onClick={()=>closeModal()}
              className="rounded-xl border px-6 py-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {editingAnnouncement ? "Updating..." : "Publishing..."}
                </>
              ) : editingAnnouncement ? (
                "Update Announcement"
              ) : (
                "Publish Announcement"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}