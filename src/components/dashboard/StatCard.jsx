export default function StatCard({ label, value, icon: Icon, tone = 'default', sublabel }) {
  const toneClasses = {
    default: 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  };

  return (
    <div className="card p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </p>
        {sublabel && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sublabel}</p>
        )}
      </div>
      <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${toneClasses[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
