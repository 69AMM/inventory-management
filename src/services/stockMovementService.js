import { readStore, writeStore, delay } from './storage';
import { seedMovements } from '../data/seedData';
import { generateId } from '../utils/inventoryUtils';
import { updateProductQuantity, getProductById } from './productService';

const KEY = 'stockMovements';

function loadAll() {
  return readStore(KEY, null) ?? seedMovements;
}

function saveAll(movements) {
  writeStore(KEY, movements);
}

export async function getStockMovements() {
  await delay();
  const movements = loadAll();
  // Most recent first.
  return [...movements].sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Records a movement AND applies the resulting quantity change to the product
// as a single logical operation, so the two never fall out of sync.
export async function createStockMovement(data) {
  if (data.type !== 'Stock In' && data.type !== 'Stock Out') {
    throw new Error('Movement type must be Stock In or Stock Out');
  }
  const product = await getProductById(data.productId);

  const quantity = Number(data.quantity);
  if (!quantity || quantity <= 0) {
    throw new Error('Quantity must be greater than zero');
  }

  if (data.type === 'Stock Out' && quantity > product.quantity) {
    throw new Error(
      `Stock Out cannot exceed current quantity (${product.quantity} available)`
    );
  }

  const delta = data.type === 'Stock In' ? quantity : -quantity;
  const updatedProduct = await updateProductQuantity(data.productId, delta);

  await delay();
  const movements = loadAll();
  const newMovement = {
    id: generateId('mov'),
    productId: product.id,
    productName: product.name,
    quantity,
    type: data.type,
    date: data.date || new Date().toISOString(),
    notes: data.notes || '',
  };
  const updated = [...movements, newMovement];
  saveAll(updated);

  return { movement: newMovement, product: updatedProduct };
}

export async function deleteStockMovement(id) {
  await delay();
  const movements = loadAll();
  const movement = movements.find((item) => item.id === id);
  if (!movement) throw new Error('Movement not found');
  const delta = movement.type === 'Stock In' ? -movement.quantity : movement.quantity;
  const product = await updateProductQuantity(movement.productId, delta);
  const updated = movements.filter((m) => m.id !== id);
  saveAll(updated);
  return product;
}

export async function getMovementsByProduct(productId) {
  await delay();
  const movements = loadAll();
  return movements
    .filter((m) => m.productId === productId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}
