import { Link } from "react-router-dom";
import {
  FiTarget,
  FiEye,
  FiBriefcase,
  FiAward,
  FiUsers,
  FiBookOpen,
  FiArrowRight,
  FiHeart,
} from "react-icons/fi";
import MetaData from "../layout/MetaData";
import Avatar from "../shared/Avatar";

const whatWeDo = [
  {
    icon: FiBriefcase,
    title: "Jobs & internships",
    desc: "A curated marketplace where students find verified opportunities and recruiters reach the right talent.",
  },
  {
    icon: FiAward,
    title: "Hackathons & events",
    desc: "Host and join hackathons, contests, and workshops that turn skills into real-world recognition.",
  },
  {
    icon: FiBookOpen,
    title: "Campus connect",
    desc: "Colleges bring students and recruiters together, streamlining placements end to end.",
  },
  {
    icon: FiUsers,
    title: "One professional network",
    desc: "Profiles, applications, and events live in a single place — no more juggling five different tools.",
  },
];

const About = () => {
  return (
    <>
      <MetaData title="About" />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute -left-10 top-10 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
          <div
            className="animate-float absolute right-0 bottom-0 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl"
            style={{ animationDelay: "2s" }}
          />
        </div>
        <div className="container-px relative py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-100 ring-1 ring-inset ring-white/20">
              Our story
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Bridging talent and opportunity
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-brand-100/90">
              NexHire was built on a simple belief: students, colleges, and
              recruiters deserve one professional home where careers begin and
              opportunities flow freely.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="container-px py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            What we do
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Everything in one place
          </h2>
          <p className="mt-3 text-ink-muted">
            We combine the best of professional networking, job discovery, and
            competitive events into a single, focused platform.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {whatWeDo.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="card group flex gap-4 p-6 transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <Icon className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="container-px grid gap-6 md:grid-cols-2">
          <div className="card p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
              <FiTarget className="text-xl" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-ink">Our mission</h3>
            <p className="mt-3 leading-relaxed text-ink-soft">
              To bridge students, colleges, and recruiters — making it effortless to
              find the right job, host meaningful events, and unlock opportunity
              regardless of where you start.
            </p>
          </div>
          <div className="card p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
              <FiEye className="text-xl" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-ink">Our vision</h3>
            <p className="mt-3 leading-relaxed text-ink-soft">
              A world where every student has a fair shot at their dream career, every
              college can showcase its talent, and every recruiter can hire with
              confidence — all powered by NexHire.
            </p>
          </div>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="container-px py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            The people behind NexHire
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Meet our founder
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-md">
          <div className="card flex flex-col items-center p-8 text-center transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
            <Avatar name="Debasish Rana" size="xl" />
            <h3 className="mt-5 text-lg font-semibold text-ink">Debasish Rana</h3>
            <p className="text-sm font-medium text-brand-600">Founder &amp; Engineer</p>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-sm leading-relaxed text-ink-soft">
              Building NexHire to make career opportunities accessible to every student.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-muted">
              <FiHeart className="text-brand-500" /> Made in Rourkela, India
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-px pb-16 lg:pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-8 py-14 text-center text-white shadow-card-hover">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Want to be part of the journey?
          </h2>
          <p className="mt-3 text-brand-100/90">
            Join NexHire and start connecting today.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="btn inline-flex bg-white text-brand-700 shadow-sm hover:bg-brand-50"
            >
              Get started <FiArrowRight />
            </Link>
            <Link
              to="/contact"
              className="btn inline-flex border border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
