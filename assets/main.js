/* PediaSOS — main.js v17 */

/* ── SERVICE WORKER — ficheiro externo (funciona em PWA iOS) ── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Desregistar SWs antigos primeiro
    navigator.serviceWorker.getRegistrations().then(regs => {
      const oldRegs = regs.filter(r => !r.active?.scriptURL?.includes('sw.js'));
      return Promise.all(oldRegs.map(r => r.unregister()));
    }).then(() => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  });
}

/* ── DRAWER ── */
function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawer-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  // Garantir drawer fechado
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');

  // Tab activa
  const path = window.location.pathname;
  if (path.includes('/artigos/')) setActiveTab('artigos');
  else if (path.includes('/loja/')) setActiveTab('loja');
  else if (path.includes('/blog/')) setActiveTab('blog');
  else if (path.includes('/links/')) setActiveTab('links');
  else if (path.includes('/primeiros-socorros/')) setActiveTab('ps');
  else if (path.includes('/membros/')) setActiveTab('membros');
  else setActiveTab('inicio');
});

function setActiveTab(id) {
  document.querySelectorAll('.mob-tab, .nav-tabs a').forEach(el => el.classList.remove('active'));
  const mob = document.getElementById('m-' + id);
  const nav = document.getElementById('t-' + id);
  if (mob) mob.classList.add('active');
  if (nav) nav.classList.add('active');
}

/* ── PWA INSTALL ── */
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const b = document.getElementById('install-banner');
  if (b) b.classList.add('show');
});
function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => { deferredPrompt = null; dismissBanner(); });
  }
}
function dismissBanner() {
  const b = document.getElementById('install-banner');
  if (b) b.classList.remove('show');
}

/* ── READING PROGRESS BAR ── */
(function(){
  const bar = document.createElement('div');
  bar.className = 'read-progress';
  bar.id = 'read-progress';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const scrolled = doc.scrollTop || document.body.scrollTop;
    const total = doc.scrollHeight - doc.clientHeight;
    const pct = total > 0 ? (scrolled / total * 100) : 0;
    bar.style.width = pct + '%';
  }, {passive: true});
})();

/* ── READING TIME ── */
function calcReadTime() {
  const content = document.querySelector('.article-content, .blog-content');
  if (!content) return;
  const words = content.innerText.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  const stag = document.querySelector('.stag');
  if (stag && !stag.querySelector('.read-time-badge')) {
    const badge = document.createElement('span');
    badge.className = 'read-time-badge';
    badge.style.marginLeft = '8px';
    badge.innerHTML = `⏱ ${mins} min`;
    stag.appendChild(badge);
  }
}

/* ── NATIVE SHARE ── */
function shareArticle() {
  const title = document.title.replace(' | PediaSOS', '');
  const url = window.location.href;
  const text = document.querySelector('meta[name="description"]')?.content || '';
  if (navigator.share) {
    navigator.share({ title, text, url }).catch(() => {});
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard?.writeText(url).then(() => {
      const btn = document.getElementById('share-native-btn');
      if (btn) { btn.textContent = '✓ Link copiado!'; setTimeout(() => btn.innerHTML = '↗ Partilhar', 2000); }
    });
  }
}

/* ── NEWSLETTER (Brevo/Sendinblue free tier) ── */
function subscribeNewsletter(e) {
  e.preventDefault();
  const input = document.getElementById('nl-email');
  const btn = document.getElementById('nl-btn');
  const success = document.getElementById('nl-success');
  const form = document.getElementById('nl-form');
  if (!input?.value || !input.value.includes('@')) {
    input.style.outline = '2px solid #E53E3E';
    return;
  }
  btn.textContent = '...';
  btn.disabled = true;
  // Store email locally (replace with Brevo API when ready)
  const emails = JSON.parse(localStorage.getItem('pediasos_subs') || '[]');
  emails.push({email: input.value, date: new Date().toISOString()});
  localStorage.setItem('pediasos_subs', JSON.stringify(emails));
  setTimeout(() => {
    if (form) form.style.display = 'none';
    if (success) success.style.display = 'block';
  }, 800);
}

/* ── INIT ALL UX FEATURES ── */
document.addEventListener('DOMContentLoaded', () => {
  calcReadTime();
  // Add share button if on article/blog page
  const shareRow = document.querySelector('.art-share');
  if (shareRow) {
    const btn = document.createElement('button');
    btn.id = 'share-native-btn';
    btn.className = 'share-native-btn';
    btn.innerHTML = '↗ Partilhar';
    btn.onclick = shareArticle;
    shareRow.insertBefore(btn, shareRow.firstChild);
  }
});
