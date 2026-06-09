function leadsMagnet() {
  return `
<section style="padding:60px 6%;background:linear-gradient(135deg,#1a2a4e 0%,#2d4069 100%);color:white">
  <div style="max-width:900px;margin:0 auto">
    <div style="text-align:center;margin-bottom:50px">
      <div style="font-size:64px;margin-bottom:24px">📚</div>
      <h1 style="font-size:44px;font-weight:700;margin-bottom:16px">Guía Completa de Compra</h1>
      <p style="font-size:18px;opacity:0.9;max-width:600px;margin:0 auto">
        Tu guía premium: Cómo invertir en real estate en Guatemala sin errores costosos
      </p>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center">
      <!-- Contenido -->
      <div>
        <h2 style="font-size:28px;margin-bottom:20px">¿Qué incluye la guía?</h2>
        <div style="line-height:2">
          <p style="margin:12px 0">✓ Análisis de mercado actual en Guatemala</p>
          <p style="margin:12px 0">✓ Cómo evaluar una propiedad profesionalmente</p>
          <p style="margin:12px 0">✓ Estrategias de financiamiento inteligente</p>
          <p style="margin:12px 0">✓ Checklist de inspección profesional</p>
          <p style="margin:12px 0">✓ Errores comunes (y cómo evitarlos)</p>
          <p style="margin:12px 0">✓ Zonas premium recomendadas 2026</p>
          <p style="margin:12px 0">✓ Negociación y cierre de trato</p>
          <p style="margin:12px 0">✓ Impuestos y documentación legal</p>
        </div>
      </div>

      <!-- CTA Descarga -->
      <div style="background:white;border-radius:16px;padding:40px;color:#1a2a4e;box-shadow:0 10px 40px rgba(0,0,0,0.3)">
        <div style="text-align:center;margin-bottom:30px">
          <div style="font-size:72px;margin-bottom:20px">⬇️</div>
          <h3 style="font-size:24px;font-weight:700;margin-bottom:12px">Descarga Gratis</h3>
          <p style="color:#666;margin-bottom:25px">Acceso inmediato a la guía completa</p>
        </div>

        <button onclick="descargarGuia()" style="width:100%;background:linear-gradient(135deg,#ffa500 0%,#ff8c00 100%);color:white;padding:18px;border:none;border-radius:10px;font-weight:700;font-size:16px;cursor:pointer;transition:transform 0.2s;margin-bottom:15px" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
          📥 Descargar PDF Ahora
        </button>

        <a href="https://wa.me/50245542088?text=Hola,%20descargué%20tu%20guía%20de%20compra.%20Quiero%20conocer%20más%20opciones%20de%20inversión%20inmobiliaria" target="_blank" style="display:block;background:#25D366;color:white;padding:14px;border-radius:8px;text-decoration:none;font-weight:600;text-align:center;margin-bottom:15px;transition:background 0.2s" onmouseover="this.style.background='#20BA5C'" onmouseout="this.style.background='#25D366'">
          💬 Contactar por WhatsApp
        </a>

        <p style="font-size:12px;color:#666;margin-top:15px;text-align:center">
          ✓ Sin formulario • ✓ 100% gratis • ✓ Descarga directa
        </p>

        <div style="margin-top:25px;padding:15px;background:#f0f0f0;border-radius:8px;text-align:center">
          <p style="font-size:13px;color:#666;margin:0">
            👥 Más de 2,000 inversores descargaron esta guía
          </p>
        </div>
      </div>
    </div>

    <!-- Contenido Preview -->
    <div style="margin-top:60px;padding:40px;background:rgba(255,255,255,0.1);border-radius:10px;border:1px solid rgba(255,255,255,0.2);backdrop-filter:blur(10px)">
      <h2 style="text-align:center;margin-top:0;margin-bottom:30px">Contenido de la Guía</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px">
        <div>
          <h4 style="color:#ffa500;margin-top:0">Sección 1: Mercado</h4>
          <p>Análisis actual del mercado inmobiliario guatemalteco, zonas premium, tendencias 2026, oportunidades de inversión y proyecciones económicas.</p>
        </div>
        <div>
          <h4 style="color:#ffa500">Sección 2: Evaluación</h4>
          <p>Cómo inspeccionar una propiedad, calcular ROI real, analizar comparables, identificar riesgos y evaluar potencial de revalorización.</p>
        </div>
        <div>
          <h4 style="color:#ffa500">Sección 3: Financiamiento</h4>
          <p>Estrategias de hipotecas, tasas bancarias 2026, cálculos de capacidad de pago, impuestos, gastos y planificación financiera.</p>
        </div>
        <div>
          <h4 style="color:#ffa500">Sección 4: Cierre</h4>
          <p>Pasos legales, documentación requerida, negociación, inspecciones finales, checklist de cierre y protección de tu inversión.</p>
        </div>
      </div>
      <p style="text-align:center;margin-top:30px;color:#ffa500;font-weight:600">
        Descarga ahora para acceder al documento completo con tablas, gráficos y análisis detallado
      </p>
    </div>
  </div>
</section>

<script>
function descargarGuia() {
  const link = document.createElement('a');
  link.href = '/files/INMUHUB-Reporte-Inversionistas-2026.pdf';
  link.download = 'INMUHUB-Guia-Completa-de-Compra.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>
`;
}

module.exports = { leadsMagnet };
