function valuacionPage() {
  return `
<div style="max-width:900px;margin:40px auto;padding:20px">

<h2>Valuador de Propiedades</h2>
<p style="color:#666;margin-bottom:30px">Calcula el valor estimado de tu propiedad en Guatemala</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:30px">

<div>
<label><strong>Zona / Ubicación</strong></label>
<select id="zona" onchange="calcular()" style="width:100%;padding:10px;margin:10px 0;border:1px solid #ddd">
  <option value="">Selecciona una zona</option>
  <option value="zona10">Zona 10 - $1,850/m²</option>
  <option value="zona14">Zona 14 - $1,620/m²</option>
  <option value="zona15">Zona 15 - $1,420/m²</option>
  <option value="zona16">Zona 16 - $1,350/m²</option>
  <option value="cayala">Cayalá - $1,900/m²</option>
  <option value="fraijanes">Fraijanes - $980/m²</option>
  <option value="san-jose">San José Pinula - $920/m²</option>
  <option value="mixco">Mixco - $1,100/m²</option>
  <option value="carretera">Carretera a El Salvador - $850/m²</option>
</select>
</div>

<div>
<label><strong>Año de Construcción</strong></label>
<input type="number" id="anio" value="2015" min="1950" max="2025" onchange="calcular()" style="width:100%;padding:10px;margin:10px 0;border:1px solid #ddd">
</div>

<div>
<label><strong>Área de Construcción (m²)</strong></label>
<input type="number" id="area" value="200" min="0" onchange="calcular()" style="width:100%;padding:10px;margin:10px 0;border:1px solid #ddd">
</div>

<div>
<label><strong>Cuartos</strong></label>
<input type="number" id="cuartos" value="3" min="0" onchange="calcular()" style="width:100%;padding:10px;margin:10px 0;border:1px solid #ddd">
</div>

<div>
<label><strong>Baños</strong></label>
<input type="number" id="banos" value="2" min="0" step="0.5" onchange="calcular()" style="width:100%;padding:10px;margin:10px 0;border:1px solid #ddd">
</div>

<div>
<label><strong>Estado</strong></label>
<select id="estado" onchange="calcular()" style="width:100%;padding:10px;margin:10px 0;border:1px solid #ddd">
  <option value="nueva">Nueva</option>
  <option value="excelente">Excelente</option>
  <option value="buen">Buen estado</option>
  <option value="regular">Regular</option>
  <option value="requiere">Requiere reparación</option>
</select>
</div>

</div>

<div style="background:#f0f0f0;padding:15px;border-radius:8px;margin-bottom:30px">
<h4 style="margin-top:0">Características Adicionales</h4>
<label><input type="checkbox" id="piscina" onchange="calcular()"> Piscina</label><br>
<label><input type="checkbox" id="gimnasio" onchange="calcular()"> Gimnasio</label><br>
<label><input type="checkbox" id="jardin" onchange="calcular()"> Jardín</label><br>
<label><input type="checkbox" id="garaje" onchange="calcular()"> Garaje</label><br>
<label><input type="checkbox" id="terraza" onchange="calcular()"> Terraza</label><br>
<label><input type="checkbox" id="seguridad" onchange="calcular()"> Seguridad 24/7</label>
</div>

<div id="resultado" style="background:#fff9f0;border:2px solid #ff9500;border-radius:8px;padding:20px;text-align:center">
<h3 style="color:#1a2a4e;margin-top:0">Valor Estimado de la Propiedad</h3>
<div style="font-size:28px;font-weight:bold;color:#ff9500;margin:15px 0">
Q <span id="valorTotal">0</span>
</div>
<p style="color:#666;font-size:12px;margin:10px 0">
Valor Base: Q <span id="valorBase">0</span> | Ajustes: <span id="ajustes">0%</span>
</p>
</div>

</div>

<script>
const precios = {
  'zona10': { nombre: 'Zona 10', precio: 1850 },
  'zona14': { nombre: 'Zona 14', precio: 1620 },
  'zona15': { nombre: 'Zona 15', precio: 1420 },
  'zona16': { nombre: 'Zona 16', precio: 1350 },
  'cayala': { nombre: 'Cayalá', precio: 1900 },
  'fraijanes': { nombre: 'Fraijanes', precio: 980 },
  'san-jose': { nombre: 'San José Pinula', precio: 920 },
  'mixco': { nombre: 'Mixco', precio: 1100 },
  'carretera': { nombre: 'Carretera a El Salvador', precio: 850 }
};

const ajusteEstado = {
  'nueva': 0.10,
  'excelente': 0.05,
  'buen': 0.02,
  'regular': -0.05,
  'requiere': -0.15
};

function calcular(){
  const zona = document.getElementById('zona').value;
  const area = parseFloat(document.getElementById('area').value) || 0;
  const anio = parseInt(document.getElementById('anio').value) || 2015;
  const cuartos = parseInt(document.getElementById('cuartos').value) || 0;
  const banos = parseFloat(document.getElementById('banos').value) || 0;
  const estado = document.getElementById('estado').value;
  
  if (!zona || area === 0) {
    document.getElementById('valorTotal').textContent = '0';
    return;
  }
  
  const precioM2 = precios[zona].precio;
  const valorBase = area * precioM2;
  
  let ajuste = ajusteEstado[estado] || 0;
  
  // Antigüedad
  const antiguedad = 2025 - anio;
  if (antiguedad > 30) ajuste -= 0.15;
  else if (antiguedad > 20) ajuste -= 0.10;
  else if (antiguedad > 10) ajuste -= 0.05;
  
  // Características
  if (document.getElementById('piscina').checked) ajuste += 0.08;
  if (document.getElementById('gimnasio').checked) ajuste += 0.05;
  if (document.getElementById('jardin').checked) ajuste += 0.03;
  if (document.getElementById('garaje').checked) ajuste += 0.05;
  if (document.getElementById('terraza').checked) ajuste += 0.04;
  if (document.getElementById('seguridad').checked) ajuste += 0.03;
  
  const valorFinal = valorBase * (1 + ajuste);
  
  const fmt = n => 'Q ' + Math.round(n).toLocaleString('es-ES');
  
  document.getElementById('valorBase').textContent = fmt(valorBase);
  document.getElementById('valorTotal').textContent = fmt(valorFinal);
  document.getElementById('ajustes').textContent = (ajuste >= 0 ? '+' : '') + (ajuste * 100).toFixed(0) + '%';
}

calcular();
</script>
`;
}

module.exports = { valuacionPage };
