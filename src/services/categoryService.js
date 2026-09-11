import { readStore, writeStore, delay } from './storage';
import { seedCategories } from '../data/seedData';
import { generateId } from '../utils/inventoryUtils';

const KEY = 'categories';

function loadAll() {
  return readStore(KEY, null) ?? seedCategories;
}

function saveAll(categories) {
  writeStore(KEY, categories);
}

export async function getCategories() {
  await delay();
  return loadAll();
}

export async function isCategoryNameTaken(name, excludeId = null) {
  await delay(100);
  const normalized = name.trim().toLowerCase();
  return loadAll().some(
    (c) => c.name.trim().toLowerCase() === normalized && c.id !== excludeId
  );
}

export async function createCategory(name) {
  await delay();
  const categories = loadAll();
  if (!name?.trim()) throw new Error('Category name is required');
  if (categories.some((category) => category.name.trim().toLowerCase() === name.trim().toLowerCase())) {
    throw new Error('Category name is already in use');
  }
  const newCategory = { id: generateId('cat'), name: name.trim() };
  const updated = [...categories, newCategory];
  saveAll(updated);
  return newCategory;
}

export async function updateCategory(id, name) {
  await delay();
  const categories = loadAll();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error('Category not found');
  }
  if (!name?.trim()) throw new Error('Category name is required');
  if (categories.some((category) => category.id !== id && category.name.trim().toLowerCase() === name.trim().toLowerCase())) {
    throw new Error('Category name is already in use');
  }
  const updated = [...categories];
  const oldName = updated[index].name;
  updated[index] = { ...updated[index], name: name.trim() };
  saveAll(updated);
  return { updatedCategory: updated[index], oldName };
}

export async function deleteCategory(id) {
  await delay();
  const categories = loadAll();
  const updated = categories.filter((c) => c.id !== id);
  saveAll(updated);
  return true;
}
