import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import ProductForm from '../components/products/ProductForm';
import { useInventory } from '../context/InventoryContext';
import { useToast } from '../context/ToastContext';
import LoadingState from '../components/common/LoadingState';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, editProduct, loading } = useInventory();
  const { showToast } = useToast();
  const product = products.find((item) => item.id === id);
  if (loading) return <LoadingState label="Loading product..." />;
  if (!product) return <div className="card p-8 text-center"><h1 className="font-semibold">Product not found</h1><button className="btn-primary mt-4" onClick={() => navigate('/products')}>Back to products</button></div>;
  const handleSubmit = async (data) => { await editProduct(id, data); showToast('Product updated successfully.'); navigate(`/products/${id}`); };
  return <div className="max-w-4xl mx-auto space-y-5"><button className="btn-ghost px-0" onClick={() => navigate(`/products/${id}`)}><ArrowLeft className="w-4 h-4" />Back to details</button><div className="card p-5 sm:p-7"><div className="flex items-center gap-3 mb-6"><div className="p-2 rounded-md bg-primary-50 text-primary-600"><Pencil className="w-5 h-5" /></div><div><h1 className="text-xl font-semibold">Edit Product</h1><p className="text-sm text-slate-500">Update product information and stock thresholds.</p></div></div><ProductForm initialValues={product} onSubmit={handleSubmit} submitLabel="Update Product" /></div></div>;
}
