import { describe, expect, it } from 'vitest';
import { calculateStockValue, getStockStatus } from './inventoryUtils';
import { getInventoryValueOverTime, getStockByCategory } from './dashboardUtils';

describe('inventory utilities', () => {
  it('derives stock status from quantity and threshold', () => {
    expect(getStockStatus(0, 5)).toBe('Out of Stock');
    expect(getStockStatus(5, 5)).toBe('Low Stock');
    expect(getStockStatus(6, 5)).toBe('In Stock');
  });

  it('calculates inventory value from cost price', () => {
    expect(calculateStockValue([{ quantity: 2, costPrice: 10 }, { quantity: 3, costPrice: 4 }])).toBe(32);
  });

  it('groups stock by category and returns a value timeline', () => {
    const products = [{ id: 'p1', category: 'Office', quantity: 4, costPrice: 5 }];
    expect(getStockByCategory(products)).toEqual([{ category: 'Office', quantity: 4 }]);
    expect(getInventoryValueOverTime(products, [])).toHaveLength(2);
  });
});
