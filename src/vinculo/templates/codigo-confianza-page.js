const { layout } = require('./layout');

function codigoConfianzaPage() {
  const title = 'Código de Confianza | Sin comisiones, sin intermediarios | INMUHUB';
  const desc = 'El compromiso público de INMUHUB con asesores y compradores: 0% comisión por venta, leads directos por WhatsApp, sin intermediación.';
  const canonical = '/codigo-confianza.html';

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": desc,
    "url": "https://inmuhub.com" + canonical
  };

  const compromisos = [
    {
      icono: '🤝',
      titulo: '0% comisión por venta',
      texto: 'INMUHUB cobra únicamente la membresía mensual del asesor. No importa el precio de la propiedad ni cuántas cierres al mes — no cobramos comisión, nunca.'
    },
    {
      icono: '💬',
      titulo: 'Tus leads van directo a ti',
      texto: 'Cuando un comprador contacta desde una propiedad, el mensaje abre directo el WhatsApp personal del asesor. No pasa por un sistema de mensajería propio, no se retiene, no se redirige.'
    },
    {
      icono: '🚫',
      titulo: 'No competimos con nuestros asesores',
      texto: 'INMUHUB no es una agencia inmobiliaria. No representamos propiedades, no cerramos tratos, no ganamos comisiones de cierre. Somos la plataforma, no un jugador más en la cancha.'
    },
    {
      icono: '💳',
      titulo: 'Precio fijo, sin sorpresas',
      texto: 'Los planes son mensuales, sin contrato anual forzoso y sin penalidades por cancelar. El precio que ves en la página de planes es el precio que pagas — sin cargos ocultos.'
    },
    {
      icono: '✅',
      titulo: 'Verificación real',
      texto: 'Cada propiedad publicada pasa por revisión de papelería y datos antes de aparecer en el catálogo público.'
    }
  ];

  const compromisosHTML = compromisos.map(c => `
    <div style="display:flex;gap:20px;padding:24px 0;border-bottom:1px solid #eee">
      <div style="font-size:32px;flex-shrink:0">${c.icono}</div>
      <div>
        <h3 style="margin:0 0 8px;font-size:18px;color:#1a2a4e;font-weight:700">${c.titulo}</h3>
        <p style="margin:0;font-size:15px;color:#555;line-height:1.6">${c.texto}</p>
      </div>
    </div>
  `).join('');

  const body = `
<div style="padding:60px 6% 80px;background:linear-gradient(135deg,#f8f9fa 0%,#e8eef5 100%);min-height:100vh">
  <div style="max-width:760px;margin:0 auto">
    <p style="text-align:center;text-transform:uppercase;letter-spacing:.12em;font-size:12px;font-weight:700;color:#ff9500;margin-bottom:12px">
      Compromiso público
    </p>
    <h1 style="text-align:center;font-size:42px;font-weight:700;margin-bottom:20px;color:#1a2a4e">
      Código de Confianza INMUHUB
    </h1>
    <p style="text-align:center;font-size:17px;color:#555;margin-bottom:48px;max-width:600px;margin-left:auto;margin-right:auto">
      Somos la plataforma, no la competencia de nuestros asesores. Esto es lo que nos comprometemos a cumplir con cada asesor y cada comprador que usa INMUHUB.
    </p>

    <div style="background:#fff;border-radius:14px;padding:12px 32px;box-shadow:0 4px 24px rgba(26,42,78,.08)">
      ${compromisosHTML}
    </div>

    <div style="text-align:center;margin-top:48px">
      <p style="font-size:14px;color:#777;margin-bottom:16px">¿Eres asesor y quieres publicar bajo estas condiciones?</p>
      <a href="/planes.html" style="display:inline-block;padding:14px 32px;background:#1a2a4e;color:#fff;border-radius:8px;font-weight:700;font-size:15px;text-decoration:none">Ver planes y precios →</a>
    </div>
  </div>
</div>

<script type="application/ld+json">
${JSON.stringify(schemaMarkup, null, 2)}
</script>
`;

  return layout({ title, desc, canonical, body });
}

module.exports = { codigoConfianzaPage };
