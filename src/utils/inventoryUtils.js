// Determines stock status strictly from quantity vs minimumStockLevel.
// This is the single source of truth — never store status separately in a way
// that could drift out of sync with quantity.
export function getStockStatus(quantity, minimumStockLevel) {
  const qty = Number(quantity);
  const min = Number(minimumStockLevel);
  if (qty === 0) return 'Out of Stock';
  if (qty > 0 && qty <= min) return 'Low Stock';
  return 'In Stock';
}

export function statusBadgeClass(status) {
  switch (status) {
    case 'In Stock':
      return 'badge-green';
    case 'Low Stock':
      return 'badge-amber';
    case 'Out of Stock':
      return 'badge-red';
    default:
      return 'badge-slate';
  }
}

export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  PKR: 'Rs ',
};

export function formatCurrency(value, currency = 'USD') {
  const symbol = currencySymbols[currency] || '$';
  const num = Number(value) || 0;
  return `${symbol}${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculateStockValue(products) {
  return products.reduce((sum, p) => sum + Number(p.quantity) * Number(p.costPrice), 0);
}
