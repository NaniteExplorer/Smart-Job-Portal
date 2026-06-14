import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FiEdit2,
  FiMail,
  FiPhone,
  FiGlobe,
  FiMapPin,
  FiFileText,
  FiBriefcase,
  FiUsers,
} from "react-icons/fi";

import MetaData from "../layout/MetaData";
import Avatar from "../shared/Avatar";
import { displayName } from "../../utils/format";

const InfoRow = ({ icon: Icon, label, children }) => {
  if (!children) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="mt-0.5 shrink-0 text-brand-600" size={18} />
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
        <p className="break-words text-sm text-ink">{children}</p>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="card p-6">
    <h2 className="mb-4 text-lg font-semibold text-ink">{title}</h2>
    {children}
  </div>
);

const Profile = () => {
  const { user } = useSelector((s) => s.auth);
  if (!user) return null;

  const role = user.role;

  return (
    <div className="container-px py-8">
      <MetaData title="Profile" />

      {/* Header card */}
      <div className="card mb-6 p-6">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <Avatar url={user.avatar?.url} name={displayName(user)} size="xl" />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <h1 className="text-2xl font-bold text-ink">{displayName(user)}</h1>
              <span className="chip capitalize">{role}</span>
            </div>
            <div className="mt-3 space-y-1 text-sm text-ink-soft">
              {user.email && (
                <p className="flex items-center justify-center gap-2 sm:justify-start">
                  <FiMail size={15} className="text-brand-600" /> {user.email}
                </p>
              )}
              {user.phone && (
                <p className="flex items-center justify-center gap-2 sm:justify-start">
                  <FiPhone size={15} className="text-brand-600" /> {user.phone}
                </p>
              )}
            </div>
            {user.bio && <p className="mt-3 text-sm text-ink-soft">{user.bio}</p>}
          </div>
          <Link to="/profile/edit" className="btn-primary inline-flex items-center gap-2">
            <FiEdit2 size={16} /> Edit Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Student */}
        {role === "student" && (
          <>
            <Section title="Academics">
              <InfoRow icon={FiBriefcase} label="Degree">{user.degree}</InfoRow>
              <InfoRow icon={FiFileText} label="Major">{user.major}</InfoRow>
              <InfoRow icon={FiFileText} label="Graduation Year">
                {user.graduationYear}
              </InfoRow>
              <InfoRow icon={FiUsers} label="University">
                {user.university?.name}
              </InfoRow>
            </Section>

            <Section title="Skills">
              {user.skills && user.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <span key={skill} className="chip">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-muted">No skills added yet.</p>
              )}
            </Section>

            <Section title="Activity">
              <InfoRow icon={FiFileText} label="Applied Jobs">
                {(user.appliedJobs?.length ?? 0).toString()}
              </InfoRow>
              {user.resume?.url && (
                <a
                  href={user.resume.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline mt-2 inline-flex items-center gap-2"
                >
                  <FiFileText size={16} /> View Resume
                </a>
              )}
            </Section>
          </>
        )}

        {/* Recruiter */}
        {role === "recruiter" && (
          <>
            <Section title="Company">
              <InfoRow icon={FiBriefcase} label="Company Name">
                {user.companyName}
              </InfoRow>
              <InfoRow icon={FiMapPin} label="Address">{user.address}</InfoRow>
              {user.website && (
                <InfoRow icon={FiGlobe} label="Website">
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 hover:underline"
                  >
                    {user.website}
                  </a>
                </InfoRow>
              )}
              <InfoRow icon={FiFileText} label="Description">
                {user.description}
              </InfoRow>
            </Section>

            <Section title="Activity">
              <InfoRow icon={FiBriefcase} label="Jobs Posted">
                {(user.jobsPosted?.length ?? 0).toString()}
              </InfoRow>
            </Section>
          </>
        )}

        {/* University */}
        {role === "university" && (
          <>
            <Section title="University">
              <InfoRow icon={FiUsers} label="Name">{user.name}</InfoRow>
              <InfoRow icon={FiMapPin} label="Address">{user.address}</InfoRow>
              {user.website && (
                <InfoRow icon={FiGlobe} label="Website">
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 hover:underline"
                  >
                    {user.website}
                  </a>
                </InfoRow>
              )}
              <InfoRow icon={FiFileText} label="Description">
                {user.description}
              </InfoRow>
            </Section>

            <Section title="Activity">
              <InfoRow icon={FiUsers} label="Students">
                {(user.students?.length ?? 0).toString()}
              </InfoRow>
            </Section>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
