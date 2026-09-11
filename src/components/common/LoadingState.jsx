import { Loader2 } from 'lucide-react';

export default function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500 dark:text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin mb-2 text-primary-600" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
