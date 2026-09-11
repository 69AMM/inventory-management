import { readStore, writeStore, delay } from './storage';
import { generateId } from '../utils/inventoryUtils';
import { apiRequest, isHostedApiEnabled } from './apiClient';

const KEY = 'suppliers';
const seedSuppliers = [
  { id: 'sup-1', name: 'TechSource Distributors', contact: 'sales@techsource.example', phone: '+1 555 0101', address: 'Austin, TX' },
  { id: 'sup-2', name: 'PaperPlus Wholesale', contact: 'orders@paperplus.example', phone: '+1 555 0102', address: 'Denver, CO' },
  { id: 'sup-3', name: 'ComfortSeating Co', contact: 'hello@comfortseating.example', phone: '+1 555 0103', address: 'Chicago, IL' },
];
function loadAll() { return readStore(KEY, null) ?? seedSuppliers; }
function saveAll(value) { writeStore(KEY, value); }
export async function getSuppliers() { if (isHostedApiEnabled()) return apiRequest('/suppliers'); await delay(); return loadAll(); }
export async function createSupplier(data) { if (isHostedApiEnabled()) return apiRequest('/suppliers', { method: 'POST', body: JSON.stringify(data) }); await delay(); if (!data.name?.trim() || !data.contact?.trim()) throw new Error('Supplier name and contact are required'); const suppliers = loadAll(); if (suppliers.some((supplier) => supplier.name.toLowerCase() === data.name.trim().toLowerCase())) throw new Error('Supplier already exists'); const supplier = { ...data, id: generateId('sup'), name: data.name.trim(), contact: data.contact.trim() }; saveAll([...suppliers, supplier]); return supplier; }
export async function updateSupplier(id, data) { if (isHostedApiEnabled()) return apiRequest(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }); await delay(); const suppliers = loadAll(); const index = suppliers.findIndex((supplier) => supplier.id === id); if (index < 0) throw new Error('Supplier not found'); const updated = { ...suppliers[index], ...data, name: data.name.trim(), contact: data.contact.trim() }; suppliers[index] = updated; saveAll(suppliers); return updated; }
export async function deleteSupplier(id) { if (isHostedApiEnabled()) return apiRequest(`/suppliers/${id}`, { method: 'DELETE' }); await delay(); saveAll(loadAll().filter((supplier) => supplier.id !== id)); }
