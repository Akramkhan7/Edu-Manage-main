import { Megaphone, Pencil, Plus, Trash2, CalendarDays } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AnnouncementModal from "../Modal/AnnouncementModal";
import toast from "react-hot-toast";

export default function Announcements() {
  const [showModal, setShowModal] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;

  const loadAnnouncements = useCallback(async () => {
    const res = await fetch(`${db_url}/announcements.json`);
    const data = await res.json();
    const loadedData = [];

    for (const key in data) {
      loadedData.push({
        id: key,
        ...data[key],
      });
    }

    return loadedData;
  }, [db_url]);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      setAnnouncements(await loadAnnouncements());
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [loadAnnouncements]);

  useEffect(() => {
    let isActive = true;

    loadAnnouncements()
      .then((loadedData) => {
        if (isActive) setAnnouncements(loadedData);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [loadAnnouncements]);

  const onEditHandler = (id) => {
    const announcement = announcements.find((item) => item.id === id);
    if (!announcement) return;
    setEditingAnnouncement(announcement);
    setShowModal(true);
  };

  const onDeleteHandler = async (id) => {
    try {
      const res = await fetch(`${db_url}/announcements/${id}.json`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Announcement deleted!");
        setAnnouncements((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete announcement.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAnnouncement(null);
  };
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
        <p className="text-sm text-gray-500">Loading announcements...</p>
      </div>
    );
  }

  return (
  <div className="space-y-8">
  <div className="flex items-end justify-between">
    <div>
      <h1 className="text-2xl  font-bold tracking-tight text-gray-900">
        Announcements
      </h1>

      <p className="mt-2 text-gray-500">
        Publish and manage announcements for your students.
      </p>
    </div>

    <button
      onClick={() => setShowModal(true)}
      className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 font-semibold text-white "
    >
      <Plus size={18} />
      New Announcement
    </button>
  </div>

  <div className="space-y-4">
    {announcements.length === 0 ? (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center">
        <Megaphone
          size={46}
          className="mx-auto text-gray-300"
        />

        <h3 className="mt-5 text-lg font-semibold text-gray-700">
          No Announcements Yet
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Create your first announcement to notify students.
        </p>
      </div>
    ) : (
      announcements.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 "
        >
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-blue-500 shadow-md">
            <Megaphone
              size={24}
              className="text-white"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="truncate text-lg font-bold text-gray-900">
                {item.announcementTitle}
              </h2>

              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                {item.type}
              </span>
            </div>

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
              {item.description}
            </p>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm text-gray-600">
              <CalendarDays
                size={16}
                className="text-indigo-500"
              />
              {item.deadline || item.eventDate}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEditHandler(item.id)}
                className="rounded-xl bg-yellow-50 p-2.5 text-yellow-600 transition hover:bg-yellow-100"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => onDeleteHandler(item.id)}
                className="rounded-xl bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))
    )}
  </div>

  {showModal && (
    <AnnouncementModal
      showModal={showModal}
      closeModal={closeModal}
      editingAnnouncement={editingAnnouncement}
      onSaved={fetchAnnouncements}
    />
  )}
</div>
  );
}
