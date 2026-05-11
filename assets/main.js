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
