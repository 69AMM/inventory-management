import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '../common/EmptyState';
import { formatDateTime } from '../../utils/inventoryUtils';

export default function RecentActivity({ movements }) {
  const recent = movements.slice(0, 6);

  if (recent.length === 0) {
    return <EmptyState title="No stock activity yet" description="Recorded stock movements will appear here." />;
  }

  return (
    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
      {recent.map((m) => (
        <li key={m.id} className="flex items-center gap-3 py-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              m.type === 'Stock In'
                ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {m.type === 'Stock In' ? (
              <ArrowUpCircle className="w-4 h-4" />
            ) : (
              <ArrowDownCircle className="w-4 h-4" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Link
              to={`/products/${m.productId}`}
              className="text-sm font-medium text-slate-800 dark:text-slate-100 hover:text-primary-600 truncate block"
            >
              {m.productName}
            </Link>
            <p className="text-xs text-slate-400 dark:text-slate-500">{formatDateTime(m.date)}</p>
          </div>
          <span
            className={`text-sm font-medium shrink-0 ${
              m.type === 'Stock In' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {m.type === 'Stock In' ? '+' : '-'}
            {m.quantity}
          </span>
        </li>
      ))}
    </ul>
  );
}
