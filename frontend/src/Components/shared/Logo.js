const Logo = ({ light = false, className = "" }) => (
  <span className={`flex items-center gap-2 ${className}`}>
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-800 font-extrabold text-white shadow-sm">
      N
    </span>
    <span className={`text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}>
      Nex<span className="text-brand-600">Hire</span>
    </span>
  </span>
);

export default Logo;
