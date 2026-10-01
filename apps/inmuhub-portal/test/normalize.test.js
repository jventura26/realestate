import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectZone, parsePrice, splitAdvisor, zoneRange, valuePosition, cleanText, normalizeWhatsapp } from '../src/normalize.js';

test('detectZone reconoce zonas y municipios', () => {
  assert.equal(detectZone('Zona 15 | Vista Hermosa 3', 'Guatemala'), 'zona-15');
  assert.equal(detectZone('Casa en Kanajuyú', 'Guatemala'), 'zona-16');
  assert.equal(detectZone('Apartamento en Cayalá, Zona 16', 'Guatemala'), 'cayala');
  assert.equal(detectZone('Casa en La Fontana | CAES', 'Fraijanes'), 'carretera-el-salvador');
  assert.equal(detectZone('Carretera a Olmeca', 'Fraijanes'), 'fraijanes');
  assert.equal(detectZone('Finca en Chimaltenango', ''), 'interior');
  assert.equal(detectZone('Casa amplia, es muy luminosa', 'Guatemala'), null);
});

test('parsePrice separa monto y moneda', () => {
  assert.deepEqual(parsePrice('$ 585,000'), { amount: 585000, currency: 'USD' });
  assert.deepEqual(parsePrice('Q. 1,440,000'), { amount: 1440000, currency: 'GTQ' });
  assert.deepEqual(parsePrice('585,000', 'USD'), { amount: 585000, currency: 'USD' });
});

test('splitAdvisor separa nombre y WhatsApp', () => {
  assert.deepEqual(splitAdvisor('Zoraida Quintana 4769-2366'), { name: 'Zoraida Quintana', whatsapp: '50247692366' });
  assert.equal(splitAdvisor(''), null);
});

test('zoneRange exige un mínimo de comparables', () => {
  assert.equal(zoneRange([10, 20, 30], 5).enough, false);
  const r = zoneRange([10, 20, 30, 40, 50], 5);
  assert.equal(r.enough, true);
  assert.equal(r.low, 20);
  assert.equal(r.median, 30);
  assert.equal(r.high, 40);
});

test('valuePosition ubica el precio frente al rango', () => {
  const r = zoneRange([10, 20, 30, 40, 50], 5);
  assert.equal(valuePosition(15, r), 'bajo');
  assert.equal(valuePosition(30, r), 'en');
  assert.equal(valuePosition(45, r), 'sobre');
  assert.equal(valuePosition(30, { enough: false }), null);
});

test('cleanText quita emojis', () => {
  assert.equal(cleanText('🏡 Residencia  exclusiva ✨'), 'Residencia exclusiva');
});

test('normalizeWhatsapp agrega el código de Guatemala', () => {
  assert.equal(normalizeWhatsapp('4769-2366'), '50247692366');
  assert.equal(normalizeWhatsapp('+502 4769 2366'), '50247692366');
  assert.equal(normalizeWhatsapp('123'), null);
});

import { projectPricePerM2, parseTypologies } from '../src/normalize.js';

test('precio por m² de proyecto: mediana de tipologías en quetzales', () => {
  const p = { currency: 'USD', price_from: 100000, m2_from: 50 };
  const t = [{ price: 100000, m2: 50 }, { price: 150000, m2: 60 }, { price: 300000, m2: 100 }];
  assert.equal(Math.round(projectPricePerM2(p, t, 7.7)), Math.round((150000 / 60) * 7.7));
});

test('precio por m² de proyecto: usa «desde» si no hay tipologías', () => {
  assert.equal(projectPricePerM2({ currency: 'GTQ', price_from: 900000, m2_from: 60 }, [], 7.7), 15000);
  assert.equal(projectPricePerM2({ currency: 'GTQ', price_from: null, m2_from: 60 }, [], 7.7), null);
});

test('tipologías: limpia filas vacías y números con comas', () => {
  const rows = parseTypologies([
    { name: 'Tipo A', bedrooms: '2', bathrooms: '2', m2: '78.5', price: '1,250,000' },
    { name: '', bedrooms: '', bathrooms: '', m2: '', price: '' },
  ]);
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0], { name: 'Tipo A', bedrooms: 2, bathrooms: 2, m2: 78.5, price: 1250000 });
});
