// English section: buying property in Guatemala from abroad
const { layout, WA } = require('./layout');
const { escapeHtml, ikTransform } = require('../../shared/utils');
const A = require('../analysis');
const { I } = require('./blocks');

const wa = m => `https://wa.me/${WA}?text=${encodeURIComponent(m)}`;
const TYPE = { Casa: 'House', Apartamento: 'Apartment', Terreno: 'Land', Finca: 'Farm / estate' };
const TYPE_PL = { Casa: 'Houses', Apartamento: 'Apartments', Terreno: 'Land', Finca: 'Farms' };
const POS = { bajo: 'Below zone range', medio: 'Within zone range', alto: 'Above zone range' };

function fechaEn() {
  const D = A.loadZoneData();
  return D.fecha ? new Date(D.fecha + 'T12:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
}
function loc(p) {
  const parts = [p.zona, p.municipio].map(x => (x || '').trim()).filter(x => x && !/^guatemala$/i.test(x));
  return parts.filter((x, i) => parts.findIndex(y => y.toLowerCase() === x.toLowerCase()) === i).join(' · ') || 'Guatemala';
}

function enCard(p, i) {
  const cfg = p.privConfig || {};
  const hide = p.esExclusiva || cfg.exclusiva || cfg.precio;
  const k = A.tipoKey(p);
  const a = A.analyze(p);
  const pr = A.priceInfo(p);
  const img = ikTransform(p.mainImage || (p.gallery || [])[0] || '', { w: 600, q: 70 });
  const land = k === 'Terreno' || k === 'Finca';
  const meta = [];
  if (!land && parseInt(p.habitaciones)) meta.push(p.habitaciones + ' bd');
  const b = (parseFloat(p.banos) || 0) + (parseFloat(p.mediosBanos) || 0) * 0.5;
  if (!land && b) meta.push(String(b).replace('.0', '') + ' ba');
  const ar = parseFloat(String(p.areaConst || p.area || '').replace(/,/g, ''));
  if (ar && !land) meta.push(Math.round(ar) + ' m²');
  const price = hide ? 'Price on request' : (pr ? '$' + Math.round(pr.usd / 1000).toLocaleString('en-US') + 'K' + (pr.isUSD ? '' : ' approx.') : escapeHtml(p.priceFormatted || ''));
  return `<div class="prop-card-wrap"><a class="prop-card" href="/propiedades/${escapeHtml(p.slug)}.html" data-tipo="${escapeHtml(k || '')}" data-precio="${pr ? Math.round(pr.usd) : 0}">
    <img src="${escapeHtml(img)}" alt="${escapeHtml((TYPE[k] || 'Property') + ' in ' + loc(p))}" loading="${i < 3 ? 'eager' : 'lazy'}" width="600" height="750">
    <div class="pc-ov"></div>
    <div class="pc-info">
      ${a && a.pricePos ? `<span class="pc-za pc-za-${a.pricePos}">${POS[a.pricePos]}</span>` : ''}
      <div class="pc-tipo">${escapeHtml(TYPE[k] || p.tipo)} · ${escapeHtml(loc(p))}</div>
      <div class="pc-title">${escapeHtml(p.title || p.titulo)}</div>
      ${meta.length ? `<div class="pc-meta">${meta.map(m => `<span>${m}</span>`).join('')}</div>` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center"><div class="pc-price">${price}</div><span class="pc-arr">→</span></div>
    </div></a></div>`;
}

function zoneRows(ids) {
  const D = A.loadZoneData();
  const byId = {}; D.lugares.forEach(l => { byId[l.id] = l; });
  return ids.map(id => byId[id]).filter(Boolean);
}

// ── /en/ ────────────────────────────────────────────────────────────
function enHome(props) {
  const D = A.loadZoneData();
  const nAn = (D.n_anuncios || 0).toLocaleString('en-US');
  const featured = props.filter(p => A.priceInfo(p) && (p.mainImage || (p.gallery || [])[0])).slice(0, 6);
  const zones = zoneRows(['M:Zona 10', 'M:Zona 14', 'M:Zona 15', 'M:Zona 16', 'M:Carretera a El Salvador', 'M:Fraijanes', 'M:Antigua Guatemala / Sacatepéquez']);
  const body = `
<section class="h2-hero" style="min-height:86vh">
  <video autoplay muted loop playsinline preload="metadata" aria-hidden="true" poster="/assets/finca-premium.jpg"><source src="https://ik.imagekit.io/Zona/Zona_INNmueble_Guatemala_Hero_16_9.webm" type="video/webm"></video>
  <div class="h2-ov"></div>
  <div class="h2-wrap" style="grid-template-columns:1fr">
    <div style="max-width:780px">
      <div class="h2-ey"><span class="h2-chip"><span class="dot"></span>For Guatemalans and investors living abroad</span></div>
      <h1 class="h2-h1">Buy in Guatemala<br><em>without buying blind.</em></h1>
      <p class="h2-lead" style="max-width:600px">Every property we show comes with a market-value analysis, what to check before you offer, and an advisor on the ground who handles visits, documents and closing for you.</p>
      <div class="h2-ctas">
        <a href="${wa('Hi, I live abroad and I am interested in buying property in Guatemala. Can we schedule a call?')}" target="_blank" rel="noopener" class="btn-gold">${I.wa} Book a video call</a>
        <a href="/en/properties.html" class="btn-ghost">See analyzed properties</a>
      </div>
      <div class="h2-proof"><span><b>${nAn}</b> listings in our price index</span><span><b>360°</b> virtual tours</span><span>Updates by <b>WhatsApp</b></span></div>
    </div>
  </div>
</section>

<section class="sec" style="background:var(--ink2)">
  <div class="sec-in">
    <div class="sec-head"><div><div class="ey">How remote buying works</div><h2 class="st">From your city <em>to the deed.</em></h2></div>
      <p>You decide; we do the legwork in Guatemala and keep you informed at every step.</p></div>
    <div class="method m5">
      <div class="method-step"><div class="method-n">01</div><h3>Discovery call</h3><p>A video call to understand your goal: a home for family, a rental, retirement or a long-term asset.</p></div>
      <div class="method-step"><div class="method-n">02</div><h3>Shortlist</h3><p>Properties with an analysis sheet, live video walk-throughs and, when available, 360° tours.</p></div>
      <div class="method-step"><div class="method-n">03</div><h3>Due diligence</h3><p>Title at the Property Registry, liens, property tax (IUSI) and measurements, checked before any offer.</p></div>
      <div class="method-step"><div class="method-n">04</div><h3>Offer and signing</h3><p>Sign on a trip, or remotely through a power of attorney. We coordinate with a Guatemalan notary on the right option for you.</p></div>
      <div class="method-step"><div class="method-n">05</div><h3>Closing</h3><p>Registration, handover and, if you rent it out, introductions to local property management.</p></div>
    </div>
  </div>
</section>

<section style="padding:100px 0 0;background:var(--ink)">
  <div class="sec-in" style="padding:0 6% 40px"><div class="sec-head" style="margin-bottom:0"><div><div class="ey">Analyzed properties</div><h2 class="st">Each one compared <em>with its market</em></h2></div>
    <p>Listings open in Spanish. Each one includes a market analysis, estimated commute and a due-diligence checklist. Ask us for an English summary of any property.</p></div></div>
  <div class="prop-grid">${featured.map((p, i) => enCard(p, i)).join('')}</div>
  <div style="text-align:center;padding:40px 6%"><a href="/en/properties.html" class="btn-ghost">See all properties ${I.arrow}</a></div>
</section>

<section class="sec" style="background:var(--ink2)">
  <div class="sec-in split" style="align-items:start">
    <div>
      <div class="ey">What it really costs</div>
      <h2 class="st-large">Purchase costs in Guatemala, <em style="color:var(--or)">in plain numbers</em></h2>
      <ul class="checks">
        <li>${I.check}<span><b>Resale property:</b> 3% stamp tax (timbres fiscales) on the deed value.</span></li>
        <li>${I.check}<span><b>New property, first sale:</b> 12% VAT, usually already included in the developer&rsquo;s price.</span></li>
        <li>${I.check}<span><b>Notary fees:</b> about 1% of the price; <b>Property Registry:</b> about 0.15%.</span></li>
        <li>${I.check}<span><b>Annual property tax (IUSI):</b> low compared with the US; we confirm it is paid up before you buy.</span></li>
      </ul>
      <p class="src-note">Reference percentages; your notary confirms exact amounts for each transaction.</p>
    </div>
    <div>
      <div class="ey">Can foreigners buy?</div>
      <h2 class="st-large">Yes, <em style="color:var(--or)">with a few exceptions</em></h2>
      <p style="font-size:.88rem;color:var(--sv);line-height:1.85;font-weight:300;margin-top:14px">Foreigners and Guatemalans living abroad can own property in Guatemala with broadly the same rights as residents. Restrictions apply near international borders and on State-owned coastal reserve land, which is leased rather than sold. We check this for every property before you commit.</p>
      <a href="${wa('Hi, I have questions about buying property in Guatemala from abroad.')}" target="_blank" rel="noopener" class="btn-gold" style="margin-top:22px">${I.wa} Ask us anything</a>
    </div>
  </div>
</section>

<section class="sec" style="background:var(--ink)">
  <div class="sec-in">
    <div class="sec-head"><div><div class="ey">Zona-INNmueble price index</div><h2 class="st">Know the market <em>before you fly in</em></h2></div>
      <p>Median asking price per m² for houses, from ${nAn} published listings. Data as of ${escapeHtml(fechaEn())}.</p></div>
    <div class="idx-mini">${zones.map(z => z.tipos.Casa && z.tipos.Casa.m2 ? `<div><span>${escapeHtml(z.nombre)}</span><b>$${z.tipos.Casa.m2[1].toLocaleString('en-US')}/m² · typical ${A.fmtUSD(z.tipos.Casa.precio[1])}</b></div>` : '').join('')}</div>
    <div style="margin-top:24px"><a href="/en/price-index.html" class="btn-ghost">Full price index ${I.arrow}</a></div>
  </div>
</section>

<section class="sec" style="background:var(--ink2)">
  <div class="sec-in">
    <div class="sec-head"><div><div class="ey">Why Zona-INNmueble</div><h2 class="st">We don&rsquo;t sell <em>for the sake of selling.</em></h2></div></div>
    <div class="commit">
      <div><h4>Analysis first</h4><p>Every price is compared with its zone. You see if it is below, within or above the typical range.</p></div>
      <div><h4>The good and the caveats</h4><p>We tell you what to verify (age, maintenance fees, commute, documents) before you decide.</p></div>
      <div><h4>Eyes on the ground</h4><p>Live video visits and 360° tours so you can shortlist without flying back and forth.</p></div>
      <div><h4>No pressure</h4><p>If a property doesn&rsquo;t fit your goal, we say so.</p></div>
    </div>
  </div>
</section>

<section class="sec" style="background:var(--ink);text-align:center">
  <div style="max-width:640px;margin:0 auto">
    <div class="ey" style="justify-content:center">Start today</div>
    <h2 class="st">Your next property starts <em>with a better decision.</em></h2>
    <p style="font-size:.86rem;color:var(--sv);line-height:1.9;margin:10px 0 30px;font-weight:300">Tell us what you are looking for and where you live. We will reply on WhatsApp and schedule a call at a time that works in your time zone.</p>
    <a href="${wa('Hi, I live abroad and I would like advice on buying property in Guatemala.')}" target="_blank" rel="noopener" class="btn-gold">${I.wa} Message us on WhatsApp</a>
  </div>
</section>`;
  return layout({ title: 'Buy Property in Guatemala from Abroad', desc: 'Buy a house, apartment, land or farm in Guatemala from the US or anywhere abroad. Market-value analysis for every property, 360° tours, due diligence and an advisor on the ground.', canonical: '/en/', body, lang: 'en', alternates: { es: '/', en: '/en/' } });
}

// ── /en/properties.html ─────────────────────────────────────────────
function enProperties(props) {
  const types = ['Casa', 'Apartamento', 'Terreno', 'Finca'].filter(k => props.some(p => A.tipoKey(p) === k));
  const body = `
<section class="pg-hero" style="padding-bottom:30px"><div class="sec-in">
  <div class="ey">Properties in Guatemala</div>
  <h1 class="pg-h1" style="font-size:clamp(2.2rem,5vw,3.8rem)">${props.length} properties, <em>each with its analysis</em></h1>
  <p class="pg-lead">Prices in US dollars (properties listed in quetzales are converted at a reference rate). Listing pages are in Spanish; ask us on WhatsApp for an English summary.</p>
  <div class="seg" id="enSeg" style="margin-top:24px"><button class="on" data-t="">All</button>${types.map(k => `<button data-t="${k}">${TYPE_PL[k]}</button>`).join('')}</div>
</div></section>
<div class="prop-grid" id="enGrid" style="background:var(--ink)">${props.map((p, i) => enCard(p, i)).join('')}</div>
<section class="sec" style="background:var(--ink);text-align:center;padding-top:60px"><a href="${wa('Hi, I saw your properties in English. Could you send me more information?')}" target="_blank" rel="noopener" class="btn-gold">${I.wa} Ask about a property</a></section>
<script>
(function(){var s=document.getElementById('enSeg');s.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){s.querySelectorAll('button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');document.querySelectorAll('#enGrid .prop-card').forEach(function(c){c.parentElement.style.display=(!b.dataset.t||c.dataset.tipo===b.dataset.t)?'':'none';});});});})();
</script>`;
  return layout({ title: 'Properties for Sale in Guatemala', desc: `Houses, land and farms for sale in Guatemala City, Carretera a El Salvador, Fraijanes and more, each with a market-value analysis. Prices in US dollars.`, canonical: '/en/properties.html', body, lang: 'en', alternates: { es: '/propiedades.html', en: '/en/properties.html' } });
}

// ── /en/price-index.html ────────────────────────────────────────────
function enIndex() {
  const D = A.loadZoneData();
  const byId = {}; D.lugares.forEach(l => { byId[l.id] = l; });
  const PRI = ['M:Zona 10', 'M:Zona 14', 'M:Zona 15', 'M:Zona 16', 'S:Cayalá', 'S:Vista Hermosa', 'M:Carretera a El Salvador', 'M:Fraijanes', 'M:San Cristóbal', 'M:Zona 13', 'M:Antigua Guatemala / Sacatepéquez', 'U:puerto san jose', 'U:monterrico'];
  const rows = (t) => PRI.map(id => byId[id]).filter(l => l && l.tipos[t]).map(l => {
    const d = l.tipos[t];
    return `<tr data-t="${t}"><td>${escapeHtml(A.zoneTitle(l, byId))}</td><td>${d.m2 ? `<b>$${d.m2[1].toLocaleString('en-US')}</b>` : '–'}</td><td>${d.m2 ? `$${d.m2[0].toLocaleString('en-US')} – $${d.m2[2].toLocaleString('en-US')}` : '–'}</td><td>${A.fmtUSD(d.precio[1])}</td><td>${d.renta ? '$' + Math.round(d.renta[1]).toLocaleString('en-US') : '–'}</td><td>${d.rend ? (d.rend * 100).toFixed(1) + '%' : '–'}</td><td>${d.n}</td></tr>`;
  }).join('');
  const types = ['Casa', 'Apartamento', 'Terreno', 'Finca'];
  const body = `
<section class="pg-hero grid-bg"><div class="sec-in">
  <div class="ey">Zona-INNmueble price index</div>
  <h1 class="pg-h1">Property prices in Guatemala <em>by zone</em></h1>
  <p class="pg-lead">Median asking price per m², typical price, rent and gross rental yield, from ${(D.n_anuncios || 0).toLocaleString('en-US')} listings for sale and ${(D.n_rentas || 0).toLocaleString('en-US')} for rent. Data as of ${escapeHtml(fechaEn())}.</p>
</div></section>
<section class="sec" style="background:var(--ink2);padding-top:56px"><div class="sec-in">
  <div class="seg" id="eiSeg">${types.map((t, i) => `<button class="${i ? '' : 'on'}" data-t="${t}">${TYPE_PL[t]}</button>`).join('')}</div>
  <div class="tbl-wrap"><table class="tbl" id="eiTbl"><thead><tr><th>Zone</th><th>Median US$/m²</th><th>Typical range US$/m²</th><th>Typical price</th><th>Typical rent/month</th><th>Gross yield</th><th>Listings</th></tr></thead>
  <tbody>${types.map(rows).join('')}</tbody></table></div>
  <p class="src-note" style="margin-top:16px">Asking prices, not closing prices; not an appraisal. Typical range = 25th to 75th percentile. Price per m² is per built m² for houses and apartments, per land m² for land and farms. <a href="/indice.html">Full index in Spanish</a>.</p>
  <a href="${wa('Hi, I would like a price analysis of a specific property in Guatemala.')}" target="_blank" rel="noopener" class="btn-gold" style="margin-top:24px">${I.wa} Request a property analysis</a>
</div></section>
<script>(function(){var s=document.getElementById('eiSeg'),r=document.querySelectorAll('#eiTbl tbody tr');function f(t){r.forEach(function(x){x.style.display=x.dataset.t===t?'':'none'});s.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.dataset.t===t)});}s.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){f(b.dataset.t)})});f('Casa');})();</script>`;
  return layout({ title: 'Guatemala Property Price Index by Zone', desc: 'Price per m², typical price, rent and rental yield by zone in Guatemala City, Carretera a El Salvador, Fraijanes, Antigua and more.', canonical: '/en/price-index.html', body, lang: 'en', alternates: { es: '/indice.html', en: '/en/price-index.html' } });
}

module.exports = { enHome, enProperties, enIndex };
