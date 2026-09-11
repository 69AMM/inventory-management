import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const KEY = 'inventory_app:session';
const demoUsers = {
  admin: { id: 'user-admin', name: 'Store Administrator', role: 'admin' },
  staff: { id: 'user-staff', name: 'Inventory Staff', role: 'staff' },
};

function readSession() {
  try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);
  const login = async ({ username, password }) => {
    const account = demoUsers[username.toLowerCase()];
    if (!account || password !== 'stockhub') throw new Error('Use admin or staff with password stockhub.');
    localStorage.setItem(KEY, JSON.stringify(account));
    setUser(account);
  };
  const logout = () => { localStorage.removeItem(KEY); setUser(null); };
  return <AuthContext.Provider value={{ user, login, logout, isAuthenticated: Boolean(user), can: (role) => user?.role === role || user?.role === 'admin' }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
