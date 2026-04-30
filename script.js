/* ================================================================
   ORAVIXA  ·  script.js
   ================================================================ */

/* ── Products ─────────────────────────────────────────────────── */
const PRODUCTS = [
  { id:1,  name:'Amazon Gift Card',   cat:'Shopping',        price:25,  emoji:'🛒', c1:'#FF9900', c2:'#C45500', tag:'Popular'    },
  { id:2,  name:'Amazon Gift Card',   cat:'Shopping',        price:50,  emoji:'🛒', c1:'#FF9900', c2:'#C45500', tag:'Best Value' },
  { id:3,  name:'Netflix Gift Card',  cat:'Streaming',       price:15,  emoji:'🎬', c1:'#E50914', c2:'#831010', tag:''           },
  { id:4,  name:'Netflix Gift Card',  cat:'Streaming',       price:25,  emoji:'🎬', c1:'#E50914', c2:'#831010', tag:'Popular'    },
  { id:5,  name:'PlayStation Store',  cat:'Gaming',          price:20,  emoji:'🎮', c1:'#00439C', c2:'#001B4E', tag:''           },
  { id:6,  name:'PlayStation Store',  cat:'Gaming',          price:50,  emoji:'🎮', c1:'#00439C', c2:'#001B4E', tag:'Hot'        },
  { id:7,  name:'Steam Wallet Code',  cat:'Gaming',          price:20,  emoji:'🕹️', c1:'#1B2838', c2:'#2A475E', tag:''           },
  { id:8,  name:'Google Play Card',   cat:'Apps',            price:15,  emoji:'📱', c1:'#4285F4', c2:'#0D47A1', tag:''           },
  { id:9,  name:'Xbox Gift Card',     cat:'Gaming',          price:25,  emoji:'🎯', c1:'#107C10', c2:'#0A5C0A', tag:''           },
  { id:10, name:'Apple Gift Card',    cat:'Apps & Services', price:25,  emoji:'🍎', c1:'#4A4A4A', c2:'#1A1A1A', tag:''           },
  { id:11, name:'Spotify Premium',    cat:'Music',           price:10,  emoji:'🎵', c1:'#1DB954', c2:'#128040', tag:'New'        },
  { id:12, name:'Roblox Gift Card',   cat:'Gaming',          price:10,  emoji:'🧱', c1:'#E2231A', c2:'#9B1813', tag:''           },
];

/* Demo USDT TRC20 address */
const WALLET = 'TLyqzVGLV1srkB7dToTAtnSubUPvnzL7o4';

/* ── Routing ──────────────────────────────────────────────────── */
const loc = window.location.pathname;
const PAGE = loc.includes('checkout') ? 'checkout'
           : loc.includes('payment')  ? 'payment'
           : 'home';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  if (PAGE === 'home')     initHome();
  if (PAGE === 'checkout') initCheckout();
  if (PAGE === 'payment')  initPayment();
});

/* ── Navbar ───────────────────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20), {passive:true});
  }

  const ham   = document.getElementById('ham');
  const links = document.getElementById('navLinks');
  if (!ham || !links) return;

  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('.nav__link').forEach(a =>
    a.addEventListener('click', () => { ham.classList.remove('open'); links.classList.remove('open'); })
  );
}

/* ── Home ─────────────────────────────────────────────────────── */
function initHome() {
  const grid = document.getElementById('grid');
  if (!grid) return;
  PRODUCTS.forEach((p, i) => grid.appendChild(makeCard(p, i)));
}

function makeCard(p, i) {
  const el = document.createElement('div');
  el.className = 'card';
  el.style.animation = `up .5s cubic-bezier(.4,0,.2,1) ${i * .05}s both`;

  el.innerHTML = `
    <div class="card__vis" style="background:linear-gradient(135deg,${p.c1},${p.c2})">
      <span class="card__emoji">${p.emoji}</span>
      ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ''}
    </div>
    <div class="card__body">
      <div class="card__cat">${p.cat}</div>
      <div class="card__name">${p.name}</div>
      <div class="card__price">
        <span class="price__n">$${p.price}</span>
        <span class="price__u">USD</span>
      </div>
      <button class="card__btn">Buy Now</button>
    </div>`;

  const buy = () => {
    localStorage.setItem('orv_product', JSON.stringify({
      id: p.id, name: p.name, cat: p.cat, price: p.price,
      emoji: p.emoji, c1: p.c1, c2: p.c2,
    }));
    window.location.href = 'checkout.html';
  };

  el.querySelector('.card__btn').addEventListener('click', e => { e.stopPropagation(); buy(); });
  el.addEventListener('click', buy);
  tilt(el);
  return el;
}

/* 3-D tilt on hover */
function tilt(el) {
  const MAX = 14;
  el.addEventListener('mouseenter', () =>
    el.style.transition = 'transform .08s linear, border-color .3s, box-shadow .3s');
  el.addEventListener('mousemove', e => {
    const r  = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top)  / r.height - .5) * -MAX * 2;
    const ry = ((e.clientX - r.left) / r.width  - .5) *  MAX * 2;
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1), border-color .3s, box-shadow .3s';
    el.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
  });
}

/* ── Checkout ─────────────────────────────────────────────────── */
function initCheckout() {
  const product = load('orv_product');
  const coGrid  = document.getElementById('coGrid');
  const empty   = document.getElementById('empty');
  const sumEl   = document.getElementById('summary');

  if (!product) {
    coGrid && (coGrid.style.display = 'none');
    empty  && (empty.style.display  = 'block');
    return;
  }

  if (sumEl) sumEl.innerHTML = `
    <p class="panel__h">Order Summary</p>
    <div class="sum__vis" style="background:linear-gradient(135deg,${product.c1},${product.c2})">
      <span style="font-size:3rem">${product.emoji}</span>
    </div>
    <div class="sum__name">${product.name}</div>
    <div class="sum__cat">${product.cat}</div>
    <div class="sum__div"></div>
    <div class="sum__row">
      <span class="sum__lbl">Total</span>
      <span class="sum__val">$${product.price} USDT</span>
    </div>`;

  const form   = document.getElementById('form');
  const emailI = document.getElementById('email');
  const emailE = document.getElementById('emailErr');

  form && form.addEventListener('submit', e => {
    e.preventDefault();
    const v = emailI.value.trim();
    if (!isEmail(v)) {
      emailI.classList.add('err');
      emailE.textContent = 'Please enter a valid email address.';
      emailI.focus();
      return;
    }
    emailI.classList.remove('err');
    emailE.textContent = '';
    localStorage.setItem('orv_email', v);
    window.location.href = 'payment.html';
  });

  emailI && emailI.addEventListener('input', () => {
    emailI.classList.remove('err');
    emailE && (emailE.textContent = '');
  });
}

/* ── Payment ──────────────────────────────────────────────────── */
function initPayment() {
  const product = load('orv_product');
  const email   = localStorage.getItem('orv_email') || '';

  /* top bar */
  const topEl = document.getElementById('payTop');
  if (topEl) {
    const price = product ? product.price : '—';
    const grad  = product ? `linear-gradient(135deg,${product.c1},${product.c2})` : '#333';
    topEl.innerHTML = `
      <div class="pay__ico" style="background:${grad}">${product ? product.emoji : '🎁'}</div>
      <div class="pay__inf">
        <div class="pay__name">${product ? product.name : 'Gift Card'}</div>
        <div class="pay__email">${email ? '→ ' + email : 'Digital delivery'}</div>
      </div>
      <div class="pay__price">$${price}</div>`;
  }

  /* wallet address */
  const addrEl = document.getElementById('addr');
  if (addrEl) addrEl.textContent = WALLET;

  /* amount */
  const amtEl = document.getElementById('amount');
  if (amtEl) amtEl.textContent = (product ? product.price : '0') + '.00';

  /* QR code — public free API */
  const qrEl = document.getElementById('qr');
  if (qrEl) {
    qrEl.src = `https://api.qrserver.com/v1/create-qr-code/?size=184x184&data=${encodeURIComponent(WALLET)}&color=000000&bgcolor=ffffff&margin=8&format=png`;
    qrEl.alt = 'USDT TRC20 wallet QR code';
  }

  /* copy button */
  const copyBtn = document.getElementById('copyBtn');
  copyBtn && copyBtn.addEventListener('click', () => clip(WALLET, copyBtn));

  /* "I have paid" */
  const paidBtn    = document.getElementById('paidBtn');
  const payPanel   = document.getElementById('payPanel');
  const okPanel    = document.getElementById('okPanel');
  const detailsEl  = document.getElementById('details');

  paidBtn && paidBtn.addEventListener('click', () => {
    paidBtn.disabled    = true;
    paidBtn.textContent = 'Verifying…';

    setTimeout(() => {
      payPanel  && (payPanel.style.display  = 'none');
      okPanel   && (okPanel.style.display   = 'block');
      if (detailsEl && product)
        detailsEl.innerHTML =
          `<strong>${product.name}</strong> — $${product.price} USDT<br>
           <span style="color:var(--txt3)">Confirmation → ${email || 'your email'}</span>`;

      localStorage.removeItem('orv_product');
      localStorage.removeItem('orv_email');
    }, 1800);
  });
}

/* ── Helpers ──────────────────────────────────────────────────── */
function load(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function clip(text, btn) {
  const ICON_COPY = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
  const ICON_TICK = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;

  const done = () => {
    btn.classList.add('copied'); btn.innerHTML = ICON_TICK;
    setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = ICON_COPY; }, 2000);
  };

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallback(text, done));
  } else fallback(text, done);
}

function fallback(text, cb) {
  const ta = Object.assign(document.createElement('textarea'),
    { value: text, style: 'position:fixed;opacity:0' });
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); cb(); } catch {}
  document.body.removeChild(ta);
}
