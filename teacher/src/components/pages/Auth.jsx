import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authActions } from "../../Store/authSlice";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;
  const api_key = import.meta.env.VITE_FIREBASE_API_KEY;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let url;

      if (isLogin) {
        url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api_key}`;
      } else {
        url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${api_key}`;
      }

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

      const teacherId = authData.localId;

      if (!isLogin) {
        const user = {
          name,
          email,
          role: "teacher",
          createdAt: Date.now(),
        };

        await fetch(`${db_url}/teachers/${teacherId}.json`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        toast.success("Account Created Successfully");
      }

      const profileRes = await fetch(`${db_url}/teachers/${teacherId}.json`);

      const profile = await profileRes.json();

      dispatch(
        authActions.login({
          token: authData.idToken,
          teacherId,
          email: authData.email,
          profile,
        }),
      );

      toast.success(isLogin ? "Login Successful" : "Signup Successful");

      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-indigo-50 to-blue-100 px-4 py-10">
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
      <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl"></div>

      <div className="relative w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-2xl backdrop-blur-xl">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-center text-white">
            <h1 className="mt-5 text-3xl font-bold">
              {isLogin ? "Teacher Login" : "Teacher Registration"}
            </h1>

            <p className="mt-2 text-sm text-indigo-100">
              {isLogin
                ? "Welcome back! Login to continue."
                : "Create your teacher account."}
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={submitHandler} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    required
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="teacher@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>

                    <span>
                      {isLogin
                        ? "Logging in..."
                        : "Creating Teacher Account..."}
                    </span>
                  </div>
                ) : (
                  <span>{isLogin ? "Login" : "Create Teacher Account"}</span>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center">
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                OR
              </span>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>

            <button
              onClick={() => setIsLogin((prev) => !prev)}
              className="w-full rounded-xl border border-slate-200 py-3 font-medium text-slate-700 transition hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600"
            >
              {isLogin
                ? "Create New Account"
                : "Already have an account? Login"}
            </button>

            <button
              type="button"
              onClick={() =>
                (window.location.href = `https://edu-manage-student.vercel.app`)
              }
              className="mt-3 w-full rounded-xl border border-emerald-200 bg-emerald-50 py-3 font-medium text-emerald-700 transition hover:bg-emerald-100"
            >
              Continue as Student →
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          © 2026 EduManage • Teacher Portal
        </p>
      </div>
    </div>
  );
};

export default Auth;
