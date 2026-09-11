import { useEffect, useState } from 'react';
import { ImagePlus, Save } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

const emptyProduct = {
  name: '', sku: '', category: '', price: '', costPrice: '', quantity: '',
  minimumStockLevel: '', supplier: '', image: '',
};

export default function ProductForm({ initialValues = emptyProduct, onSubmit, submitLabel = 'Save Product' }) {
  const { categories, checkSkuTaken } = useInventory();
  const [form, setForm] = useState({ ...emptyProduct, ...initialValues });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => setForm({ ...emptyProduct, ...initialValues }), [initialValues]);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const uploadImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((current) => ({ ...current, image: 'Choose an image file.' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update('image', reader.result);
    reader.readAsDataURL(file);
  };

  const validate = async () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Product name is required.';
    if (!form.sku.trim()) next.sku = 'SKU is required.';
    else if (await checkSkuTaken(form.sku, initialValues.id)) next.sku = 'This SKU is already in use.';
    if (!form.category) next.category = 'Choose a category.';
    for (const field of ['price', 'costPrice', 'quantity', 'minimumStockLevel']) {
      if (form[field] === '' || Number(form[field]) < 0 || Number.isNaN(Number(form[field]))) {
        next[field] = 'Enter a zero or positive number.';
      }
    }
    if (!form.supplier.trim()) next.supplier = 'Supplier is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!(await validate())) return;
    setBusy(true);
    try {
      await onSubmit({ ...form, price: Number(form.price), costPrice: Number(form.costPrice), quantity: Number(form.quantity), minimumStockLevel: Number(form.minimumStockLevel) });
    } catch (error) {
      setErrors({ form: error.message || 'Unable to save product.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {errors.form && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{errors.form}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Product Name" value={form.name} error={errors.name} onChange={(v) => update('name', v)} required />
        <Field label="SKU" value={form.sku} error={errors.sku} onChange={(v) => update('sku', v.toUpperCase())} required />
        <SelectField label="Category" value={form.category} error={errors.category} onChange={(v) => update('category', v)} options={categories.map((category) => ({ value: category.name, label: category.name }))} required />
        <Field label="Supplier" value={form.supplier} error={errors.supplier} onChange={(v) => update('supplier', v)} required />
        <NumberField label="Selling Price" value={form.price} error={errors.price} onChange={(v) => update('price', v)} />
        <NumberField label="Cost Price" value={form.costPrice} error={errors.costPrice} onChange={(v) => update('costPrice', v)} />
        <NumberField label="Quantity" value={form.quantity} error={errors.quantity} onChange={(v) => update('quantity', v)} />
        <NumberField label="Minimum Stock Level" value={form.minimumStockLevel} error={errors.minimumStockLevel} onChange={(v) => update('minimumStockLevel', v)} />
        <div className="md:col-span-2">
          <Field label="Product Image URL" value={form.image} onChange={(v) => update('image', v)} placeholder="https://..." />
          <div className="mt-2 flex items-center gap-3">
            <label className="btn-secondary cursor-pointer"><ImagePlus className="w-4 h-4" />Upload image<input type="file" accept="image/*" className="hidden" onChange={uploadImage} /></label>
            <p className="text-xs text-slate-400">Remote URL or local image upload</p>
          </div>
          {errors.image && <span className="error-text">{errors.image}</span>}
          {form.image && <img src={form.image} alt="Product preview" className="mt-3 w-20 h-20 rounded-md object-cover border border-slate-200" />}
        </div>
      </div>
      <div className="flex justify-end border-t border-slate-200 dark:border-slate-800 pt-5">
        <button className="btn-primary" disabled={busy}><Save className="w-4 h-4" />{busy ? 'Saving...' : submitLabel}</button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, error, type = 'text', placeholder, required }) {
  return <label className="block"><span className="label">{label}{required && ' *'}</span><input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={`input ${error ? 'input-error' : ''}`} />{error && <span className="error-text">{error}</span>}</label>;
}

function NumberField(props) { return <Field {...props} type="number" />; }

function SelectField({ label, value, onChange, options, error, required }) {
  return <label className="block"><span className="label">{label}{required && ' *'}</span><select value={value} onChange={(e) => onChange(e.target.value)} className={`input ${error ? 'input-error' : ''}`}><option value="">Select category</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{error && <span className="error-text">{error}</span>}</label>;
}