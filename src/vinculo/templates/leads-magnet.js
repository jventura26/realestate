function leadsMagnet() {
  return `
<section style="padding:80px 6%;background:linear-gradient(135deg,#1a2a4e 0%,#2d4069 100%);color:white">
  <div style="max-width:700px;margin:0 auto;text-align:center">
    <!-- Icono -->
    <div style="font-size:64px;margin-bottom:24px">📚</div>
    
    <!-- Título -->
    <h2 style="font-size:36px;font-weight:700;margin-bottom:16px">Guía Completa de Compra</h2>
    <p style="font-size:18px;opacity:0.9;margin-bottom:40px;line-height:1.6">
      Descarga nuestra guía premium: "Cómo invertir en real estate en Guatemala sin errores costosos"
    </p>

    <!-- Contenido preview -->
    <div style="background:rgba(255,255,255,0.1);border-radius:12px;padding:24px;margin-bottom:40px;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2);text-align:left">
      <p style="font-size:13px;opacity:0.8;text-transform:uppercase;margin-bottom:16px">Incluye:</p>
      <ul style="list-style:none;margin:0;padding:0">
        <li style="margin-bottom:12px;display:flex;align-items:center;gap:12px">
          <span style="color:#ffa500">✓</span>
          <span>Análisis de mercado actual en Guatemala</span>
        </li>
        <li style="margin-bottom:12px;display:flex;align-items:center;gap:12px">
          <span style="color:#ffa500">✓</span>
          <span>Guía paso a paso: desde búsqueda hasta cierre</span>
        </li>
        <li style="margin-bottom:12px;display:flex;align-items:center;gap:12px">
          <span style="color:#ffa500">✓</span>
          <span>Checklist de inspección profesional</span>
        </li>
        <li style="margin-bottom:12px;display:flex;align-items:center;gap:12px">
          <span style="color:#ffa500">✓</span>
          <span>Errores comunes (y cómo evitarlos)</span>
        </li>
        <li style="margin-bottom:12px;display:flex;align-items:center;gap:12px">
          <span style="color:#ffa500">✓</span>
          <span>Estrategias de inversión y financiamiento</span>
        </li>
        <li style="display:flex;align-items:center;gap:12px">
          <span style="color:#ffa500">✓</span>
          <span>Zonas premium recomendadas 2024-2025</span>
        </li>
      </ul>
    </div>

    <!-- Formulario -->
    <form id="leadForm" style="background:white;border-radius:12px;padding:32px;color:#1a2a4e">
      <div style="margin-bottom:16px">
        <input type="text" placeholder="Tu nombre completo" required style="width:100%;padding:14px;border:1px solid #d1d5db;border-radius:8px;font-family:inherit;font-size:14px;box-sizing:border-box;margin-bottom:12px">
      </div>

      <div style="margin-bottom:16px">
        <input type="email" placeholder="Tu email" required style="width:100%;padding:14px;border:1px solid #d1d5db;border-radius:8px;font-family:inherit;font-size:14px;box-sizing:border-box;margin-bottom:12px">
      </div>

      <div style="margin-bottom:24px">
        <input type="tel" placeholder="Tu teléfono (WhatsApp)" required style="width:100%;padding:14px;border:1px solid #d1d5db;border-radius:8px;font-family:inherit;font-size:14px;box-sizing:border-box">
      </div>

      <button type="submit" style="width:100%;background:linear-gradient(135deg,#ffa500 0%,#ff8c00 100%);color:white;padding:16px;border:none;border-radius:8px;font-weight:700;font-size:16px;cursor:pointer;transition:all 0.3s">
        📥 Descargar Guía Gratis
      </button>

      <p style="font-size:12px;color:#666;margin-top:12px">
        ✓ Sin spam • ✓ 100% privado • ✓ Acceso inmediato
      </p>
    </form>

    <!-- Frase de confianza -->
    <p style="margin-top:40px;font-size:14px;opacity:0.8">
      👥 Más de 2,000 inversores ya descargaron esta guía
    </p>
  </div>
</section>

<script>
document.getElementById('leadForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = this.querySelector('input[type="text"]').value;
  const email = this.querySelector('input[type="email"]').value;
  const phone = this.querySelector('input[type="tel"]').value;
  
  // Guardar en localStorage para rastrear
  const leads = JSON.parse(localStorage.getItem('leads') || '[]');
  leads.push({ name, email, phone, date: new Date().toISOString() });
  localStorage.setItem('leads', JSON.stringify(leads));
  
  // Redirigir a WhatsApp con mensaje de confirmación
  const msg = encodeURIComponent('Hola, acabo de descargar tu guía de compra. Me gustaría conocer más opciones de inversión.');
  window.location.href = 'https://wa.me/502XXXXXXXX?text=' + msg;
});
</script>
`;
}

module.exports = { leadsMagnet };
