import { Activity, ArrowDownToLine, ArrowUpFromLine, PackagePlus, Pencil } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useQuery } from '@tanstack/react-query';
import { getStockMovements } from '../services/stockMovementService';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import { formatDateTime } from '../utils/inventoryUtils';

export default function ActivityLog() {
  const { products, stockMovements, loading } = useInventory();
  const { data: queriedMovements } = useQuery({ queryKey: ['stock-movements'], queryFn: getStockMovements });
  if (loading) return <LoadingState label="Loading activity..." />;
  const productEvents = products.flatMap((product) => [{ id: `${product.id}-updated`, title: `${product.name} updated`, detail: `${product.sku} · ${product.category}`, date: product.updatedAt, icon: Pencil }, ...(product.createdAt === product.updatedAt ? [{ id: `${product.id}-created`, title: `${product.name} created`, detail: `${product.sku} · ${product.category}`, date: product.createdAt, icon: PackagePlus }] : [])]);
  const movementEvents = (queriedMovements || stockMovements).map((movement) => ({ id: movement.id, title: `${movement.type}: ${movement.productName}`, detail: `${movement.quantity} units${movement.notes ? ` · ${movement.notes}` : ''}`, date: movement.date, icon: movement.type === 'Stock In' ? ArrowDownToLine : ArrowUpFromLine }));
  const events = [...productEvents, ...movementEvents].sort((a, b) => new Date(b.date) - new Date(a.date));
  return <div className="space-y-5 max-w-4xl"><div><h1 className="text-xl font-semibold">Activity Log</h1><p className="text-sm text-slate-500 mt-1">A chronological record of inventory and product activity.</p></div>{events.length === 0 ? <EmptyState icon={Activity} title="No activity yet" description="Product and stock events will appear here." /> : <div className="card divide-y divide-slate-100 dark:divide-slate-800">{events.map((event) => <div key={event.id} className="p-4 flex items-start gap-3"><div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500"><event.icon className="w-4 h-4" /></div><div className="flex-1"><p className="font-medium text-sm">{event.title}</p><p className="text-xs text-slate-500 mt-1">{event.detail}</p></div><time className="text-xs text-slate-400 whitespace-nowrap">{formatDateTime(event.date)}</time></div>)}</div>}</div>;
}
