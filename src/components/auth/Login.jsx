import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Boxes, LockKeyhole } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ username: 'admin', password: 'stockhub' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  const submit = async (event) => { event.preventDefault(); setBusy(true); setError(''); try { await login(form); } catch (loginError) { setError(loginError.message); } finally { setBusy(false); } };
  return <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-5"><div className="w-full max-w-md card p-7 sm:p-9"><div className="flex items-center gap-3 mb-8"><div className="w-10 h-10 rounded-md bg-primary-600 flex items-center justify-center"><Boxes className="text-white" /></div><div><h1 className="text-xl font-semibold">StockHub</h1><p className="text-sm text-slate-500">Inventory workspace</p></div></div><h2 className="text-lg font-semibold">Sign in</h2><p className="text-sm text-slate-500 mt-1 mb-6">Demo accounts use password <strong>stockhub</strong>.</p><form onSubmit={submit} className="space-y-4">{error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}<label className="block"><span className="label">Username</span><select className="input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}><option value="admin">admin (Administrator)</option><option value="staff">staff (Staff)</option></select></label><label className="block"><span className="label">Password</span><div className="relative"><LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input className="input pl-9" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div></label><button className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button></form></div></main>;
}
