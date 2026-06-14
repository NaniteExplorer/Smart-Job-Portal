// Shared formatting helpers used across NexHire.

export const formatSalary = (min, max) => {
  const fmt = (n) => {
    if (!n) return null;
    if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 ? 1 : 0)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
    return `₹${n}`;
  };
  const lo = fmt(min);
  const hi = fmt(max);
  if (lo && hi) return `${lo} – ${hi}`;
  return lo || hi || "Not disclosed";
};

export const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

export const timeAgo = (date) => {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  const units = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [secs, label] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val} ${label}${val > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

// Display name for any user object regardless of role.
export const displayName = (user) => {
  if (!user) return "";
  if (user.role === "student") return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  if (user.role === "recruiter") return user.companyName || "";
  if (user.role === "university") return user.name || "";
  return user.displayName || "";
};

export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "NX";
