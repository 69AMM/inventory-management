import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as productService from '../services/productService';
import * as categoryService from '../services/categoryService';
import * as stockMovementService from '../services/stockMovementService';
import * as settingsService from '../services/settingsService';
import * as supplierService from '../services/supplierService';

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [settings, setSettings] = useState(null);
  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---- Initial load ----
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData, movementsData, settingsData, suppliersData] =
        await Promise.all([
          productService.getProducts(),
          categoryService.getCategories(),
          stockMovementService.getStockMovements(),
          settingsService.getSettings(),
          supplierService.getSuppliers(),
        ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setStockMovements(movementsData);
      setSettings(settingsData);
      setSuppliers(suppliersData);
    } catch (err) {
      setError(err.message || 'Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Apply dark mode class to <html> whenever settings change.
  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings]);

  // ---- Product actions ----
  const addProduct = useCallback(async (data) => {
    const created = await productService.createProduct(data);
    setProducts((prev) => [...prev, created]);
    return created;
  }, []);

  const editProduct = useCallback(async (id, data) => {
    const updated = await productService.updateProduct(id, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }, []);

  const removeProduct = useCallback(async (id) => {
    await productService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const removeProducts = useCallback(async (ids) => {
    await productService.deleteProducts(ids);
    const idSet = new Set(ids);
    setProducts((prev) => prev.filter((p) => !idSet.has(p.id)));
  }, []);

  const checkSkuTaken = useCallback(async (sku, excludeId = null) => {
    return productService.isSkuTaken(sku, excludeId);
  }, []);

  // ---- Category actions ----
  const addCategory = useCallback(async (name) => {
    const created = await categoryService.createCategory(name);
    setCategories((prev) => [...prev, created]);
    return created;
  }, []);

  const editCategory = useCallback(async (id, name) => {
    const { updatedCategory, oldName } = await categoryService.updateCategory(id, name);
    setCategories((prev) => prev.map((c) => (c.id === id ? updatedCategory : c)));
    // Keep products' category field in sync with the rename.
    if (oldName !== updatedCategory.name) {
      const affected = products.filter((p) => p.category === oldName);
      await Promise.all(
        affected.map((p) => productService.updateProduct(p.id, { ...p, category: updatedCategory.name }))
      );
      setProducts((prev) =>
        prev.map((p) => (p.category === oldName ? { ...p, category: updatedCategory.name } : p))
      );
    }
    return updatedCategory;
  }, [products]);

  const removeCategory = useCallback(async (id, name) => {
    const inUse = products.some((p) => p.category === name);
    if (inUse) {
      throw new Error('Cannot delete a category that is currently assigned to products.');
    }
    await categoryService.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, [products]);

  const checkCategoryNameTaken = useCallback(async (name, excludeId = null) => {
    return categoryService.isCategoryNameTaken(name, excludeId);
  }, []);

  // ---- Stock movement actions ----
  const addStockMovement = useCallback(async (data) => {
    const { movement, product } = await stockMovementService.createStockMovement(data);
    setStockMovements((prev) => [movement, ...prev]);
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    return { movement, product };
  }, []);

  const removeStockMovement = useCallback(async (id) => {
    const product = await stockMovementService.deleteStockMovement(id);
    setStockMovements((prev) => prev.filter((m) => m.id !== id));
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  }, []);

  // ---- Settings actions ----
  const updateAppSettings = useCallback(async (partial) => {
    const updated = await settingsService.updateSettings(partial);
    setSettings(updated);
    return updated;
  }, []);

  const addSupplier = useCallback(async (data) => {
    const created = await supplierService.createSupplier(data);
    setSuppliers((prev) => [...prev, created]);
    return created;
  }, []);
  const editSupplier = useCallback(async (id, data) => {
    const updated = await supplierService.updateSupplier(id, data);
    setSuppliers((prev) => prev.map((supplier) => supplier.id === id ? updated : supplier));
    return updated;
  }, []);
  const removeSupplier = useCallback(async (id) => {
    await supplierService.deleteSupplier(id);
    setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
  }, []);

  const value = {
    // state
    products,
    categories,
    stockMovements,
    settings,
    suppliers,
    loading,
    error,
    // lifecycle
    reload: loadAll,
    // product actions
    addProduct,
    editProduct,
    removeProduct,
    removeProducts,
    checkSkuTaken,
    // category actions
    addCategory,
    editCategory,
    removeCategory,
    checkCategoryNameTaken,
    // stock movement actions
    addStockMovement,
    removeStockMovement,
    // settings actions
    updateAppSettings,
    addSupplier,
    editSupplier,
    removeSupplier,
  };

  return (
    <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return ctx;
}
