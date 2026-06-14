import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";
import Logo from "../shared/Logo";

const Footer = () => (
  <footer className="mt-auto border-t border-slate-200 bg-white">
    <div className="container-px grid gap-8 py-12 md:grid-cols-4">
      <div className="md:col-span-1">
        <Logo />
        <p className="mt-3 max-w-xs text-sm text-ink-muted">
          Bridging students, colleges and recruiters — find jobs, host hackathons,
          and connect campus talent with opportunity.
        </p>
        <div className="mt-4 flex gap-3 text-ink-muted">
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-brand-600"><FaLinkedin size={20} /></a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-brand-600"><FaGithub size={20} /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-brand-600"><FaTwitter size={20} /></a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-brand-600"><FaInstagram size={20} /></a>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-ink">For Students</h4>
        <ul className="mt-3 space-y-2 text-sm text-ink-muted">
          <li><Link to="/jobs" className="hover:text-brand-600">Browse Jobs</Link></li>
          <li><Link to="/events" className="hover:text-brand-600">Hackathons</Link></li>
          <li><Link to="/signup" className="hover:text-brand-600">Create Profile</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-ink">For Recruiters</h4>
        <ul className="mt-3 space-y-2 text-sm text-ink-muted">
          <li><Link to="/signup" className="hover:text-brand-600">Post a Job</Link></li>
          <li><Link to="/host/events/new" className="hover:text-brand-600">Host an Event</Link></li>
          <li><Link to="/about" className="hover:text-brand-600">Why NexHire</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-ink">Company</h4>
        <ul className="mt-3 space-y-2 text-sm text-ink-muted">
          <li><Link to="/about" className="hover:text-brand-600">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-brand-600">Contact</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-slate-100 py-5">
      <p className="container-px text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} NexHire. Built to connect talent with opportunity.
      </p>
    </div>
  </footer>
);

export default Footer;
