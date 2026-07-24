/**
 * Zona-INNmueble Admin Worker
 */

const ADMIN_USER_DEFAULT = 'admin';
const ADMIN_PASS_DEFAULT = 'admin1203';
const SESSION_TTL = 60 * 60 * 8;
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_LOCKOUT_SECONDS = 60 * 15;
const HOOK_ZONA = 'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/8105bd67-0276-4485-a0e0-50dcdb0e525d';
const HOOK_INMU = 'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/8a9c31c6-547b-4bef-b8d4-d7661fcda2f6';

// Meta Conversions API config
var PIXEL_ID = '1668269500330907';
// Multi-sitio: cada dominio puede tener su propio Pixel de Meta para
// Conversions API (server-side). InmuHub usa temporalmente el mismo
// Pixel que Zona INNmueble hasta que se cree uno propio en Meta Business
// Manager. En cuanto exista, reemplazar el valor de 'inmuhub.com' abajo
// y los eventos de ese dominio se separan automaticamente sin tocar
// nada mas del worker.
var PIXEL_IDS = {
  'zona-innmueble.com': '1668269500330907',
  'inmuhub.com': '1003403445392993' // Pixel real de InmuHub (Meta Business Manager)
};
function getPixelId(pageUrl) {
  try {
    var host = new URL(pageUrl).hostname.replace(/^www\./, '');
    return PIXEL_IDS[host] || PIXEL_ID;
  } catch (e) {
    return PIXEL_ID;
  }
}
var NOTIFY_WEBHOOK = 'https://script.google.com/macros/s/AKfycby8sAQtzXYJHyRnO5sIHgyju-_dNdS6xyjjCJPQtjWghKcWZKc3xjqX6lUxRUP3Dniu/exec';
var META_CAPI_TOKEN = 'EAAJqIg1BUn0BR4xyyEPPk7LYPBwj3XofzQq6fcq3JUmsNaYMTYwmDycjyZAinUl9NDjlB8ZBymE0vHqcqZCevHtZAoaEhCwHhm3i5ZBrAJ5z3ayUujBFEcpmLdcXZCw9qL1kSp6eilAvQ3ZB0x5ZBVHhVcTLIZCaZBeb2nqjNrV9D1WAi0wqEwQuU0g6aT5KuPVsA14QZDZD';
var META_PAGE_ID = '1616853578595692';
var META_PAGE_TOKEN = 'EAAaB8PdEbm0BR9apOesnvDsqcNnrfBpHYkzi9U0W5ByPBYVvQBZB1wodErfhbpAyg85H8etiONqRLTjUuKnCgYfYNIXdRe5VBs2WXc72XIZAhWSDRUlGp2b1HPIazf7EuZCWxkOZBhvnOrOIZA076u78HkCeSJWMI4DaTPzUZAzq4PomzJqQnWvzU2oLZCgZCRfuM0u8MWWtxZBofFH0NPq9tdAd51SjjZB4sIAYsD';

async function hashSHA256(value) {
  var encoder = new TextEncoder();
  var data = encoder.encode(value);
  var hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
}

async function triggerRebuild() {
  try {
    await Promise.all([
      fetch(HOOK_ZONA, { method: 'POST' }),
      fetch(HOOK_INMU, { method: 'POST' }),
    ]);
  } catch(e) {}
}

async function requireAuth(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return false;
  return (await env.DB.get('session:' + match[1])) === 'valid';
}

function generateToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}


function getDynamicGridJS() {
  return `
(function(){
  var API = 'https://zona-inmu.tours-virtuales-gt.workers.dev';
  function fetchProps(cb) {
    fetch(API + '/api/propiedades-publicas', { cache: 'no-cache' })
      .then(function(r){ return r.json(); })
      .then(function(data){ cb(null, data); })
      .catch(function(e){ cb(e, []); });
  }
  window.__zonaInmuLoadProps = fetchProps;
  document.dispatchEvent(new CustomEvent('zonaInmuReady'));
})();
`;
}

function getAdminHTML() {
  return "<!DOCTYPE html>\n<html lang=\"es\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<title>Admin \u00b7 Zona INNmueble</title>\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.27.0/dist/tabler-icons.min.css\">\n<style>\n:root{\n  --navy:#0D1B3E;--navy2:#142240;--navy3:#1A3060;\n  --or:#F5820D;--or2:#FF9B2E;\n  --wh:#fff;--bg:#F0F2F5;\n  --text:#1A1A2E;--text2:#4A5568;--text3:#8A9BB0;\n  --border:#E2E8F0;--border2:#CBD5E0;\n  --green:#22c55e;--red:#ef4444;--yellow:#f59e0b;--blue:#3b82f6;\n}\n*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}\nhtml,body{height:100%;font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);font-size:14px}\ninput,select,textarea,button{font-family:inherit;font-size:13px}\na{text-decoration:none;color:inherit}\n\n/* LOGIN */\n#loginPage{position:fixed;inset:0;background:var(--navy);display:flex;justify-content:center;align-items:center;z-index:9999}\n.login-card{background:var(--wh);border-radius:14px;padding:44px 40px;width:100%;max-width:380px;box-shadow:0 24px 60px rgba(0,0,0,.4)}\n.login-logo{font-size:22px;font-weight:800;color:var(--navy);letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px}\n.login-logo span{color:var(--or)}\n.login-sub{color:var(--text3);font-size:13px;margin-bottom:28px}\n.login-field{margin-bottom:14px}\n.login-field label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--navy);margin-bottom:5px}\n.login-field input{width:100%;padding:10px 13px;border:1.5px solid var(--border2);border-radius:7px;font-size:14px;outline:none;transition:border-color .15s}\n.login-field input:focus{border-color:var(--or)}\n#loginBtn{width:100%;padding:12px;background:var(--navy);color:var(--wh);border:none;border-radius:7px;font-weight:700;font-size:14px;cursor:pointer;transition:background .15s}\n#loginBtn:hover{background:var(--navy3)}\n#loginErr{background:#FEF2F2;color:#B91C1C;border-radius:6px;padding:10px 14px;font-size:13px;margin-top:12px;display:none}\n\n/* APP */\n#adminApp{display:none;height:100vh;overflow:hidden}\n.app{display:flex;height:100vh;overflow:hidden}\n\n/* SIDEBAR */\n.sidebar{width:230px;background:var(--navy);display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto}\n.sb-logo{padding:18px 20px 16px;border-bottom:1px solid rgba(255,255,255,.08)}\n.sb-brand{font-size:14px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--wh)}\n.sb-brand span{color:var(--or)}\n.sb-sub{font-size:10px;color:rgba(255,255,255,.3);margin-top:2px}\n.sb-nav{padding:10px 0;flex:1}\n.sb-section{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.22);padding:14px 20px 5px}\n.sb-item{display:flex;align-items:center;gap:10px;padding:9px 20px;font-size:12px;color:rgba(255,255,255,.55);cursor:pointer;transition:all .15s;border-right:2px solid transparent}\n.sb-item:hover{color:var(--wh);background:rgba(255,255,255,.06)}\n.sb-item.active{color:var(--wh);background:rgba(245,130,13,.15);border-right-color:var(--or)}\n.sb-item i{font-size:17px;flex-shrink:0}\n.sb-badge{margin-left:auto;background:var(--or);color:var(--navy);font-size:10px;font-weight:700;padding:1px 7px;border-radius:20px}\n.sb-badge.new{background:var(--green)}\n.sb-bottom{padding:14px 20px;border-top:1px solid rgba(255,255,255,.08)}\n.sb-user{display:flex;align-items:center;gap:10px}\n.sb-avatar{width:34px;height:34px;border-radius:50%;background:var(--or);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--navy);flex-shrink:0}\n.sb-uname{font-size:12px;color:rgba(255,255,255,.8);font-weight:600}\n.sb-urole{font-size:10px;color:rgba(255,255,255,.35)}\n\n/* MAIN */\n.main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}\n.topbar{background:var(--wh);border-bottom:1px solid var(--border);padding:0 24px;height:58px;display:flex;align-items:center;gap:10px;flex-shrink:0}\n.topbar-title{font-size:16px;font-weight:700;color:var(--navy);flex:1}\n.content{flex:1;overflow-y:auto;padding:24px;min-height:0}\n\n/* BUTTONS */\n.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all .15s}\n.btn-primary{background:var(--or);color:var(--wh)}\n.btn-primary:hover{background:var(--or2)}\n.btn-navy{background:var(--navy);color:var(--wh)}\n.btn-navy:hover{background:var(--navy3)}\n.btn-ghost{background:transparent;color:var(--text2);border:1px solid var(--border2)}\n.btn-ghost:hover{background:var(--bg)}\n.btn-green{background:var(--green);color:var(--wh)}\n.btn-sm{padding:5px 12px;font-size:11px}\n.btn i{font-size:15px}\n\n/* DASHBOARD STATS */\n.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:22px}\n.stat-card{background:var(--wh);border:1px solid var(--border);border-radius:10px;padding:18px 20px;position:relative;overflow:hidden}\n.stat-card::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:var(--or)}\n.stat-card.green::before{background:var(--green)}\n.stat-card.blue::before{background:var(--blue)}\n.stat-card.red::before{background:var(--red)}\n.stat-card.yellow::before{background:var(--yellow)}\n.stat-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text3);margin-bottom:8px}\n.stat-val{font-size:28px;font-weight:800;color:var(--navy);line-height:1}\n.stat-sub{font-size:11px;color:var(--text3);margin-top:5px}\n.stat-icon{position:absolute;right:16px;top:50%;transform:translateY(-50%);font-size:28px;color:var(--border);opacity:.7}\n\n/* DASHBOARD GRID */\n.dash-grid{display:grid;grid-template-columns:1fr 340px;gap:16px}\n@media(max-width:1100px){.dash-grid{grid-template-columns:1fr}}\n\n/* TABLE */\n.table-wrap{background:var(--wh);border:1px solid var(--border);border-radius:10px;overflow:hidden}\n.table-header{padding:16px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid var(--border)}\n.table-title{font-size:13px;font-weight:700;color:var(--navy)}\n.search-box{display:flex;align-items:center;gap:8px;background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:7px 12px;flex:1;max-width:280px}\n.search-box i{font-size:16px;color:var(--text3)}\n.search-box input{border:none;background:transparent;outline:none;width:100%;font-size:13px;color:var(--text)}\ntable{width:100%;border-collapse:collapse}\nth{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text3);padding:11px 14px;text-align:left;background:var(--bg);border-bottom:1px solid var(--border);white-space:nowrap}\ntd{padding:11px 14px;border-bottom:1px solid var(--border);vertical-align:middle;font-size:13px}\ntr:last-child td{border-bottom:none}\ntr:hover td{background:#FAFBFF}\n.prop-img{width:48px;height:38px;border-radius:5px;object-fit:cover;background:var(--bg);border:1px solid var(--border);display:block}\n.prop-name{font-weight:600;color:var(--navy);max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.prop-loc{font-size:11px;color:var(--text3);margin-top:1px}\n.price-cell{font-weight:700;color:var(--or);white-space:nowrap}\n.badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}\n.badge-green{background:#dcfce7;color:#166534}\n.badge-red{background:#fee2e2;color:#991b1b}\n.badge-gray{background:#f1f5f9;color:#475569}\n.badge-orange{background:#ffedd5;color:#9a3412}\n.badge-blue{background:#dbeafe;color:#1e40af}\n.badge-yellow{background:#fef3c7;color:#92400e}\n.actions-cell{display:flex;gap:5px}\n.icon-btn{width:30px;height:30px;border-radius:6px;border:1px solid var(--border);background:var(--bg);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text2);transition:all .15s}\n.icon-btn:hover{background:var(--navy);color:var(--wh);border-color:var(--navy)}\n.icon-btn.danger:hover{background:var(--red);border-color:var(--red)}\n.icon-btn.success:hover{background:var(--green);border-color:var(--green)}\n.icon-btn i{font-size:15px}\n\n/* COMPLETION BAR */\n.completion-bar{height:4px;background:var(--border);border-radius:2px;margin-top:4px;width:80px}\n.completion-fill{height:100%;border-radius:2px;transition:width .3s}\n\n/* MODAL */\n.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;z-index:500;overflow-y:auto;padding:16px}\n.modal-overlay.open{display:flex;align-items:flex-start;justify-content:center}\n.modal-panel{background:var(--wh);width:100%;max-width:960px;border-radius:12px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.4);display:flex;flex-direction:column;max-height:calc(100vh - 32px)}\n.modal-topbar{background:var(--navy);padding:0 20px;height:54px;display:flex;align-items:center;gap:12px;flex-shrink:0}\n.modal-topbar-title{font-size:14px;font-weight:700;color:var(--wh);flex:1}\n.modal-progress{font-size:11px;color:rgba(255,255,255,.5);white-space:nowrap}\n.modal-body{display:flex;flex:1;min-height:0;overflow:hidden}\n\n/* FORM TABS */\n.form-tabs-nav{width:160px;background:#F8FAFC;border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;padding:12px 0}\n.ftab{display:flex;align-items:center;gap:8px;padding:10px 16px;font-size:12px;font-weight:500;color:var(--text3);cursor:pointer;border-right:2px solid transparent;transition:all .15s}\n.ftab:hover{color:var(--navy);background:rgba(0,0,0,.03)}\n.ftab.active{color:var(--or);background:rgba(245,130,13,.06);border-right-color:var(--or);font-weight:700}\n.ftab i{font-size:16px;flex-shrink:0}\n.ftab-dot{width:6px;height:6px;border-radius:50%;background:var(--green);margin-left:auto;display:none}\n.ftab.has-data .ftab-dot{display:block}\n.form-tabs-body{flex:1;overflow-y:auto;padding:20px}\n.ftab-panel{display:none}\n.ftab-panel.active{display:block}\n.form-right{width:280px;border-left:1px solid var(--border);padding:16px;overflow-y:auto;flex-shrink:0;background:var(--bg)}\n\n/* FORM ELEMENTS */\n.fsec{margin-bottom:20px;padding-bottom:18px;border-bottom:1px solid var(--border)}\n.fsec:last-child{border-bottom:none;margin-bottom:0}\n.fsec-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--navy);margin-bottom:12px;display:flex;align-items:center;gap:7px}\n.fsec-title i{font-size:16px;color:var(--or)}\n.fg{margin-bottom:10px}\n.fg:last-child{margin-bottom:0}\n.fg label{display:block;font-size:11px;font-weight:600;color:var(--text2);margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em}\n.fg input,.fg select,.fg textarea{width:100%;padding:8px 10px;border:1px solid var(--border2);border-radius:6px;font-size:13px;color:var(--text);background:var(--wh);outline:none;transition:border-color .15s}\n.fg input:focus,.fg select:focus,.fg textarea:focus{border-color:var(--or);box-shadow:0 0 0 2px rgba(245,130,13,.1)}\n.fg textarea{resize:vertical;min-height:70px}\n.fg-row{display:grid;gap:10px}\n.fg-row.c2{grid-template-columns:1fr 1fr}\n.fg-row.c3{grid-template-columns:1fr 1fr 1fr}\n.fg-row.c4{grid-template-columns:1fr 1fr 1fr 1fr}\n.fg-hint{font-size:11px;color:var(--text3);margin-top:3px}\n.fg-auto{font-size:11px;color:var(--blue);margin-top:2px;cursor:pointer}\n\n/* CHARS */\n.chars-group{margin-bottom:14px}\n.chars-group-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text2);margin-bottom:8px;display:flex;align-items:center;gap:6px}\n.chars-group-title i{font-size:14px;color:var(--or)}\n.chars-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px}\n.char-item{display:flex;align-items:center;gap:7px;padding:6px 8px;border:1px solid var(--border);border-radius:6px;cursor:pointer;font-size:12px;color:var(--text2);transition:all .15s;user-select:none}\n.char-item:hover{border-color:var(--or)}\n.char-item input{width:13px;height:13px;accent-color:var(--or);cursor:pointer;flex-shrink:0;margin:0}\n.char-item.checked{background:#FFF8F2;border-color:var(--or);color:var(--navy);font-weight:500}\n\n/* PRIV CONFIG */\n.priv-toggle{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border:1px solid var(--border);border-radius:7px;margin-bottom:7px;cursor:pointer;transition:border-color .15s}\n.priv-toggle:hover{border-color:var(--or)}\n.priv-toggle label{font-size:12px;font-weight:600;color:var(--navy);cursor:pointer;flex:1}\n.priv-toggle small{font-size:11px;color:var(--text3);display:block;font-weight:400}\n.toggle-switch{position:relative;width:36px;height:20px;flex-shrink:0}\n.toggle-switch input{opacity:0;width:0;height:0;position:absolute}\n.toggle-slider{position:absolute;inset:0;background:var(--border2);border-radius:10px;transition:.2s}\n.toggle-slider::before{content:'';position:absolute;width:14px;height:14px;left:3px;top:3px;background:var(--wh);border-radius:50%;transition:.2s}\n.toggle-switch input:checked + .toggle-slider{background:var(--or)}\n.toggle-switch input:checked + .toggle-slider::before{transform:translateX(16px)}\n\n/* SHARE BOX */\n.share-box{background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:14px;margin-bottom:14px}\n.share-box-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#1E40AF;margin-bottom:12px;display:flex;align-items:center;gap:6px}\n.share-box .fg label{color:#1D4ED8}\n.share-box .fg input,.share-box .fg textarea{border-color:#BFDBFE}\n\n/* PRIVATE BOX */\n.priv-box{background:#FFFBEB;border:1px solid #FCD34D;border-radius:8px;padding:14px}\n.priv-box-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#92400E;margin-bottom:12px;display:flex;align-items:center;gap:6px}\n.priv-box .fg label{color:#78350F}\n.priv-box .fg input,.priv-box .fg textarea{border-color:#FCD34D;background:#FFFDE7}\n\n/* SIDE CARDS */\n.side-card{background:var(--wh);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:10px}\n.side-card:last-child{margin-bottom:0}\n.side-card-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--navy);margin-bottom:10px;display:flex;align-items:center;gap:6px}\n.side-card-title i{font-size:15px;color:var(--or)}\n.status-pills{display:flex;gap:6px;flex-wrap:wrap}\n.pill{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--border2);color:var(--text2);background:var(--bg);transition:all .15s}\n.pill.active{background:var(--or);color:var(--wh);border-color:var(--or)}\n.sitio-row{display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;cursor:pointer;margin-bottom:6px;transition:border-color .15s}\n.sitio-row:last-child{margin-bottom:0}\n.sitio-row:hover{border-color:var(--or)}\n.sitio-row input{width:14px;height:14px;accent-color:var(--or)}\n.sitio-label{font-size:12px;font-weight:600;color:var(--navy)}\n.sitio-url{font-size:10px;color:var(--text3)}\n.img-preview{width:100%;height:110px;object-fit:cover;border-radius:6px;border:1px solid var(--border);display:none;margin-top:8px}\n.gal-wrap{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}\n.gal-item{position:relative}\n.gal-item img{width:60px;height:46px;object-fit:cover;border-radius:5px;border:1px solid var(--border)}\n.gal-remove{position:absolute;top:-4px;right:-4px;background:var(--red);color:var(--wh);border:none;border-radius:50%;width:16px;height:16px;font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;line-height:1}\n.gal-count{font-size:11px;color:var(--text3);margin-top:4px}\n.add-gal-btn{margin-top:8px;width:100%;padding:7px;border:1.5px dashed var(--border2);border-radius:6px;background:none;font-size:12px;color:var(--text3);cursor:pointer;transition:border-color .15s}\n.add-gal-btn:hover{border-color:var(--or);color:var(--or)}\n\n/* MODAL FOOTER */\n.modal-footer{padding:12px 20px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;background:var(--bg);flex-shrink:0}\n.modal-footer-left{display:flex;gap:8px}\n.modal-footer-right{display:flex;gap:8px}\n\n/* LEADS */\n.leads-filters{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}\n.lead-filter-btn{padding:5px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--border2);color:var(--text2);background:var(--wh);transition:all .15s}\n.lead-filter-btn.active{background:var(--navy);color:var(--wh);border-color:var(--navy)}\n.lead-card{background:var(--wh);border:1px solid var(--border);border-radius:10px;padding:16px;margin-bottom:10px;transition:box-shadow .15s}\n.lead-card:hover{box-shadow:0 4px 12px rgba(0,0,0,.08)}\n.lead-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;gap:12px}\n.lead-name{font-size:14px;font-weight:700;color:var(--navy)}\n.lead-time{font-size:11px;color:var(--text3);white-space:nowrap}\n.lead-detail{font-size:12px;color:var(--text2);margin-bottom:4px;display:flex;align-items:center;gap:6px}\n.lead-detail i{font-size:14px;color:var(--text3);flex-shrink:0}\n.lead-actions{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;align-items:center}\n.wa-btn{display:inline-flex;align-items:center;gap:6px;background:#25D366;color:var(--wh);padding:6px 14px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none;transition:background .15s}\n.wa-btn:hover{background:#1ebe5d}\n.lead-status-sel{padding:5px 10px;border:1px solid var(--border2);border-radius:6px;font-size:12px;font-weight:600;outline:none;cursor:pointer;background:var(--wh)}\n.lead-note-btn{padding:5px 10px;border:1px solid var(--border2);border-radius:6px;font-size:12px;color:var(--text2);background:var(--wh);cursor:pointer;display:flex;align-items:center;gap:4px}\n.lead-note-area{margin-top:8px;display:none}\n.lead-note-area textarea{width:100%;padding:8px;border:1px solid var(--border2);border-radius:6px;font-size:12px;resize:none;outline:none}\n.lead-note-area textarea:focus{border-color:var(--or)}\n\n/* TOAST */\n.toast{position:fixed;bottom:24px;right:24px;background:var(--navy);color:var(--wh);padding:12px 18px;border-radius:8px;font-size:13px;font-weight:600;transform:translateY(80px);opacity:0;transition:all .3s;z-index:9999;display:flex;align-items:center;gap:8px;max-width:320px}\n.toast.show{transform:translateY(0);opacity:1}\n.toast.success{border-left:4px solid var(--green)}\n.toast.error{border-left:4px solid var(--red)}\n\n/* REBUILD BTN */\n.rebuild-banner{background:linear-gradient(135deg,var(--navy),var(--navy3));border-radius:10px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}\n.rebuild-text{color:rgba(255,255,255,.8);font-size:12px}\n.rebuild-text strong{color:var(--wh);display:block;margin-bottom:2px}\n\n@media(max-width:768px){\n  .sidebar{display:none}\n  .form-tabs-nav{display:none}\n  .form-right{width:100%;border-left:none;border-top:1px solid var(--border)}\n  .modal-body{flex-direction:column}\n  .dash-grid{grid-template-columns:1fr}\n  .fg-row.c3,.fg-row.c4{grid-template-columns:1fr 1fr}\n}\n/* KANBAN */\n.kanban-board{display:flex;gap:12px;overflow-x:auto;padding:4px 0 16px;min-height:60vh}\n.kanban-col{min-width:240px;max-width:280px;flex:1;background:var(--bg);border-radius:10px;display:flex;flex-direction:column}\n.kanban-col-header{padding:12px 14px;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:space-between;border-radius:10px 10px 0 0}\n.kanban-col-header .col-count{background:rgba(255,255,255,.25);border-radius:10px;padding:2px 8px;font-size:11px;font-weight:600}\n.kanban-col[data-stage=\"Nuevo\"] .kanban-col-header{background:#3b82f6;color:#fff}\n.kanban-col[data-stage=\"Contactado\"] .kanban-col-header{background:#eab308;color:#fff}\n.kanban-col[data-stage=\"Interesado\"] .kanban-col-header{background:#f97316;color:#fff}\n.kanban-col[data-stage=\"Visita\"] .kanban-col-header{background:#8b5cf6;color:#fff}\n.kanban-col[data-stage=\"Cierre\"] .kanban-col-header{background:#22c55e;color:#fff}\n.kanban-col[data-stage=\"Perdido\"] .kanban-col-header{background:#6b7280;color:#fff}\n.kanban-cards{flex:1;padding:8px;overflow-y:auto;display:flex;flex-direction:column;gap:8px}\n.kanban-card{background:var(--wh);border:1px solid var(--border);border-radius:8px;padding:12px;cursor:pointer;transition:box-shadow .15s,transform .1s}\n.kanban-card:hover{box-shadow:0 4px 12px rgba(0,0,0,.1);transform:translateY(-1px)}\n.kanban-card .kc-name{font-size:13px;font-weight:700;color:var(--navy);margin-bottom:6px}\n.kanban-card .kc-prop{font-size:11px;color:var(--text2);margin-bottom:4px}\n.kanban-card .kc-phone{font-size:11px;color:var(--text3)}\n.kanban-card .kc-meta{display:flex;align-items:center;justify-content:space-between;margin-top:8px}\n.kanban-card .kc-date{font-size:10px;color:var(--text3)}\n.score-badge{font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;text-transform:uppercase;letter-spacing:.5px}\n.score-hot{background:#fee2e2;color:#dc2626}\n.score-warm{background:#fff7ed;color:#f97316}\n.score-cold{background:#eff6ff;color:#3b82f6}\n.lead-modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px}\n.lead-modal{background:var(--wh);border-radius:14px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)}\n.lead-modal-head{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}\n.lead-modal-head h3{font-size:16px;font-weight:700;color:var(--navy);margin:0}\n.lead-modal-close{background:none;border:none;font-size:20px;cursor:pointer;color:var(--text3);padding:4px}\n.lead-modal-body{padding:24px}\n.lm-row{display:flex;gap:12px;margin-bottom:12px}\n.lm-field{flex:1}\n.lm-label{font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}\n.lm-value{font-size:13px;color:var(--navy);font-weight:500}\n.lm-section{font-size:12px;font-weight:700;color:var(--navy);margin:20px 0 10px;padding-top:14px;border-top:1px solid var(--border)}\n.lm-notes-list{max-height:200px;overflow-y:auto;margin-bottom:12px}\n.lm-note-item{background:var(--bg);border-radius:8px;padding:10px 12px;margin-bottom:6px;font-size:12px;color:var(--text2)}\n.lm-note-item .note-date{font-size:10px;color:var(--text3);margin-bottom:4px}\n.lm-note-input{width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;font-size:12px;resize:vertical;min-height:60px;font-family:inherit;box-sizing:border-box}\n.lm-stage-sel{width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:8px;font-size:13px;background:var(--wh)}\n.lm-followup{width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:8px;font-size:13px;box-sizing:border-box}\n.lm-actions{display:flex;gap:8px;margin-top:16px}\n.lm-actions .btn{flex:1}\n.pipeline-mini{display:flex;gap:6px;margin-top:10px}\n.pipeline-mini-col{flex:1;text-align:center}\n.pipeline-mini-col .pm-count{font-size:16px;font-weight:700;color:var(--navy)}\n.pipeline-mini-col .pm-label{font-size:9px;color:var(--text3);text-transform:uppercase}\n.dash-chart-bars{display:flex;align-items:flex-end;gap:6px;height:80px;padding:10px 0}\n.dash-chart-bars .bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}\n.dash-chart-bars .bar{width:100%;background:var(--or);border-radius:3px 3px 0 0;min-height:2px;transition:height .3s}\n.dash-chart-bars .bar-label{font-size:9px;color:var(--text3)}\n</style>\n</head>\n<body>\n\n<!-- LOGIN -->\n<div id=\"loginPage\">\n  <div class=\"login-card\">\n    <div class=\"login-logo\"><span>Zona</span>-INNmueble</div>\n    <div class=\"login-sub\">Panel de administraci\u00f3n \u00b7 Premium</div>\n    <div class=\"login-field\"><label>Usuario</label><input type=\"text\" id=\"loginUser\" placeholder=\"admin\" autocomplete=\"username\"></div>\n    <div class=\"login-field\"><label>Contrase\u00f1a</label><input type=\"password\" id=\"loginPass\" autocomplete=\"current-password\" onkeydown=\"if(event.key==='Enter')doLogin()\"></div>\n    <button id=\"loginBtn\" onclick=\"doLogin()\">Ingresar</button>\n    <div id=\"loginErr\">Usuario o contrase\u00f1a incorrectos.</div>\n  </div>\n</div>\n\n<!-- APP -->\n<div id=\"adminApp\">\n  <div class=\"app\">\n    <div class=\"sidebar\">\n      <div class=\"sb-logo\">\n        <div class=\"sb-brand\"><span>Zona</span>-INNmueble</div>\n        <div class=\"sb-sub\">Panel de administraci\u00f3n</div>\n      </div>\n      <div class=\"sb-nav\">\n        <div class=\"sb-item active\" id=\"nav-dashboard\" onclick=\"showPage('dashboard')\"><i class=\"ti ti-layout-dashboard\"></i> Dashboard</div>\n        <div class=\"sb-section\">Cat\u00e1logo</div>\n        <div class=\"sb-item\" id=\"nav-propiedades\" onclick=\"showPage('propiedades')\"><i class=\"ti ti-building\"></i> Propiedades</div>\n        <div class=\"sb-item\" onclick=\"openModal(null)\"><i class=\"ti ti-plus\"></i> Nueva propiedad</div>\n        <div class=\"sb-section\">Clientes</div>\n        <div class=\"sb-item\" id=\"nav-leads\" onclick=\"showPage('leads')\"><i class=\"ti ti-users\"></i> Leads <span class=\"sb-badge new\" id=\"leadsCount\">0</span></div>\n        <div class=\"sb-item\" id=\"nav-pipeline\" onclick=\"showPage('pipeline')\"><i class=\"ti ti-layout-kanban\"></i> Pipeline</div>\n        <div class=\"sb-section\">Sitios</div>\n        <div class=\"sb-item\" onclick=\"window.open('https://zona-innmueble.com','_blank')\"><i class=\"ti ti-world\"></i> Ver sitio</div>\n        <div class=\"sb-item\" onclick=\"triggerRebuild()\"><i class=\"ti ti-refresh\"></i> Publicar cambios</div>\n      </div>\n      <div class=\"sb-bottom\">\n        <div class=\"sb-user\">\n          <div class=\"sb-avatar\">ZI</div>\n          <div>\n            <div class=\"sb-uname\">Admin</div>\n            <div class=\"sb-urole\" id=\"sidebarLogout\" onclick=\"doLogout()\" style=\"cursor:pointer;color:rgba(255,100,100,.6)\">Cerrar sesi\u00f3n</div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"main\">\n      <div class=\"topbar\">\n        <div class=\"topbar-title\" id=\"pageTitle\">Dashboard</div>\n        <button class=\"btn btn-ghost btn-sm\" onclick=\"showPage('leads')\"><i class=\"ti ti-users\"></i> Leads <span id=\"topLeadsCount\" style=\"background:var(--green);color:#fff;font-size:10px;padding:1px 6px;border-radius:10px;margin-left:2px\">0</span></button>\n        <button class=\"btn btn-ghost btn-sm\" onclick=\"doLogout()\"><i class=\"ti ti-logout\"></i> Salir</button>\n        <button class=\"btn btn-primary btn-sm\" onclick=\"openModal(null)\"><i class=\"ti ti-plus\"></i> Nueva propiedad</button>\n      </div>\n      <div class=\"content\" id=\"mainContent\"></div>\n    </div>\n  </div>\n</div>\n\n<!-- MODAL PROPIEDAD -->\n<div class=\"modal-overlay\" id=\"modalOverlay\">\n  <div class=\"modal-panel\">\n    <div class=\"modal-topbar\">\n      <button class=\"btn btn-ghost btn-sm\" onclick=\"closeModal()\" style=\"color:#fff;border-color:rgba(255,255,255,.2)\"><i class=\"ti ti-x\"></i></button>\n      <div class=\"modal-topbar-title\" id=\"modalTitle\">Nueva propiedad</div>\n      <div class=\"modal-progress\" id=\"modalProgress\">0% completo</div>\n      <button class=\"btn btn-sm\" onclick=\"saveProp()\" style=\"background:var(--or);color:#fff;border:none\"><i class=\"ti ti-device-floppy\"></i> Guardar</button>\n    </div>\n    <div class=\"modal-body\">\n      <!-- TABS NAV -->\n      <div class=\"form-tabs-nav\">\n        <div class=\"ftab active\" onclick=\"switchTab('basico')\"><i class=\"ti ti-info-circle\"></i> B\u00e1sico <span class=\"ftab-dot\"></span></div>\n        <div class=\"ftab\" onclick=\"switchTab('detalles')\"><i class=\"ti ti-ruler\"></i> Detalles <span class=\"ftab-dot\"></span></div>\n        <div class=\"ftab\" onclick=\"switchTab('contenido')\"><i class=\"ti ti-file-text\"></i> Contenido <span class=\"ftab-dot\"></span></div>\n        <div class=\"ftab\" onclick=\"switchTab('caracteristicas')\"><i class=\"ti ti-tag\"></i> Amenidades <span class=\"ftab-dot\"></span></div>\n        <div class=\"ftab\" onclick=\"switchTab('publicacion')\"><i class=\"ti ti-send\"></i> Publicaci\u00f3n <span class=\"ftab-dot\"></span></div>\n      </div>\n\n      <!-- TABS BODY -->\n      <div class=\"form-tabs-body\">\n\n        <!-- TAB 1: B\u00c1SICO -->\n        <div class=\"ftab-panel active\" id=\"tab-basico\">\n          <div class=\"fsec\">\n            <div class=\"fsec-title\"><i class=\"ti ti-home\"></i> Informaci\u00f3n principal</div>\n            <div class=\"fg\"><label>T\u00edtulo de la propiedad *</label><input type=\"text\" id=\"fTitulo\" placeholder=\"Ej: Residencia en Kanajuy\u00fa \u00b7 Zona 16\" oninput=\"updateProgress()\"></div>\n            <div class=\"fg-row c2\">\n              <div class=\"fg\" style=\"flex:2\"><label>Precio <span style=\"font-size:.65rem;color:#94a3b8;font-weight:400\">(número sin símbolo)</span></label><input type=\"text\" id=\"fPrecio\" placeholder=\"Ej: 395000\" oninput=\"autoFormatPrice()\"></div>\n              <div class=\"fg\" style=\"flex:1;max-width:140px\"><label>Moneda</label><select id=\"fMoneda\" style=\"width:100%;padding:10px 12px;background:#1e2d4e;border:1px solid #2d4a7a;border-radius:6px;color:#e2e8f0;font-size:.82rem;font-family:inherit;cursor:pointer\"><option value=\"Q.\">Q. — Quetzal</option><option value=\"$\">$ — Dólar</option><option value=\"USD\">USD</option></select></div>\n              <div class=\"fg\"><label>C\u00f3digo interno</label><input type=\"text\" id=\"fCodigo\" placeholder=\"CV-001\"></div>\n            </div>\n            <div class=\"fg-row c3\">\n              <div class=\"fg\"><label>Tipo</label>\n                <select id=\"fTipo\" onchange=\"updateProgress()\">\n                  <option>Casa</option><option>Apartamento</option><option>Finca</option><option>Local</option><option>Terreno</option>\n                </select>\n              </div>\n              <div class=\"fg\"><label>Operaci\u00f3n</label>\n                <select id=\"fOperacion\"><option>Venta</option><option>Renta</option><option>Venta/Renta</option></select>\n              </div>\n              <div class=\"fg\"><label>Categor\u00eda</label>\n                <select id=\"fTipoListing\"><option>Residencial</option><option>Finca</option><option>Inversi\u00f3n</option><option>Comercial</option></select>\n              </div>\n            </div>\n          </div>\n          <div class=\"fsec\">\n            <div class=\"fsec-title\"><i class=\"ti ti-map-pin\"></i> Ubicaci\u00f3n</div>\n            <div class=\"fg-row c2\">\n              <div class=\"fg\"><label>Zona / Colonia</label><input type=\"text\" id=\"fZona\" placeholder=\"Ej: Kanajuy\u00fa, El Socorro, Hacienda Nueva\"></div>\n              <div class=\"fg\"><label>Municipio</label><input type=\"text\" id=\"fMunicipio\" placeholder=\"Ej: Guatemala, Fraijanes, Mixco\"></div>\n            </div>\n            <div class=\"fg-row c2\">\n              <div class=\"fg\"><label>Departamento</label>\n                <select id=\"fDepartamento\">\n                  <option value=\"\">-- Seleccionar --</option>\n                  <option>Guatemala</option><option>Sacatep\u00e9quez</option><option>Escuintla</option>\n                  <option>Chimaltenango</option><option>Baja Verapaz</option><option>Alta Verapaz</option>\n                  <option>El Progreso</option><option>Jalapa</option><option>Jutiapa</option>\n                </select>\n              </div>\n              <div class=\"fg\"><label>Ubicaci\u00f3n general (referencia)</label><input type=\"text\" id=\"fUbicacionGeneral\" placeholder=\"Fraijanes \u00b7 Km 16.5 \u00b7 Carr. a El Salvador\"></div>\n            </div>\n            <div class=\"fg-row c2\">\n              <div class=\"fg\"><label>Latitud</label><input type=\"text\" id=\"fLat\" placeholder=\"14.6349\"></div>\n              <div class=\"fg\"><label>Longitud</label><input type=\"text\" id=\"fLng\" placeholder=\"-90.5069\"></div>\n            </div>\n          </div>\n          <div class=\"fsec\">\n            <div class=\"fsec-title\"><i class=\"ti ti-user-check\"></i> Asesor</div>\n            <div class=\"fg-row c2\">\n              <div class=\"fg\"><label>Nombre del asesor</label><input type=\"text\" id=\"fAsesor\" placeholder=\"Ej: Juan P\u00e9rez\"></div>\n              <div class=\"fg\"><label>WhatsApp asesor (sin +502)</label><input type=\"text\" id=\"fWaAsesor\" placeholder=\"Ej: 45542088\"></div>\n            </div>\n          </div>\n        </div>\n\n        <!-- TAB 2: DETALLES -->\n        <div class=\"ftab-panel\" id=\"tab-detalles\">\n          <div class=\"fsec\">\n            <div class=\"fsec-title\"><i class=\"ti ti-ruler\"></i> Medidas y espacios</div>\n            <div class=\"fg-row c4\">\n              <div class=\"fg\"><label>\u00c1rea m\u00b2</label><input type=\"text\" id=\"fArea\" placeholder=\"350\"></div>\n              <div class=\"fg\"><label>\u00c1rea v\u00b2</label><input type=\"text\" id=\"fAreaV2\" placeholder=\"2048\"></div>\n              <div class=\"fg\"><label>Habitaciones</label><input type=\"number\" id=\"fHabitaciones\" placeholder=\"0\" min=\"0\"></div>\n              <div class=\"fg\"><label>Ba\u00f1os</label><input type=\"number\" id=\"fBanos\" placeholder=\"0\" min=\"0\"></div>\n            </div>\n            <div class=\"fg-row c4\">\n              <div class=\"fg\"><label>Medios ba\u00f1os</label><input type=\"number\" id=\"fMediosBanos\" placeholder=\"0\" min=\"0\"></div>\n              <div class=\"fg\"><label>Parqueos</label><input type=\"number\" id=\"fParqueos\" placeholder=\"0\" min=\"0\"></div>\n              <div class=\"fg\"><label>Niveles</label><input type=\"number\" id=\"fNiveles\" placeholder=\"1\" min=\"1\"></div>\n              <div class=\"fg\"><label>Terreno m\u00b2</label><input type=\"text\" id=\"fTerreno\" placeholder=\"500\"></div>\n            </div>\n            <div class=\"fg\"><label>Resumen t\u00e9cnico (para ficha)</label><input type=\"text\" id=\"fDatosTecnicos\" placeholder=\"Ej: 4 hab \u00b7 4.5 ba\u00f1os \u00b7 580 m\u00b2 construidos \u00b7 Terreno 2,400 m\u00b2\"></div>\n          </div>\n          <div class=\"fsec\">\n            <div class=\"fsec-title\"><i class=\"ti ti-tools\"></i> Construcci\u00f3n y acabados</div>\n            <div class=\"fg-row c3\">\n              <div class=\"fg\"><label>A\u00f1o construcci\u00f3n</label><input type=\"text\" id=\"fAnioConstruccion\" placeholder=\"2018\"></div>\n              <div class=\"fg\"><label>Estado</label>\n                <select id=\"fEstadoConstruccion\"><option value=\"\">-- Seleccionar --</option><option>Nueva</option><option>Usada</option><option>En construcci\u00f3n</option><option>En planos</option></select>\n              </div>\n              <div class=\"fg\"><label>Acabados</label>\n                <select id=\"fAcabados\"><option value=\"\">-- Seleccionar --</option><option>B\u00e1sico</option><option>Medio</option><option>Premium</option><option>Lujo</option></select>\n              </div>\n            </div>\n            <div class=\"fg-row c3\">\n              <div class=\"fg\"><label>Tipo construcci\u00f3n</label>\n                <select id=\"fTipoConstruccion\"><option value=\"\">-- Seleccionar --</option><option>Block / Concreto</option><option>Mixta</option><option>Madera</option><option>Adobe</option></select>\n              </div>\n              <div class=\"fg\"><label>Techo</label>\n                <select id=\"fTecho\"><option value=\"\">-- Seleccionar --</option><option>Losa</option><option>Terraza</option><option>Duralita</option><option>Teja</option><option>Mixto</option></select>\n              </div>\n              <div class=\"fg\"><label>Piso</label>\n                <select id=\"fPiso\"><option value=\"\">-- Seleccionar --</option><option>Granito</option><option>Porcelanato</option><option>Cer\u00e1mica</option><option>Madera</option><option>M\u00e1rmol</option><option>Cemento alisado</option></select>\n              </div>\n            </div>\n            <div class=\"fg-row c3\">\n              <div class=\"fg\"><label>Orientaci\u00f3n</label>\n                <select id=\"fOrientacion\"><option value=\"\">--</option><option>Norte</option><option>Sur</option><option>Este</option><option>Oeste</option><option>Noreste</option><option>Noroeste</option><option>Sureste</option><option>Suroeste</option></select>\n              </div>\n              <div class=\"fg\"><label>Antig\u00fcedad (a\u00f1os)</label><input type=\"number\" id=\"fAntiguedad\" placeholder=\"0\" min=\"0\"></div>\n              <div class=\"fg\"><label>Cuota mantenimiento</label><input type=\"text\" id=\"fCuotaMant\" placeholder=\"Ej: Q 800/mes\"></div>\n            </div>\n          </div>\n          <div class=\"fsec\">\n            <div class=\"fsec-title\"><i class=\"ti ti-building-skyscraper\"></i> Apartamento</div>\n            <div class=\"fg-row c3\">\n              <div class=\"fg\"><label>N\u00famero de piso</label><input type=\"number\" id=\"fNumeroPiso\" placeholder=\"0\" min=\"0\"></div>\n              <div class=\"fg\"><label>\u00c1rea balc\u00f3n m\u00b2</label><input type=\"text\" id=\"fAreaBalcon\" placeholder=\"0\"></div>\n              <div class=\"fg\"><label>Vista</label>\n                <select id=\"fVista\"><option value=\"\">--</option><option>Interior</option><option>Exterior</option><option>Ciudad</option><option>Jard\u00edn</option><option>Monta\u00f1a</option><option>Valle</option></select>\n              </div>\n            </div>\n          </div>\n          <div class=\"fsec\">\n            <div class=\"fsec-title\"><i class=\"ti ti-plant\"></i> Finca</div>\n            <div class=\"fg-row c3\">\n              <div class=\"fg\"><label>Extensi\u00f3n (manzanas)</label><input type=\"text\" id=\"fManzanas\" placeholder=\"0\"></div>\n              <div class=\"fg\"><label>Tipo de cultivo</label><input type=\"text\" id=\"fCultivo\" placeholder=\"Ej: Aguacate, Caf\u00e9, Sin cultivo\"></div>\n              <div class=\"fg\"><label>Tiempo a carretera</label><input type=\"text\" id=\"fTiempoCarretera\" placeholder=\"Ej: 5 min\"></div>\n            </div>\n            <div class=\"fg\"><label>T\u00edtulo / Escritura</label>\n              <select id=\"fTituloFinca\"><option value=\"\">-- Seleccionar --</option><option>Finca inscrita en Registro</option><option>T\u00edtulo supletorio</option><option>En tr\u00e1mite</option><option>Escritura p\u00fablica</option></select>\n            </div>\n          </div>\n          <div class=\"fsec\">\n            <div class=\"fsec-title\"><i class=\"ti ti-home-dollar\"></i> Renta</div>\n            <div class=\"fg-row c3\">\n              <div class=\"fg\"><label>Precio renta mensual</label><input type=\"text\" id=\"fPrecioRenta\" placeholder=\"Ej: $1,200/mes\"></div>\n              <div class=\"fg\"><label>Banco financiamiento</label><input type=\"text\" id=\"fBancoFin\" placeholder=\"Ej: Banrural, G&T\"></div>\n              <div class=\"fg\"><label>Disponible desde</label><input type=\"text\" id=\"fDisponibleDesde\" placeholder=\"Ej: Julio 2026\"></div>\n            </div>\n          </div>\n        </div>\n\n        <!-- TAB 3: CONTENIDO -->\n        <div class=\"ftab-panel\" id=\"tab-contenido\">\n          <div class=\"fsec\">\n            <div class=\"fsec-title\"><i class=\"ti ti-file-text\"></i> Textos premium</div>\n            <div class=\"fg\">\n              <label>Descripci\u00f3n completa</label>\n              <textarea id=\"fDescripcion\" style=\"min-height:100px\" placeholder=\"Descripci\u00f3n detallada y premium para el sitio web. Describe el entorno, los acabados, el estilo de vida que ofrece...\" oninput=\"updateProgress()\"></textarea>\n            </div>\n            <div class=\"fg\">\n              <label>Hook para redes sociales</label>\n              <input type=\"text\" id=\"fHook\" placeholder=\"Ej: Hay casas. Y luego est\u00e1 esta.\">\n              <div class=\"fg-hint\">Frase corta y poderosa para Instagram y Facebook. M\u00e1x. 80 caracteres.</div>\n            </div>\n            <div class=\"fg\">\n              <label>Descripci\u00f3n corta (para preview)</label>\n              <textarea id=\"fDescCorta\" style=\"min-height:56px\" placeholder=\"2-3 l\u00edneas elegantes que resumen lo esencial de la propiedad...\"></textarea>\n            </div>\n          </div>\n          <div class=\"fsec\">\n            <div class=\"fsec-title\"><i class=\"ti ti-search\"></i> SEO y multimedia</div>\n            <div class=\"fg\"><label>Tags SEO (separados por coma)</label><input type=\"text\" id=\"fTagsSeo\" placeholder=\"Ej: casa zona 10, residencia exclusiva guatemala, propiedad premium\"></div>\n            <div class=\"fg\"><label>Video tour (YouTube / Vimeo URL)</label><input type=\"url\" id=\"fVideoUrl\" placeholder=\"https://youtube.com/watch?v=...\"></div>\n            <div class=\"fg\"><label>Plano de planta (URL imagen)</label><input type=\"url\" id=\"fPlano\" placeholder=\"https://ik.imagekit.io/Zona/planos/...\"></div>\n            <div class=\"fg\"><label>Certificado energ\u00e9tico</label>\n              <select id=\"fCertEnerg\"><option value=\"\">Sin certificado</option><option>A+</option><option>A</option><option>B</option><option>C</option><option>D</option></select>\n            </div>\n            <div class=\"fg\">\n              <label>Slug URL</label>\n              <input type=\"text\" id=\"fSlug\" placeholder=\"casa-zona-10-kanajuyu\">\n              <div class=\"fg-auto\" onclick=\"autoSlug()\">\ud83d\udd04 Generar desde t\u00edtulo</div>\n            </div>\n            <div class=\"fg\"><label>Fecha de publicaci\u00f3n</label><input type=\"date\" id=\"fFechaPublicacion\"></div>\n          </div>\n          <div class=\"share-box\">\n            <div class=\"share-box-title\"><i class=\"ti ti-share\"></i> Ficha compartible (WhatsApp / Redes)</div>\n            <div class=\"fg\"><label>URL del PDF (Google Drive)</label><input type=\"url\" id=\"fPdfUrl\" placeholder=\"https://drive.google.com/...\"></div>\n          </div>\n          <div class=\"priv-box\" style=\"margin-top:14px\">\n            <div class=\"priv-box-title\"><i class=\"ti ti-lock\"></i> Informaci\u00f3n privada (solo admin)</div>\n            <div class=\"fg\"><label>Precio real / margen negociaci\u00f3n</label><input type=\"text\" id=\"fPrecioReal\" placeholder=\"Ej: Vendedor acepta m\u00ednimo Q 2,200,000\"></div>\n            <div class=\"fg\"><label>Contacto del vendedor</label><input type=\"text\" id=\"fContactoVendedor\" placeholder=\"Ej: Juan P\u00e9rez \u00b7 +502 5555-1234\"></div>\n            <div class=\"fg\"><label>Notas internas</label><textarea id=\"fNotasInternas\" style=\"min-height:56px\" placeholder=\"Motivaci\u00f3n de venta, situaci\u00f3n especial, observaciones...\"></textarea></div>\n            <div class=\"fg\"><label>Estado legal</label><input type=\"text\" id=\"fEstadoLegal\" placeholder=\"Ej: Sin grav\u00e1menes, IUSI al d\u00eda, escritura en tr\u00e1mite\"></div>\n          </div>\n        </div>\n\n        <!-- TAB 4: CARACTER\u00cdSTICAS -->\n        <div class=\"ftab-panel\" id=\"tab-caracteristicas\">\n          <div class=\"chars-group\">\n            <div class=\"chars-group-title\"><i class=\"ti ti-map-pin\"></i> Ubicaci\u00f3n</div>\n            <div class=\"chars-grid\">\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Ubicaci\u00f3n privilegiada\"> Ubicaci\u00f3n privilegiada</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Sobre carretera principal\"> Sobre carretera principal</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Entorno natural y vistas\"> Entorno natural y vistas</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Cerca de servicios\"> Cerca de servicios</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Zona residencial exclusiva\"> Zona residencial exclusiva</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Acceso pavimentado\"> Acceso pavimentado</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Vista al valle\"> Vista al valle</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Vista a monta\u00f1as\"> Vista a monta\u00f1as</label>\n            </div>\n          </div>\n          <div class=\"chars-group\">\n            <div class=\"chars-group-title\"><i class=\"ti ti-shield\"></i> Seguridad</div>\n            <div class=\"chars-grid\">\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Garita 24/7\"> Garita 24/7</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Condominio cerrado\"> Condominio cerrado</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"C\u00e1maras de seguridad\"> C\u00e1maras de seguridad</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Sistema de alarma\"> Sistema de alarma</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Muros perimetrales\"> Muros perimetrales</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Port\u00f3n el\u00e9ctrico\"> Port\u00f3n el\u00e9ctrico</label>\n            </div>\n          </div>\n          <div class=\"chars-group\">\n            <div class=\"chars-group-title\"><i class=\"ti ti-droplet\"></i> Servicios b\u00e1sicos</div>\n            <div class=\"chars-grid\">\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Agua municipal\"> Agua municipal</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Pozo propio\"> Pozo propio</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Cisterna\"> Cisterna</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Luz 110v/220v\"> Luz 110v/220v</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Panel solar\"> Panel solar</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Internet fibra disponible\"> Internet fibra</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Gas propano\"> Gas propano</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Drenaje municipal\"> Drenaje municipal</label>\n            </div>\n          </div>\n          <div class=\"chars-group\">\n            <div class=\"chars-group-title\"><i class=\"ti ti-tree\"></i> Exteriores</div>\n            <div class=\"chars-grid\">\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Piscina\"> Piscina</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Jard\u00edn amplio\"> Jard\u00edn amplio</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"\u00c1rea de BBQ\"> \u00c1rea de BBQ</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"P\u00e9rgola\"> P\u00e9rgola</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Terraza exterior\"> Terraza exterior</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Cancha deportiva\"> Cancha deportiva</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Juegos infantiles\"> Juegos infantiles</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Huerto / \u00e1rea de siembra\"> Huerto / siembra</label>\n            </div>\n          </div>\n          <div class=\"chars-group\">\n            <div class=\"chars-group-title\"><i class=\"ti ti-sofa\"></i> Interiores</div>\n            <div class=\"chars-grid\">\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Cocina equipada\"> Cocina equipada</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Isla de cocina\"> Isla de cocina</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Walk-in closet\"> Walk-in closet</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Cuarto de servicio con ba\u00f1o\"> Cuarto de servicio</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Bodega\"> Bodega</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Chimenea\"> Chimenea</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Jacuzzi\"> Jacuzzi</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Estudio / Oficina\"> Estudio / Oficina</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Sala familiar\"> Sala familiar</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Sala de cine\"> Sala de cine</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Lavander\u00eda interna\"> Lavander\u00eda interna</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Bar interior\"> Bar interior</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Cocina abierta\"> Cocina abierta</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Aire acondicionado\"> Aire acondicionado</label>\n            </div>\n          </div>\n          <div class=\"chars-group\">\n            <div class=\"chars-group-title\"><i class=\"ti ti-plant\"></i> Para fincas</div>\n            <div class=\"chars-grid\">\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Agua de nacimiento\"> Agua de nacimiento</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"R\u00edo o quebrada\"> R\u00edo o quebrada</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Luz trif\u00e1sica\"> Luz trif\u00e1sica</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Casa del guardi\u00e1n\"> Casa del guardi\u00e1n</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Corrales\"> Corrales</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Cultivo activo\"> Cultivo activo</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Finca inscrita en Registro\"> Finca inscrita</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Caminos internos\"> Caminos internos</label>\n            </div>\n          </div>\n          <div class=\"chars-group\">\n            <div class=\"chars-group-title\"><i class=\"ti ti-trending-up\"></i> Inversi\u00f3n</div>\n            <div class=\"chars-grid\">\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Alta plusval\u00eda\"> Alta plusval\u00eda</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Zona en crecimiento\"> Zona en crecimiento</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Papeler\u00eda en orden\"> Papeler\u00eda en orden</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Sin grav\u00e1menes\"> Sin grav\u00e1menes</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Financiamiento disponible\"> Financiamiento disponible</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Negociable\"> Negociable</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Potencial de desarrollo\"> Potencial de desarrollo</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Apta para alquiler\"> Apta para alquiler</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Acepta permuta\"> Acepta permuta</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Disponibilidad inmediata\"> Disponibilidad inmediata</label>\n            </div>\n          </div>\n          <div class=\"chars-group\">\n            <div class=\"chars-group-title\"><i class=\"ti ti-car\"></i> Veh\u00edculos</div>\n            <div class=\"chars-grid\">\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Garaje cerrado\"> Garaje cerrado</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Parqueo techado\"> Parqueo techado</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Parqueo descubierto\"> Parqueo descubierto</label>\n              <label class=\"char-item\"><input type=\"checkbox\" value=\"Acceso para cami\u00f3n\"> Acceso para cami\u00f3n</label>\n            </div>\n          </div>\n        </div>\n\n        <!-- TAB 5: PUBLICACI\u00d3N -->\n        <div class=\"ftab-panel\" id=\"tab-publicacion\">\n          <div class=\"fsec\">\n            <div class=\"fsec-title\"><i class=\"ti ti-eye-off\"></i> Control de visibilidad p\u00fablica</div>\n            <p style=\"font-size:12px;color:var(--text3);margin-bottom:14px\">Selecciona qu\u00e9 informaci\u00f3n se oculta en el sitio p\u00fablico. \u00datil para propiedades exclusivas o en negociaci\u00f3n.</p>\n            <div class=\"priv-toggle\" onclick=\"togglePriv('privPrecio')\">\n              <label><strong>Ocultar precio</strong><small>Muestra \"A consultar\" en vez del precio</small></label>\n              <label class=\"toggle-switch\"><input type=\"checkbox\" id=\"privPrecio\"><span class=\"toggle-slider\"></span></label>\n            </div>\n            <div class=\"priv-toggle\" onclick=\"togglePriv('privDireccion')\">\n              <label><strong>Ocultar direcci\u00f3n exacta</strong><small>Solo muestra zona/municipio general</small></label>\n              <label class=\"toggle-switch\"><input type=\"checkbox\" id=\"privDireccion\"><span class=\"toggle-slider\"></span></label>\n            </div>\n            <div class=\"priv-toggle\" onclick=\"togglePriv('privGaleria')\">\n              <label><strong>Ocultar galer\u00eda</strong><small>Solo muestra la imagen principal</small></label>\n              <label class=\"toggle-switch\"><input type=\"checkbox\" id=\"privGaleria\"><span class=\"toggle-slider\"></span></label>\n            </div>\n            <div class=\"priv-toggle\" onclick=\"togglePriv('privDatos')\">\n              <label><strong>Ocultar datos t\u00e9cnicos</strong><small>\u00c1rea, habitaciones y ba\u00f1os no visibles</small></label>\n              <label class=\"toggle-switch\"><input type=\"checkbox\" id=\"privDatos\"><span class=\"toggle-slider\"></span></label>\n            </div>\n            <div class=\"priv-toggle\" onclick=\"togglePriv('privDesc')\">\n              <label><strong>Ocultar descripci\u00f3n</strong><small>Solo muestra el hook de redes</small></label>\n              <label class=\"toggle-switch\"><input type=\"checkbox\" id=\"privDesc\"><span class=\"toggle-slider\"></span></label>\n            </div>\n            <div class=\"priv-toggle\" onclick=\"togglePriv('privExclusiva')\">\n              <label><strong style=\"color:var(--or)\">\ud83c\udff7\ufe0f Listado EXCLUSIVO</strong><small>Muestra mensaje de propiedad exclusiva y oculta todo excepto imagen y t\u00edtulo</small></label>\n              <label class=\"toggle-switch\"><input type=\"checkbox\" id=\"privExclusiva\"><span class=\"toggle-slider\"></span></label>\n            </div>\n          </div>\n          <div class=\"fsec\">\n            <div class=\"fsec-title\"><i class=\"ti ti-world\"></i> Publicar en</div>\n            <label class=\"sitio-row\"><input type=\"checkbox\" id=\"sZona\" checked><div><div class=\"sitio-label\">Zona INNmueble</div><div class=\"sitio-url\">zona-innmueble.com</div></div></label>\n            <label class=\"sitio-row\"><input type=\"checkbox\" id=\"sInmu\"><div><div class=\"sitio-label\">InmuHub</div><div class=\"sitio-url\">inmuhub.com</div></div></label>\n          </div>\n          <div class=\"fsec\">\n            <div class=\"fsec-title\"><i class=\"ti ti-eye\"></i> Contadores</div>\n            <div class=\"fg-row c2\">\n              <div class=\"fg\"><label>Vistas</label><input type=\"number\" id=\"fVistas\" placeholder=\"0\" min=\"0\"></div>\n              <div class=\"fg\"><label>Favoritos</label><input type=\"number\" id=\"fFavoritos\" placeholder=\"0\" min=\"0\"></div>\n            </div>\n          </div>\n        </div>\n\n      </div><!-- /form-tabs-body -->\n\n      <!-- SIDEBAR DERECHO -->\n      <div class=\"form-right\">\n        <div class=\"side-card\">\n          <div class=\"side-card-title\"><i class=\"ti ti-photo\"></i> Imagen principal</div>\n          <div class=\"fg\"><input type=\"url\" id=\"fImagen\" placeholder=\"https://ik.imagekit.io/Zona/...\" oninput=\"previewImg(); updateProgress()\"></div>\n          <img id=\"imgPreview\" class=\"img-preview\">\n        </div>\n        <div class=\"side-card\">\n          <div class=\"side-card-title\"><i class=\"ti ti-photos\"></i> Galer\u00eda (<span id=\"galCount\">0</span> fotos)</div>\n          <div class=\"gal-wrap\" id=\"galWrap\"></div>\n          <button type=\"button\" class=\"add-gal-btn\" onclick=\"addGalImgBulk()\">+ Agregar fotos (URL por URL)</button>\n        </div>\n        <div class=\"side-card\">\n          <div class=\"side-card-title\"><i class=\"ti ti-toggle-right\"></i> Estado</div>\n          <div class=\"status-pills\" id=\"statusPills\">\n            <div class=\"pill active\" onclick=\"setStatus('Activa')\">Activa</div>\n            <div class=\"pill\" onclick=\"setStatus('Vendida')\">Vendida</div>\n            <div class=\"pill\" onclick=\"setStatus('Pausada')\">Pausada</div>\n          </div>\n          <input type=\"hidden\" id=\"fEstado\" value=\"Activa\">\n        </div>\n        <div class=\"side-card\" style=\"background:#FFF8F2;border-color:rgba(245,130,13,.3)\">\n          <div class=\"side-card-title\"><i class=\"ti ti-share\"></i> Compartir propiedad</div>\n          <button type=\"button\" onclick=\"shareWA()\" class=\"btn btn-green btn-sm\" style=\"width:100%;justify-content:center;margin-bottom:6px\"><i class=\"ti ti-brand-whatsapp\"></i> Enviar por WhatsApp</button>\n          <button type=\"button\" onclick=\"copyLink()\" class=\"btn btn-ghost btn-sm\" style=\"width:100%;justify-content:center\"><i class=\"ti ti-link\"></i> Copiar enlace</button>\n        </div>\n      </div>\n    </div>\n    <div class=\"modal-footer\">\n      <div class=\"modal-footer-left\">\n        <button class=\"btn btn-ghost btn-sm\" onclick=\"closeModal()\"><i class=\"ti ti-x\"></i> Cancelar</button>\n        <button class=\"btn btn-ghost btn-sm\" onclick=\"duplicateProp()\" id=\"btnDuplicate\" style=\"display:none\"><i class=\"ti ti-copy\"></i> Duplicar</button>\n      </div>\n      <div class=\"modal-footer-right\">\n        <div id=\"progressLabel\" style=\"font-size:12px;color:var(--text3);align-self:center\">0% completo</div>\n        <button class=\"btn btn-navy btn-sm\" onclick=\"saveProp()\"><i class=\"ti ti-device-floppy\"></i> Guardar propiedad</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div class=\"toast\" id=\"toast\"></div>\n\n<script>\nconst API = 'https://zona-inmu.tours-virtuales-gt.workers.dev';\nlet props = [];\nlet editingId = null;\nlet galUrls = [];\nlet currentStatus = 'Activa';\nlet leadsData = [];\nlet leadStatuses = {};\n  try { leadStatuses = JSON.parse(localStorage.getItem('zin_ls') || '{}'); } catch(e) {}\n\n// \u2500\u2500 AUTH \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nasync function doLogin() {\n  const user = document.getElementById('loginUser').value.trim();\n  const pass = document.getElementById('loginPass').value.trim();\n  const btn  = document.getElementById('loginBtn');\n  const err  = document.getElementById('loginErr');\n  if (!user || !pass) return;\n  btn.disabled = true; btn.textContent = 'Ingresando...'; err.style.display = 'none';\n  try {\n    const r = await fetch(API + '/api/login', {method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({user,pass})});\n    if (r.ok) {\n      document.getElementById('loginPage').style.display = 'none';\n      document.getElementById('adminApp').style.display = 'block';\n      await loadProps();\n      showPage('dashboard');\n    } else { err.style.display = 'block'; }\n  } catch(e) { err.textContent = 'Error de conexi\u00f3n.'; err.style.display = 'block'; }\n  btn.disabled = false; btn.textContent = 'Ingresar';\n}\n\nasync function doLogout() {\n  await fetch(API + '/api/logout', {method:'POST',credentials:'include'}).catch(()=>{});\n  document.getElementById('adminApp').style.display = 'none';\n  document.getElementById('loginPage').style.display = 'flex';\n}\n\nasync function checkSession() {\n  try {\n    const r = await fetch(API + '/api/me', {credentials:'include'});\n    if (r.ok) {\n      document.getElementById('loginPage').style.display = 'none';\n      document.getElementById('adminApp').style.display = 'block';\n      await loadProps();\n      showPage('dashboard');\n    }\n  } catch(e) {}\n}\n\n// \u2500\u2500 PROPS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nasync function loadProps() {\n  try {\n    const r = await fetch(API + '/api/propiedades', {credentials:'include'});\n    if (r.ok) props = await r.json();\n  } catch(e) { console.error('loadProps:', e); }\n}\n\n// \u2500\u2500 NAVIGATION \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nfunction showPage(page) {\n  document.querySelectorAll('.sb-item').forEach(n => n.classList.remove('active'));\n  const nav = document.getElementById('nav-' + page);\n  if (nav) nav.classList.add('active');\n  const titles = {dashboard:'Dashboard', propiedades:'Propiedades', leads:'Leads CRM', pipeline:'Pipeline CRM'};\n  document.getElementById('pageTitle').textContent = titles[page] || page;\n  const mc = document.getElementById('mainContent');\n  if (page === 'dashboard')   renderDashboard(mc);\n  if (page === 'propiedades') renderPropiedades(mc);\n  if (page === 'leads')       renderLeads(mc);\n  if (page === 'pipeline')    renderPipeline(mc);\n}\n\n// \u2500\u2500 DASHBOARD \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nfunction renderDashboard(mc) {\n  const activas  = props.filter(p => !p.estado || p.estado === 'Activa').length;\n  const vendidas = props.filter(p => p.estado === 'Vendida').length;\n  const pausadas = props.filter(p => p.estado === 'Pausada').length;\n  const casas    = props.filter(p => p.tipo === 'Casa').length;\n  const fincas   = props.filter(p => p.tipo === 'Finca').length;\n  const apts     = props.filter(p => p.tipo === 'Apartamento').length;\n\n  mc.innerHTML = `\n    <div class=\"rebuild-banner\">\n      <div class=\"rebuild-text\"><strong>\u00bfActualizaste propiedades?</strong>Los cambios se reflejan en el sitio despu\u00e9s de publicar.</div>\n      <button class=\"btn btn-sm\" style=\"background:var(--or);color:#fff;border:none;white-space:nowrap\" onclick=\"triggerRebuild()\"><i class=\"ti ti-refresh\"></i> Publicar ahora</button>\n    </div>\n    <div class=\"stats-grid\">\n      <div class=\"stat-card green\"><div class=\"stat-label\">Activas</div><div class=\"stat-val\">${activas}</div><div class=\"stat-sub\">De ${props.length} total</div><i class=\"ti ti-check stat-icon\"></i></div>\n      <div class=\"stat-card red\"><div class=\"stat-label\">Vendidas</div><div class=\"stat-val\">${vendidas}</div><div class=\"stat-sub\">Cerradas</div><i class=\"ti ti-trophy stat-icon\"></i></div>\n      <div class=\"stat-card yellow\"><div class=\"stat-label\">Pausadas</div><div class=\"stat-val\">${pausadas}</div><div class=\"stat-sub\">En revisi\u00f3n</div><i class=\"ti ti-pause stat-icon\"></i></div>\n      <div class=\"stat-card blue\"><div class=\"stat-label\">Leads</div><div class=\"stat-val\" id=\"dashLeadsNum\">\u2014</div><div class=\"stat-sub\">Total registrados</div><i class=\"ti ti-users stat-icon\"></i></div>\n    </div>\n    <div class=\"table-wrap\" style=\"margin-bottom:14px\">\n      <div class=\"table-header\"><div class=\"table-title\">Pipeline de Leads</div><button class=\"btn btn-primary btn-sm\" onclick=\"showPage('pipeline')\"><i class=\"ti ti-layout-kanban\"></i> Ver Pipeline</button></div>\n      <div id=\"dashPipelineStats\" style=\"padding:14px 20px\">\n        <div class=\"pipeline-mini\" id=\"dashPipelineMini\"></div>\n      </div>\n    </div>\n    <div class=\"table-wrap\" style=\"margin-bottom:14px\">\n      <div class=\"table-header\"><div class=\"table-title\">Leads \u00faltimos 7 d\u00edas</div></div>\n      <div id=\"dashLeadsChart\" style=\"padding:14px 20px\"><div class=\"dash-chart-bars\" id=\"dashChartBars\"></div></div>\n    </div>\n    <div class=\"dash-grid\">\n      <div class=\"table-wrap\">\n        <div class=\"table-header\">\n          <div class=\"table-title\">Propiedades recientes</div>\n          <button class=\"btn btn-primary btn-sm\" onclick=\"openModal(null)\"><i class=\"ti ti-plus\"></i> Nueva</button>\n        </div>\n        ${buildTable(props.slice(0, 8))}\n      </div>\n      <div>\n        <div class=\"table-wrap\" style=\"margin-bottom:14px\">\n          <div class=\"table-header\"><div class=\"table-title\">Por tipo</div></div>\n          <div style=\"padding:14px 20px\">\n            ${[['Casa',casas,'#F5820D'],['Finca',fincas,'#22c55e'],['Apartamento',apts,'#3b82f6'],['Otros',props.length-casas-fincas-apts,'#8A9BB0']].map(([tipo,n,color])=>`\n            <div style=\"display:flex;align-items:center;gap:10px;margin-bottom:10px\">\n              <div style=\"font-size:12px;color:var(--text2);width:90px\">${tipo}</div>\n              <div style=\"flex:1;height:8px;background:var(--border);border-radius:4px\">\n                <div style=\"height:100%;border-radius:4px;background:${color};width:${props.length?Math.round(n/props.length*100):0}%;transition:width .5s\"></div>\n              </div>\n              <div style=\"font-size:12px;font-weight:700;color:var(--navy);width:24px;text-align:right\">${n}</div>\n            </div>`).join('')}\n          </div>\n        </div>\n        <div class=\"table-wrap\" id=\"dashLeadsWrap\">\n          <div class=\"table-header\"><div class=\"table-title\">\u00daltimos leads</div><button class=\"btn btn-ghost btn-sm\" onclick=\"showPage('leads')\">Ver todos</button></div>\n          <div style=\"padding:20px;text-align:center;color:var(--text3);font-size:12px\">Cargando...</div>\n        </div>\n      </div>\n    </div>`;\n  \n  fetch(API + '/api/leads', {credentials:'include'})\n    .then(r => r.json()).then(leads => {\n      leadsData = leads;\n      const n = leads.length;\n      document.querySelectorAll('#dashLeadsNum,#topLeadsCount').forEach(el => { if(el) el.textContent = n; });\n      document.querySelectorAll('#leadsCount,#topLeadsCount').forEach(el => { if(el) el.textContent = n; });\n      const wrap = document.getElementById('dashLeadsWrap');\n      if (!wrap) return;\n      if (!leads.length) { wrap.innerHTML += '<div style=\"padding:20px;text-align:center;color:var(--text3);font-size:12px\">Sin leads a\u00fan</div>'; return; }\n      wrap.querySelector('div:last-child').innerHTML = leads.slice(0,4).map(l => `\n        <div style=\"padding:10px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:8px\">\n          <div>\n            <div style=\"font-size:12px;font-weight:700;color:var(--navy)\">${esc(l.nombre||'Sin nombre')}</div>\n            <div style=\"font-size:11px;color:var(--text3)\">${esc(l.propiedad||'-')} \u00b7 ${l.fecha?l.fecha.substring(0,10):'-'}</div>\n          </div>\n          ${l.telefono?`<a href=\"https://wa.me/502${l.telefono.replace(/\\D/g,'')}\" target=\"_blank\" class=\"wa-btn\" style=\"padding:4px 10px;font-size:11px\"><i class=\"ti ti-brand-whatsapp\"></i></a>`:''}\n        </div>`).join('');\n      var miniEl = document.getElementById('dashPipelineMini');\n      if (miniEl) {\n        var stageColors = {Nuevo:'#3b82f6',Contactado:'#eab308',Interesado:'#f97316',Visita:'#8b5cf6',Cierre:'#22c55e',Perdido:'#6b7280'};\n        var stageCounts = {};\n        pipelineStages.forEach(function(s){ stageCounts[s] = 0; });\n        leads.forEach(function(l){ var s = l.stage || leadStatuses[l.id||l.fecha] || 'Nuevo'; stageCounts[s] = (stageCounts[s]||0) + 1; });\n        miniEl.innerHTML = pipelineStages.map(function(s){\n          return '<div class=\"pipeline-mini-col\"><div class=\"pm-count\" style=\"color:' + stageColors[s] + '\">' + (stageCounts[s]||0) + '</div><div class=\"pm-label\">' + s + '</div></div>';\n        }).join('');\n      }\n      var chartEl = document.getElementById('dashChartBars');\n      if (chartEl) {\n        var today = new Date();\n        var days = [];\n        var dayCounts = [];\n        for (var d = 6; d >= 0; d--) {\n          var dt = new Date(today); dt.setDate(dt.getDate() - d);\n          var key = dt.toISOString().substring(0,10);\n          days.push(dt.toLocaleDateString('es',{weekday:'short'}).substring(0,3));\n          var count = 0;\n          leads.forEach(function(l){ if(l.fecha && l.fecha.substring(0,10) === key) count++; });\n          dayCounts.push(count);\n        }\n        var maxC = Math.max.apply(null, dayCounts) || 1;\n        chartEl.innerHTML = days.map(function(day, i){\n          var h = Math.round((dayCounts[i]/maxC)*60);\n          return '<div class=\"bar-wrap\"><div class=\"bar\" style=\"height:' + h + 'px\"></div><div class=\"bar-label\">' + day + '</div></div>';\n        }).join('');\n      }\n    }).catch(() => {});\n}\n\n// \u2500\u2500 PROPIEDADES PAGE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nfunction renderPropiedades(mc) {\n  mc.innerHTML = `\n    <div class=\"table-wrap\">\n      <div class=\"table-header\">\n        <div class=\"search-box\"><i class=\"ti ti-search\"></i><input type=\"text\" id=\"searchInput\" placeholder=\"Buscar propiedad...\" oninput=\"filterTable()\"></div>\n        <div style=\"display:flex;gap:8px\">\n          <select id=\"filterStatus\" onchange=\"filterTable()\" style=\"padding:6px 10px;border:1px solid var(--border2);border-radius:7px;font-size:12px;outline:none\">\n            <option value=\"\">Todos los estados</option>\n            <option value=\"Activa\">Activas</option>\n            <option value=\"Vendida\">Vendidas</option>\n            <option value=\"Pausada\">Pausadas</option>\n          </select>\n          <button class=\"btn btn-primary btn-sm\" onclick=\"openModal(null)\"><i class=\"ti ti-plus\"></i> Nueva</button>\n        </div>\n      </div>\n      <div id=\"tableBody\">${buildTable(props)}</div>\n    </div>`;\n}\n\nfunction filterTable() {\n  const q  = (document.getElementById('searchInput')?.value || '').toLowerCase();\n  const st = document.getElementById('filterStatus')?.value || '';\n  let filtered = props;\n  if (q) filtered = filtered.filter(p => (p.titulo||'').toLowerCase().includes(q) || (p.municipio||p.zona||'').toLowerCase().includes(q) || (p.tipo||'').toLowerCase().includes(q));\n  if (st) filtered = filtered.filter(p => (p.estado||'Activa') === st);\n  const tb = document.getElementById('tableBody');\n  if (tb) tb.innerHTML = buildTable(filtered);\n}\n\nfunction buildTable(data) {\n  if (!data || !data.length) return '<div style=\"padding:40px;text-align:center;color:var(--text3);font-size:13px\">Sin propiedades</div>';\n  let rows = '';\n  data.forEach((p, i) => {\n    const id  = encodeURIComponent(p.id || p.slug || i);\n    const est = p.estado || 'Activa';\n    const bc  = est==='Vendida'?'badge-red':est==='Pausada'?'badge-gray':'badge-green';\n    const img = p.imagen ? `<img class=\"prop-img\" src=\"${p.imagen}\" onerror=\"this.style.opacity='.3'\">` : `<div class=\"prop-img\"></div>`;\n    const comp = calcCompletion(p);\n    const compColor = comp>=80?'#22c55e':comp>=50?'#f59e0b':'#ef4444';\n    rows += `<tr>\n      <td style=\"white-space:nowrap\">${img}</td>\n      <td>\n        <div class=\"prop-name\" title=\"${esc(p.titulo||'')}\">${esc(p.titulo||'')}</div>\n        <div class=\"prop-loc\">${esc(p.municipio||p.zona||'')} \u00b7 ${esc(p.tipo||'')}</div>\n        <div class=\"completion-bar\"><div class=\"completion-fill\" style=\"width:${comp}%;background:${compColor}\"></div></div>\n      </td>\n      <td class=\"price-cell\">${esc(p.priceFormatted||p.precio||'\u2014')}</td>\n      <td><span class=\"badge ${bc}\">${esc(est)}</span></td>\n      <td style=\"font-size:11px;color:var(--text3)\">${comp}%</td>\n      <td><div class=\"actions-cell\">\n        <div class=\"icon-btn\" title=\"Editar\" onclick=\"openModal('${id}')\"><i class=\"ti ti-edit\"></i></div>\n        <div class=\"icon-btn success\" title=\"Ver en sitio\" onclick=\"window.open('https://zona-innmueble.com/propiedades/${p.slug||p.id}.html','_blank')\"><i class=\"ti ti-external-link\"></i></div>\n        <div class=\"icon-btn danger\" title=\"Eliminar\" onclick=\"deleteProp('${id}','${esc(p.titulo||'')}')\"><i class=\"ti ti-trash\"></i></div>\n      </div></td>\n    </tr>`;\n  });\n  return `<table>\n    <thead><tr><th></th><th>Propiedad</th><th>Precio</th><th>Estado</th><th>Completud</th><th>Acciones</th></tr></thead>\n    <tbody>${rows}</tbody>\n  </table>`;\n}\n\nfunction calcCompletion(p) {\n  const checks = [\n    p.titulo, p.precio, p.tipo, p.municipio||p.zona,\n    p.descripcion, p.imagen, (p.gallery&&p.gallery.length>1),\n    p.habitaciones||p.manzanas, p.banos, p.area||p.areaConst,\n    p.caracteristicas&&p.caracteristicas.length\n  ];\n  const done = checks.filter(Boolean).length;\n  return Math.round(done / checks.length * 100);\n}\n\n// \u2500\u2500 LEADS CRM \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nlet currentLeadFilter = 'all';\n\nasync function renderLeads(mc) {\n  mc.innerHTML = '<div style=\"padding:40px;text-align:center;color:var(--text3)\">Cargando leads...</div>';\n  try {\n    const r = await fetch(API + '/api/leads', {credentials:'include'});\n    leadsData = await r.json();\n    document.querySelectorAll('#leadsCount,#topLeadsCount').forEach(el => { if(el) el.textContent = leadsData.length; });\n    \n    if (!leadsData.length) {\n      mc.innerHTML = `<div style=\"padding:60px;text-align:center\">\n        <i class=\"ti ti-users\" style=\"font-size:48px;color:var(--border);display:block;margin-bottom:12px\"></i>\n        <div style=\"font-size:14px;font-weight:700;color:var(--navy);margin-bottom:4px\">Sin leads a\u00fan</div>\n        <div style=\"font-size:12px;color:var(--text3)\">Los leads aparecer\u00e1n aqu\u00ed cuando los clientes completen el formulario del sitio.</div>\n      </div>`;\n      return;\n    }\n\n    const statusCounts = leadsData.reduce((acc, l) => {\n      const s = leadStatuses[l.id||l.fecha] || 'Nuevo';\n      acc[s] = (acc[s]||0) + 1;\n      return acc;\n    }, {});\n\n    mc.innerHTML = `\n      <div class=\"leads-filters\">\n        <button class=\"lead-filter-btn active\" onclick=\"filterLeads('all',this)\">Todos (${leadsData.length})</button>\n        <button class=\"lead-filter-btn\" onclick=\"filterLeads('Nuevo',this)\">Nuevos (${statusCounts['Nuevo']||0})</button>\n        <button class=\"lead-filter-btn\" onclick=\"filterLeads('Contactado',this)\">Contactados (${statusCounts['Contactado']||0})</button>\n        <button class=\"lead-filter-btn\" onclick=\"filterLeads('Calificado',this)\">Calificados (${statusCounts['Calificado']||0})</button>\n        <button class=\"lead-filter-btn\" onclick=\"filterLeads('Cerrado',this)\">Cerrados (${statusCounts['Cerrado']||0})</button>\n      </div>\n      <div id=\"leadsList\">${buildLeadsList(leadsData)}</div>`;\n  } catch(e) {\n    mc.innerHTML = '<div style=\"padding:40px;text-align:center;color:var(--red)\">Error cargando leads.</div>';\n  }\n}\n\nfunction buildLeadsList(leads) {\n  return leads.map((l, i) => {\n    const lid = l.id || l.fecha || i;\n    const st = leadStatuses[lid] || 'Nuevo';\n    const stColors = {Nuevo:'badge-blue',Contactado:'badge-yellow',Calificado:'badge-orange',Cerrado:'badge-green'};\n    return `\n      <div class=\"lead-card\" data-status=\"${st}\" data-id=\"${lid}\" onclick=\"openLeadDetail('${lid}')\" style=\"cursor:pointer\">\n        <div class=\"lead-header\">\n          <div>\n            <div class=\"lead-name\">${esc(l.nombre||'Sin nombre')}</div>\n            <span class=\"badge ${stColors[st]||'badge-gray'}\" style=\"margin-top:4px\">${st}</span>\n          </div>\n          <div class=\"lead-time\">${l.fecha?l.fecha.substring(0,10):'-'}</div>\n        </div>\n        ${l.telefono?`<div class=\"lead-detail\"><i class=\"ti ti-phone\"></i> ${esc(l.telefono)}</div>`:''}\n        ${l.propiedad?`<div class=\"lead-detail\"><i class=\"ti ti-building\"></i> ${esc(l.propiedad)}</div>`:''}\n        ${l.mensaje?`<div class=\"lead-detail\" style=\"font-style:italic\"><i class=\"ti ti-message\"></i> \"${esc(l.mensaje)}\"</div>`:''}\n        <div class=\"lead-actions\">\n          ${l.telefono?`<a class=\"wa-btn\" href=\"https://wa.me/502${l.telefono.replace(/\\D/g,'')}\" target=\"_blank\"><i class=\"ti ti-brand-whatsapp\"></i> Contactar</a>`:''}\n          <select class=\"lead-status-sel\" onchange=\"updateLeadStatus('${lid}',this.value)\">\n            <option ${st==='Nuevo'?'selected':''}>Nuevo</option>\n            <option ${st==='Contactado'?'selected':''}>Contactado</option>\n            <option ${st==='Calificado'?'selected':''}>Calificado</option>\n            <option ${st==='Cerrado'?'selected':''}>Cerrado</option>\n          </select>\n          <button class=\"lead-note-btn\" onclick=\"toggleNote('note-${lid}')\"><i class=\"ti ti-note\"></i> Nota</button>\n        </div>\n        <div class=\"lead-note-area\" id=\"note-${lid}\">\n          <textarea placeholder=\"Escribe una nota sobre este lead...\" rows=\"2\">${l._nota||''}</textarea>\n        </div>\n      </div>`;\n  }).join('');\n}\n\nfunction filterLeads(status, btn) {\n  currentLeadFilter = status;\n  document.querySelectorAll('.lead-filter-btn').forEach(b => b.classList.remove('active'));\n  btn.classList.add('active');\n  const filtered = status === 'all' ? leadsData : leadsData.filter(l => {\n    const lid = l.id || l.fecha;\n    return (leadStatuses[lid] || 'Nuevo') === status;\n  });\n  const list = document.getElementById('leadsList');\n  if (list) list.innerHTML = buildLeadsList(filtered);\n}\n\nfunction updateLeadStatus(lid, status) {\n  leadStatuses[lid] = status;\n  try { localStorage.setItem('zin_ls', JSON.stringify(leadStatuses)); } catch(e) {}\n  const card = document.querySelector(`[data-id=\"${lid}\"]`);\n  if (card) card.dataset.status = status;\n  showToast(`Estado: ${status}`, 'success');\n}\n\nfunction toggleNote(id) {\n  const el = document.getElementById(id);\n  if (el) el.style.display = el.style.display === 'block' ? 'none' : 'block';\n}\n\n// \u2500\u2500 PIPELINE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nvar pipelineStages = ['Nuevo','Contactado','Interesado','Visita','Cierre','Perdido'];\n\nasync function renderPipeline(mc) {\n  mc.innerHTML = '<div style=\"padding:40px;text-align:center;color:var(--text3)\">Cargando pipeline...</div>';\n  try {\n    var r = await fetch(API + '/api/leads', {credentials:'include'});\n    leadsData = await r.json();\n    document.querySelectorAll('#leadsCount,#topLeadsCount').forEach(function(el){ if(el) el.textContent = leadsData.length; });\n    var grouped = {};\n    pipelineStages.forEach(function(s){ grouped[s] = []; });\n    leadsData.forEach(function(l){\n      var stage = l.stage || leadStatuses[l.id||l.fecha] || 'Nuevo';\n      if (!grouped[stage]) grouped[stage] = [];\n      grouped[stage].push(l);\n    });\n    var colsHtml = pipelineStages.map(function(stage){\n      var cards = grouped[stage] || [];\n      var cardsHtml = cards.map(function(l){\n        var lid = l.id || l.fecha || '';\n        var score = l.lead_score || 0;\n        var tier = l.lead_tier || (score >= 70 ? 'HOT' : (score >= 40 ? 'WARM' : 'COLD'));\n        var tierClass = tier === 'HOT' ? 'score-hot' : (tier === 'WARM' ? 'score-warm' : 'score-cold');\n        var phone = l.telefono || '';\n        return '<div class=\"kanban-card\" onclick=\"openLeadDetail(\'' + lid + '\')\">'+\n          '<div class=\"kc-name\">' + esc(l.nombre||'Sin nombre') + '</div>'+\n          (l.propiedad ? '<div class=\"kc-prop\"><i class=\"ti ti-building\"></i> ' + esc(l.propiedad) + '</div>' : '')+\n          (phone ? '<div class=\"kc-phone\"><i class=\"ti ti-phone\"></i> ' + esc(phone) + '</div>' : '')+\n          '<div class=\"kc-meta\">'+\n            '<span class=\"score-badge ' + tierClass + '\">' + tier + '</span>'+\n            '<span class=\"kc-date\">' + (l.fecha ? l.fecha.substring(0,10) : '-') + '</span>'+\n          '</div>'+\n        '</div>';\n      }).join('');\n      return '<div class=\"kanban-col\" data-stage=\"' + stage + '\">'+\n        '<div class=\"kanban-col-header\"><span>' + stage + '</span><span class=\"col-count\">' + cards.length + '</span></div>'+\n        '<div class=\"kanban-cards\">' + (cardsHtml || '<div style=\"padding:20px;text-align:center;font-size:11px;color:var(--text3)\">Sin leads</div>') + '</div>'+\n      '</div>';\n    }).join('');\n    mc.innerHTML = '<div class=\"kanban-board\">' + colsHtml + '</div>';\n  } catch(e) {\n    mc.innerHTML = '<div style=\"padding:40px;text-align:center;color:var(--red)\">Error cargando pipeline.</div>';\n  }\n}\n\nfunction openLeadDetail(lid) {\n  var lead = null;\n  for (var i = 0; i < leadsData.length; i++) {\n    if ((leadsData[i].id || leadsData[i].fecha) === lid) { lead = leadsData[i]; break; }\n  }\n  if (!lead) return;\n  var score = lead.lead_score || 0;\n  var tier = lead.lead_tier || (score >= 70 ? 'HOT' : (score >= 40 ? 'WARM' : 'COLD'));\n  var tierClass = tier === 'HOT' ? 'score-hot' : (tier === 'WARM' ? 'score-warm' : 'score-cold');\n  var currentStage = lead.stage || leadStatuses[lid] || 'Nuevo';\n  var phone = lead.telefono || '';\n  var waLink = phone ? 'https://wa.me/502' + phone.replace(/\\D/g,'') : '';\n  var notesHtml = '';\n  if (lead.notes_history && lead.notes_history.length) {\n    for (var n = 0; n < lead.notes_history.length; n++) {\n      var note = lead.notes_history[n];\n      notesHtml += '<div class=\"lm-note-item\"><div class=\"note-date\">' + (note.date || '-') + '</div>' + esc(note.text || '') + '</div>';\n    }\n  }\n  var stageOpts = pipelineStages.map(function(s){\n    return '<option' + (s === currentStage ? ' selected' : '') + '>' + s + '</option>';\n  }).join('');\n  var overlay = document.createElement('div');\n  overlay.className = 'lead-modal-overlay';\n  overlay.onclick = function(e){ if(e.target === overlay) overlay.remove(); };\n  overlay.innerHTML = '<div class=\"lead-modal\">'+\n    '<div class=\"lead-modal-head\"><h3>' + esc(lead.nombre||'Lead') + ' <span class=\"score-badge ' + tierClass + '\" style=\"margin-left:8px;font-size:11px\">' + tier + ' (' + score + ')</span></h3><button class=\"lead-modal-close\" onclick=\"this.closest(\'\'.lead-modal-overlay\'\').remove()\">&times;</button></div>'+\n    '<div class=\"lead-modal-body\">'+\n      '<div class=\"lm-row\">'+\n        '<div class=\"lm-field\"><div class=\"lm-label\">Tel\u00e9fono</div><div class=\"lm-value\">' + esc(phone || '-') + '</div></div>'+\n        '<div class=\"lm-field\"><div class=\"lm-label\">Email</div><div class=\"lm-value\">' + esc(lead.email || '-') + '</div></div>'+\n      '</div>'+\n      '<div class=\"lm-row\">'+\n        '<div class=\"lm-field\"><div class=\"lm-label\">Propiedad</div><div class=\"lm-value\">' + esc(lead.propiedad || '-') + '</div></div>'+\n        '<div class=\"lm-field\"><div class=\"lm-label\">Presupuesto</div><div class=\"lm-value\">' + esc(lead.presupuesto || lead.budget || '-') + '</div></div>'+\n      '</div>'+\n      '<div class=\"lm-row\">'+\n        '<div class=\"lm-field\"><div class=\"lm-label\">Fuente</div><div class=\"lm-value\">' + esc(lead.fuente || lead.source || '-') + '</div></div>'+\n        '<div class=\"lm-field\"><div class=\"lm-label\">Fecha</div><div class=\"lm-value\">' + (lead.fecha ? lead.fecha.substring(0,10) : '-') + '</div></div>'+\n      '</div>'+\n      (lead.mensaje ? '<div class=\"lm-row\"><div class=\"lm-field\"><div class=\"lm-label\">Mensaje</div><div class=\"lm-value\" style=\"font-style:italic\">\"' + esc(lead.mensaje) + '\"</div></div></div>' : '')+\n      '<div class=\"lm-section\">Etapa</div>'+\n      '<select class=\"lm-stage-sel\" id=\"ldStage\">' + stageOpts + '</select>'+\n      '<div class=\"lm-section\">Seguimiento</div>'+\n      '<input type=\"date\" class=\"lm-followup\" id=\"ldFollowup\" value=\"' + (lead.followup_date || '') + '\">'+\n      '<div class=\"lm-section\">Notas</div>'+\n      '<div class=\"lm-notes-list\">' + (notesHtml || '<div style=\"font-size:12px;color:var(--text3);padding:8px\">Sin notas a\u00fan.</div>') + '</div>'+\n      '<textarea class=\"lm-note-input\" id=\"ldNote\" placeholder=\"Agregar nota...\"></textarea>'+\n      '<div class=\"lm-actions\">'+\n        (waLink ? '<a class=\"btn btn-sm\" style=\"background:#25d366;color:#fff;border:none;text-decoration:none;text-align:center\" href=\"' + waLink + '\" target=\"_blank\"><i class=\"ti ti-brand-whatsapp\"></i> WhatsApp</a>' : '')+\n        '<button class=\"btn btn-sm\" style=\"background:var(--navy);color:#fff;border:none\" onclick=\"saveLeadDetail(\'' + lid + '\')\"><i class=\"ti ti-device-floppy\"></i> Guardar</button>'+\n      '</div>'+\n    '</div>'+\n  '</div>';\n  document.body.appendChild(overlay);\n}\n\nasync function saveLeadDetail(lid) {\n  var stage = document.getElementById('ldStage').value;\n  var followup = document.getElementById('ldFollowup').value;\n  var noteText = document.getElementById('ldNote').value.trim();\n  try {\n    var r = await fetch(API + '/api/leads/update', {\n      method:'PUT', credentials:'include',\n      headers:{'Content-Type':'application/json'},\n      body: JSON.stringify({id:lid, stage:stage, followup_date:followup})\n    });\n    if (!r.ok) throw new Error('update failed');\n    leadStatuses[lid] = stage;\n    try { localStorage.setItem('zin_ls', JSON.stringify(leadStatuses)); } catch(e) {}\n    if (noteText) {\n      await fetch(API + '/api/leads/note', {\n        method:'POST', credentials:'include',\n        headers:{'Content-Type':'application/json'},\n        body: JSON.stringify({lead_id:lid, text:noteText})\n      });\n    }\n    var overlay = document.querySelector('.lead-modal-overlay');\n    if (overlay) overlay.remove();\n    showToast('Lead actualizado', 'success');\n    var mc = document.getElementById('mainContent');\n    var activePage = document.querySelector('.sb-item.active');\n    if (activePage && activePage.id === 'nav-pipeline') renderPipeline(mc);\n    else if (activePage && activePage.id === 'nav-leads') renderLeads(mc);\n  } catch(e) {\n    showToast('Error al guardar lead', 'error');\n  }\n}\n\n// \u2500\u2500 REBUILD \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nasync function triggerRebuild() {\n  showToast('Publicando sitio...', 'success');\n  try {\n    const r = await fetch(API + '/api/rebuild', {method:'POST',credentials:'include'});\n    if (r.ok) showToast('\u00a1Sitio publicado! Actualizando en ~30 seg.', 'success');\n    else showToast('Error al publicar. Intenta de nuevo.', 'error');\n  } catch(e) { showToast('Error de conexi\u00f3n.', 'error'); }\n}\n\n// \u2500\u2500 MODAL \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nfunction openModal(id) {\n  editingId = null; galUrls = []; currentStatus = 'Activa';\n  clearForm();\n  document.getElementById('btnDuplicate').style.display = 'none';\n  if (id) {\n    const decoded = decodeURIComponent(id);\n    const p = props.find(x => (x.id||x.slug) === decoded || encodeURIComponent(x.id||x.slug) === id);\n    if (p) {\n      editingId = p.id || p.slug;\n      document.getElementById('modalTitle').textContent = 'Editar propiedad';\n      document.getElementById('btnDuplicate').style.display = 'inline-flex';\n      loadForm(p);\n    }\n  } else {\n    document.getElementById('modalTitle').textContent = 'Nueva propiedad';\n  }\n  switchTab('basico');\n  document.getElementById('modalOverlay').classList.add('open');\n  updateProgress();\n}\n\nfunction closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }\n\nfunction switchTab(tab) {\n  document.querySelectorAll('.ftab-panel').forEach(p => p.classList.remove('active'));\n  document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));\n  const panel = document.getElementById('tab-' + tab);\n  if (panel) panel.classList.add('active');\n  const tabs = {basico:0,detalles:1,contenido:2,caracteristicas:3,publicacion:4};\n  const idx = tabs[tab];\n  document.querySelectorAll('.ftab')[idx]?.classList.add('active');\n}\n\nfunction togglePriv(id) {\n  const el = document.getElementById(id);\n  if (el) el.checked = !el.checked;\n}\n\nfunction clearForm() {\n  const ids = ['fTitulo','fPrecio','fMoneda','fCodigo','fZona','fMunicipio','fUbicacionGeneral',\n    'fArea','fAreaV2','fHabitaciones','fBanos','fMediosBanos','fParqueos','fNiveles',\n    'fDatosTecnicos','fTerreno','fAnioConstruccion','fDescripcion','fHook','fDescCorta',\n    'fPdfUrl','fPrecioReal','fContactoVendedor','fNotasInternas','fEstadoLegal',\n    'fSlug','fLat','fLng','fImagen','fManzanas','fCultivo','fTituloFinca',\n    'fTiempoCarretera','fPrecioRenta','fBancoFin','fDisponibleDesde','fNumeroPiso',\n    'fAreaBalcon','fAsesor','fWaAsesor','fTagsSeo','fVideoUrl','fPlano',\n    'fVistas','fFavoritos','fFechaPublicacion','fAntiguedad','fCuotaMant'];\n  ids.forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });\n  ['fEstadoConstruccion','fTipoConstruccion','fTecho','fPiso','fAcabados',\n   'fDepartamento','fOrientacion','fVista','fCertEnerg'].forEach(id => {\n    const el=document.getElementById(id); if(el) el.value='';\n  });\n  document.getElementById('fTipo').value = 'Casa';\n  document.getElementById('fOperacion').value = 'Venta';\n  document.getElementById('fTipoListing').value = 'Residencial';\n  document.getElementById('sZona').checked = true;\n  document.getElementById('sInmu').checked = false;\n  ['privPrecio','privDireccion','privGaleria','privDatos','privDesc','privExclusiva'].forEach(id => {\n    const el=document.getElementById(id); if(el) el.checked=false;\n  });\n  document.querySelectorAll('.char-item input[type=checkbox]').forEach(cb => {\n    cb.checked=false; cb.closest('.char-item').classList.remove('checked');\n  });\n  setStatus('Activa');\n  galUrls = []; renderGallery();\n  const imgPrev = document.getElementById('imgPreview');\n  if (imgPrev) imgPrev.style.display = 'none';\n}\n\nfunction loadForm(p) {\n  const set = (id, val) => { const el=document.getElementById(id); if(el) el.value=val||''; };\n  set('fTitulo', p.titulo); set('fPrecio', p.precio); set('fMoneda', p.moneda||'$'); set('fCodigo', p.codigo);\n  set('fZona', p.zona); set('fMunicipio', p.municipio); set('fUbicacionGeneral', p.ubicacionGeneral);\n  set('fArea', p.area||p.areaConst); set('fAreaV2', p.areaV2);\n  set('fHabitaciones', p.habitaciones); set('fBanos', p.banos);\n  set('fMediosBanos', p.mediosBanos); set('fParqueos', p.parqueos);\n  set('fNiveles', p.niveles); set('fDatosTecnicos', p.datosTecnicos);\n  set('fTerreno', p.terreno); set('fAnioConstruccion', p.anioConstruccion);\n  set('fEstadoConstruccion', p.estadoConstruccion); set('fTipoConstruccion', p.tipoConstruccion);\n  set('fTecho', p.techo); set('fPiso', p.piso); set('fAcabados', p.acabados);\n  set('fOrientacion', p.orientacion); set('fAntiguedad', p.antiguedad);\n  set('fCuotaMant', p.cuotaMant); set('fDescripcion', p.descripcion);\n  set('fHook', p.hook); set('fDescCorta', p.descCorta);\n  set('fPdfUrl', p.pdfUrl); set('fPrecioReal', p.precioReal);\n  set('fContactoVendedor', p.contactoVendedor); set('fNotasInternas', p.notasInternas);\n  set('fEstadoLegal', p.estadoLegal); set('fSlug', p.slug);\n  set('fLat', p.lat); set('fLng', p.lng); set('fImagen', p.imagen||p.mainImage);\n  set('fManzanas', p.manzanas); set('fCultivo', p.cultivo);\n  set('fTituloFinca', p.tituloFinca); set('fTiempoCarretera', p.tiempoCarretera);\n  set('fPrecioRenta', p.precioRenta); set('fBancoFin', p.bancoFin);\n  set('fDisponibleDesde', p.disponibleDesde); set('fNumeroPiso', p.numeroPiso);\n  set('fAreaBalcon', p.areaBalcon); set('fVista', p.vista);\n  set('fAsesor', p.asesor); set('fWaAsesor', p.waAsesor);\n  set('fTagsSeo', p.tagsSeo); set('fVideoUrl', p.videoUrl||p.video);\n  set('fPlano', p.plano); set('fVistas', p.vistas||0); set('fFavoritos', p.favoritos||0);\n  set('fFechaPublicacion', p.fechaPublicacion);\n  const sel = (id, val) => { const el=document.getElementById(id); if(el&&val) el.value=val; };\n  sel('fTipo', p.tipo); sel('fOperacion', p.operacion||p.cinta);\n  sel('fTipoListing', p.tipoListing); sel('fDepartamento', p.departamento);\n  sel('fOrientacion', p.orientacion); sel('fVista', p.vista); sel('fCertEnerg', p.certEnerg);\n  // privConfig\n  const cfg = p.privConfig || {};\n  document.getElementById('privPrecio').checked = !!cfg.precio;\n  document.getElementById('privDireccion').checked = !!cfg.direccion;\n  document.getElementById('privGaleria').checked = !!cfg.galeria;\n  document.getElementById('privDatos').checked = !!cfg.datos;\n  document.getElementById('privDesc').checked = !!cfg.descripcion;\n  document.getElementById('privExclusiva').checked = !!(p.esExclusiva || cfg.exclusiva);\n  document.getElementById('sZona').checked = p.sitios ? p.sitios.includes('zona') : true;\n  document.getElementById('sInmu').checked = p.sitios ? p.sitios.includes('inmu') : false;\n  setStatus(p.estado || 'Activa');\n  if (p.caracteristicas) {\n    document.querySelectorAll('.char-item input[type=checkbox]').forEach(cb => {\n      const on = p.caracteristicas.includes(cb.value);\n      cb.checked = on; cb.closest('.char-item').classList.toggle('checked', on);\n    });\n  }\n  galUrls = (p.gallery||[]).filter(u => u && u !== (p.imagen||p.mainImage));\n  renderGallery();\n  if (p.imagen||p.mainImage) {\n    const img = document.getElementById('imgPreview');\n    if (img) { img.src = p.imagen||p.mainImage; img.style.display='block'; }\n  }\n  updateProgress();\n}\n\nfunction setStatus(st) {\n  currentStatus = st;\n  document.getElementById('fEstado').value = st;\n  document.querySelectorAll('#statusPills .pill').forEach(p => p.classList.toggle('active', p.textContent===st));\n}\n\nfunction previewImg() {\n  const val = document.getElementById('fImagen').value;\n  const img = document.getElementById('imgPreview');\n  if (val) { img.src=val; img.style.display='block'; } else { img.style.display='none'; }\n}\n\nfunction addGalImgBulk() {\n  const url = prompt('URL de la imagen (ImageKit):');\n  if (url && url.trim()) { galUrls.push(url.trim()); renderGallery(); }\n}\n\nfunction removeGalImg(i) { galUrls.splice(i,1); renderGallery(); }\n\nfunction renderGallery() {\n  const wrap = document.getElementById('galWrap');\n  if (!wrap) return;\n  wrap.innerHTML = galUrls.map((u,i) =>\n    `<div class=\"gal-item\"><img src=\"${u}\" onerror=\"this.style.opacity='.3'\"><button class=\"gal-remove\" onclick=\"removeGalImg(${i})\">\u00d7</button></div>`\n  ).join('');\n  const cnt = document.getElementById('galCount');\n  if (cnt) cnt.textContent = galUrls.length;\n}\n\nfunction autoSlug() {\n  const titulo = document.getElementById('fTitulo').value;\n  if (!titulo) return;\n  const slug = titulo.toLowerCase()\n    .replace(/[\u00e1\u00e0\u00e4\u00e2]/g,'a').replace(/[\u00e9\u00e8\u00eb\u00ea]/g,'e').replace(/[\u00ed\u00ec\u00ef\u00ee]/g,'i')\n    .replace(/[\u00f3\u00f2\u00f6\u00f4]/g,'o').replace(/[\u00fa\u00f9\u00fc\u00fb]/g,'u').replace(/\u00f1/g,'n')\n    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');\n  document.getElementById('fSlug').value = slug;\n}\n\nfunction autoFormatPrice() { /* prix auto-format placeholder */ }\n\nfunction updateProgress() {\n  const titulo = document.getElementById('fTitulo')?.value;\n  const precio = document.getElementById('fPrecio')?.value;\n  const tipo = document.getElementById('fTipo')?.value;\n  const municipio = document.getElementById('fMunicipio')?.value;\n  const desc = document.getElementById('fDescripcion')?.value;\n  const imagen = document.getElementById('fImagen')?.value;\n  const hab = document.getElementById('fHabitaciones')?.value;\n  const banos = document.getElementById('fBanos')?.value;\n  const area = document.getElementById('fArea')?.value;\n  const hook = document.getElementById('fHook')?.value;\n  const slug = document.getElementById('fSlug')?.value;\n  const checks = [titulo,precio,tipo,municipio,desc,imagen,hab,banos,area,hook,slug,galUrls.length>0];\n  const done = checks.filter(Boolean).length;\n  const pct = Math.round(done/checks.length*100);\n  document.querySelectorAll('#modalProgress,#progressLabel').forEach(el => {\n    if(el) el.textContent = `${pct}% completo`;\n  });\n}\n\nfunction shareWA() {\n  const titulo = document.getElementById('fTitulo').value || 'Propiedad';\n  const slug = document.getElementById('fSlug').value;\n  const url = slug ? `https://zona-innmueble.com/propiedades/${slug}.html` : 'https://zona-innmueble.com';\n  const msg = encodeURIComponent(`*${titulo}*\\n${url}`);\n  window.open(`https://wa.me/?text=${msg}`, '_blank');\n}\n\nfunction copyLink() {\n  const slug = document.getElementById('fSlug').value;\n  if (!slug) { showToast('Primero genera el slug', 'error'); return; }\n  navigator.clipboard.writeText(`https://zona-innmueble.com/propiedades/${slug}.html`);\n  showToast('Enlace copiado \u2713', 'success');\n}\n\nasync function duplicateProp() {\n  if (!editingId) return;\n  const p = props.find(x => (x.id||x.slug) === editingId);\n  if (!p) return;\n  galUrls = [...(p.gallery || [])];\n  privConfig = {...(p.privConfig || {})};\n  currentStatus = 'Activa';\n  editingId = null;\n  document.getElementById('fTitulo').value = (p.titulo||'') + ' (Copia)';\n  document.getElementById('fSlug').value = '';\n  document.getElementById('modalTitle').textContent = 'Duplicar propiedad';\n  document.getElementById('btnDuplicate').style.display = 'none';\n  renderGallery();\n  // apply privConfig toggles from duplicated property\n  const _pce = document.getElementById('privPrecio'); if(_pce) _pce.checked = !!privConfig.precio;\n  const _pdi = document.getElementById('privDireccion'); if(_pdi) _pdi.checked = !!privConfig.direccion;\n  const _pga = document.getElementById('privGaleria'); if(_pga) _pga.checked = !!privConfig.galeria;\n  const _pda = document.getElementById('privDatos'); if(_pda) _pda.checked = !!privConfig.datos;\n  const _pds = document.getElementById('privDesc'); if(_pds) _pds.checked = !!privConfig.descripcion;\n  const _pex = document.getElementById('privExclusiva'); if(_pex) _pex.checked = !!privConfig.exclusiva;\n  showToast('Editando copia \u2014 guarda para crear', 'success');\n}\n\nasync function saveProp() {\n  const titulo = document.getElementById('fTitulo').value.trim();\n  if (!titulo) { showToast('El t\u00edtulo es obligatorio', 'error'); switchTab('basico'); return; }\n  const chars = Array.from(document.querySelectorAll('.char-item input[type=checkbox]:checked')).map(cb => cb.value);\n  const sitios = [];\n  if (document.getElementById('sZona').checked) sitios.push('zona');\n  if (document.getElementById('sInmu').checked) sitios.push('inmu');\n  const g = id => { const el=document.getElementById(id); return el ? el.value.trim() : ''; };\n  const privConfig = {\n    precio: document.getElementById('privPrecio').checked,\n    direccion: document.getElementById('privDireccion').checked,\n    galeria: document.getElementById('privGaleria').checked,\n    datos: document.getElementById('privDatos').checked,\n    descripcion: document.getElementById('privDesc').checked,\n    exclusiva: document.getElementById('privExclusiva').checked,\n  };\n  const data = {\n    titulo, precio:g('fPrecio'), moneda:g('fMoneda')||'$', codigo:g('fCodigo'),\n    tipo:g('fTipo'), operacion:g('fOperacion'), tipoListing:g('fTipoListing'),\n    zona:g('fZona'), municipio:g('fMunicipio'), ubicacionGeneral:g('fUbicacionGeneral'),\n    area:g('fArea'), areaV2:g('fAreaV2'), terreno:g('fTerreno'),\n    habitaciones:g('fHabitaciones'), banos:g('fBanos'), mediosBanos:g('fMediosBanos'),\n    parqueos:g('fParqueos'), niveles:g('fNiveles'), datosTecnicos:g('fDatosTecnicos'),\n    anioConstruccion:g('fAnioConstruccion'), estadoConstruccion:g('fEstadoConstruccion'),\n    tipoConstruccion:g('fTipoConstruccion'), techo:g('fTecho'),\n    piso:g('fPiso'), acabados:g('fAcabados'),\n    orientacion:g('fOrientacion'), antiguedad:g('fAntiguedad'), cuotaMant:g('fCuotaMant'),\n    numeroPiso:g('fNumeroPiso'), areaBalcon:g('fAreaBalcon'), vista:g('fVista'),\n    manzanas:g('fManzanas'), cultivo:g('fCultivo'), tituloFinca:g('fTituloFinca'),\n    tiempoCarretera:g('fTiempoCarretera'), precioRenta:g('fPrecioRenta'),\n    bancoFin:g('fBancoFin'), disponibleDesde:g('fDisponibleDesde'),\n    descripcion:g('fDescripcion'), hook:g('fHook'), descCorta:g('fDescCorta'),\n    pdfUrl:g('fPdfUrl'), precioReal:g('fPrecioReal'),\n    contactoVendedor:g('fContactoVendedor'), notasInternas:g('fNotasInternas'),\n    estadoLegal:g('fEstadoLegal'), departamento:g('fDepartamento'),\n    lat:g('fLat'), lng:g('fLng'), slug:g('fSlug'),\n    imagen:g('fImagen'), gallery:galUrls,\n    asesor:g('fAsesor'), waAsesor:g('fWaAsesor'),\n    tagsSeo:g('fTagsSeo'), videoUrl:g('fVideoUrl'), plano:g('fPlano'),\n    certEnerg:g('fCertEnerg'), vistas:parseInt(g('fVistas'))||0,\n    favoritos:parseInt(g('fFavoritos'))||0, fechaPublicacion:g('fFechaPublicacion'),\n    estado:currentStatus, caracteristicas:chars, sitios, privConfig,\n    esExclusiva: privConfig.exclusiva,\n    ...(editingId ? {id:editingId} : {})\n  };\n  try {\n    const r = await fetch(API + '/api/propiedades', {\n      method: editingId ? 'PUT' : 'POST',\n      credentials:'include',\n      headers:{'Content-Type':'application/json'},\n      body:JSON.stringify(data)\n    });\n    if (r.ok) {\n      showToast(editingId ? 'Propiedad actualizada \u2713' : 'Propiedad creada \u2713', 'success');\n      closeModal();\n      await loadProps();\n      showPage('propiedades');\n    } else { showToast('Error al guardar', 'error'); }\n  } catch(e) { showToast('Error de conexi\u00f3n', 'error'); }\n}\n\nasync function deleteProp(id, titulo) {\n  if (!confirm('\u00bfEliminar \"' + decodeURIComponent(titulo) + '\"?')) return;\n  try {\n    const r = await fetch(API + '/api/propiedades/' + id, {method:'DELETE',credentials:'include'});\n    if (r.ok) {\n      showToast('Propiedad eliminada', 'success');\n      await loadProps();\n      showPage('propiedades');\n    } else { showToast('Error al eliminar', 'error'); }\n  } catch(e) { showToast('Error de conexi\u00f3n', 'error'); }\n}\n\n// \u2500\u2500 UTILS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nfunction esc(s) {\n  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');\n}\n\nfunction showToast(msg, type) {\n  const t = document.getElementById('toast');\n  t.textContent = msg; t.className = 'toast '+(type||'');\n  void t.offsetWidth; t.classList.add('show');\n  setTimeout(()=>t.classList.remove('show'), 3000);\n}\n\ndocument.addEventListener('keydown', e => {\n  if (e.key==='Escape') closeModal();\n});\n\ndocument.querySelectorAll('.char-item').forEach(item => {\n  item.addEventListener('change', () => item.classList.toggle('checked', item.querySelector('input').checked));\n});\n\ncheckSession();\n</script>\n</body>\n</html>\n";
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const ALLOWED_ORIGINS = [
      'https://zona-innmueble.com',
      'https://www.zona-innmueble.com',
      'https://inmuhub.com',
      'https://www.inmuhub.com',
    ];

    function cors(req) {
      const origin = (req.headers.get('Origin') || '');
      const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : '*';
      return {
        'Access-Control-Allow-Origin': allowed,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };
    }

    function jsonRes(data, status = 200) {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...cors(request) },
      });
    }

    // ── OPTIONS ──────────────────────────────────────────────────
    if (method === 'OPTIONS') {
      return new Response(null, { headers: cors(request) });
    }

    // ── Admin HTML ───────────────────────────────────────────────
    if (method === 'GET' && path === '/admin') {
        return Response.redirect('https://zona-innmueble.com/admin.html', 302);
      }
      if (method === 'GET' && path === '/') {
      return new Response(getAdminHTML(), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
      });
    }

    // ── Dynamic grid JS (public site) ───────────────────────────
    if (method === 'GET' && path === '/dynamic-grid.js') {
      return new Response(getDynamicGridJS(), {
        headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-cache', ...cors(request) },
      });
    }

    // ── Public propiedades (no auth) ─────────────────────────────
    if (method === 'GET' && path === '/api/propiedades-publicas') {
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      const pub = data
        .filter(p => p.estado !== 'Pausada' && p.estado !== 'Eliminada')
        .map(p => {
          const out = { ...p };
          if (p.privConfig) {
            if (p.privConfig.precio) delete out.precio;
            if (p.privConfig.direccion) { delete out.ubicacion; delete out.municipio; }
            if (p.privConfig.galeria) { delete out.gallery; delete out.galeria; }
            if (p.privConfig.datos) { delete out.habitaciones; delete out.banos; delete out.area; }
            if (p.privConfig.descripcion) delete out.descripcion;
          }
          return out;
        });
      return new Response(JSON.stringify(pub), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60', ...cors(request) },
      });
    }

    // ── Public propiedades alias (used by build.js) ─────────────
    if (method === 'GET' && path === '/api/public/propiedades') {
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      const pub = data
        .filter(p => p.estado !== 'Pausada' && p.estado !== 'Eliminada')
        .map(p => {
          const out = { ...p };
          if (p.privConfig) {
            if (p.privConfig.precio) delete out.precio;
            if (p.privConfig.direccion) { delete out.ubicacion; delete out.municipio; }
            if (p.privConfig.galeria) { delete out.gallery; delete out.galeria; }
            if (p.privConfig.datos) { delete out.habitaciones; delete out.banos; delete out.area; }
            if (p.privConfig.descripcion) delete out.descripcion;
          }
          return out;
        });
      return new Response(JSON.stringify(pub), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', ...cors(request) },
      });
    }

    // ── POST /api/login ──────────────────────────────────────────
    if (method === 'POST' && path === '/api/login') {
      let body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      const { user, pass } = body || {};

      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const attemptsKey = 'login_attempts:' + ip;
      const attemptsRaw = await env.DB.get(attemptsKey);
      const attempts = attemptsRaw ? JSON.parse(attemptsRaw) : { count: 0, ts: Date.now() };

      if (attempts.count >= LOGIN_MAX_ATTEMPTS) {
        const elapsed = (Date.now() - attempts.ts) / 1000;
        if (elapsed < LOGIN_LOCKOUT_SECONDS) {
          return jsonRes({ error: `Demasiados intentos. Espera ${Math.ceil(LOGIN_LOCKOUT_SECONDS - elapsed)}s.` }, 429);
        }
        attempts.count = 0;
      }

      const adminUser = env.ADMIN_USER || ADMIN_USER_DEFAULT;
      const adminPass = env.ADMIN_PASS || ADMIN_PASS_DEFAULT;

      if (user !== adminUser || pass !== adminPass) {
        attempts.count = (attempts.count || 0) + 1;
        attempts.ts = Date.now();
        await env.DB.put(attemptsKey, JSON.stringify(attempts), { expirationTtl: LOGIN_LOCKOUT_SECONDS });
        return jsonRes({ error: 'Credenciales incorrectas' }, 401);
      }

      await env.DB.delete(attemptsKey);
      const token = generateToken();
      await env.DB.put('session:' + token, 'valid', { expirationTtl: SESSION_TTL });

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `session=${token}; HttpOnly; Secure; SameSite=None; Max-Age=${SESSION_TTL}; Path=/`,
          ...cors(request),
        },
      });
    }

    // ── POST /api/logout ─────────────────────────────────────────
    if (method === 'POST' && path === '/api/logout') {
      const cookie = request.headers.get('Cookie') || '';
      const match = cookie.match(/session=([^;]+)/);
      if (match) await env.DB.delete('session:' + match[1]);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'session=; HttpOnly; Secure; SameSite=None; Max-Age=0; Path=/',
          ...cors(request),
        },
      });
    }

    // ── GET /api/me ──────────────────────────────────────────────
    if (method === 'GET' && path === '/api/me') {
      const authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      return jsonRes({ ok: true, user: env.ADMIN_USER || ADMIN_USER_DEFAULT });
    }

    // ── GET /api/propiedades (admin) ─────────────────────────────
    if (method === 'GET' && path === '/api/propiedades') {
      const authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      return jsonRes(data);
    }

    // ── POST /api/propiedades (crear) ────────────────────────────
    if (method === 'POST' && path === '/api/propiedades') {
      const authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      let body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      body.id = String(Date.now());
      body.createdAt = new Date().toISOString();
      if (!body.slug && body.titulo) {
        body.slug = body.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      }
      data.push(body);
      await env.DB.put('propiedades', JSON.stringify(data));
      ctx.waitUntil(triggerRebuild()); // auto-deploy al crear
      return jsonRes({ ok: true, id: body.id });
    }

    // ── PUT /api/propiedades/:id (actualizar) ────────────────────
    if (method === 'PUT' && path.startsWith('/api/propiedades/')) {
      const authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      const id = decodeURIComponent(path.slice('/api/propiedades/'.length));
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      const idx = data.findIndex(p => (p.id || p.slug || '') === id);
      if (idx < 0) return jsonRes({ error: 'No encontrado' }, 404);
      let body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.slug && body.titulo) {
        body.slug = body.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      }
      data[idx] = { ...data[idx], ...body, id };
      await env.DB.put('propiedades', JSON.stringify(data));
      ctx.waitUntil(triggerRebuild()); // auto-deploy al editar
      return jsonRes({ ok: true, prop: data[idx] });
    }

    // ── PUT /api/propiedades (body tiene id) ─────────────────────
    if (method === 'PUT' && path === '/api/propiedades') {
      const authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      let body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      const { id } = body || {};
      if (!id) return jsonRes({ error: 'ID requerido' }, 400);
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      const idx = data.findIndex(p => (p.id || p.slug || '') === id);
      if (idx < 0) return jsonRes({ error: 'No encontrado' }, 404);
      if (!body.slug && body.titulo) {
        body.slug = body.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      }
      data[idx] = { ...data[idx], ...body, id };
      await env.DB.put('propiedades', JSON.stringify(data));
      ctx.waitUntil(triggerRebuild()); // auto-deploy al editar
      return jsonRes({ ok: true, prop: data[idx] });
    }

    // ── DELETE /api/propiedades/:id ──────────────────────────────
    if (method === 'DELETE' && path.startsWith('/api/propiedades/')) {
      const authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      const id = decodeURIComponent(path.slice('/api/propiedades/'.length));
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      const filtered = data.filter(p => {
        const pid = p.id || p.slug || '';
        return pid !== id;
      });
      await env.DB.put('propiedades', JSON.stringify(filtered));
      ctx.waitUntil(triggerRebuild()); // auto-deploy al eliminar
      return jsonRes({ ok: true });
    }

    // ── GET /api/leads ───────────────────────────────────────────
    if (method === 'GET' && path === '/api/leads') {
      const authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      const raw = await env.DB.get('leads');
      const data = raw ? JSON.parse(raw) : [];
      return jsonRes(data.sort((a, b) => new Date(b.fecha || b.createdAt || 0) - new Date(a.fecha || a.createdAt || 0)));
    }

    // ── POST /api/leads/import (bulk import) ────────
    if (method === 'POST' && path === '/api/leads/import') {
      if (!(await requireAuth(request, env))) return jsonRes({ error: 'No autorizado' }, 401);
      var importBody;
      try { importBody = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!Array.isArray(importBody)) return jsonRes({ error: 'Se espera un array' }, 400);
      // Get existing leads
      var existingRaw = await env.DB.get('leads');
      var existing = existingRaw ? JSON.parse(existingRaw) : [];
      // Build phone index of existing leads to avoid duplicates
      var phoneIndex = {};
      for (var ei = 0; ei < existing.length; ei++) {
        var ep = (existing[ei].phone || '').replace(/[^0-9]/g, '');
        if (ep) phoneIndex[ep] = true;
      }
      // Add only new leads
      var added = 0;
      for (var ii = 0; ii < importBody.length; ii++) {
        var imp = importBody[ii];
        var impPhone = (imp.phone || '').replace(/[^0-9]/g, '');
        if (impPhone && phoneIndex[impPhone]) continue;
        if (!imp.id) imp.id = String(Date.now()) + '_' + ii;
        if (!imp.createdAt) imp.createdAt = new Date().toISOString();
        if (!imp.fecha) imp.fecha = imp.createdAt.slice(0, 10);
        existing.push(imp);
        if (impPhone) phoneIndex[impPhone] = true;
        added++;
      }
      await env.DB.put('leads', JSON.stringify(existing));
      return jsonRes({ ok: true, imported: added, total: existing.length, duplicates: importBody.length - added });
    }

    // ── POST /api/lead (desde sitio público) + Meta CAPI ────────
    if (method === 'POST' && (path === '/api/lead' || path === '/api/leads')) {
      let body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      var raw = await env.DB.get('leads');
      var data = raw ? JSON.parse(raw) : [];
      var lead = { ...body, id: String(Date.now()), createdAt: new Date().toISOString(), fecha: new Date().toISOString() };

      // ── Lead Scoring Automático ────────────────────────────
      var score = 0;
      var pres = (lead.presupuesto || '').toLowerCase();
      if (pres.indexOf('500') >= 0 || pres.indexOf('millon') >= 0 || pres.indexOf('1,000') >= 0) score += 40;
      else if (pres.indexOf('300') >= 0 || pres.indexOf('400') >= 0) score += 30;
      else if (pres.indexOf('200') >= 0 || pres.indexOf('150') >= 0) score += 20;
      else if (pres.indexOf('100') >= 0) score += 10;
      var zona = (lead.zona_interes || lead.zona || '').toLowerCase();
      if (zona.indexOf('14') >= 0 || zona.indexOf('15') >= 0 || zona.indexOf('cayal') >= 0) score += 25;
      else if (zona.indexOf('10') >= 0 || zona.indexOf('16') >= 0) score += 20;
      else if (zona.indexOf('fraijanes') >= 0 || zona.indexOf('salvador') >= 0) score += 15;
      else if (zona) score += 5;
      var tipo = (lead.tipo_propiedad || lead.tipo || '').toLowerCase();
      if (tipo.indexOf('finca') >= 0 || tipo.indexOf('luxury') >= 0 || tipo.indexOf('penthouse') >= 0) score += 20;
      else if (tipo.indexOf('casa') >= 0 || tipo.indexOf('residencia') >= 0) score += 15;
      else if (tipo.indexOf('apartamento') >= 0 || tipo.indexOf('apto') >= 0) score += 10;
      else if (tipo.indexOf('terreno') >= 0 || tipo.indexOf('lote') >= 0) score += 10;
      if (lead.email && lead.email.indexOf('@') >= 0) score += 10;
      if (lead.telefono || lead.phone) score += 5;
      lead.lead_score = score;
      lead.lead_tier = score >= 60 ? 'HOT' : score >= 35 ? 'WARM' : 'COLD';
      lead.stage = lead.lead_tier === 'HOT' ? 'Nuevo' : 'Nuevo';

      data.push(lead);
      await env.DB.put('leads', JSON.stringify(data));

      // ── Meta Conversions API (server-side) ──────────────────
      var token = env.META_CAPI_TOKEN || META_CAPI_TOKEN;
      if (token) {
        var userData = {
          client_user_agent: lead.user_agent || '',
          client_ip_address: request.headers.get('cf-connecting-ip') || '',
          fbc: lead.fbc || '',
          fbp: lead.fbp || '',
          external_id: [await hashSHA256(lead.id)],
          ct: [await hashSHA256('guatemala city')],
          st: [await hashSHA256('guatemala')],
          country: [await hashSHA256('gt')],
          zp: [await hashSHA256('01010')]
        };
        // Hash PII before sending
        if (lead.email) {
          userData.em = [await hashSHA256(lead.email.toLowerCase().trim())];
        }
        if (lead.phone) {
          userData.ph = [await hashSHA256(lead.phone.replace(/[^0-9]/g, ''))];
        }
        if (lead.name || lead.nombre) {
          var nameVal = (lead.name || lead.nombre).toLowerCase().trim().split(' ')[0];
          userData.fn = [await hashSHA256(nameVal)];
        }
        var eventData = {
          data: [{
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            event_source_url: lead.page_url || '',
            action_source: 'website',
            user_data: userData,
            custom_data: {
              property_slug: lead.property_slug || '',
              property_name: lead.property_name || lead.propiedad || '',
              utm_source: lead.utm_source || '',
              utm_campaign: lead.utm_campaign || '',
              lead_type: 'form'
            }
          }]
        };
        // Fire and forget — don't block the response
        ctx.waitUntil(
          fetch('https://graph.facebook.com/v21.0/' + getPixelId(lead.page_url) + '/events?access_token=' + token, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
          }).catch(function() {})
        );
      }

      // ── Notificación email via Google Apps Script ───────────
      var NOTIFY_URL = env.NOTIFY_WEBHOOK || NOTIFY_WEBHOOK || '';
      if (NOTIFY_URL) {
        var notifyData = {
          nombre: lead.nombre || lead.name || 'Sin nombre',
          telefono: lead.telefono || lead.phone || '',
          email: lead.email || '',
          propiedad: lead.propiedad || lead.property_name || '',
          presupuesto: lead.presupuesto || '',
          zona: lead.zona_interes || '',
          tipo: lead.tipo_propiedad || lead.tipo || '',
          fuente: lead.utm_source || lead.source || 'Sitio web',
          fecha: lead.fecha,
          lead_score: lead.lead_score,
          lead_tier: lead.lead_tier,
          whatsapp_link: (function(){ var ph = (lead.telefono || lead.phone || '').replace(/[^0-9]/g, ''); return ph ? 'https://wa.me/' + (ph.startsWith('502') ? ph : '502' + ph) : ''; })()
        };
        ctx.waitUntil(
          fetch(NOTIFY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notifyData)
          }).catch(function() {})
        );
      }

      return jsonRes({ ok: true, id: lead.id });
    }

    // ── META LEAD ADS WEBHOOK ──────────────────────────────────────
    // GET: verification challenge from Meta
    if (method === 'GET' && path === '/api/leads/webhook') {
      var params = new URL(request.url).searchParams;
      var mode = params.get('hub.mode');
      var token = params.get('hub.verify_token');
      var challenge = params.get('hub.challenge');
      if (mode === 'subscribe' && token === 'zona_innmueble_webhook_2026') {
        return new Response(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
      }
      return jsonRes({ error: 'Verification failed' }, 403);
    }

    // POST: receive lead data from Meta Lead Ads
    if (method === 'POST' && path === '/api/leads/webhook') {
      var body;
      try { body = await request.json(); } catch { return jsonRes({ ok: true }); }

      // Meta sends: { entry: [{ id, changes: [{ value: { leadgen_id, form_id, page_id, created_time } }] }] }
      // We must fetch actual lead data from Graph API using leadgen_id
      var graphToken = env.META_CAPI_TOKEN || META_CAPI_TOKEN;
      var entries = body.entry || [];
      for (var e = 0; e < entries.length; e++) {
        var changes = entries[e].changes || [];
        for (var ch = 0; ch < changes.length; ch++) {
          var val = changes[ch].value || {};
          var leadgenId = val.leadgen_id || '';
          var formId = val.form_id || '';
          var pageId = val.page_id || entries[e].id || '';

          // Fetch lead details from Graph API
          var nombre = '';
          var email = '';
          var telefono = '';
          var formName = '';
          if (leadgenId && graphToken) {
            try {
              var graphRes = await fetch('https://graph.facebook.com/v21.0/' + leadgenId + '?access_token=' + graphToken);
              var graphData = await graphRes.json();
              if (graphData.field_data) {
                for (var f = 0; f < graphData.field_data.length; f++) {
                  var fd = graphData.field_data[f];
                  var fn = (fd.name || '').toLowerCase();
                  var fv = (fd.values && fd.values[0]) || '';
                  if (fn === 'full_name' || fn === 'nombre_completo' || fn === 'nombre') nombre = fv;
                  else if (fn === 'email' || fn === 'correo') email = fv;
                  else if (fn === 'phone_number' || fn === 'telefono' || fn === 'whatsapp') telefono = fv;
                }
              }
              formName = graphData.form_id || formId;
            } catch(graphErr) { /* continue with empty fields */ }
          }

          var lead = {
            id: String(Date.now()) + '_' + Math.random().toString(36).slice(2,6),
            nombre: nombre,
            email: email,
            telefono: telefono,
            propiedad: formName || formId,
            fuente: 'Meta Lead Ad',
            leadgen_id: leadgenId,
            form_id: formId,
            page_id: pageId,
            fecha: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            stage: 'Nuevo',
            fase: 'NUEVO LEAD',
            lead_score: 30,
            lead_tier: 'WARM'
          };

          // Save to KV
          var raw = await env.DB.get('leads');
          var data = raw ? JSON.parse(raw) : [];
          data.push(lead);
          await env.DB.put('leads', JSON.stringify(data));

          // Notify via Google Apps Script (includes WhatsApp link)
          var NOTIFY_URL = env.NOTIFY_WEBHOOK || NOTIFY_WEBHOOK || '';
          if (NOTIFY_URL) {
            var phone = (lead.telefono || '').replace(/[^0-9]/g, '');
            var waLink = phone ? 'https://wa.me/' + (phone.startsWith('502') ? phone : '502' + phone) : '';
            ctx.waitUntil(
              fetch(NOTIFY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  nombre: lead.nombre,
                  telefono: lead.telefono,
                  email: lead.email,
                  propiedad: 'Meta Lead Ad Form',
                  fuente: 'Meta Lead Ad',
                  fecha: lead.fecha,
                  lead_score: lead.lead_score,
                  lead_tier: lead.lead_tier,
                  whatsapp_link: waLink,
                  tipo: 'instant_form'
                })
              }).catch(function() {})
            );
          }
        }
      }
      return jsonRes({ ok: true });
    }

    // ── POST /api/leads/sync-meta ── Pull leads from Meta Graph API ──
    if (method === 'POST' && path === '/api/leads/sync-meta') {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      var body;
      try { body = await request.json(); } catch { body = {}; }
      var pageToken = body.page_token || env.META_PAGE_TOKEN || META_PAGE_TOKEN || '';
      if (!pageToken) return jsonRes({ error: 'Se requiere page_token' }, 400);
      var pageId = env.META_PAGE_ID || META_PAGE_ID;

      // Get all leadgen forms for the page
      var formsRes = await fetch('https://graph.facebook.com/v21.0/' + pageId + '/leadgen_forms?access_token=' + pageToken);
      var formsData = await formsRes.json();
      if (formsData.error) return jsonRes({ error: 'Error Graph API: ' + formsData.error.message }, 400);

      var forms = formsData.data || [];
      var raw = await env.DB.get('leads');
      var existingLeads = raw ? JSON.parse(raw) : [];
      var existingIds = {};
      for (var i = 0; i < existingLeads.length; i++) {
        if (existingLeads[i].leadgen_id) existingIds[existingLeads[i].leadgen_id] = true;
      }

      var newCount = 0;
      for (var fi = 0; fi < forms.length; fi++) {
        var formId = forms[fi].id;
        var formName = forms[fi].name || formId;
        // Get leads for this form
        var leadsRes = await fetch('https://graph.facebook.com/v21.0/' + formId + '/leads?access_token=' + pageToken);
        var leadsData = await leadsRes.json();
        if (leadsData.error) continue;
        var metaLeads = leadsData.data || [];

        for (var li = 0; li < metaLeads.length; li++) {
          var ml = metaLeads[li];
          if (existingIds[ml.id]) continue; // already imported

          var nombre = '';
          var email = '';
          var telefono = '';
          var fieldData = ml.field_data || [];
          for (var fd = 0; fd < fieldData.length; fd++) {
            var fn = (fieldData[fd].name || '').toLowerCase();
            var fv = (fieldData[fd].values && fieldData[fd].values[0]) || '';
            if (fn === 'full_name' || fn === 'nombre_completo' || fn === 'nombre') nombre = fv;
            else if (fn === 'email' || fn === 'correo' || fn === 'correo_electrónico') email = fv;
            else if (fn === 'phone_number' || fn === 'telefono' || fn === 'número_de_teléfono' || fn === 'whatsapp') telefono = fv;
          }

          var lead = {
            id: String(Date.now()) + '_' + Math.random().toString(36).slice(2,6),
            nombre: nombre,
            email: email,
            telefono: telefono,
            propiedad: formName,
            fuente: 'Meta Lead Ad',
            leadgen_id: ml.id,
            form_id: formId,
            page_id: pageId,
            fecha: ml.created_time || new Date().toISOString(),
            createdAt: new Date().toISOString(),
            stage: 'Nuevo',
            fase: 'NUEVO LEAD',
            lead_score: 30,
            lead_tier: 'WARM'
          };
          existingLeads.push(lead);
          existingIds[ml.id] = true;
          newCount++;
        }
      }

      if (newCount > 0) {
        await env.DB.put('leads', JSON.stringify(existingLeads));
      }
      return jsonRes({ ok: true, new_leads: newCount, total_forms: forms.length });
    }

    // ── PUT /api/leads/update ─────────────────────────────────────
    if (method === 'PUT' && path === '/api/leads/update') {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      var raw = await env.DB.get('leads');
      var data = raw ? JSON.parse(raw) : [];
      var found = false;
      for (var i = 0; i < data.length; i++) {
        if ((data[i].id || data[i]._id || data[i].fecha) == body.id) {
          if (body.stage) data[i].stage = body.stage;
          if (body.followup_date) data[i].followup_date = body.followup_date;
          if (body.contacted_at) data[i].contacted_at = body.contacted_at;
          found = true;
          break;
        }
      }
      if (found) await env.DB.put('leads', JSON.stringify(data));
      return jsonRes({ ok: found });
    }

    // ── POST /api/leads/note ──────────────────────────────────────
    if (method === 'POST' && path === '/api/leads/note') {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      var raw = await env.DB.get('leads');
      var data = raw ? JSON.parse(raw) : [];
      for (var i = 0; i < data.length; i++) {
        if ((data[i].id || data[i]._id || data[i].fecha) == body.id) {
          if (!data[i].notes_history) data[i].notes_history = [];
          data[i].notes_history.push({ text: body.text, date: new Date().toISOString().slice(0, 10), author: 'Admin' });
          break;
        }
      }
      await env.DB.put('leads', JSON.stringify(data));
      return jsonRes({ ok: true });
    }

    // ── DELETE /api/leads/delete ─────────────────────────────────
    if (method === 'DELETE' && path === '/api/leads/delete') {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.id) return jsonRes({ error: 'ID requerido' }, 400);
      var raw = await env.DB.get('leads');
      var data = raw ? JSON.parse(raw) : [];
      var before = data.length;
      data = data.filter(function(l) { return (l.id || l._id || l.fecha) != body.id; });
      if (data.length < before) {
        await env.DB.put('leads', JSON.stringify(data));
        return jsonRes({ ok: true, deleted: true });
      }
      return jsonRes({ error: 'Lead no encontrado' }, 404);
    }

    // ── GET /api/public/brokers ── public broker profiles ──
    if (method === 'GET' && path === '/api/public/brokers') {
      var raw = await env.DB.get('brokers');
      var data = raw ? JSON.parse(raw) : [];
      var pub = data.filter(function(b){ return b.activo !== false && b.estado === 'aprobado'; }).map(function(b){
        var o = Object.assign({}, b);
        delete o.telefono; delete o.whatsapp_raw; delete o.email; delete o.password_hash; delete o.whatsapp;
        return o;
      });
      return new Response(JSON.stringify(pub), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', ...cors(request) },
      });
    }

    // ── GET /api/brokers ── all brokers (admin) ──
    if (method === 'GET' && path === '/api/brokers') {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      var raw = await env.DB.get('brokers');
      var data = raw ? JSON.parse(raw) : [];
      return jsonRes(data);
    }

    // ── POST /api/brokers ── create broker ──
    if (method === 'POST' && path === '/api/brokers') {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.nombre) return jsonRes({ error: 'Nombre requerido' }, 400);
      var raw = await env.DB.get('brokers');
      var data = raw ? JSON.parse(raw) : [];
      var slug = (body.nombre||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      var existing = data.find(function(b){ return b.slug === slug; });
      if (existing) slug = slug + '-' + Date.now().toString(36);
      var broker = {
        id: 'bk_' + Date.now().toString(36) + Math.random().toString(36).slice(2,6),
        slug: slug,
        nombre: body.nombre,
        titulo: body.titulo || 'Asesor Inmobiliario',
        bio: body.bio || '',
        foto: body.foto || '',
        telefono: body.telefono || '',
        whatsapp: body.whatsapp || '',
        whatsapp_raw: body.whatsapp || '',
        email: body.email || '',
        zonas: body.zonas || [],
        especialidad: body.especialidad || [],
        verificado: body.verificado || false,
        destacado: body.destacado || false,
        activo: true,
        propiedades_count: 0,
        rating: body.rating || 0,
        reviews_count: 0,
        response_time: body.response_time || 'Menos de 2 horas',
        created_at: new Date().toISOString(),
      };
      data.push(broker);
      await env.DB.put('brokers', JSON.stringify(data));
      return jsonRes({ ok: true, broker: broker });
    }

    // ── PUT /api/brokers ── update broker ──
    if (method === 'PUT' && path === '/api/brokers') {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.id) return jsonRes({ error: 'ID requerido' }, 400);
      var raw = await env.DB.get('brokers');
      var data = raw ? JSON.parse(raw) : [];
      var found = false;
      for (var i = 0; i < data.length; i++) {
        if (data[i].id === body.id) {
          var fields = ['nombre','titulo','bio','foto','telefono','whatsapp','whatsapp_raw','email','zonas','especialidad','verificado','destacado','activo','rating','response_time','estado','plan'];
          fields.forEach(function(f){ if (body[f] !== undefined) data[i][f] = body[f]; });
          found = true;
          break;
        }
      }
      if (found) await env.DB.put('brokers', JSON.stringify(data));
      return jsonRes({ ok: found });
    }

    // ── DELETE /api/brokers ── delete broker ──
    if (method === 'DELETE' && path === '/api/brokers') {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.id) return jsonRes({ error: 'ID requerido' }, 400);
      var raw = await env.DB.get('brokers');
      var data = raw ? JSON.parse(raw) : [];
      var before = data.length;
      data = data.filter(function(b){ return b.id !== body.id; });
      if (data.length < before) {
        await env.DB.put('brokers', JSON.stringify(data));
        return jsonRes({ ok: true, deleted: true });
      }
      return jsonRes({ error: 'Broker no encontrado' }, 404);
    }

    // ── GET /api/meta-ads-stats ── return cached Meta Ads stats ──
    if (method === 'GET' && path === '/api/meta-ads-stats') {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      var cached = await env.DB.get('meta_ads_stats');
      if (cached) return jsonRes(JSON.parse(cached));
      return jsonRes({ error: 'Sin datos. Actualiza desde Cowork.' }, 404);
    }

    // ── POST /api/meta-ads-stats ── save Meta Ads stats from Cowork ──
    if (method === 'POST' && path === '/api/meta-ads-stats') {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      await env.DB.put('meta_ads_stats', JSON.stringify(body));
      return jsonRes({ ok: true });
    }

    // ── POST /api/rebuild ─────────────────────────────────────────
    if (method === 'POST' && path === '/api/rebuild') {
      const authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      ctx.waitUntil(triggerRebuild());
      return jsonRes({ ok: true });
    }

    // ── POST /api/pageview (CAPI server-side PageView) ─────────
    if (method === 'POST' && path === '/api/pageview') {
      var body;
      try { body = await request.json(); } catch { return jsonRes({ ok: true }); }
      var token = env.META_CAPI_TOKEN || META_CAPI_TOKEN;
      if (token) {
        var pvUserData = {
          client_user_agent: body.user_agent || request.headers.get('user-agent') || '',
          client_ip_address: request.headers.get('cf-connecting-ip') || '',
          fbc: body.fbc || '',
          fbp: body.fbp || '',
          ct: [await hashSHA256('guatemala city')],
          st: [await hashSHA256('guatemala')],
          country: [await hashSHA256('gt')],
          zp: [await hashSHA256('01010')]
        };
        if (body.external_id) {
          pvUserData.external_id = [await hashSHA256(body.external_id)];
        }
        var pvEvent = {
          data: [{
            event_name: body.event_name || 'PageView',
            event_time: Math.floor(Date.now() / 1000),
            event_source_url: body.page_url || '',
            action_source: 'website',
            user_data: pvUserData,
            custom_data: body.custom_data || {}
          }]
        };
        ctx.waitUntil(
          fetch('https://graph.facebook.com/v21.0/' + getPixelId(body.page_url) + '/events?access_token=' + token, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pvEvent)
          }).catch(function() {})
        );
      }
      return jsonRes({ ok: true });
    }

    // ════════════════════════════════════════════════════════════
    // ══ BROKER AUTH & SELF-SERVICE ENDPOINTS ══════════════════
    // ════════════════════════════════════════════════════════════

    // ── POST /api/broker/register ── public registration ──
    if (method === 'POST' && path === '/api/broker/register') {
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.nombre || !body.email || !body.password) {
        return jsonRes({ error: 'Nombre, email y contraseña son requeridos' }, 400);
      }
      if (body.password.length < 6) {
        return jsonRes({ error: 'La contraseña debe tener al menos 6 caracteres' }, 400);
      }
      var raw = await env.DB.get('brokers');
      var data = raw ? JSON.parse(raw) : [];
      var emailExists = data.find(function(b){ return b.email && b.email.toLowerCase() === body.email.toLowerCase(); });
      if (emailExists) return jsonRes({ error: 'Ya existe una cuenta con este email' }, 409);
      var slug = (body.nombre||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      var existingSlug = data.find(function(b){ return b.slug === slug; });
      if (existingSlug) slug = slug + '-' + Date.now().toString(36);
      var passwordHash = await hashSHA256(body.password + ':broker_salt_zi');
      var broker = {
        id: 'bk_' + Date.now().toString(36) + Math.random().toString(36).slice(2,6),
        slug: slug,
        nombre: body.nombre,
        titulo: body.titulo || 'Asesor Inmobiliario',
        bio: body.bio || '',
        foto: body.foto || '',
        telefono: body.telefono || '',
        whatsapp: body.whatsapp || '',
        whatsapp_raw: body.whatsapp || '',
        email: body.email.toLowerCase(),
        zonas: body.zonas || [],
        especialidad: body.especialidad || [],
        verificado: false,
        destacado: false,
        activo: false,
        estado: 'pendiente',
        plan: 'free',
        password_hash: passwordHash,
        propiedades_count: 0,
        rating: 0,
        reviews_count: 0,
        response_time: 'Menos de 2 horas',
        created_at: new Date().toISOString(),
      };
      data.push(broker);
      await env.DB.put('brokers', JSON.stringify(data));
      return jsonRes({ ok: true, message: 'Registro exitoso. Tu cuenta está pendiente de aprobación.' });
    }

    // ── POST /api/broker/login ── broker authentication ──
    if (method === 'POST' && path === '/api/broker/login') {
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.email || !body.password) return jsonRes({ error: 'Email y contraseña requeridos' }, 400);
      var raw = await env.DB.get('brokers');
      var data = raw ? JSON.parse(raw) : [];
      var broker = data.find(function(b){ return b.email && b.email.toLowerCase() === body.email.toLowerCase(); });
      if (!broker || !broker.password_hash) return jsonRes({ error: 'Credenciales inválidas' }, 401);
      var hash = await hashSHA256(body.password + ':broker_salt_zi');
      if (hash !== broker.password_hash) return jsonRes({ error: 'Credenciales inválidas' }, 401);
      if (broker.estado === 'pendiente') return jsonRes({ error: 'Tu cuenta está pendiente de aprobación' }, 403);
      if (broker.estado === 'rechazado') return jsonRes({ error: 'Tu cuenta ha sido rechazada' }, 403);
      if (broker.activo === false && broker.estado !== 'aprobado') return jsonRes({ error: 'Tu cuenta no está activa' }, 403);
      var token = generateToken();
      await env.DB.put('broker_session:' + token, broker.id, { expirationTtl: SESSION_TTL });
      return jsonRes({ ok: true, token: token, broker: { id: broker.id, nombre: broker.nombre, plan: broker.plan, estado: broker.estado } });
    }

    // ── POST /api/broker/logout ──
    if (method === 'POST' && path === '/api/broker/logout') {
      var authHeader = request.headers.get('Authorization') || '';
      var bToken = authHeader.replace('Bearer ', '');
      if (bToken) await env.DB.delete('broker_session:' + bToken);
      return jsonRes({ ok: true });
    }

    // ── Helper: authenticate broker from Bearer token ──
    async function requireBrokerAuth(request, env) {
      var authHeader = request.headers.get('Authorization') || '';
      var token = authHeader.replace('Bearer ', '');
      if (!token) return null;
      var brokerId = await env.DB.get('broker_session:' + token);
      if (!brokerId) return null;
      var raw = await env.DB.get('brokers');
      var data = raw ? JSON.parse(raw) : [];
      return data.find(function(b){ return b.id === brokerId; }) || null;
    }

    // ── GET /api/broker/me ── broker profile ──
    if (method === 'GET' && path === '/api/broker/me') {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: 'No autenticado' }, 401);
      var planLimits = { free: 2, basico: 8, pro: 25, premium: 999 };
      var raw = await env.DB.get('propiedades');
      var allProps = raw ? JSON.parse(raw) : [];
      var myProps = allProps.filter(function(p){ return p.broker_id === broker.id; });
      var stats = await env.DB.get('broker_stats:' + broker.id);
      var statsData = stats ? JSON.parse(stats) : { views: 0, wa_clicks: 0 };
      return jsonRes({
        id: broker.id,
        slug: broker.slug,
        nombre: broker.nombre,
        titulo: broker.titulo,
        bio: broker.bio,
        foto: broker.foto,
        email: broker.email,
        telefono: broker.telefono,
        whatsapp: broker.whatsapp,
        zonas: broker.zonas,
        especialidad: broker.especialidad,
        verificado: broker.verificado,
        destacado: broker.destacado,
        plan: broker.plan || 'free',
        estado: broker.estado || 'aprobado',
        propiedades_count: myProps.length,
        propiedades_limit: planLimits[broker.plan || 'free'] || 2,
        stats: statsData,
        created_at: broker.created_at,
      });
    }

    // ── PUT /api/broker/me ── broker updates own profile ──
    if (method === 'PUT' && path === '/api/broker/me') {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: 'No autenticado' }, 401);
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      var raw = await env.DB.get('brokers');
      var data = raw ? JSON.parse(raw) : [];
      var allowedFields = ['nombre','titulo','bio','foto','telefono','whatsapp','zonas','especialidad','response_time'];
      for (var i = 0; i < data.length; i++) {
        if (data[i].id === broker.id) {
          allowedFields.forEach(function(f){ if (body[f] !== undefined) data[i][f] = body[f]; });
          if (body.whatsapp) data[i].whatsapp_raw = body.whatsapp;
          break;
        }
      }
      await env.DB.put('brokers', JSON.stringify(data));
      ctx.waitUntil(triggerRebuild());
      return jsonRes({ ok: true });
    }

    // ── GET /api/broker/propiedades ── broker's own properties ──
    if (method === 'GET' && path === '/api/broker/propiedades') {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: 'No autenticado' }, 401);
      var raw = await env.DB.get('propiedades');
      var allProps = raw ? JSON.parse(raw) : [];
      var myProps = allProps.filter(function(p){ return p.broker_id === broker.id; });
      return jsonRes(myProps);
    }

    // ── POST /api/broker/propiedades ── broker creates property ──
    if (method === 'POST' && path === '/api/broker/propiedades') {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: 'No autenticado' }, 401);
      var planLimits = { free: 2, basico: 8, pro: 25, premium: 999 };
      var limit = planLimits[broker.plan || 'free'] || 2;
      var raw = await env.DB.get('propiedades');
      var allProps = raw ? JSON.parse(raw) : [];
      var myCount = allProps.filter(function(p){ return p.broker_id === broker.id; }).length;
      if (myCount >= limit) {
        return jsonRes({ error: 'Has alcanzado el límite de propiedades de tu plan (' + limit + '). Actualiza tu plan para publicar más.' }, 403);
      }
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.titulo) return jsonRes({ error: 'Título requerido' }, 400);
      var slug = (body.titulo||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      var existingSlug = allProps.find(function(p){ return p.slug === slug; });
      if (existingSlug) slug = slug + '-' + Date.now().toString(36);
      var prop = Object.assign({}, body, {
        id: slug,
        slug: slug,
        broker_id: broker.id,
        estado: 'Activa',
        sitios: ['inmu'],
        createdAt: new Date().toISOString(),
      });
      allProps.push(prop);
      await env.DB.put('propiedades', JSON.stringify(allProps));
      ctx.waitUntil(triggerRebuild());
      return jsonRes({ ok: true, propiedad: prop });
    }

    // ── PUT /api/broker/propiedades ── broker edits own property ──
    if (method === 'PUT' && path === '/api/broker/propiedades') {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: 'No autenticado' }, 401);
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.id) return jsonRes({ error: 'ID requerido' }, 400);
      var raw = await env.DB.get('propiedades');
      var allProps = raw ? JSON.parse(raw) : [];
      var idx = allProps.findIndex(function(p){ return (p.id||p.slug) === body.id && p.broker_id === broker.id; });
      if (idx === -1) return jsonRes({ error: 'Propiedad no encontrada o no te pertenece' }, 404);
      var id = body.id; delete body.id;
      delete body.broker_id;
      allProps[idx] = Object.assign({}, allProps[idx], body, { id: id, broker_id: broker.id });
      await env.DB.put('propiedades', JSON.stringify(allProps));
      ctx.waitUntil(triggerRebuild());
      return jsonRes({ ok: true });
    }

    // ── DELETE /api/broker/propiedades ── broker deletes own property ──
    if (method === 'DELETE' && path === '/api/broker/propiedades') {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: 'No autenticado' }, 401);
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.id) return jsonRes({ error: 'ID requerido' }, 400);
      var raw = await env.DB.get('propiedades');
      var allProps = raw ? JSON.parse(raw) : [];
      var before = allProps.length;
      allProps = allProps.filter(function(p){ return !((p.id||p.slug) === body.id && p.broker_id === broker.id); });
      if (allProps.length < before) {
        await env.DB.put('propiedades', JSON.stringify(allProps));
        ctx.waitUntil(triggerRebuild());
        return jsonRes({ ok: true });
      }
      return jsonRes({ error: 'Propiedad no encontrada o no te pertenece' }, 404);
    }

    // ── POST /api/broker/view/:slug ── track profile view (public) ──
    if (method === 'POST' && path.startsWith('/api/broker/view/')) {
      var slug = path.split('/api/broker/view/')[1];
      if (slug) {
        var statsKey = 'broker_stats_by_slug:' + slug;
        var raw = await env.DB.get('brokers');
        var data = raw ? JSON.parse(raw) : [];
        var b = data.find(function(x){ return x.slug === slug; });
        if (b) {
          var sRaw = await env.DB.get('broker_stats:' + b.id);
          var s = sRaw ? JSON.parse(sRaw) : { views: 0, wa_clicks: 0 };
          s.views = (s.views || 0) + 1;
          await env.DB.put('broker_stats:' + b.id, JSON.stringify(s));
        }
      }
      return jsonRes({ ok: true });
    }

    // ── POST /api/broker/wa-click/:slug ── track WhatsApp click (public) ──
    if (method === 'POST' && path.startsWith('/api/broker/wa-click/')) {
      var slug = path.split('/api/broker/wa-click/')[1];
      if (slug) {
        var raw = await env.DB.get('brokers');
        var data = raw ? JSON.parse(raw) : [];
        var b = data.find(function(x){ return x.slug === slug; });
        if (b) {
          var sRaw = await env.DB.get('broker_stats:' + b.id);
          var s = sRaw ? JSON.parse(sRaw) : { views: 0, wa_clicks: 0 };
          s.wa_clicks = (s.wa_clicks || 0) + 1;
          await env.DB.put('broker_stats:' + b.id, JSON.stringify(s));
        }
      }
      return jsonRes({ ok: true });
    }

    // ── PUT /api/brokers/approve ── admin approves/rejects broker ──
    if (method === 'PUT' && path === '/api/brokers/approve') {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.id || !body.estado) return jsonRes({ error: 'ID y estado requeridos' }, 400);
      if (['aprobado','rechazado','pendiente'].indexOf(body.estado) === -1) return jsonRes({ error: 'Estado inválido' }, 400);
      var raw = await env.DB.get('brokers');
      var data = raw ? JSON.parse(raw) : [];
      var found = false;
      for (var i = 0; i < data.length; i++) {
        if (data[i].id === body.id) {
          data[i].estado = body.estado;
          data[i].activo = body.estado === 'aprobado';
          if (body.plan) data[i].plan = body.plan;
          found = true;
          break;
        }
      }
      if (found) {
        await env.DB.put('brokers', JSON.stringify(data));
        ctx.waitUntil(triggerRebuild());
      }
      return jsonRes({ ok: found });
    }

    // ── PUT /api/brokers/plan ── admin changes broker plan ──
    if (method === 'PUT' && path === '/api/brokers/plan') {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: 'No autenticado' }, 401);
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.id || !body.plan) return jsonRes({ error: 'ID y plan requeridos' }, 400);
      if (['free','basico','pro','premium'].indexOf(body.plan) === -1) return jsonRes({ error: 'Plan inválido' }, 400);
      var raw = await env.DB.get('brokers');
      var data = raw ? JSON.parse(raw) : [];
      var found = false;
      for (var i = 0; i < data.length; i++) {
        if (data[i].id === body.id) {
          data[i].plan = body.plan;
          if (body.plan === 'pro' || body.plan === 'premium') data[i].verificado = true;
          if (body.plan === 'premium') data[i].destacado = true;
          found = true;
          break;
        }
      }
      if (found) await env.DB.put('brokers', JSON.stringify(data));
      return jsonRes({ ok: found });
    }


    // ═══════════════════════════════════════════════════════════════
    // FASE 3: MENSAJES, BÚSQUEDA, FAVORITOS
    // ═══════════════════════════════════════════════════════════════

    // ── POST /api/messages ── visitor sends message to broker ──
    if (method === 'POST' && path === '/api/messages') {
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.broker_id || !body.nombre || !body.email || !body.mensaje) {
        return jsonRes({ error: 'broker_id, nombre, email y mensaje son requeridos' }, 400);
      }
      var msg = {
        id: crypto.randomUUID(),
        broker_id: body.broker_id,
        propiedad_id: body.propiedad_id || null,
        propiedad_titulo: body.propiedad_titulo || null,
        nombre: body.nombre,
        email: body.email,
        telefono: body.telefono || '',
        mensaje: body.mensaje,
        leido: false,
        created_at: new Date().toISOString(),
      };
      var raw = await env.DB.get('messages:' + body.broker_id);
      var msgs = raw ? JSON.parse(raw) : [];
      msgs.unshift(msg);
      // Keep max 500 messages per broker
      if (msgs.length > 500) msgs = msgs.slice(0, 500);
      await env.DB.put('messages:' + body.broker_id, JSON.stringify(msgs));
      // Update unread count
      var unread = msgs.filter(function(m){ return !m.leido; }).length;
      await env.DB.put('messages_unread:' + body.broker_id, String(unread));
      // Notify broker via webhook (same pattern as lead notification)
      var brokersRaw = await env.DB.get('brokers');
      var brokers = brokersRaw ? JSON.parse(brokersRaw) : [];
      var broker = brokers.find(function(b){ return b.id === body.broker_id; });
      if (broker && NOTIFY_WEBHOOK) {
        ctx.waitUntil(fetch(NOTIFY_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'broker_message',
            broker_name: broker.nombre,
            broker_phone: broker.whatsapp_raw || '',
            broker_email: broker.email || '',
            broker_id: broker.id,
            sender_name: body.nombre,
            sender_email: body.email,
            sender_phone: body.telefono || '',
            property: body.propiedad_titulo || 'Consulta general',
            property_id: body.propiedad_id || '',
            message: body.mensaje.substring(0, 500),
            unread_count: unread,
          })
        }).catch(function(){}));
      }
      return jsonRes({ ok: true, id: msg.id });
    }

    // ── GET /api/broker/messages ── broker reads their messages ──
    if (method === 'GET' && path === '/api/broker/messages') {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: 'No autenticado' }, 401);
      var raw = await env.DB.get('messages:' + broker.id);
      var msgs = raw ? JSON.parse(raw) : [];
      var unread = msgs.filter(function(m){ return !m.leido; }).length;
      return jsonRes({ messages: msgs, unread: unread });
    }

    // ── PUT /api/broker/messages/read ── mark message as read ──
    if (method === 'PUT' && path === '/api/broker/messages/read') {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: 'No autenticado' }, 401);
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.id) return jsonRes({ error: 'ID requerido' }, 400);
      var raw = await env.DB.get('messages:' + broker.id);
      var msgs = raw ? JSON.parse(raw) : [];
      var found = false;
      for (var i = 0; i < msgs.length; i++) {
        if (msgs[i].id === body.id) { msgs[i].leido = true; found = true; break; }
      }
      if (found) {
        await env.DB.put('messages:' + broker.id, JSON.stringify(msgs));
        var unread = msgs.filter(function(m){ return !m.leido; }).length;
        await env.DB.put('messages_unread:' + broker.id, String(unread));
      }
      return jsonRes({ ok: found });
    }

    // ── PUT /api/broker/messages/read-all ── mark all as read ──
    if (method === 'PUT' && path === '/api/broker/messages/read-all') {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: 'No autenticado' }, 401);
      var raw = await env.DB.get('messages:' + broker.id);
      var msgs = raw ? JSON.parse(raw) : [];
      for (var i = 0; i < msgs.length; i++) { msgs[i].leido = true; }
      await env.DB.put('messages:' + broker.id, JSON.stringify(msgs));
      await env.DB.put('messages_unread:' + broker.id, '0');
      return jsonRes({ ok: true });
    }

    // ── DELETE /api/broker/messages ── delete a message ──
    if (method === 'DELETE' && path === '/api/broker/messages') {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: 'No autenticado' }, 401);
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.id) return jsonRes({ error: 'ID requerido' }, 400);
      var raw = await env.DB.get('messages:' + broker.id);
      var msgs = raw ? JSON.parse(raw) : [];
      msgs = msgs.filter(function(m){ return m.id !== body.id; });
      await env.DB.put('messages:' + broker.id, JSON.stringify(msgs));
      var unread = msgs.filter(function(m){ return !m.leido; }).length;
      await env.DB.put('messages_unread:' + broker.id, String(unread));
      return jsonRes({ ok: true });
    }

    // ── GET /api/public/propiedades/search ── advanced property search ──
    if (method === 'GET' && path === '/api/public/propiedades/search') {
      var raw = await env.DB.get('propiedades');
      var data = raw ? JSON.parse(raw) : [];
      var results = data.filter(function(p){ return p.estado !== 'Pausada' && p.estado !== 'Eliminada'; });
      var searchUrl = new URL(request.url);
      var tipo = searchUrl.searchParams.get('tipo');
      var zona = searchUrl.searchParams.get('zona');
      var precioMin = searchUrl.searchParams.get('precio_min');
      var precioMax = searchUrl.searchParams.get('precio_max');
      var habMin = searchUrl.searchParams.get('habitaciones_min');
      var banosMin = searchUrl.searchParams.get('banos_min');
      var areaMin = searchUrl.searchParams.get('area_min');
      var areaMax = searchUrl.searchParams.get('area_max');
      var q = searchUrl.searchParams.get('q');
      var broker_id = searchUrl.searchParams.get('broker_id');
      var sort = searchUrl.searchParams.get('sort') || 'newest';
      if (tipo) results = results.filter(function(p){ return (p.tipo || '').toLowerCase() === tipo.toLowerCase(); });
      if (zona) results = results.filter(function(p){ return (p.zona || p.ubicacion || '').toLowerCase().indexOf(zona.toLowerCase()) !== -1; });
      if (precioMin) results = results.filter(function(p){ return parseFloat(p.precio) >= parseFloat(precioMin); });
      if (precioMax) results = results.filter(function(p){ return parseFloat(p.precio) <= parseFloat(precioMax); });
      if (habMin) results = results.filter(function(p){ return parseInt(p.habitaciones) >= parseInt(habMin); });
      if (banosMin) results = results.filter(function(p){ return parseInt(p.banos) >= parseInt(banosMin); });
      if (areaMin) results = results.filter(function(p){ return parseFloat(p.area) >= parseFloat(areaMin); });
      if (areaMax) results = results.filter(function(p){ return parseFloat(p.area) <= parseFloat(areaMax); });
      if (broker_id) results = results.filter(function(p){ return p.broker_id === broker_id; });
      if (q) {
        var terms = q.toLowerCase().split(/\s+/);
        results = results.filter(function(p){
          var text = [p.titulo, p.descripcion, p.ubicacion, p.zona, p.tipo, p.municipio].join(' ').toLowerCase();
          return terms.every(function(t){ return text.indexOf(t) !== -1; });
        });
      }
      // Apply privacy config
      results = results.map(function(p){
        var out = Object.assign({}, p);
        if (p.privConfig) {
          if (p.privConfig.precio) delete out.precio;
          if (p.privConfig.direccion) { delete out.ubicacion; delete out.municipio; }
          if (p.privConfig.galeria) { delete out.gallery; delete out.galeria; }
          if (p.privConfig.datos) { delete out.habitaciones; delete out.banos; delete out.area; }
          if (p.privConfig.descripcion) delete out.descripcion;
        }
        return out;
      });
      // Sort
      if (sort === 'price_asc') results.sort(function(a,b){ return (parseFloat(a.precio)||0)-(parseFloat(b.precio)||0); });
      else if (sort === 'price_desc') results.sort(function(a,b){ return (parseFloat(b.precio)||0)-(parseFloat(a.precio)||0); });
      else if (sort === 'area_desc') results.sort(function(a,b){ return (parseFloat(b.area)||0)-(parseFloat(a.area)||0); });
      else results.sort(function(a,b){ return new Date(b.created_at||0)-new Date(a.created_at||0); });
      return new Response(JSON.stringify({ total: results.length, results: results }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=30', ...cors(request) },
      });
    }

    // ── POST /api/leads/route ── auto-route lead to matching broker ──
    if (method === 'POST' && path === '/api/leads/route') {
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.lead_id) return jsonRes({ error: 'lead_id requerido' }, 400);
      // Get lead
      var leadsRaw = await env.DB.get('leads');
      var leads = leadsRaw ? JSON.parse(leadsRaw) : [];
      var lead = leads.find(function(l){ return l.id === body.lead_id; });
      if (!lead) return jsonRes({ error: 'Lead no encontrado' }, 404);
      // Get brokers
      var brokersRaw = await env.DB.get('brokers');
      var brokers = brokersRaw ? JSON.parse(brokersRaw) : [];
      var aprobados = brokers.filter(function(b){ return b.estado === 'aprobado'; });
      // Match by zona
      var zona = (lead.zona || lead.propiedad || '').toLowerCase();
      var matched = aprobados.filter(function(b){
        if (!b.zonas || !b.zonas.length) return false;
        return b.zonas.some(function(z){ return zona.indexOf(z.toLowerCase()) !== -1; });
      });
      // If no match by zona, try by especialidad/tipo
      if (!matched.length && lead.tipo) {
        var tipo = lead.tipo.toLowerCase();
        matched = aprobados.filter(function(b){
          return (b.especialidad || []).some(function(e){ return e.toLowerCase().indexOf(tipo) !== -1; });
        });
      }
      // If still no match, assign to premium/pro brokers
      if (!matched.length) {
        matched = aprobados.filter(function(b){ return b.plan === 'premium' || b.plan === 'pro'; });
      }
      // Pick the one with fewest assigned leads (round robin)
      if (matched.length) {
        var best = matched[0];
        var minCount = 999999;
        for (var i = 0; i < matched.length; i++) {
          var count = leads.filter(function(l){ return l.assigned_broker === matched[i].id; }).length;
          if (count < minCount) { minCount = count; best = matched[i]; }
        }
        // Assign
        for (var j = 0; j < leads.length; j++) {
          if (leads[j].id === body.lead_id) {
            leads[j].assigned_broker = best.id;
            leads[j].assigned_broker_name = best.nombre;
            leads[j].assigned_at = new Date().toISOString();
            break;
          }
        }
        await env.DB.put('leads', JSON.stringify(leads));
        return jsonRes({ ok: true, assigned_to: best.nombre, broker_id: best.id });
      }
      return jsonRes({ ok: false, message: 'No hay asesores disponibles para esta zona' });
    }

    // ── GET /api/broker/messages/unread-count ── quick unread check ──
    if (method === 'GET' && path === '/api/broker/messages/unread-count') {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: 'No autenticado' }, 401);
      var count = await env.DB.get('messages_unread:' + broker.id);
      return jsonRes({ unread: parseInt(count || '0') });
    }

    // ══════════════════════════════════════════════════════════
    // CRM AUTOMATIONS — Follow-up, Lead Routing Integration, Weekly Reports
    // ══════════════════════════════════════════════════════════

    // ── GET /api/cron/followups ── Check leads needing follow-up ──
    if (method === 'GET' && path === '/api/cron/followups') {
      var authH = request.headers.get('Authorization') || '';
      if (authH !== 'Bearer ' + (env.CRON_SECRET || 'cron-secret-2026')) return jsonRes({ error: 'Unauthorized' }, 401);
      var leads = JSON.parse(await env.DB.get('leads') || '[]');
      var now = Date.now();
      var oneDay = 86400000;
      var twoDays = oneDay * 2;
      var sevenDays = oneDay * 7;
      var actions = [];

      for (var i = 0; i < leads.length; i++) {
        var ld = leads[i];
        if (ld.etapa === 'cerrado' || ld.etapa === 'perdido') continue;
        var created = new Date(ld.fecha || ld.created_at || 0).getTime();
        var lastContact = ld.last_contact ? new Date(ld.last_contact).getTime() : created;
        var age = now - created;
        var sinceContact = now - lastContact;
        var score = ld.score || 0;

        // High-score leads not contacted in 24h
        if (score >= 70 && sinceContact > oneDay && !ld.followup_sent_hot) {
          actions.push({ lead_id: ld.id, type: 'hot_lead_reminder', nombre: ld.nombre, score: score, hours_since: Math.round(sinceContact / 3600000) });
          leads[i].followup_sent_hot = true;
        }
        // New leads not moved from 'nuevo' in 48h
        else if (ld.etapa === 'nuevo' && age > twoDays && !ld.followup_sent_48h) {
          actions.push({ lead_id: ld.id, type: 'stale_new_lead', nombre: ld.nombre, hours_since: Math.round(age / 3600000) });
          leads[i].followup_sent_48h = true;
        }
        // Any lead with no contact in 7 days
        else if (sinceContact > sevenDays && !ld.followup_sent_7d) {
          actions.push({ lead_id: ld.id, type: 'cold_lead_7d', nombre: ld.nombre, days_since: Math.round(sinceContact / oneDay) });
          leads[i].followup_sent_7d = true;
        }
      }

      if (actions.length > 0) {
        await env.DB.put('leads', JSON.stringify(leads));
        // Send webhook notification with follow-up actions
        if (env.NOTIFY_WEBHOOK) {
          try {
            await fetch(env.NOTIFY_WEBHOOK, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type: 'followup_reminders', actions: actions, count: actions.length, timestamp: new Date().toISOString() })
            });
          } catch(e) {}
        }
      }
      return jsonRes({ ok: true, followups: actions.length, actions: actions });
    }

    // ── POST /api/leads/auto-route ── Enhanced lead routing with auto-assignment ──
    if (method === 'POST' && path === '/api/leads/auto-route') {
      var authH = request.headers.get('Authorization') || '';
      if (authH !== 'Bearer ' + (env.ADMIN_KEY || '')) return jsonRes({ error: 'Unauthorized' }, 401);
      var body = await request.json();
      var leads = JSON.parse(await env.DB.get('leads') || '[]');
      var brokers = JSON.parse(await env.DB.get('brokers') || '[]');
      var approvedBrokers = brokers.filter(function(b) { return b.status === 'aprobado'; });
      if (!approvedBrokers.length) return jsonRes({ error: 'No hay asesores aprobados' }, 400);
      var routed = 0;
      var results = [];

      for (var i = 0; i < leads.length; i++) {
        var ld = leads[i];
        if (ld.assigned_broker) continue; // Already assigned
        if (ld.etapa === 'cerrado' || ld.etapa === 'perdido') continue;

        // Match by zona
        var zona = (ld.zona || ld.ubicacion || '').toLowerCase();
        var tipo = (ld.tipo || ld.interes || '').toLowerCase();
        var matched = [];

        for (var j = 0; j < approvedBrokers.length; j++) {
          var b = approvedBrokers[j];
          var bZonas = (b.zonas || []).map(function(z) { return z.toLowerCase(); });
          var bEsp = (b.especialidad || []).map(function(e) { return e.toLowerCase(); });
          var zMatch = zona && bZonas.some(function(z) { return zona.indexOf(z) !== -1 || z.indexOf(zona) !== -1; });
          var tMatch = tipo && bEsp.some(function(e) { return tipo.indexOf(e) !== -1 || e.indexOf(tipo) !== -1; });
          if (zMatch && tMatch) matched.push({ broker: b, priority: 3 });
          else if (zMatch) matched.push({ broker: b, priority: 2 });
          else if (tMatch) matched.push({ broker: b, priority: 1 });
        }

        if (matched.length === 0) {
          // Round-robin among all approved
          var assignedCounts = {};
          leads.forEach(function(l) { if (l.assigned_broker) assignedCounts[l.assigned_broker] = (assignedCounts[l.assigned_broker] || 0) + 1; });
          var best = approvedBrokers.reduce(function(a, b) { return (assignedCounts[a.id] || 0) <= (assignedCounts[b.id] || 0) ? a : b; });
          matched.push({ broker: best, priority: 0 });
        }

        // Sort by priority desc, then by fewest assigned
        matched.sort(function(a, b) { return b.priority - a.priority; });
        var winner = matched[0].broker;
        leads[i].assigned_broker = winner.id;
        leads[i].assigned_broker_name = winner.nombre;
        leads[i].assigned_at = new Date().toISOString();
        routed++;
        results.push({ lead: ld.nombre, broker: winner.nombre, priority: matched[0].priority });
      }

      if (routed > 0) {
        await env.DB.put('leads', JSON.stringify(leads));
      }
      return jsonRes({ ok: true, routed: routed, results: results });
    }

    // ── GET /api/reports/weekly ── Generate weekly performance report ──
    if (method === 'GET' && path === '/api/reports/weekly') {
      var authH = request.headers.get('Authorization') || '';
      if (authH !== 'Bearer ' + (env.CRON_SECRET || 'cron-secret-2026') && authH !== 'Bearer ' + (env.ADMIN_KEY || ''))
        return jsonRes({ error: 'Unauthorized' }, 401);

      var leads = JSON.parse(await env.DB.get('leads') || '[]');
      var brokers = JSON.parse(await env.DB.get('brokers') || '[]');
      var now = Date.now();
      var weekAgo = now - 7 * 86400000;

      // Leads this week
      var weekLeads = leads.filter(function(l) { return new Date(l.fecha || l.created_at || 0).getTime() > weekAgo; });
      var totalLeads = leads.length;

      // By etapa
      var byEtapa = {};
      leads.forEach(function(l) { byEtapa[l.etapa || 'sin_etapa'] = (byEtapa[l.etapa || 'sin_etapa'] || 0) + 1; });

      // By source
      var bySource = {};
      weekLeads.forEach(function(l) { var s = l.utm_source || l.source || 'directo'; bySource[s] = (bySource[s] || 0) + 1; });

      // High score leads
      var hotLeads = leads.filter(function(l) { return (l.score || 0) >= 70 && l.etapa !== 'cerrado' && l.etapa !== 'perdido'; });

      // Broker performance
      var brokerStats = {};
      leads.forEach(function(l) {
        if (l.assigned_broker) {
          if (!brokerStats[l.assigned_broker]) brokerStats[l.assigned_broker] = { total: 0, nuevo: 0, contactado: 0, cerrado: 0, perdido: 0, name: l.assigned_broker_name || l.assigned_broker };
          brokerStats[l.assigned_broker].total++;
          brokerStats[l.assigned_broker][l.etapa || 'nuevo']++;
        }
      });

      // Conversion rate
      var cerrados = leads.filter(function(l) { return l.etapa === 'cerrado'; }).length;
      var convRate = totalLeads > 0 ? Math.round((cerrados / totalLeads) * 100) : 0;

      // Stale leads (no contact in 7+ days, still active)
      var staleLeads = leads.filter(function(l) {
        if (l.etapa === 'cerrado' || l.etapa === 'perdido') return false;
        var lastC = l.last_contact ? new Date(l.last_contact).getTime() : new Date(l.fecha || l.created_at || 0).getTime();
        return (now - lastC) > 7 * 86400000;
      });

      var report = {
        period: { from: new Date(weekAgo).toISOString().split('T')[0], to: new Date(now).toISOString().split('T')[0] },
        summary: {
          total_leads: totalLeads,
          new_this_week: weekLeads.length,
          hot_leads: hotLeads.length,
          stale_leads: staleLeads.length,
          conversion_rate: convRate + '%',
          active_brokers: brokers.filter(function(b) { return b.status === 'aprobado'; }).length
        },
        pipeline: byEtapa,
        sources_this_week: bySource,
        broker_performance: Object.values(brokerStats),
        alerts: []
      };

      if (hotLeads.length > 0) report.alerts.push({ type: 'hot_leads', message: hotLeads.length + ' leads calientes sin cerrar', leads: hotLeads.map(function(l) { return { nombre: l.nombre, score: l.score, etapa: l.etapa }; }).slice(0, 10) });
      if (staleLeads.length > 0) report.alerts.push({ type: 'stale_leads', message: staleLeads.length + ' leads sin contacto en 7+ dias' });
      if (weekLeads.length === 0) report.alerts.push({ type: 'no_leads', message: 'No se generaron leads esta semana' });

      // Send via webhook if configured
      if (env.NOTIFY_WEBHOOK) {
        try {
          await fetch(env.NOTIFY_WEBHOOK, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'weekly_report', report: report, timestamp: new Date().toISOString() })
          });
        } catch(e) {}
      }

      return jsonRes(report);
    }


    // ══════════════════════════════════════════════════════════
    // ECOSYSTEM GROWTH — Analytics, Reviews, Payments
    // ══════════════════════════════════════════════════════════

    // ── POST /api/track ── Track profile/property views (public, no auth) ──
    if (method === 'POST' && path === '/api/track') {
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      var event = body.event; // 'profile_view', 'property_view', 'property_click', 'whatsapp_click', 'phone_click'
      var brokerId = body.broker_id;
      if (!event || !brokerId) return jsonRes({ error: 'event y broker_id requeridos' }, 400);
      var today = new Date().toISOString().split('T')[0];
      var key = 'analytics:' + brokerId;
      var raw = await env.DB.get(key);
      var analytics = raw ? JSON.parse(raw) : { daily: {}, totals: {} };
      if (!analytics.daily[today]) analytics.daily[today] = {};
      analytics.daily[today][event] = (analytics.daily[today][event] || 0) + 1;
      analytics.totals[event] = (analytics.totals[event] || 0) + 1;
      // Keep only last 90 days
      var days = Object.keys(analytics.daily).sort();
      if (days.length > 90) {
        for (var d = 0; d < days.length - 90; d++) delete analytics.daily[days[d]];
      }
      await env.DB.put(key, JSON.stringify(analytics));
      return jsonRes({ ok: true });
    }

    // ── GET /api/broker/analytics ── Broker reads their analytics ──
    if (method === 'GET' && path === '/api/broker/analytics') {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: 'No autenticado' }, 401);
      var raw = await env.DB.get('analytics:' + broker.id);
      var analytics = raw ? JSON.parse(raw) : { daily: {}, totals: {} };
      // Calculate last 7 and 30 day summaries
      var now = new Date();
      var last7 = {};
      var last30 = {};
      for (var i = 0; i < 30; i++) {
        var d = new Date(now - i * 86400000).toISOString().split('T')[0];
        var dayData = analytics.daily[d] || {};
        Object.keys(dayData).forEach(function(ev) {
          last30[ev] = (last30[ev] || 0) + dayData[ev];
          if (i < 7) last7[ev] = (last7[ev] || 0) + dayData[ev];
        });
      }
      // Get message count
      var msgsRaw = await env.DB.get('messages:' + broker.id);
      var msgs = msgsRaw ? JSON.parse(msgsRaw) : [];
      var unread = msgs.filter(function(m) { return !m.leido; }).length;
      // Get property count
      var propsRaw = await env.DB.get('propiedades');
      var allProps = propsRaw ? JSON.parse(propsRaw) : [];
      var myProps = allProps.filter(function(p) { return p.broker_id === broker.id && p.estado !== 'Eliminada'; });
      // Get reviews
      var revRaw = await env.DB.get('reviews:' + broker.id);
      var reviews = revRaw ? JSON.parse(revRaw) : [];
      var avgRating = reviews.length > 0 ? (reviews.reduce(function(s, r) { return s + r.rating; }, 0) / reviews.length).toFixed(1) : null;

      return jsonRes({
        totals: analytics.totals,
        last7: last7,
        last30: last30,
        daily: analytics.daily,
        messages_total: msgs.length,
        messages_unread: unread,
        properties_active: myProps.length,
        reviews_count: reviews.length,
        avg_rating: avgRating,
      });
    }

    // ── POST /api/reviews ── Submit a review for a broker (public) ──
    if (method === 'POST' && path === '/api/reviews') {
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.broker_id || !body.nombre || !body.rating || !body.comentario) {
        return jsonRes({ error: 'broker_id, nombre, rating y comentario son requeridos' }, 400);
      }
      var rating = parseInt(body.rating);
      if (rating < 1 || rating > 5) return jsonRes({ error: 'Rating debe ser entre 1 y 5' }, 400);
      var review = {
        id: crypto.randomUUID(),
        broker_id: body.broker_id,
        nombre: body.nombre,
        email: body.email || '',
        rating: rating,
        comentario: body.comentario.substring(0, 500),
        propiedad: body.propiedad || '',
        status: 'pending', // pending → approved → rejected
        created_at: new Date().toISOString(),
      };
      var key = 'reviews:' + body.broker_id;
      var raw = await env.DB.get(key);
      var reviews = raw ? JSON.parse(raw) : [];
      reviews.unshift(review);
      if (reviews.length > 100) reviews = reviews.slice(0, 100);
      await env.DB.put(key, JSON.stringify(reviews));
      // Update broker avg rating (only approved reviews)
      var approved = reviews.filter(function(r) { return r.status === 'approved'; });
      if (approved.length > 0) {
        var avg = (approved.reduce(function(s, r) { return s + r.rating; }, 0) / approved.length).toFixed(1);
        var brokersRaw = await env.DB.get('brokers');
        var brokers = brokersRaw ? JSON.parse(brokersRaw) : [];
        for (var i = 0; i < brokers.length; i++) {
          if (brokers[i].id === body.broker_id) {
            brokers[i].avg_rating = parseFloat(avg);
            brokers[i].review_count = approved.length;
            break;
          }
        }
        await env.DB.put('brokers', JSON.stringify(brokers));
      }
      // Notify via webhook
      if (NOTIFY_WEBHOOK) {
        ctx.waitUntil(fetch(NOTIFY_WEBHOOK, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'new_review', broker_id: body.broker_id, reviewer: body.nombre, rating: rating, comment: body.comentario.substring(0, 200) })
        }).catch(function(){}));
      }
      return jsonRes({ ok: true, id: review.id, message: 'Reseña enviada. Será visible después de aprobación.' });
    }

    // ── GET /api/public/reviews/:broker_id ── Public: get approved reviews ──
    if (method === 'GET' && path.startsWith('/api/public/reviews/')) {
      var brokerId = path.replace('/api/public/reviews/', '');
      var raw = await env.DB.get('reviews:' + brokerId);
      var reviews = raw ? JSON.parse(raw) : [];
      var approved = reviews.filter(function(r) { return r.status === 'approved'; });
      // Remove emails from public view
      approved.forEach(function(r) { delete r.email; });
      var avg = approved.length > 0 ? (approved.reduce(function(s, r) { return s + r.rating; }, 0) / approved.length).toFixed(1) : null;
      return jsonRes({ reviews: approved, avg_rating: avg, count: approved.length });
    }

    // ── GET /api/broker/reviews ── Broker sees all their reviews ──
    if (method === 'GET' && path === '/api/broker/reviews') {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: 'No autenticado' }, 401);
      var raw = await env.DB.get('reviews:' + broker.id);
      var reviews = raw ? JSON.parse(raw) : [];
      return jsonRes({ reviews: reviews });
    }

    // ── PUT /api/admin/reviews ── Admin approves/rejects reviews ──
    if (method === 'PUT' && path === '/api/admin/reviews') {
      if (!(await requireAuth(request, env))) return jsonRes({ error: 'No autorizado' }, 401);
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.broker_id || !body.review_id || !body.status) return jsonRes({ error: 'broker_id, review_id y status requeridos' }, 400);
      var key = 'reviews:' + body.broker_id;
      var raw = await env.DB.get(key);
      var reviews = raw ? JSON.parse(raw) : [];
      var found = false;
      for (var i = 0; i < reviews.length; i++) {
        if (reviews[i].id === body.review_id) {
          reviews[i].status = body.status;
          found = true;
          break;
        }
      }
      if (!found) return jsonRes({ error: 'Reseña no encontrada' }, 404);
      await env.DB.put(key, JSON.stringify(reviews));
      // Recalculate avg rating
      var approved = reviews.filter(function(r) { return r.status === 'approved'; });
      var brokersRaw = await env.DB.get('brokers');
      var brokers = brokersRaw ? JSON.parse(brokersRaw) : [];
      for (var i = 0; i < brokers.length; i++) {
        if (brokers[i].id === body.broker_id) {
          brokers[i].avg_rating = approved.length > 0 ? parseFloat((approved.reduce(function(s, r) { return s + r.rating; }, 0) / approved.length).toFixed(1)) : 0;
          brokers[i].review_count = approved.length;
          break;
        }
      }
      await env.DB.put('brokers', JSON.stringify(brokers));
      return jsonRes({ ok: true });
    }

    // ── GET /api/admin/reviews/pending ── Admin sees all pending reviews ──
    if (method === 'GET' && path === '/api/admin/reviews/pending') {
      if (!(await requireAuth(request, env))) return jsonRes({ error: 'No autorizado' }, 401);
      var brokersRaw = await env.DB.get('brokers');
      var brokers = brokersRaw ? JSON.parse(brokersRaw) : [];
      var pending = [];
      for (var b = 0; b < brokers.length; b++) {
        var raw = await env.DB.get('reviews:' + brokers[b].id);
        var reviews = raw ? JSON.parse(raw) : [];
        reviews.filter(function(r) { return r.status === 'pending'; }).forEach(function(r) {
          r.broker_name = brokers[b].nombre;
          pending.push(r);
        });
      }
      pending.sort(function(a, b) { return new Date(b.created_at) - new Date(a.created_at); });
      return jsonRes({ pending: pending });
    }

    // ── POST /api/broker/payment-request ── Broker requests plan upgrade (manual payment) ──
    if (method === 'POST' && path === '/api/broker/payment-request') {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: 'No autenticado' }, 401);
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      var plan = body.plan;
      if (plan !== 'pro' && plan !== 'premium') return jsonRes({ error: 'Plan debe ser pro o premium' }, 400);
      var paymentRequest = {
        id: crypto.randomUUID(),
        broker_id: broker.id,
        broker_name: broker.nombre,
        broker_email: broker.email || '',
        current_plan: broker.plan || 'free',
        requested_plan: plan,
        status: 'pending', // pending → confirmed → rejected
        created_at: new Date().toISOString(),
        payment_method: body.payment_method || '',
        payment_reference: body.payment_reference || '',
        notes: body.notes || '',
      };
      var key = 'payment_requests';
      var raw = await env.DB.get(key);
      var requests = raw ? JSON.parse(raw) : [];
      requests.unshift(paymentRequest);
      await env.DB.put(key, JSON.stringify(requests));
      // Notify admin
      if (NOTIFY_WEBHOOK) {
        ctx.waitUntil(fetch(NOTIFY_WEBHOOK, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'payment_request', broker: broker.nombre, plan: plan, reference: body.payment_reference || 'Sin referencia' })
        }).catch(function(){}));
      }
      return jsonRes({
        ok: true,
        id: paymentRequest.id,
        message: 'Solicitud recibida. Tu plan será activado al confirmar el pago.',
        payment_info: {
          bank: 'Banco Industrial',
          account: 'Monetaria 000-000000-0',
          name: 'ZONA INNMUEBLE',
          amount: plan === 'basico' ? 'Q149/mes' : plan === 'pro' ? 'Q349/mes' : 'Q699/mes',
          instructions: 'Realiza la transferencia o depósito y envía el comprobante por WhatsApp o sube la referencia aquí.',
        }
      });
    }

    // ── GET /api/admin/payment-requests ── Admin sees payment requests ──
    if (method === 'GET' && path === '/api/admin/payment-requests') {
      if (!(await requireAuth(request, env))) return jsonRes({ error: 'No autorizado' }, 401);
      var raw = await env.DB.get('payment_requests');
      var requests = raw ? JSON.parse(raw) : [];
      return jsonRes({ requests: requests });
    }

    // ── PUT /api/admin/payment-requests ── Admin confirms/rejects payment ──
    if (method === 'PUT' && path === '/api/admin/payment-requests') {
      if (!(await requireAuth(request, env))) return jsonRes({ error: 'No autorizado' }, 401);
      var body;
      try { body = await request.json(); } catch { return jsonRes({ error: 'JSON inválido' }, 400); }
      if (!body.request_id || !body.status) return jsonRes({ error: 'request_id y status requeridos' }, 400);
      var raw = await env.DB.get('payment_requests');
      var requests = raw ? JSON.parse(raw) : [];
      var req = null;
      for (var i = 0; i < requests.length; i++) {
        if (requests[i].id === body.request_id) {
          requests[i].status = body.status;
          requests[i].confirmed_at = new Date().toISOString();
          req = requests[i];
          break;
        }
      }
      if (!req) return jsonRes({ error: 'Solicitud no encontrada' }, 404);
      await env.DB.put('payment_requests', JSON.stringify(requests));
      // If confirmed, upgrade broker plan
      if (body.status === 'confirmed') {
        var brokersRaw = await env.DB.get('brokers');
        var brokers = brokersRaw ? JSON.parse(brokersRaw) : [];
        for (var i = 0; i < brokers.length; i++) {
          if (brokers[i].id === req.broker_id) {
            brokers[i].plan = req.requested_plan;
            brokers[i].plan_activated_at = new Date().toISOString();
            break;
          }
        }
        await env.DB.put('brokers', JSON.stringify(brokers));
      }
      return jsonRes({ ok: true, plan_upgraded: body.status === 'confirmed' });
    }

    return jsonRes({ error: 'Not found' }, 404);
  },
};