const Loader = ({ full = true }) => (
  <div className={`flex items-center justify-center ${full ? "min-h-[60vh]" : "py-10"}`}>
    <div className="relative h-12 w-12">
      <div className="absolute inset-0 rounded-full border-4 border-brand-100" />
      <div className="absolute inset-0 animate-spin-faster rounded-full border-4 border-transparent border-t-brand-600" />
    </div>
  </div>
);

export default Loader;
