import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PackagePlus } from 'lucide-react';
import ProductForm from '../components/products/ProductForm';
import { useInventory } from '../context/InventoryContext';
import { useToast } from '../context/ToastContext';

export default function AddProduct() {
  const navigate = useNavigate();
  const { addProduct } = useInventory();
  const { showToast } = useToast();
  const handleSubmit = async (data) => { await addProduct(data); showToast('Product created successfully.'); navigate('/products'); };
  return <div className="max-w-4xl mx-auto space-y-5"><button className="btn-ghost px-0" onClick={() => navigate('/products')}><ArrowLeft className="w-4 h-4" />Back to products</button><div className="card p-5 sm:p-7"><div className="flex items-center gap-3 mb-6"><div className="p-2 rounded-md bg-primary-50 text-primary-600"><PackagePlus className="w-5 h-5" /></div><div><h1 className="text-xl font-semibold">Add Product</h1><p className="text-sm text-slate-500">Create a new item for your inventory.</p></div></div><ProductForm onSubmit={handleSubmit} /></div></div>;
}
