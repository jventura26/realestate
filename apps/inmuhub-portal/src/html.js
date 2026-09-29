// Plantillas HTML seguras: todo valor interpolado se escapa salvo que sea SafeHtml.

export class SafeHtml {
  constructor(value) { this.value = value; }
  toString() { return this.value; }
}

export function escape(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function render(v) {
  if (v === null || v === undefined || v === false) return '';
  if (v instanceof SafeHtml) return v.value;
  if (Array.isArray(v)) return v.map(render).join('');
  return escape(v);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += render(values[i]) + strings[i + 1];
  return new SafeHtml(out);
}

export const raw = (s) => new SafeHtml(String(s));

export function formatMoney(amount, currency) {
  if (!amount) return 'Precio a consultar';
  const n = Math.round(amount).toLocaleString('en-US');
  return currency === 'USD' ? `US$ ${n}` : `Q ${n}`;
}

export function formatNumber(n, digits = 0) {
  if (n === null || n === undefined) return '';
  return Number(n).toLocaleString('en-US', { maximumFractionDigits: digits });
}

export const TYPE_LABELS = {
  casa: 'Casa', apartamento: 'Apartamento', terreno: 'Terreno', finca: 'Finca',
  local: 'Local', oficina: 'Oficina', otro: 'Propiedad',
};

export const OPERATION_LABELS = { venta: 'Venta', renta: 'Renta', venta_renta: 'Venta o renta' };

export const POSITION_LABELS = {
  bajo: 'Bajo el rango de zona',
  en: 'En rango de zona',
  sobre: 'Sobre el rango de zona',
};

export function firstImage(p) {
  try {
    const arr = JSON.parse(p.images || '[]');
    return arr[0] || null;
  } catch {
    return null;
  }
}

export function parseJsonArray(s) {
  try {
    const v = JSON.parse(s || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
