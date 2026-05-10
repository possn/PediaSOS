/* PediaSOS — main.js */

/* ── SERVICE WORKER (PWA) ── */
if ('serviceWorker' in navigator) {
  const sw = `
    const C='pediasos-v2';
    const ASSETS=['/','index.html','assets/style.css','assets/main.js','assets/logo.png'];
    self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
    self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim();});
    self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('/'))));});
  `;
  const blob = new Blob([sw], {type:'application/javascript'});
  navigator.serviceWorker.register(URL.createObjectURL(blob)).catch(()=>{});
}

/* ── PWA INSTALL BANNER ── */
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const banner = document.getElementById('install-banner');
  if (banner) banner.classList.add('show');
});
window.addEventListener('appinstalled', () => {
  const banner = document.getElementById('install-banner');
  if (banner) banner.classList.remove('show');
});
function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => { deferredPrompt = null; dismissBanner(); });
  }
}
function dismissBanner() {
  const banner = document.getElementById('install-banner');
  if (banner) banner.classList.remove('show');
}

/* ── MOBILE TAB ACTIVE STATE ── */
function setActiveTab(id) {
  document.querySelectorAll('.mob-tab, .nav-tabs a').forEach(el => el.classList.remove('active'));
  const mob = document.getElementById('m-' + id);
  const nav = document.getElementById('t-' + id);
  if (mob) mob.classList.add('active');
  if (nav) nav.classList.add('active');
}

/* ── MARK CURRENT PAGE ── */
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if (path.includes('/artigos/')) setActiveTab('artigos');
  else if (path.includes('/loja/')) setActiveTab('loja');
  else if (path.includes('/sobre')) setActiveTab('sobre');
  else if (path.includes('/calculadora')) setActiveTab('calc');
  else setActiveTab('inicio');
});
