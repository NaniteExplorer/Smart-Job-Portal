import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiSave, FiLock } from "react-icons/fi";

import MetaData from "../layout/MetaData";
import { updateProfile, updatePassword } from "../../store/authSlice";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((s) => s.auth);
  const role = user?.role;

  // Profile form state, prefilled from the current user.
  const [form, setForm] = useState({
    phone: user?.phone || "",
    bio: user?.bio || "",
    website: user?.website || "",
    address: user?.address || "",
    description: user?.description || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    degree: user?.degree || "",
    major: user?.major || "",
    graduationYear: user?.graduationYear || "",
    skills: (user?.skills || []).join(", "),
    companyName: user?.companyName || "",
    name: user?.name || "",
  });

  const [pwd, setPwd] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwdLoading, setPwdLoading] = useState(false);

  const onForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onPwd = (e) => setPwd({ ...pwd, [e.target.name]: e.target.value });

  const buildPayload = () => {
    const common = {
      phone: form.phone,
      bio: form.bio,
      website: form.website,
      address: form.address,
      description: form.description,
    };
    if (role === "student") {
      return {
        ...common,
        firstName: form.firstName,
        lastName: form.lastName,
        degree: form.degree,
        major: form.major,
        graduationYear: form.graduationYear,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
    }
    if (role === "recruiter") return { ...common, companyName: form.companyName };
    if (role === "university") return { ...common, name: form.name };
    return common;
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(buildPayload())).unwrap();
      toast.success("Profile updated");
      navigate("/profile");
    } catch (err) {
      toast.error(err.message || err || "Failed to update profile");
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (pwd.newPassword !== pwd.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setPwdLoading(true);
    try {
      await dispatch(updatePassword(pwd)).unwrap();
      toast.success("Password updated");
      setPwd({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.message || err || "Failed to update password");
    } finally {
      setPwdLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container-px py-8">
      <MetaData title="Edit Profile" />
      <h1 className="mb-6 text-2xl font-bold text-ink">Edit Profile</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile form */}
        <form onSubmit={submitProfile} className="card space-y-4 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-ink">Profile details</h2>

          {role === "student" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">First Name</label>
                <input
                  className="input"
                  name="firstName"
                  value={form.firstName}
                  onChange={onForm}
                />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input
                  className="input"
                  name="lastName"
                  value={form.lastName}
                  onChange={onForm}
                />
              </div>
            </div>
          )}

          {role === "recruiter" && (
            <div>
              <label className="label">Company Name</label>
              <input
                className="input"
                name="companyName"
                value={form.companyName}
                onChange={onForm}
              />
            </div>
          )}

          {role === "university" && (
            <div>
              <label className="label">University Name</label>
              <input
                className="input"
                name="name"
                value={form.name}
                onChange={onForm}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Phone</label>
              <input
                className="input"
                name="phone"
                value={form.phone}
                onChange={onForm}
              />
            </div>
            <div>
              <label className="label">Website</label>
              <input
                className="input"
                name="website"
                value={form.website}
                onChange={onForm}
              />
            </div>
          </div>

          <div>
            <label className="label">Address</label>
            <input
              className="input"
              name="address"
              value={form.address}
              onChange={onForm}
            />
          </div>

          {role === "student" && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="label">Degree</label>
                  <input
                    className="input"
                    name="degree"
                    value={form.degree}
                    onChange={onForm}
                  />
                </div>
                <div>
                  <label className="label">Major</label>
                  <input
                    className="input"
                    name="major"
                    value={form.major}
                    onChange={onForm}
                  />
                </div>
                <div>
                  <label className="label">Graduation Year</label>
                  <input
                    className="input"
                    name="graduationYear"
                    value={form.graduationYear}
                    onChange={onForm}
                  />
                </div>
              </div>
              <div>
                <label className="label">Skills (comma separated)</label>
                <input
                  className="input"
                  name="skills"
                  value={form.skills}
                  onChange={onForm}
                  placeholder="React, Node.js, SQL"
                />
              </div>
            </>
          )}

          <div>
            <label className="label">Bio</label>
            <textarea
              className="input"
              rows={3}
              name="bio"
              value={form.bio}
              onChange={onForm}
            />
          </div>

          {(role === "recruiter" || role === "university") && (
            <div>
              <label className="label">Description</label>
              <textarea
                className="input"
                rows={3}
                name="description"
                value={form.description}
                onChange={onForm}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"
          >
            <FiSave size={16} /> {loading ? "Saving..." : "Save changes"}
          </button>
        </form>

        {/* Change password */}
        <form onSubmit={submitPassword} className="card h-fit space-y-4 p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
            <FiLock size={18} className="text-brand-600" /> Change Password
          </h2>
          <div>
            <label className="label">Current Password</label>
            <input
              type="password"
              className="input"
              name="oldPassword"
              value={pwd.oldPassword}
              onChange={onPwd}
            />
          </div>
          <div>
            <label className="label">New Password</label>
            <input
              type="password"
              className="input"
              name="newPassword"
              value={pwd.newPassword}
              onChange={onPwd}
            />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input
              type="password"
              className="input"
              name="confirmPassword"
              value={pwd.confirmPassword}
              onChange={onPwd}
            />
          </div>
          <button
            type="submit"
            disabled={pwdLoading}
            className="btn-outline inline-flex items-center gap-2 disabled:opacity-60"
          >
            <FiLock size={16} /> {pwdLoading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
