function valuacionPage() {
  return `
<section style="padding:60px 6%;background:linear-gradient(135deg,#1a2a4e 0%,#2d4069 100%);color:white">
<div style="max-width:1200px;margin:0 auto;text-align:center">
<h1 style="font-size:48px;font-weight:800;margin-bottom:16px;letter-spacing:-1px">Valuador de Propiedades</h1>
<p style="font-size:18px;opacity:0.9;margin:0">Calcula el valor estimado de tu propiedad en Guatemala</p>
</div>
</section>

<section style="padding:60px 6%;background:white">
<div style="max-width:900px;margin:0 auto">

<form id="valuationForm" style="background:white;border-radius:16px;padding:48px;box-shadow:0 10px 40px rgba(0,0,0,0.1);border:1px solid #e5e7eb">

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-bottom:32px">
  <div>
    <label style="display:block;font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:14px">Zona / Ubicación *</label>
    <select id="zona" required style="width:100%;padding:12px;border:2px solid #d1d5db;border-radius:8px;font-size:14px;font-family:inherit;outline:none;transition:all 0.3s">
      <option value="">Selecciona una zona</option>
      <optgroup label="Ciudad de Guatemala">
      <option value="zona1">Zona 1 - $1,200/m²</option>
      <option value="zona2">Zona 2 - $1,150/m²</option>
      <option value="zona3">Zona 3 - $980/m²</option>
      <option value="zona4">Zona 4 - $1,050/m²</option>
      <option value="zona5">Zona 5 - $900/m²</option>
      <option value="zona10">Zona 10 - $1,850/m²</option>
      <option value="zona12">Zona 12 - $1,300/m²</option>
      <option value="zona14">Zona 14 - $1,620/m²</option>
      <option value="zona15">Zona 15 - $1,420/m²</option>
      <option value="zona16">Zona 16 - $1,350/m²</option>
      <option value="zona17">Zona 17 - $1,100/m²</option>
      <option value="zona18">Zona 18 - $950/m²</option>
      <option value="zona19">Zona 19 - $850/m²</option>
      <option value="zona21">Zona 21 - $1,180/m²</option>
      </optgroup>
      <optgroup label="Municipios">
      <option value="cayala">Cayalá - $1,900/m²</option>
      <option value="fraijanes">Fraijanes - $980/m²</option>
      <option value="san-jose">San José Pinula - $920/m²</option>
      <option value="mixco">Mixco - $1,100/m²</option>
      <option value="santa-catarina">Santa Catarina Pinula - $1,050/m²</option>
      <option value="san-pedro">San Pedro Sacatepéquez - $880/m²</option>
      <option value="carretera">Carretera a El Salvador - $850/m²</option>
      </optgroup>
    </select>
  </div>
  
  <div>
    <label style="display:block;font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:14px">Año de Construcción *</label>
    <input type="number" id="anio" min="1950" max="2025" placeholder="Ej: 2015" required style="width:100%;padding:12px;border:2px solid #d1d5db;border-radius:8px;font-size:14px;font-family:inherit;outline:none;transition:all 0.3s">
  </div>
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px;margin-bottom:32px">
  <div>
    <label style="display:block;font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:14px">Tipo de Construcción</label>
    <select id="tipo" style="width:100%;padding:12px;border:2px solid #d1d5db;border-radius:8px;font-size:14px;font-family:inherit;">
      <option value="moderna">Moderna</option>
      <option value="colonial">Colonial</option>
      <option value="minimalista">Minimalista</option>
      <option value="tradicional">Tradicional</option>
    </select>
  </div>
  
  <div>
    <label style="display:block;font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:14px">Estado de la Propiedad</label>
    <select id="estado" style="width:100%;padding:12px;border:2px solid #d1d5db;border-radius:8px;font-size:14px;font-family:inherit;">
      <option value="nueva">Nueva</option>
      <option value="excelente">Excelente</option>
      <option value="buen">Buen estado</option>
      <option value="regular">Regular</option>
      <option value="requiere">Requiere reparación</option>
    </select>
  </div>
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-bottom:32px">
  <div>
    <label style="display:block;font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:14px">m² de Construcción *</label>
    <input type="number" id="areaConst" min="50" max="10000" placeholder="Ej: 250" required style="width:100%;padding:12px;border:2px solid #d1d5db;border-radius:8px;font-size:14px;font-family:inherit;outline:none;transition:all 0.3s">
  </div>
  
  <div>
    <label style="display:block;font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:14px">m² de Terreno *</label>
    <input type="number" id="areaTerr" min="50" max="10000" placeholder="Ej: 500" required style="width:100%;padding:12px;border:2px solid #d1d5db;border-radius:8px;font-size:14px;font-family:inherit;outline:none;transition:all 0.3s">
  </div>
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-bottom:32px">
  <div>
    <label style="display:block;font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:14px">Habitaciones *</label>
    <input type="number" id="cuartos" min="1" max="20" placeholder="Ej: 3" required style="width:100%;padding:12px;border:2px solid #d1d5db;border-radius:8px;font-size:14px;font-family:inherit;outline:none;transition:all 0.3s">
  </div>
  
  <div>
    <label style="display:block;font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:14px">Baños *</label>
    <input type="number" id="banos" min="1" max="20" step="0.5" placeholder="Ej: 2.5" required style="width:100%;padding:12px;border:2px solid #d1d5db;border-radius:8px;font-size:14px;font-family:inherit;outline:none;transition:all 0.3s">
  </div>
</div>

<div style="background:#f3f4f6;border-radius:12px;padding:24px;margin-bottom:32px;box-sizing:border-box">
<p style="font-weight:600;color:#1a2a4e;margin-bottom:16px;font-size:14px;margin-top:0">Características Adicionales</p>
<div style="display:block;width:100%;text-align:left;box-sizing:border-box">
  <div style="margin-bottom:12px;padding:0;display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box"><input type="checkbox" id="piscina" style="width:18px;height:18px;margin:0;flex-shrink:0"> for="piscina" style="cursor:pointer;color:#4b5563;margin:0;flex:1;min-width:0;word-break:break-word">Piscina (+5%)</label></div>
  <div style="margin-bottom:12px;padding:0;display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box"><input type="checkbox" id="gimnasio" style="width:18px;height:18px;margin:0;flex-shrink:0"> <label for="gimnasio" style="cursor:pointer;color:#4b5563;margin:0;flex:1;min-width:0;word-break:break-word">Gimnasio (+3%)</label></div>
  <div style="margin-bottom:12px;padding:0;display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box"><input type="checkbox" id="jardin" style="width:18px;height:18px;margin:0;flex-shrink:0"> <label for="jardin" style="cursor:pointer;color:#4b5563;margin:0;flex:1;min-width:0;word-break:break-word">Jardín (+2%)</label></div>
  <div style="margin-bottom:12px;padding:0;display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box"><input type="checkbox" id="garaje" style="width:18px;height:18px;margin:0;flex-shrink:0"> <label for="garaje" style="cursor:pointer;color:#4b5563;margin:0;flex:1;min-width:0;word-break:break-word">Garaje cubierto (+4%)</label></div>
  <div style="margin-bottom:12px;padding:0;display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box"><input type="checkbox" id="terraza" style="width:18px;height:18px;margin:0;flex-shrink:0"> <label for="terraza" style="cursor:pointer;color:#4b5563;margin:0;flex:1;min-width:0;word-break:break-word">Terraza/Balcón (+3%)</label></div>
  <div style="margin-bottom:12px;padding:0;display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box"><input type="checkbox" id="seguridad" style="width:18px;height:18px;margin:0;flex-shrink:0"> <label for="seguridad" style="cursor:pointer;color:#4b5563;margin:0;flex:1;min-width:0;word-break:break-word">Seguridad 24/7 (+2%)</label></div>
</div>
</div>

<button type="submit" style="width:100%;background:linear-gradient(135deg,#ffa500 0%,#ff8c00 100%);color:white;border:none;padding:16px;border-radius:8px;font-weight:600;font-size:16px;cursor:pointer;transition:all 0.3s">
  CALCULAR VALUACIÓN
</button>

</form>

<div id="resultado" style="display:none;margin-top:48px;background:linear-gradient(135deg,#f3f4f6 0%,#e5e7eb 100%);border-radius:16px;padding:40px;border-left:6px solid #ffa500">
  <h3 style="font-size:24px;font-weight:700;color:#1a2a4e;margin-bottom:24px">Valuación Estimada</h3>
  
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-bottom:32px">
    <div style="background:white;border-radius:12px;padding:24px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.05)">
      <p style="color:#666;font-size:12px;text-transform:uppercase;margin-bottom:8px;letter-spacing:1px">Valor Base</p>
      <p style="font-size:32px;font-weight:700;color:#1a2a4e;margin:0" id="valorBase">$0</p>
    </div>
    
    <div style="background:white;border-radius:12px;padding:24px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.05)">
      <p style="color:#666;font-size:12px;text-transform:uppercase;margin-bottom:8px;letter-spacing:1px">Ajustes</p>
      <p style="font-size:32px;font-weight:700;color:#ff8c00;margin:0" id="ajustes">+$0</p>
    </div>
  </div>
  
  <div style="background:linear-gradient(135deg,#1a2a4e 0%,#2d4069 100%);border-radius:12px;padding:32px;text-align:center;color:white;margin-bottom:24px">
    <p style="font-size:14px;opacity:0.8;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px">VALOR TOTAL ESTIMADO</p>
    <p style="font-size:48px;font-weight:800;margin:0;color:#ffa500" id="valorTotal">$0</p>
    <p style="font-size:12px;opacity:0.7;margin-top:16px">Valuación aproximada basada en datos de mercado actual</p>
  </div>
  
  <div style="background:white;border-radius:12px;padding:24px">
    <h4 style="font-size:16px;font-weight:700;color:#1a2a4e;margin-bottom:16px">Detalles del Cálculo</h4>
    <div style="font-size:13px;color:#666;line-height:1.8">
      <p>Zona: <strong id="zonaText">-</strong></p>
      <p>m² Construcción: <strong id="areaConstText">-</strong></p>
      <p>m² Terreno: <strong id="areaTerrText">-</strong></p>
      <p>Cuartos: <strong id="cuartosText">-</strong> | Baños: <strong id="banosText">-</strong></p>
      <p>Año: <strong id="anioText">-</strong></p>
      <p id="caracteristicasText" style="margin-top:12px;color:#999"></p>
    </div>
  </div>
  
  <div style="margin-top:24px;padding:20px;background:#fff3e0;border-radius:12px;border-left:4px solid #ff8c00">
    <p style="font-size:13px;color:#c65911;margin:0"><strong>⚠ Disclaimer:</strong> Esta es una valuación estimada basada en datos de mercado. Para una valuación oficial, contacta con un tasador profesional.</p>
  </div>
</div>

</div>
</section>

<script>
const precios = {
  'zona10': { nombre: 'Zona 10', precio: 1850 },
  'zona14': { nombre: 'Zona 14', precio: 1620 },
  'zona15': { nombre: 'Zona 15', precio: 1420 },
  'zona16': { nombre: 'Zona 16', precio: 1350 },
  'cayala': { nombre: 'Cayalá', precio: 1900 },
  'fraijanes': { nombre: 'Fraijanes', precio: 980 },
  'carretera': { nombre: 'Carretera a El Salvador', precio: 850 },
  'mixco': { nombre: 'Mixco', precio: 1100 },
  'san-jose': { nombre: 'San José Pinula', precio: 920 }
};

function fmt(n) {
  return '$' + Math.round(n).toLocaleString('es-GT');
}

document.getElementById('valuationForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const zona = document.getElementById('zona').value;
  const areaConst = parseInt(document.getElementById('areaConst').value) || 0;
  const areaTerr = parseInt(document.getElementById('areaTerr').value) || 0;
  const cuartos = parseInt(document.getElementById('cuartos').value) || 0;
  const banos = parseFloat(document.getElementById('banos').value) || 0;
  const anio = parseInt(document.getElementById('anio').value) || 2000;
  
  if (!zona) {
    alert('Por favor selecciona una zona');
    return;
  }
  
  // Valor base: m² × precio/m² de la zona
  const precioM2 = precios[zona].precio;
  const valorBase = areaConst * precioM2;
  
  // Ajustes por características
  let ajuste = 0;
  
  // Depreciation por año (-0.5% por año desde 1980, -0.3% por año desde 2000)
  const anioRef = anio < 2000 ? 1980 : 2000;
  const anosAntiguedad = new Date().getFullYear() - anio;
  const deprecacion = anio < 2000 ? anosAntiguedad * 0.005 : Math.max(0, (anio - 2000) < 10 ? 0 : (anio - 2010) * 0.002);
  ajuste -= Math.min(0.25, deprecacion); // Máximo -25%
  
  // Ajustes por características
  if (document.getElementById('piscina').checked) ajuste += 0.05;
  if (document.getElementById('gimnasio').checked) ajuste += 0.03;
  if (document.getElementById('jardin').checked) ajuste += 0.02;
  if (document.getElementById('garaje').checked) ajuste += 0.04;
  if (document.getElementById('terraza').checked) ajuste += 0.03;
  if (document.getElementById('seguridad').checked) ajuste += 0.02;
  
  // Ajuste por relación cuartos/baños (mejor relación = +premium)
  if (cuartos > 0 && banos >= cuartos * 0.8) {
    ajuste += 0.03; // +3% si está bien distribuido
  }
  
  // Ajuste por tamaño (economía de escala)
  if (areaConst < 100) ajuste -= 0.05;
  if (areaConst > 500) ajuste += 0.03;
  
  const montoAjuste = valorBase * ajuste;
  const valorTotal = valorBase + montoAjuste;
  
  // Mostrar resultados
  document.getElementById('valorBase').textContent = fmt(valorBase);
  document.getElementById('ajustes').textContent = (ajuste >= 0 ? '+' : '') + (ajuste * 100).toFixed(1) + '%';
  document.getElementById('valorTotal').textContent = fmt(valorTotal);
  
  // Detalles
  document.getElementById('zonaText').textContent = precios[zona].nombre + ' ($' + precioM2 + '/m²)';
  document.getElementById('areaConstText').textContent = areaConst + ' m²';
  document.getElementById('areaTerrText').textContent = areaTerr + ' m²';
  document.getElementById('cuartosText').textContent = cuartos;
  document.getElementById('banosText').textContent = banos;
  document.getElementById('anioText').textContent = anio + ' (' + anosAntiguedad + ' años)';
  
  // Características
  const chars = [];
  if (document.getElementById('piscina').checked) chars.push('Piscina');
  if (document.getElementById('gimnasio').checked) chars.push('Gimnasio');
  if (document.getElementById('jardin').checked) chars.push('Jardín');
  if (document.getElementById('garaje').checked) chars.push('Garaje cubierto');
  if (document.getElementById('terraza').checked) chars.push('Terraza/Balcón');
  if (document.getElementById('seguridad').checked) chars.push('Seguridad 24/7');
  
  document.getElementById('caracteristicasText').textContent = chars.length > 0 
    ? '✓ ' + chars.join(' • ') 
    : '(Sin características adicionales)';
  
  document.getElementById('resultado').style.display = 'block';
  document.getElementById('resultado').scrollIntoView({ behavior: 'smooth' });
});
</script>
`;
}

module.exports = { valuacionPage };
