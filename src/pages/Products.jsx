import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowUp, Download, Eye, FileUp, Package, Pencil, Plus, ScanBarcode, Trash2 } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useToast } from '../context/ToastContext';
import SearchInput from '../components/common/SearchInput';
import FilterDropdown from '../components/common/FilterDropdown';
import Pagination from '../components/common/Pagination';
import Badge from '../components/common/Badge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { formatCurrency } from '../utils/inventoryUtils';
import BarcodeScanner from '../components/common/BarcodeScanner';
import { downloadTextFile, parseCsv, productsToCsv } from '../utils/csv';

export default function Products() {
  const { products, categories, settings, loading, error, reload, addProduct, removeProduct, removeProducts } = useInventory();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState({ key: 'name', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const importInput = useRef(null);
  const pageSize = 8;

  const filtered = useMemo(() => products.filter((product) => {
    const term = search.toLowerCase();
    return (!term || `${product.name} ${product.sku} ${product.supplier}`.toLowerCase().includes(term)) && (category === 'all' || product.category === category) && (status === 'all' || product.status === status);
  }).sort((a, b) => { const left = a[sort.key]; const right = b[sort.key]; const result = typeof left === 'string' ? left.localeCompare(right) : Number(left) - Number(right); return sort.direction === 'asc' ? result : -result; }), [products, search, category, status, sort]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => setPage(1), [search, category, status]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);
  const allVisibleSelected = visible.length > 0 && visible.every((product) => selected.includes(product.id));
  const toggleSort = (key) => setSort((current) => current.key === key ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' });
  const toggleAll = () => setSelected(allVisibleSelected ? selected.filter((id) => !visible.some((product) => product.id === id)) : [...new Set([...selected, ...visible.map((product) => product.id)])]);
  const confirmDelete = async () => { if (deleteTarget === 'selected') { await removeProducts(selected); setSelected([]); showToast(`${selected.length} products deleted.`); } else { await removeProduct(deleteTarget); setSelected((ids) => ids.filter((id) => id !== deleteTarget)); showToast('Product deleted.'); } setDeleteTarget(null); };
  const exportProducts = () => downloadTextFile('stockhub-products.csv', productsToCsv(products));
  const importProducts = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const rows = parseCsv(await file.text());
    let imported = 0;
    for (const row of rows) {
      try {
        await addProduct({ ...row, price: Number(row.price), costPrice: Number(row.costPrice), quantity: Number(row.quantity), minimumStockLevel: Number(row.minimumStockLevel) });
        imported += 1;
      } catch { /* Continue importing valid rows. */ }
    }
    showToast(`${imported} of ${rows.length} products imported.`);
    if (imported) reload();
  };
  const money = settings?.currency || 'USD';

  if (loading) return <LoadingState label="Loading products..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  return <div className="space-y-5">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><h1 className="text-xl font-semibold">Products</h1><p className="text-sm text-slate-500 mt-1">Manage inventory, pricing, and stock health.</p></div><div className="flex flex-wrap gap-2"><button className="btn-secondary" onClick={() => setScannerOpen(true)}><ScanBarcode className="w-4 h-4" />Scan SKU</button><button className="btn-secondary" onClick={exportProducts}><Download className="w-4 h-4" />Export CSV</button><button className="btn-secondary" onClick={() => importInput.current?.click()}><FileUp className="w-4 h-4" />Import CSV</button><input ref={importInput} type="file" accept=".csv,text/csv" className="hidden" onChange={importProducts} /><Link to="/products/add" className="btn-primary"><Plus className="w-4 h-4" />Add Product</Link></div></div>
    <div className="card p-4"><div className="grid grid-cols-1 md:grid-cols-[minmax(220px,1fr)_180px_180px_auto] gap-3"><SearchInput value={search} onChange={setSearch} placeholder="Search name, SKU, supplier..." /><FilterDropdown value={category} onChange={setCategory} label="Filter by category" options={[{ value: 'all', label: 'All categories' }, ...categories.map((item) => ({ value: item.name, label: item.name }))]} /><FilterDropdown value={status} onChange={setStatus} label="Filter by stock status" options={[{ value: 'all', label: 'All stock status' }, { value: 'In Stock', label: 'In stock' }, { value: 'Low Stock', label: 'Low stock' }, { value: 'Out of Stock', label: 'Out of stock' }]} />{selected.length > 0 && <button className="btn-danger" onClick={() => setDeleteTarget('selected')}><Trash2 className="w-4 h-4" />Delete ({selected.length})</button>}</div></div>
    <div className="card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 dark:bg-slate-800/60 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-4"><input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} aria-label="Select all visible products" /></th><SortHeader label="Product" sortKey="name" sort={sort} onSort={toggleSort} /><SortHeader label="Category" sortKey="category" sort={sort} onSort={toggleSort} /><SortHeader label="Price" sortKey="price" sort={sort} onSort={toggleSort} /><SortHeader label="Quantity" sortKey="quantity" sort={sort} onSort={toggleSort} /><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{visible.map((product) => <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40"><td className="p-4"><input type="checkbox" checked={selected.includes(product.id)} onChange={() => setSelected((ids) => ids.includes(product.id) ? ids.filter((id) => id !== product.id) : [...ids, product.id])} aria-label={`Select ${product.name}`} /></td><td className="p-4"><div className="flex items-center gap-3 min-w-[220px]"><img src={product.image} alt="" className="w-10 h-10 rounded-md object-cover bg-slate-100" /><div><Link to={`/products/${product.id}`} className="font-medium hover:text-primary-600">{product.name}</Link><p className="text-xs text-slate-400 mt-0.5">{product.sku}</p></div></div></td><td className="p-4 text-slate-600 dark:text-slate-300">{product.category}</td><td className="p-4 whitespace-nowrap">{formatCurrency(product.price, money)}</td><td className="p-4 font-medium">{product.quantity}</td><td className="p-4"><Badge>{product.status}</Badge></td><td className="p-4"><div className="flex gap-1"><button className="btn-ghost p-2" title="View product" onClick={() => navigate(`/products/${product.id}`)}><Eye className="w-4 h-4" /></button><button className="btn-ghost p-2" title="Edit product" onClick={() => navigate(`/products/${product.id}/edit`)}><Pencil className="w-4 h-4" /></button><button className="btn-ghost p-2 text-red-500" title="Delete product" onClick={() => setDeleteTarget(product.id)}><Trash2 className="w-4 h-4" /></button></div></td></tr>)}</tbody></table></div>{visible.length === 0 && <EmptyState icon={Package} title="No products found" description="Try changing your search or filters." />}<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={pageSize} /></div>
    <ConfirmDialog isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} title="Delete product?" message="This removes the product from inventory. Existing movement history is retained." confirmLabel="Delete product" />
    <BarcodeScanner isOpen={scannerOpen} onClose={() => setScannerOpen(false)} products={products} onProduct={(product) => { setScannerOpen(false); navigate(`/products/${product.id}`); }} />
  </div>;
}

function SortHeader({ label, sortKey, sort, onSort }) { const active = sort.key === sortKey; return <th className="p-4"><button className="inline-flex items-center gap-1" onClick={() => onSort(sortKey)}>{label}{active && (sort.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}</button></th>; }
