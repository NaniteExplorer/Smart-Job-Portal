import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff, FiUser, FiBriefcase, FiBook } from "react-icons/fi";
import toast from "react-hot-toast";
import { register } from "../../store/authSlice";
import MetaData from "../layout/MetaData";
import Logo from "../shared/Logo";

const ROLES = [
  { value: "student", label: "Student", icon: FiUser, blurb: "Find jobs & events" },
  { value: "recruiter", label: "Recruiter", icon: FiBriefcase, blurb: "Hire top talent" },
  { value: "university", label: "University", icon: FiBook, blurb: "Connect your students" },
];

const initialFields = {
  // common
  email: "",
  password: "",
  confirmPassword: "",
  // student
  firstName: "",
  lastName: "",
  degree: "",
  major: "",
  graduationYear: "",
  skills: "",
  university: "",
  // recruiter
  companyName: "",
  // recruiter + university shared
  address: "",
  website: "",
  description: "",
  // university
  name: "",
};

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useSelector((s) => s.auth);

  const [role, setRole] = useState("student");
  const [fields, setFields] = useState(initialFields);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  const buildPayload = () => {
    const { email, password } = fields;
    const base = { role, email, password };

    if (role === "student") {
      const payload = {
        ...base,
        firstName: fields.firstName.trim(),
        lastName: fields.lastName.trim(),
        degree: fields.degree.trim(),
        major: fields.major.trim(),
        graduationYear: Number(fields.graduationYear),
        skills: fields.skills.trim(),
      };
      // university is optional; omit unless a value is present (backend expects an ObjectId)
      if (fields.university.trim()) payload.university = fields.university.trim();
      return payload;
    }

    if (role === "recruiter") {
      return {
        ...base,
        companyName: fields.companyName.trim(),
        address: fields.address.trim(),
        website: fields.website.trim(),
        description: fields.description.trim(),
      };
    }

    // university
    return {
      ...base,
      name: fields.name.trim(),
      address: fields.address.trim(),
      website: fields.website.trim(),
      description: fields.description.trim(),
    };
  };

  const validate = () => {
    if (!fields.email.trim()) return "Email is required.";
    if (fields.password.length < 8) return "Password must be at least 8 characters.";
    if (fields.password !== fields.confirmPassword) return "Passwords do not match.";

    if (role === "student") {
      if (!fields.firstName.trim() || !fields.lastName.trim())
        return "First and last name are required.";
      if (!fields.degree.trim() || !fields.major.trim())
        return "Degree and major are required.";
      if (!fields.graduationYear || Number.isNaN(Number(fields.graduationYear)))
        return "A valid graduation year is required.";
    } else if (role === "recruiter") {
      if (!fields.companyName.trim()) return "Company name is required.";
    } else if (role === "university") {
      if (!fields.name.trim()) return "University name is required.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    try {
      await dispatch(register(buildPayload())).unwrap();
      toast.success("Welcome to NexHire!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <MetaData title="Create account" />
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-brand-700 to-brand-950 p-12 text-white lg:flex">
          <Logo light />
          <div className="max-w-md">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
              Join the network that moves careers forward.
            </h1>
            <p className="mt-4 text-lg text-brand-100">
              Students, recruiters, and universities — all in one place. Create your free account and start
              building meaningful connections today.
            </p>
            <ul className="mt-10 space-y-3 text-brand-100">
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/40 text-sm">✓</span>
                Discover jobs, internships & campus events
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/40 text-sm">✓</span>
                Manage applications in one dashboard
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/40 text-sm">✓</span>
                Reach the right people, faster
              </li>
            </ul>
          </div>
          <p className="text-sm text-brand-200">© {new Date().getFullYear()} NexHire. All rights reserved.</p>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6">
          <div className="w-full max-w-lg">
            <div className="mb-8 flex justify-center lg:hidden">
              <Logo />
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-bold text-ink">Create your account</h2>
              <p className="mt-1 text-sm text-ink-muted">Choose how you want to use NexHire.</p>

              {/* Role selector */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {ROLES.map(({ value, label, icon: Icon, blurb }) => {
                  const active = role === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRole(value)}
                      className={`flex flex-col items-center rounded-xl border p-4 text-center transition ${
                        active
                          ? "border-brand-600 bg-brand-50 ring-2 ring-brand-100"
                          : "border-slate-200 bg-white hover:border-brand-300"
                      }`}
                    >
                      <Icon className={`h-6 w-6 ${active ? "text-brand-600" : "text-slate-400"}`} />
                      <span className={`mt-2 text-sm font-semibold ${active ? "text-brand-700" : "text-ink"}`}>
                        {label}
                      </span>
                      <span className="mt-0.5 text-[11px] text-ink-muted">{blurb}</span>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* Role-specific fields */}
                {role === "student" && (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="label">First name</label>
                      <input id="firstName" className="input" required value={fields.firstName} onChange={set("firstName")} placeholder="Jane" />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="label">Last name</label>
                      <input id="lastName" className="input" required value={fields.lastName} onChange={set("lastName")} placeholder="Doe" />
                    </div>
                    <div>
                      <label htmlFor="degree" className="label">Degree</label>
                      <input id="degree" className="input" required value={fields.degree} onChange={set("degree")} placeholder="B.Tech" />
                    </div>
                    <div>
                      <label htmlFor="major" className="label">Major</label>
                      <input id="major" className="input" required value={fields.major} onChange={set("major")} placeholder="Computer Science" />
                    </div>
                    <div>
                      <label htmlFor="graduationYear" className="label">Graduation year</label>
                      <input id="graduationYear" type="number" className="input" required value={fields.graduationYear} onChange={set("graduationYear")} placeholder="2026" />
                    </div>
                    <div>
                      <label htmlFor="university" className="label">University <span className="text-ink-muted">(optional)</span></label>
                      <input id="university" className="input" value={fields.university} onChange={set("university")} placeholder="Your university" />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="skills" className="label">Skills <span className="text-ink-muted">(comma-separated)</span></label>
                      <input id="skills" className="input" value={fields.skills} onChange={set("skills")} placeholder="React, Node.js, SQL" />
                    </div>
                  </div>
                )}

                {role === "recruiter" && (
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="companyName" className="label">Company name</label>
                      <input id="companyName" className="input" required value={fields.companyName} onChange={set("companyName")} placeholder="Acme Inc." />
                    </div>
                    <div>
                      <label htmlFor="address" className="label">Address</label>
                      <input id="address" className="input" value={fields.address} onChange={set("address")} placeholder="City, Country" />
                    </div>
                    <div>
                      <label htmlFor="website" className="label">Website</label>
                      <input id="website" className="input" value={fields.website} onChange={set("website")} placeholder="https://acme.com" />
                    </div>
                    <div>
                      <label htmlFor="description" className="label">About the company</label>
                      <textarea id="description" rows={3} className="input" value={fields.description} onChange={set("description")} placeholder="Tell candidates what you do." />
                    </div>
                  </div>
                )}

                {role === "university" && (
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="name" className="label">University name</label>
                      <input id="name" className="input" required value={fields.name} onChange={set("name")} placeholder="State University" />
                    </div>
                    <div>
                      <label htmlFor="address" className="label">Address</label>
                      <input id="address" className="input" value={fields.address} onChange={set("address")} placeholder="City, Country" />
                    </div>
                    <div>
                      <label htmlFor="website" className="label">Website</label>
                      <input id="website" className="input" value={fields.website} onChange={set("website")} placeholder="https://university.edu" />
                    </div>
                    <div>
                      <label htmlFor="description" className="label">About the university</label>
                      <textarea id="description" rows={3} className="input" value={fields.description} onChange={set("description")} placeholder="A short introduction." />
                    </div>
                  </div>
                )}

                {/* Common credentials */}
                <div>
                  <label htmlFor="email" className="label">Email address</label>
                  <input id="email" type="email" autoComplete="email" className="input" required value={fields.email} onChange={set("email")} placeholder="you@example.com" />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="password" className="label">Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="input pr-10"
                        required
                        value={fields.password}
                        onChange={set("password")}
                        placeholder="Min. 8 characters"
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
                  <div>
                    <label htmlFor="confirmPassword" className="label">Confirm password</label>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="input"
                      required
                      value={fields.confirmPassword}
                      onChange={set("confirmPassword")}
                      placeholder="Re-enter password"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                  {loading ? "Creating account…" : "Create account"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-ink-muted">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
