import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { logout } from "../../store/authSlice";
import { displayName } from "../../utils/format";
import Avatar from "../shared/Avatar";
import Logo from "../shared/Logo";

const navLinks = [
  { to: "/jobs", label: "Jobs" },
  { to: "/events", label: "Hackathons" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const roleMenus = {
  student: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/applications", label: "My Applications" },
    { to: "/saved", label: "Saved Jobs" },
    { to: "/profile", label: "Profile" },
  ],
  recruiter: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/recruiter/jobs", label: "Manage Jobs" },
    { to: "/host/events", label: "My Events" },
    { to: "/profile", label: "Profile" },
  ],
  university: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/host/events", label: "My Events" },
    { to: "/profile", label: "Profile" },
  ],
};

const Header = () => {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success("Logged out");
    navigate("/");
    setMenuOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? "text-brand-700" : "text-ink-soft hover:text-brand-700"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-px flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn-ghost">Sign in</Link>
              <Link to="/signup" className="btn-primary">Join NexHire</Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 hover:bg-slate-50"
              >
                <Avatar url={user?.avatar?.url} name={displayName(user)} size="sm" />
                <span className="max-w-[120px] truncate text-sm font-medium text-ink">
                  {displayName(user)}
                </span>
                <FiChevronDown className="text-ink-muted" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                    {(roleMenus[user?.role] || []).map((m) => (
                      <Link
                        key={m.to}
                        to={m.to}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-ink-soft hover:bg-brand-50 hover:text-brand-700"
                      >
                        {m.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="block w-full border-t border-slate-100 px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                    >
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu">
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-ink-soft"
            >
              {l.label}
            </NavLink>
          ))}
          <div className="mt-2 border-t border-slate-100 pt-2">
            {!isAuthenticated ? (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline flex-1">Sign in</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary flex-1">Join</Link>
              </div>
            ) : (
              <>
                {(roleMenus[user?.role] || []).map((m) => (
                  <NavLink key={m.to} to={m.to} onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-ink-soft">
                    {m.label}
                  </NavLink>
                ))}
                <button onClick={handleLogout} className="block py-2 text-sm text-rose-600">Log out</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
