import { Link } from "react-router-dom";
import MetaData from "./MetaData";

const NotFound = () => (
  <div className="container-px flex min-h-[60vh] flex-col items-center justify-center text-center">
    <MetaData title="Page not found" />
    <p className="text-7xl font-extrabold text-brand-600">404</p>
    <h1 className="mt-4 text-2xl font-bold text-ink">This page took a different career path</h1>
    <p className="mt-2 text-ink-muted">The page you're looking for doesn't exist or has moved.</p>
    <Link to="/" className="btn-primary mt-6">Back to home</Link>
  </div>
);

export default NotFound;
