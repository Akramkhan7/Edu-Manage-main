import { useState } from "react";
import {
  Mail,
  User,
  BookOpen,
  Building2,
  Pencil,
  X,
  Check,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { authActions } from "../../Store/authSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const teacherId = useSelector((state) => state.auth.teacherId);
  const teacher = useSelector((state) => state.auth.profile);
  const subjects = useSelector((state) => state.subject.subjects);

  const subject = subjects.find((item) => item.teacherId === teacherId);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(teacher?.name || "");
  const [email, setEmail] = useState(teacher?.email || "");

  const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;

  if (!teacherId) return null;

  const startEdit = () => {
    setName(teacher?.name || "");
    setEmail(teacher?.email || "");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const editHandler = async () => {
    if (!name.trim()) {
      return toast.error("Name cannot be empty.");
    }

    setLoading(true);

    try {
      const res = await fetch(`${db_url}/teachers/${teacherId}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      dispatch(authActions.updateProfile({ name }));

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Account Profile
        </h1>
        <p className="text-xs font-semibold text-slate-500 sm:text-sm">
          Manage your personal details and active institutional assignments.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Main User Info Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 font-bold text-indigo-600 ring-1 ring-indigo-600/10">
                <User size={26} />
              </div>

              {isEditing ? (
                <div className="flex-1 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none transition-all hover:border-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Email Address
                      <Lock size={10} className="text-slate-400" />
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-slate-100/70 px-3.5 py-2 text-slate-500">
                      <Mail size={14} className="text-slate-400 shrink-0" />
                      <input
                        value={email}
                        readOnly
                        type="email"
                        className="w-full bg-transparent text-xs font-semibold outline-none cursor-not-allowed sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                      {teacher?.name || "Teacher Account"}
                    </h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 ring-1 ring-indigo-600/10">
                      <ShieldCheck size={11} />
                      Verified
                    </span>
                  </div>
                  <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 sm:text-sm">
                    <Mail size={13} className="text-slate-400" />
                    {teacher?.email || "No email assigned"}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
              {isEditing ? (
                <>
                  <button
                    onClick={cancelEdit}
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-xs transition-all duration-200 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50"
                    title="Cancel"
                  >
                    <X size={16} />
                  </button>
                  <button
                    onClick={editHandler}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Check size={16} />
                    )}
                    <span>Save</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={startEdit}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:text-sm"
                >
                  <Pencil size={15} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Department & Subject Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200/60">
                <Building2 size={18} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Department
                </p>
                <p className="text-xs font-bold text-slate-800 sm:text-sm">
                  {subject?.branch || "Not Assigned"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200/60">
                <BookOpen size={18} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Assigned Subject
                </p>
                <p className="text-xs font-bold text-slate-800 sm:text-sm">
                  {subject?.name || "Not Assigned"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}