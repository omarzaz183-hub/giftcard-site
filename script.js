/* ============================================================
   ORAVIXA — script.js
   ============================================================ */

const PRODUCTS = [
  { id:  1, name: 'Amazon Gift Card',    brand: 'Amazon',      price: 25,  emoji: '🛒', cat: 'Shopping',        color1: '#FF9900', color2: '#E47911', tag: 'Popular'    },
  { id:  2, name: 'Amazon Gift Card',    brand: 'Amazon',      price: 50,  emoji: '🛒', cat: 'Shopping',        color1: '#FF9900', color2: '#E47911', tag: 'Best Value' },
  { id:  3, name: 'Netflix Gift Card',   brand: 'Netflix',     price: 15,  emoji: '🎬', cat: 'Streaming',       color1: '#E50914', color2: '#8B0000', tag: ''           },
  { id:  4, name: 'Netflix Gift Card',   brand: 'Netflix',     price: 25,  emoji: '🎬', cat: 'Streaming',       color1: '#E50914', color2: '#8B0000', tag: 'Popular'    },
  { id:  5, name: 'PlayStation Store',   brand: 'PlayStation', price: 20,  emoji: '🎮', cat: 'Gaming',          color1: '#00439C', color2: '#001F5B', tag: ''           },
  { id:  6, name: 'PlayStation Store',   brand: 'PlayStation', price: 50,  emoji: '🎮', cat: 'Gaming',          color1: '#00439C', color2: '#001F5B', tag: 'Hot'        },
  { id:  7, name: 'Steam Wallet Code',   brand: 'Steam',       price: 20,  emoji: '🕹️', cat: 'Gaming',          color1: '#1b2838', color2: '#2a475e', tag: ''           },
  { id:  8, name: 'Google Play Card',    brand: 'Google Play', price: 15,  emoji: '📱', cat: 'Apps',            color1: '#4285F4', color2: '#34A853', tag: ''           },
  { id:  9, name: 'Xbox Gift Card',      brand: 'Xbox',        price: 25,  emoji: '🎯', cat: 'Gaming',          color1: '#107C10', color2: '#0D5E0D', tag: ''           },
  { id: 10, name: 'Apple Gift Card',     brand: 'Apple',       price: 25,  emoji: '🍎', cat: 'Apps & Services', color1: '#555555', color2: '#222222', tag: ''           },
  { id: 11, name: 'Spotify Premium',     brand: 'Spotify',     price: 10,  emoji: '🎵', cat: 'Music',           color1: '#1DB954', color2: '#158A3E', tag: 'New'        },
  { id: 12, name: 'Roblox Gift Card',    brand: 'Roblox',      price: 10,  emoji: '🧱', cat: 'Gaming',          color1: '#E2231A', color2: '#9E1913', tag: ''           },
];

const WALLET = 'TLyqzVGLV1srkB7dToTAtnSubUPvnzL7o4';

/* ---- Page detection ---- */
const path = window.location.pathname;
const PAGE = path.includes('checkout') ? 'checkout'
           : path.includes('payment')  ? 'payment'
           : 'home';

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  if (PAGE === 'home')     initHome();
  if (PAGE === 'checkout') initCheckout();
  if (PAGE === 'payment')  initPayment();
});

/* ============================================================
   NAVBAR
   ============================================================ */
function initNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  const ham   = document.getElementById('ham');
  const links = document.getElementById('navLinks');
  if (!ham || !links) return;

  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      links.classList.remove('open');
    });
  });
}

/* ============================================================
   HOME PAGE
   ============================================================ */
function initHome() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  PRODUCTS.forEach((p, i) => {
    const card = buildCard(p, i);
    grid.appendChild(card);
  });
}

function buildCard(p, i) {
  const el = document.createElement('div');
  el.className = 'card';
  el.style.cssText = `animation: fadeUp .5s cubic-bezier(.4,0,.2,1) ${i * 0.05}s both`;

  el.innerHTML = `
    <div class="card-visual" style="background:linear-gradient(135deg,${p.color1},${p.color2})">
      <span class="card-emoji">${p.emoji}</span>
      ${p.tag ? `<span class="card-tag">${p.tag}</span>` : ''}
    </div>
    <div class="card-body">
      <div class="card-cat">${p.cat}</div>
      <div class="card-name">${p.name}</div>
      <div class="card-price">
        <span class="price-amt">$${p.price}</span>
        <span class="price-cur">USD</span>
      </div>
      <button class="card-btn">Buy Now</button>
    </div>`;

  el.querySelector('.card-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    selectProduct(p);
  });
  el.addEventListener('click', () => selectProduct(p));

  applyTilt(el);
  return el;
}

function applyTilt(el) {
  const MAX = 13;

  el.addEventListener('mouseenter', () => {
    el.style.transition = 'transform .1s linear, box-shadow .3s ease, border-color .3s ease';
  });

  el.addEventListener('mousemove', (e) => {
    const r  = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top)  / r.height - .5) * -MAX * 2;
    const ry = ((e.clientX - r.left) / r.width  - .5) *  MAX * 2;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transition = 'transform .55s cubic-bezier(.4,0,.2,1), box-shadow .3s ease, border-color .3s ease';
    el.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
}

function selectProduct(p) {
  localStorage.setItem('orv_product', JSON.stringify({
    id: p.id, name: p.name, price: p.price,
    emoji: p.emoji, cat: p.cat,
    color1: p.color1, color2: p.color2,
  }));
  window.location.href = 'checkout.html';
}

/* ============================================================
   CHECKOUT PAGE
   ============================================================ */
function initCheckout() {
  const product  = getProduct();
  const coGrid   = document.getElementById('coGrid');
  const emptyEl  = document.getElementById('emptyState');
  const summaryEl = document.getElementById('orderSummary');

  if (!product) {
    coGrid  && (coGrid.style.display  = 'none');
    emptyEl && (emptyEl.style.display = 'block');
    return;
  }

  if (summaryEl) {
    summaryEl.innerHTML = `
      <h3>Order Summary</h3>
      <div class="order-visual" style="background:linear-gradient(135deg,${product.color1},${product.color2})">
        <span style="font-size:3.2rem">${product.emoji}</span>
      </div>
      <div class="order-name">${product.name}</div>
      <div class="order-cat">${product.cat}</div>
      <div class="order-div"></div>
      <div class="order-row">
        <span class="order-lbl">Total</span>
        <span class="order-total">$${product.price} USDT</span>
      </div>`;
  }

  const form     = document.getElementById('coForm');
  const emailIn  = document.getElementById('email');
  const emailErr = document.getElementById('emailErr');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailIn.value.trim();

    if (!validEmail(email)) {
      emailIn.classList.add('has-error');
      emailErr.textContent = 'Please enter a valid email address.';
      emailIn.focus();
      return;
    }

    emailIn.classList.remove('has-error');
    emailErr.textContent = '';
    localStorage.setItem('orv_email', email);
    window.location.href = 'payment.html';
  });

  emailIn.addEventListener('input', () => {
    emailIn.classList.remove('has-error');
    emailErr.textContent = '';
  });
}

/* ============================================================
   PAYMENT PAGE
   ============================================================ */
function initPayment() {
  const product = getProduct();
  const email   = localStorage.getItem('orv_email') || '';

  /* Summary bar */
  const sumEl = document.getElementById('paySummary');
  if (sumEl && product) {
    sumEl.innerHTML = `
      <div class="pay-icon" style="background:linear-gradient(135deg,${product.color1},${product.color2})">
        ${product.emoji}
      </div>
      <div class="pay-info">
        <div class="pay-name">${product.name}</div>
        <div class="pay-email">${email ? '→ ' + email : 'Digital delivery'}</div>
      </div>
      <div class="pay-amt">$${product ? product.price : '0'}</div>`;
  }

  /* Wallet */
  const addrEl = document.getElementById('walletAddr');
  if (addrEl) addrEl.textContent = WALLET;

  /* Amount */
  const amtEl = document.getElementById('amtVal');
  if (amtEl) amtEl.textContent = product ? product.price + '.00' : '0.00';

  /* QR code via free public API */
  const qrEl = document.getElementById('qrImg');
  if (qrEl) {
    qrEl.src = `https://api.qrserver.com/v1/create-qr-code/?size=186x186&data=${encodeURIComponent(WALLET)}&color=7c5cfc&bgcolor=ffffff&margin=8&format=png`;
    qrEl.alt = 'USDT TRC20 wallet QR code';
  }

  /* Copy button */
  const copyBtn = document.getElementById('copyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      copyToClipboard(WALLET, copyBtn);
    });
  }

  /* "I have paid" */
  const paidBtn     = document.getElementById('paidBtn');
  const payPanel    = document.getElementById('payPanel');
  const successPanel = document.getElementById('successPanel');
  const detailsEl   = document.getElementById('successDetails');

  if (!paidBtn) return;

  paidBtn.addEventListener('click', () => {
    paidBtn.disabled    = true;
    paidBtn.textContent = 'Verifying payment…';

    setTimeout(() => {
      payPanel    && (payPanel.style.display    = 'none');
      successPanel && (successPanel.style.display = 'block');

      if (detailsEl && product) {
        detailsEl.innerHTML = `
          <strong>${product.name}</strong> — $${product.price} USDT<br>
          <span style="color:var(--t3)">Confirmation will be sent to: ${email || 'your email'}</span>`;
      }

      localStorage.removeItem('orv_product');
      localStorage.removeItem('orv_email');
    }, 2000);
  });
}

/* ============================================================
   HELPERS
   ============================================================ */
function getProduct() {
  try { return JSON.parse(localStorage.getItem('orv_product')); }
  catch { return null; }
}

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function copyToClipboard(text, btn) {
  const tick = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  const copy = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

  const done = () => {
    btn.classList.add('copied');
    btn.innerHTML = tick;
    setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = copy; }, 2200);
  };

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); cb(); } catch (_) {}
  document.body.removeChild(ta);
}
