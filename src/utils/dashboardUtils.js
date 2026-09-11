// Aggregates total quantity per category from the live products list.
export function getStockByCategory(products) {
  const map = {};
  products.forEach((p) => {
    map[p.category] = (map[p.category] || 0) + Number(p.quantity);
  });
  return Object.entries(map).map(([category, quantity]) => ({ category, quantity }));
}

// Reconstructs a realistic "inventory value over time" series by walking
// backward from the current total stock value through the recorded stock
// movements (using each product's current cost price as a stable proxy for
// its historical cost). This keeps the chart grounded in real activity
// rather than being fully synthetic.
export function getInventoryValueOverTime(products, movements) {
  const costByProductId = {};
  products.forEach((p) => {
    costByProductId[p.id] = Number(p.costPrice);
  });

  const currentValue = products.reduce(
    (sum, p) => sum + Number(p.quantity) * Number(p.costPrice),
    0
  );

  const sortedMovements = [...movements].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const netDelta = sortedMovements.reduce((sum, m) => {
    const cost = costByProductId[m.productId] ?? 0;
    const signedQty = m.type === 'Stock In' ? m.quantity : -m.quantity;
    return sum + signedQty * cost;
  }, 0);

  let runningValue = currentValue - netDelta;
  const points = [
    {
      label: sortedMovements.length
        ? new Date(sortedMovements[0].date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })
        : 'Start',
      value: Math.max(0, Math.round(runningValue)),
    },
  ];

  sortedMovements.forEach((m) => {
    const cost = costByProductId[m.productId] ?? 0;
    const signedQty = m.type === 'Stock In' ? m.quantity : -m.quantity;
    runningValue += signedQty * cost;
    points.push({
      label: new Date(m.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
      value: Math.max(0, Math.round(runningValue)),
    });
  });

  points.push({ label: 'Today', value: Math.round(currentValue) });

  // Collapse to at most 10 points for chart readability, always keeping the last.
  if (points.length > 10) {
    const step = Math.ceil(points.length / 10);
    const reduced = points.filter((_, i) => i % step === 0);
    if (reduced[reduced.length - 1] !== points[points.length - 1]) {
      reduced.push(points[points.length - 1]);
    }
    return reduced;
  }

  return points;
}
