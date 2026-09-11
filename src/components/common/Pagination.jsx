import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, pageSize }) {
  if (totalPages <= 1) {
    return totalItems > 0 ? (
      <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
        <span>Showing all {totalItems} items</span>
      </div>
    ) : null;
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const pages = [];
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 dark:border-slate-800">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        Showing {start}-{end} of {totalItems}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-md border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {startPage > 1 && (
          <>
            <PageButton page={1} current={currentPage} onClick={onPageChange} />
            {startPage > 2 && <span className="px-1 text-slate-400">...</span>}
          </>
        )}
        {pages.map((p) => (
          <PageButton key={p} page={p} current={currentPage} onClick={onPageChange} />
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1 text-slate-400">...</span>}
            <PageButton page={totalPages} current={currentPage} onClick={onPageChange} />
          </>
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-md border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function PageButton({ page, current, onClick }) {
  const isActive = page === current;
  return (
    <button
      onClick={() => onClick(page)}
      className={`w-8 h-8 text-sm rounded-md border ${
        isActive
          ? 'bg-primary-600 text-white border-primary-600'
          : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
      }`}
    >
      {page}
    </button>
  );
}
