import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Store/authSlice";
import toast from "react-hot-toast";
import { User, Mail, Hash, BookOpen, ShieldCheck, Save, Loader2 } from "lucide-react";

export default function Profile() {
  const profile = useSelector((state) => state.auth?.profile);
  const dispatch = useDispatch();
  
  const [name, setName] = useState(profile?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="mt-2 text-xs font-semibold text-slate-500">Loading profile data...</p>
      </div>
    );
  }

  const updateProfile = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setIsUpdating(true);
    try {
      const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;
      const endpoint = profile.role === "teacher" ? "teachers" : "students";
      
      const res = await fetch(`${db_url}/${endpoint}/${profile.id}.json`, {
        method: "PATCH",
        body: JSON.stringify({ name: name.trim() }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        dispatch(authActions.updateProfile({ name: name.trim() }));
        toast.success("Profile updated successfully.");
      } else {
        throw new Error("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Account Profile
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
          Manage your account details and personal preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:border-slate-300">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-50 border-2 border-indigo-100 text-4xl font-black text-indigo-600 shadow-inner">
                {profile.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="absolute bottom-1 right-1 rounded-full bg-emerald-500 p-1.5 ring-4 ring-white" />
            </div>

            <h2 className="mt-4 text-xl font-extrabold text-slate-900">
              {profile.name}
            </h2>

            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-extrabold text-indigo-700 ring-1 ring-inset ring-indigo-200 capitalize">
              <ShieldCheck size={13} />
              {profile.role || "Student"}
            </span>

            <div className="mt-6 w-full space-y-3 text-left">
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <Hash size={14} />
                  <p className="text-[11px] font-bold uppercase tracking-wider">
                    Enrollment ID
                  </p>
                </div>
                <p className="mt-1 text-sm font-extrabold text-slate-900">
                  {profile?.rollNo || profile?.enrollmentNo || "N/A"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <BookOpen size={14} />
                  <p className="text-[11px] font-bold uppercase tracking-wider">
                    Assigned Subjects
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {profile.subjects?.length > 0 ? (
                    profile.subjects.map((sub, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200/80 shadow-xs"
                      >
                        {sub}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs font-semibold text-slate-400">
                      No subjects assigned yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details Form */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:border-slate-300 lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-extrabold text-slate-900">
                Personal Information
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Update your visible profile display details.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <User size={13} className="text-slate-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <Mail size={13} className="text-slate-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={profile.email}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-400 cursor-not-allowed"
                />
                <p className="text-[11px] font-semibold text-slate-400 pt-0.5">
                  Email addresses are permanently tied to your account.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={updateProfile}
              disabled={isUpdating}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs sm:text-sm font-extrabold text-white transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20"
            >
              {isUpdating ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}