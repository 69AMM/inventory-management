import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const titleMap = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/products/add': 'Add Product',
  '/categories': 'Categories',
  '/stock-movements': 'Stock Movements',
  '/settings': 'Settings',
  '/activity': 'Activity Log',
  '/suppliers': 'Suppliers',
};

function resolveTitle(pathname) {
  if (titleMap[pathname]) return titleMap[pathname];
  if (/^\/products\/[^/]+\/edit$/.test(pathname)) return 'Edit Product';
  if (/^\/products\/[^/]+$/.test(pathname)) return 'Product Details';
  return 'StockHub';
}

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const pageTitle = resolveTitle(location.pathname);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <Sidebar isMobileOpen={isMobileOpen} onCloseMobile={() => setIsMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onOpenMobileMenu={() => setIsMobileOpen(true)} pageTitle={pageTitle} />
        <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
