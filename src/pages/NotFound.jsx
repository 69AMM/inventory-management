import { Link } from 'react-router-dom';
import { PackageX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <PackageX className="w-7 h-7 text-slate-400" />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
          404 — Page Not Found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link to="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
