import { useState } from 'react';
import { Pencil, Plus, Trash2, Truck } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';

const blank = { name: '', contact: '', phone: '', address: '' };
export default function Suppliers() {
  const { suppliers, products, addSupplier, editSupplier, removeSupplier, loading } = useInventory();
  const { can } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState(blank); const [editing, setEditing] = useState(null); const [deleteTarget, setDeleteTarget] = useState(null); const [open, setOpen] = useState(false); const [error, setError] = useState('');
  const start = (supplier = null) => { setEditing(supplier); setForm(supplier || blank); setError(''); setOpen(true); };
  const submit = async (event) => { event.preventDefault(); try { if (editing) await editSupplier(editing.id, form); else await addSupplier(form); setOpen(false); showToast(editing ? 'Supplier updated.' : 'Supplier added.'); } catch (submitError) { setError(submitError.message); } };
  const remove = async () => { await removeSupplier(deleteTarget.id); setDeleteTarget(null); showToast('Supplier removed.'); };
  if (loading) return <LoadingState label="Loading suppliers..." />;
  return <div className="space-y-5"><div className="flex items-center justify-between"><div><h1 className="text-xl font-semibold">Suppliers</h1><p className="text-sm text-slate-500 mt-1">Manage vendor contacts and procurement relationships.</p></div>{can('admin') && <button className="btn-primary" onClick={() => start()}><Plus className="w-4 h-4" />Add supplier</button>}</div>{suppliers.length === 0 ? <EmptyState icon={Truck} title="No suppliers" description="Add a supplier to connect products with vendors." /> : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{suppliers.map((supplier) => { const count = products.filter((product) => product.supplier === supplier.name).length; return <div className="card p-5" key={supplier.id}><div className="flex justify-between"><div className="p-2 rounded-md bg-primary-50 text-primary-600"><Truck className="w-5 h-5" /></div>{can('admin') && <div className="flex gap-1"><button className="btn-ghost p-2" onClick={() => start(supplier)} title="Edit supplier"><Pencil className="w-4 h-4" /></button><button className="btn-ghost p-2 text-red-500" onClick={() => setDeleteTarget(supplier)} title="Delete supplier"><Trash2 className="w-4 h-4" /></button></div>}</div><h2 className="font-semibold mt-4">{supplier.name}</h2><p className="text-sm text-primary-600 mt-1">{supplier.contact}</p><p className="text-sm text-slate-500 mt-1">{supplier.phone || 'No phone'} · {supplier.address || 'No address'}</p><p className="text-xs text-slate-400 mt-4">{count} products supplied</p></div>; })}</div>}<Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? 'Edit supplier' : 'Add supplier'}><form className="space-y-4" onSubmit={submit}>{error && <p className="error-text">{error}</p>}{[['name', 'Supplier name *'], ['contact', 'Email or contact *'], ['phone', 'Phone'], ['address', 'Address']].map(([field, label]) => <label className="block" key={field}><span className="label">{label}</span><input className="input" value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} /></label>)}<div className="flex justify-end gap-2"><button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button><button className="btn-primary">Save supplier</button></div></form></Modal><ConfirmDialog isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={remove} title="Delete supplier?" message="Products will retain their supplier text, but this vendor record will be removed." confirmLabel="Delete supplier" /></div>;
}
