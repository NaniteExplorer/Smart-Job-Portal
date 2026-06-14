import { useState } from "react";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import MetaData from "../layout/MetaData";

const contactCards = [
  {
    icon: FiMail,
    label: "Email us",
    value: "hello@nexhire.dev",
    href: "mailto:hello@nexhire.dev",
  },
  {
    icon: FiPhone,
    label: "Call us",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: FiMapPin,
    label: "Visit us",
    value: "Rourkela, India",
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <MetaData title="Contact" />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute -left-10 top-8 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
          <div
            className="animate-float absolute right-0 bottom-0 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl"
            style={{ animationDelay: "2s" }}
          />
        </div>
        <div className="container-px relative py-20 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-100 ring-1 ring-inset ring-white/20">
              Get in touch
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
              We'd love to hear from you
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-brand-100/90">
              Questions, feedback, or partnership ideas? Reach out and our team will
              get back to you shortly.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="container-px py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Contact info cards */}
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Contact details
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Reach us through any channel
            </h2>
            <div className="mt-6 space-y-4">
              {contactCards.map(({ icon: Icon, label, value, href }) => {
                const body = (
                  <div className="card flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon className="text-xl" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                        {label}
                      </p>
                      <p className="mt-0.5 font-semibold text-ink">{value}</p>
                    </div>
                  </div>
                );
                return href ? (
                  <a key={label} href={href} className="block">
                    {body}
                  </a>
                ) : (
                  <div key={label}>{body}</div>
                );
              })}
            </div>
          </div>

          {/* Contact form */}
          <div className="card p-8">
            <h2 className="text-xl font-bold text-ink">Send us a message</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Fill in the form and we'll respond as soon as we can.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="input"
                />
              </div>
              <div>
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input"
                />
              </div>
              <div>
                <label className="label" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="input resize-none"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                <FiSend /> Send message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
