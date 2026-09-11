import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InventoryProvider } from './context/InventoryContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';

import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import StockMovements from './pages/StockMovements';
import Settings from './pages/Settings';
import ActivityLog from './pages/ActivityLog';
import Suppliers from './pages/Suppliers';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <InventoryProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/products/:id/edit" element={<EditProduct />} />
              <Route element={<ProtectedRoute role="admin" />}>
                <Route path="/categories" element={<Categories />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/suppliers" element={<Suppliers />} />
              </Route>
              <Route path="/stock-movements" element={<StockMovements />} />
              <Route path="/activity" element={<ActivityLog />} />
            </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </InventoryProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
