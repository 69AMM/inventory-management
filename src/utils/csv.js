export function productsToCsv(products) {
  const headers = ['name', 'sku', 'category', 'price', 'costPrice', 'quantity', 'minimumStockLevel', 'supplier', 'image'];
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [headers.join(','), ...products.map((product) => headers.map((header) => escape(product[header])).join(','))].join('\n');
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];
    if (character === '"' && quoted && next === '"') { cell += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = []; cell = '';
    } else cell += character;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const headers = rows.shift()?.map((header) => header.trim()) || [];
  return rows.map((values) => headers.reduce((result, header, index) => ({ ...result, [header]: values[index]?.trim() || '' }), {}));
}

export function downloadTextFile(filename, text, type = 'text/csv;charset=utf-8') {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([text], { type }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
