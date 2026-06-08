function valuacionPage() {
  return `
<div style="max-width:900px;margin:40px auto;padding:20px">

<h2>Valuador de Propiedades</h2>
<p style="color:#666;margin-bottom:20px">Calcula el valor estimado de tu propiedad en Guatemala - Precios 2026</p>

<div style="background:#fff3cd;border:3px solid #ff9500;border-radius:8px;padding:20px;margin-bottom:30px">
<h3 style="color:#856404;margin-top:0">⚠️ Advertencia Importante</h3>
<p style="font-size:12px;color:#333;line-height:1.6;margin:10px 0">
Los valores por metro cuadrado presentados en este reporte son <strong>referenciales</strong> y tienen fines exclusivamente informativos. Los precios pueden variar significativamente según factores como ubicación exacta, condominio, estado de conservación, antigüedad, acabados, amenidades, tamaño del terreno, vistas, accesibilidad, oferta y demanda del mercado, entre otros.
</p>
<p style="font-size:12px;color:#333;line-height:1.6;margin:10px 0">
Esta información <strong>no constituye un avalúo profesional</strong> ni una valoración oficial de una propiedad específica. Para determinar el valor real de mercado de un inmueble se recomienda realizar un análisis comparativo de mercado (CMA) o solicitar un <strong>avalúo profesional</strong> efectuado por un valuador certificado.
</p>
<p style="font-size:12px;color:#333;line-height:1.6;margin:10px 0">
Los valores aquí indicados representan rangos estimados del mercado inmobiliario del Departamento de Guatemala y pueden estar sujetos a cambios sin previo aviso debido a las condiciones económicas, financieras y comerciales vigentes.
</p>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:30px">

<div>
<label><strong>Zona / Ubicación</strong></label>
<select id="zona" onchange="calcular()" style="width:100%;padding:10px;margin:10px 0;border:1px solid #ddd">
  <option value="">Selecciona una zona</option>
  <optgroup label="Zonas Premium">
  <option value="cayala">Cayalá (Apto: $2,500-4,500 | Casa: $2,200-4,000)</option>
  <option value="zona14">Zona 14 (Apto: $2,200-3,800 | Casa: $2,000-3,500)</option>
  <option value="zona15">Zona 15 (Apto: $2,000-3,500 | Casa: $1,800-3,200)</option>
  <option value="zona10">Zona 10 (Apto: $2,000-3,200 | Casa: $1,800-3,000)</option>
  </optgroup>
  <optgroup label="Zonas Residenciales">
  <option value="zona4">Zona 4 (Apto: $1,800-3,000 | Casa: $1,500-2,500)</option>
  <option value="zona16">Zona 16 (Apto: $1,600-3,000 | Casa: $1,400-2,800)</option>
  <option value="zona13">Zona 13 (Apto: $1,500-2,500 | Casa: $1,300-2,300)</option>
  <option value="zona11">Zona 11 (Apto: $1,100-1,900 | Casa: $1,000-1,800)</option>
  </optgroup>
  <optgroup label="Municipios Desarrollo">
  <option value="carretera">Carretera a El Salvador (Apto: $1,100-2,000 | Casa: $900-2,000)</option>
  <option value="santa-catarina">Santa Catarina Pinula (Apto: $1,100-2,000 | Casa: $1,000-2,000)</option>
  <option value="san-cristobal">San Cristóbal (Apto: $1,000-1,800 | Casa: $900-1,800)</option>
  <option value="fraijanes">Fraijanes (Apto: $1,000-1,800 | Casa: $900-1,800)</option>
  <option value="san-jose">San José Pinula (Apto: $800-1,400 | Casa: $700-1,400)</option>
  <option value="mixco">Mixco (Apto: $800-1,500 | Casa: $700-1,500)</option>
  </optgroup>
  <optgroup label="Municipios Accesibles">
  <option value="villa-nueva">Villa Nueva (Apto: $700-1,300 | Casa: $600-1,200)</option>
  <option value="villa-canales">Villa Canales (Apto: $600-1,200 | Casa: $500-1,200)</option>
  <option value="amatitlan">Amatitlán (Apto: $500-1,000 | Casa: $500-1,000)</option>
  <option value="palencia">Palencia (Casa/Terreno: $400-900)</option>
  <option value="chinautla">Chinautla (Casa/Terreno: $400-900)</option>
  </optgroup>
</select>
</div>

<div>
<label><strong>Tipo de Propiedad</strong></label>
<select id="tipo" onchange="calcular()" style="width:100%;padding:10px;margin:10px 0;border:1px solid #ddd">
  <option value="casa">Casa</option>
  <option value="apartamento">Apartamento</option>
  <option value="terreno">Terreno</option>
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

<div id="resultado" style="background:#fff9f0;border:2px solid #ff9500;border-radius:8px;padding:20px">
<h3 style="color:#1a2a4e;margin-top:0">Valor Estimado (USD)</h3>
<div style="font-size:28px;font-weight:bold;color:#ff9500;margin:15px 0">
US\$ <span id="valorTotal">0</span>
</div>
<p style="color:#666;font-size:12px;margin:10px 0">
Rango de Mercado: US\$ <span id="minValor">0</span> - US\$ <span id="maxValor">0</span><br>
Valor Base: US\$ <span id="valorBase">0</span> | Ajustes: <span id="ajustes">0%</span>
</p>
</div>

</div>

<script>
const precios = {
  'cayala': { casa: [2200, 4000], apto: [2500, 4500] },
  'zona14': { casa: [2000, 3500], apto: [2200, 3800] },
  'zona15': { casa: [1800, 3200], apto: [2000, 3500] },
  'zona10': { casa: [1800, 3000], apto: [2000, 3200] },
  'zona4': { casa: [1500, 2500], apto: [1800, 3000] },
  'zona16': { casa: [1400, 2800], apto: [1600, 3000] },
  'zona13': { casa: [1300, 2300], apto: [1500, 2500] },
  'zona11': { casa: [1000, 1800], apto: [1100, 1900] },
  'carretera': { casa: [900, 2000], apto: [1100, 2000] },
  'santa-catarina': { casa: [1000, 2000], apto: [1100, 2000] },
  'san-cristobal': { casa: [900, 1800], apto: [1000, 1800] },
  'fraijanes': { casa: [900, 1800], apto: [1000, 1800] },
  'san-jose': { casa: [700, 1400], apto: [800, 1400] },
  'mixco': { casa: [700, 1500], apto: [800, 1500] },
  'villa-nueva': { casa: [600, 1200], apto: [700, 1300] },
  'villa-canales': { casa: [500, 1200], apto: [600, 1200] },
  'amatitlan': { casa: [500, 1000], apto: [500, 1000] },
  'palencia': { casa: [400, 900], apto: [400, 900] },
  'chinautla': { casa: [400, 900], apto: [400, 900] }
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
  const tipo = document.getElementById('tipo').value;
  const area = parseFloat(document.getElementById('area').value) || 0;
  const anio = parseInt(document.getElementById('anio').value) || 2015;
  const estado = document.getElementById('estado').value;
  
  if (!zona || area === 0) {
    document.getElementById('valorTotal').textContent = '0';
    return;
  }
  
  const rangoPrecio = precios[zona][tipo];
  const minPrecio = rangoPrecio[0];
  const maxPrecio = rangoPrecio[1];
  const promedioPrecio = (minPrecio + maxPrecio) / 2;
  
  const valorBaseMin = area * minPrecio;
  const valorBaseMax = area * maxPrecio;
  const valorBase = area * promedioPrecio;
  
  let ajuste = ajusteEstado[estado] || 0;
  
  const antiguedad = 2025 - anio;
  if (antiguedad > 30) ajuste -= 0.15;
  else if (antiguedad > 20) ajuste -= 0.10;
  else if (antiguedad > 10) ajuste -= 0.05;
  
  if (document.getElementById('piscina').checked) ajuste += 0.08;
  if (document.getElementById('gimnasio').checked) ajuste += 0.05;
  if (document.getElementById('jardin').checked) ajuste += 0.03;
  if (document.getElementById('garaje').checked) ajuste += 0.05;
  if (document.getElementById('terraza').checked) ajuste += 0.04;
  if (document.getElementById('seguridad').checked) ajuste += 0.03;
  
  const valorFinal = valorBase * (1 + ajuste);
  const valorFinalMin = valorBaseMin * (1 + ajuste);
  const valorFinalMax = valorBaseMax * (1 + ajuste);
  
  const fmt = n => '\$' + Math.round(n).toLocaleString('es-ES');
  
  document.getElementById('valorBase').textContent = fmt(valorBase);
  document.getElementById('valorTotal').textContent = fmt(valorFinal);
  document.getElementById('minValor').textContent = fmt(valorFinalMin);
  document.getElementById('maxValor').textContent = fmt(valorFinalMax);
  document.getElementById('ajustes').textContent = (ajuste >= 0 ? '+' : '') + (ajuste * 100).toFixed(0) + '%';
}

calcular();
</script>
`;
}

module.exports = { valuacionPage };
