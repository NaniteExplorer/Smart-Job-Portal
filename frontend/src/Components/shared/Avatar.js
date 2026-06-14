import { initials } from "../../utils/format";

const sizes = { sm: "h-9 w-9 text-xs", md: "h-12 w-12 text-sm", lg: "h-20 w-20 text-xl", xl: "h-28 w-28 text-3xl" };

const Avatar = ({ url, name, size = "md", className = "" }) => {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-white ${className}`}
      />
    );
  }
  return (
    <div
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-brand-600 font-semibold text-white ring-2 ring-white ${className}`}
    >
      {initials(name)}
    </div>
  );
};

export default Avatar;
