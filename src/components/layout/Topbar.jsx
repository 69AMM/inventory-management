import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Moon, Sun, User } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ onOpenMobileMenu, pageTitle }) {
  const { products, settings, updateAppSettings } = useInventory();
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const lowStockItems = settings?.notifications ? products.filter(
    (p) => p.status === 'Low Stock' || p.status === 'Out of Stock'
  ) : [];

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    if (settings) updateAppSettings({ darkMode: !settings.darkMode });
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle dark mode"
        >
          {settings?.darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
            {lowStockItems.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-card shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Stock Alerts
                </p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {lowStockItems.length === 0 ? (
                  <p className="text-sm text-slate-500 px-4 py-6 text-center">
                    All products are sufficiently stocked.
                  </p>
                ) : (
                  lowStockItems.slice(0, 6).map((p) => (
                    <Link
                      to={`/products/${p.id}`}
                      key={p.id}
                      onClick={() => setNotifOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm"
                    >
                      <span className="text-slate-700 dark:text-slate-200 truncate pr-2">
                        {p.name}
                      </span>
                      <span
                        className={
                          p.status === 'Out of Stock' ? 'badge-red' : 'badge-amber'
                        }
                      >
                        {p.status}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          <User className="w-4 h-4 text-slate-500 dark:text-slate-300" />
        </div>
        <button className="btn-ghost text-xs px-2" onClick={logout} title={`Sign out ${user?.name}`}>Sign out</button>
      </div>
    </header>
  );
}
