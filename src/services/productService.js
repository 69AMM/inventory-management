import { readStore, writeStore, delay } from './storage';
import { seedProducts } from '../data/seedData';
import { generateId, getStockStatus } from '../utils/inventoryUtils';

const KEY = 'products';

function loadAll() {
  return readStore(KEY, null) ?? seedProducts;
}

function saveAll(products) {
  writeStore(KEY, products);
}

// Ensures the derived `status` field always matches quantity/minimumStockLevel
// before it is persisted or returned, so it can never drift out of sync.
function withComputedStatus(product) {
  return {
    ...product,
    status: getStockStatus(product.quantity, product.minimumStockLevel),
  };
}

export async function getProducts() {
  await delay();
  const products = loadAll().map(withComputedStatus);
  return products;
}

export async function getProductById(id) {
  await delay();
  const product = loadAll().find((p) => p.id === id);
  if (!product) {
    throw new Error('Product not found');
  }
  return withComputedStatus(product);
}

export async function isSkuTaken(sku, excludeId = null) {
  await delay(100);
  const normalized = sku.trim().toLowerCase();
  return loadAll().some(
    (p) => p.sku.trim().toLowerCase() === normalized && p.id !== excludeId
  );
}

export async function createProduct(data) {
  await delay();
  const products = loadAll();
  if (!data.name?.trim() || !data.sku?.trim() || !data.category?.trim() || !data.supplier?.trim()) {
    throw new Error('Name, SKU, category, and supplier are required');
  }
  if ([data.price, data.costPrice, data.quantity, data.minimumStockLevel].some((value) => Number.isNaN(Number(value)) || Number(value) < 0)) {
    throw new Error('Prices, quantity, and minimum stock level cannot be negative');
  }
  if (products.some((product) => product.sku.trim().toLowerCase() === data.sku.trim().toLowerCase())) {
    throw new Error('SKU is already in use');
  }
  const now = new Date().toISOString();
  const newProduct = withComputedStatus({
    id: generateId('prod'),
    name: data.name,
    sku: data.sku,
    category: data.category,
    price: Number(data.price),
    costPrice: Number(data.costPrice),
    quantity: Number(data.quantity),
    minimumStockLevel: Number(data.minimumStockLevel),
    supplier: data.supplier,
    image: data.image || '',
    createdAt: now,
    updatedAt: now,
  });
  const updated = [...products, newProduct];
  saveAll(updated);
  return newProduct;
}

export async function updateProduct(id, data) {
  await delay();
  const products = loadAll();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error('Product not found');
  }
  if (!data.name?.trim() || !data.sku?.trim() || !data.category?.trim() || !data.supplier?.trim()) {
    throw new Error('Name, SKU, category, and supplier are required');
  }
  if ([data.price, data.costPrice, data.quantity, data.minimumStockLevel].some((value) => Number.isNaN(Number(value)) || Number(value) < 0)) {
    throw new Error('Prices, quantity, and minimum stock level cannot be negative');
  }
  if (products.some((product) => product.id !== id && product.sku.trim().toLowerCase() === data.sku.trim().toLowerCase())) {
    throw new Error('SKU is already in use');
  }
  const updatedProduct = withComputedStatus({
    ...products[index],
    ...data,
    price: Number(data.price),
    costPrice: Number(data.costPrice),
    quantity: Number(data.quantity),
    minimumStockLevel: Number(data.minimumStockLevel),
    updatedAt: new Date().toISOString(),
  });
  const updated = [...products];
  updated[index] = updatedProduct;
  saveAll(updated);
  return updatedProduct;
}

// Used internally by the stock-movement flow to adjust quantity only,
// keeping status derivation and updatedAt consistent.
export async function updateProductQuantity(id, quantityDelta) {
  await delay(150);
  const products = loadAll();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error('Product not found');
  }
  const newQuantity = products[index].quantity + quantityDelta;
  if (newQuantity < 0) {
    throw new Error('Stock Out exceeds current quantity');
  }
  const updatedProduct = withComputedStatus({
    ...products[index],
    quantity: newQuantity,
    updatedAt: new Date().toISOString(),
  });
  const updated = [...products];
  updated[index] = updatedProduct;
  saveAll(updated);
  return updatedProduct;
}

export async function deleteProduct(id) {
  await delay();
  const products = loadAll();
  const updated = products.filter((p) => p.id !== id);
  saveAll(updated);
  return true;
}

export async function deleteProducts(ids) {
  await delay();
  const idSet = new Set(ids);
  const products = loadAll();
  const updated = products.filter((p) => !idSet.has(p.id));
  saveAll(updated);
  return true;
}
