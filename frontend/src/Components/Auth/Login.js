import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
import { login } from "../../store/authSlice";
import MetaData from "../layout/MetaData";
import Logo from "../shared/Logo";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, isAuthenticated } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      toast.success("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <MetaData title="Sign in" />
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-brand-700 to-brand-950 p-12 text-white lg:flex">
          <Logo light />
          <div className="max-w-md">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
              Where careers and opportunities connect.
            </h1>
            <p className="mt-4 text-lg text-brand-100">
              Sign in to discover jobs, manage applications, and grow your professional network on NexHire.
            </p>
            <blockquote className="mt-10 border-l-2 border-brand-400 pl-4 text-brand-100">
              <p className="italic">
                “NexHire helped me land my first role straight out of university. The whole process felt effortless.”
              </p>
              <footer className="mt-2 text-sm font-medium text-white">
                — Aanya R., Software Engineer
              </footer>
            </blockquote>
          </div>
          <p className="text-sm text-brand-200">© {new Date().getFullYear()} NexHire. All rights reserved.</p>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6">
          <div className="w-full max-w-md">
            <div className="mb-8 flex justify-center lg:hidden">
              <Logo />
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-bold text-ink">Welcome back</h2>
              <p className="mt-1 text-sm text-ink-muted">Sign in to continue to NexHire.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="email" className="label">Email address</label>
                  <div className="relative">
                    <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="label">Password</label>
                  <div className="relative">
                    <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="input pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink-soft"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-ink-muted">
                New here?{" "}
                <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-700">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
