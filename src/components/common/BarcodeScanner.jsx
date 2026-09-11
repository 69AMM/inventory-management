import { useEffect, useRef, useState } from 'react';
import { ScanBarcode, Search } from 'lucide-react';
import Modal from './Modal';

export default function BarcodeScanner({ isOpen, onClose, products, onProduct }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { if (isOpen) { setValue(''); setTimeout(() => inputRef.current?.focus(), 0); } }, [isOpen]);
  const submit = (event) => {
    event.preventDefault();
    const product = products.find((item) => item.sku.toLowerCase() === value.trim().toLowerCase());
    if (product) onProduct(product);
  };
  return <Modal isOpen={isOpen} onClose={onClose} title="Scan product barcode" maxWidth="max-w-md"><div className="text-center mb-5"><div className="mx-auto w-16 h-16 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><ScanBarcode className="w-9 h-9" /></div><p className="text-sm text-slate-500 mt-3">Use a USB scanner or enter a product SKU.</p></div><form onSubmit={submit} className="space-y-3"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input ref={inputRef} className="input pl-9" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Scan or type SKU" autoComplete="off" /></div><button className="btn-primary w-full" disabled={!value.trim()}>Find product</button></form></Modal>;
}
