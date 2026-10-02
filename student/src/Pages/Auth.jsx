import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { authActions } from "../Store/authSlice";

const subjects = [
  "Operating Systems",
  "Database Management",
  "Computer Networks",
  "Java",
];

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const api_key = import.meta.env.VITE_FIREBASE_API_KEY;
  const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isLogin
        ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api_key}`
        : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${api_key}`;

      const authRes = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      });

      const authData = await authRes.json();

      if (!authRes.ok) {
        throw new Error(authData.error.message);
      }

      const studentId = authData.localId;

      if (!isLogin) {
        const profile = {
          name,
          email,
          rollNo,
          role: "student",
          subjects,
        };

        await fetch(`${db_url}/students/${studentId}.json`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        });

        dispatch(
          authActions.login({
            token: authData.idToken,
            studentId,
            email,
            profile,
          }),
        );

        toast.success("Account Created");
      } else {
        const res = await fetch(`${db_url}/students/${studentId}.json`);

        const profile = await res.json();

        dispatch(
          authActions.login({
            token: authData.idToken,
            studentId,
            email,
            profile,
          }),
        );

        toast.success("Login Successful");
      }

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-linear-to-br from-slate-100 via-indigo-50 to-blue-100 px-4 py-3 sm:py-5">
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
      <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl"></div>

      <div className="relative w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-2xl backdrop-blur-xl">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-5 text-center text-white sm:py-6">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {isLogin ? "Student Login" : "Student Registration"}
            </h1>

            <p className="mt-2 text-sm text-indigo-100">
              {isLogin
                ? "Welcome back! Login to continue."
                : "Create your student account."}
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <form onSubmit={submitHandler} className="space-y-3 sm:space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>

                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Roll Number
                    </label>

                    <input
                      type="text"
                      placeholder="2026CS001"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-2.5 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>

                    <span>
                      {isLogin ? "Logging in..." : "Creating Account..."}
                    </span>
                  </div>
                ) : (
                  <span>{isLogin ? "Login" : "Create Student Account"}</span>
                )}
              </button>
            </form>

            <div className="my-4 flex items-center">
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                OR
              </span>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full rounded-xl border border-slate-200 py-2.5 font-medium text-slate-700 transition hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600"
            >
              {isLogin
                ? "Create New Account"
                : "Already have an account? Login"}
            </button>

            <button
              type="button"
              onClick={() =>
                (window.location.href = `${import.meta.env.VITE_TEACHER_URL}`)
              }
              className="mt-2 w-full rounded-xl border border-amber-200 bg-amber-50 py-2.5 font-medium text-amber-700 transition hover:bg-amber-100"
            >
              Continue as Teacher →
            </button>
          </div>
        </div>

       
      </div>
    </div>
  );
}
