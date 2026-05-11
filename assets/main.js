/* PediaSOS — main.js v16 */

/* ── DETECTAR BASE PATH ── */
const BASE = window.location.pathname.startsWith('/PediaSOS') ? '/PediaSOS/' : '/';

/* ── SERVICE WORKER ── */
if ('serviceWorker' in navigator) {
  // Unregister ALL old service workers first, then register new one
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(r => r.unregister());
  }).then(() => {
    const sw = `
      const C='pediasos-v16';
      const BASE='${BASE}';
      const ASSETS=[
        BASE,
        BASE+'index.html',
        BASE+'assets/style.css',
        BASE+'assets/main.js',
        BASE+'assets/logo.png',
        BASE+'assets/icon-192.png',
        BASE+'assets/icon-512.png',
        BASE+'manifest.json'
      ];
      self.addEventListener('install',e=>{
        e.waitUntil(
          caches.open(C).then(c=>c.addAll(ASSETS).catch(()=>{}))
        );
        self.skipWaiting();
      });
      self.addEventListener('activate',e=>{
        e.waitUntil(
          caches.keys().then(ks=>Promise.all(
            ks.filter(k=>k!==C).map(k=>caches.delete(k))
          ))
        );
        self.clients.claim();
      });
      self.addEventListener('fetch',e=>{
        // Network first for HTML, cache first for assets
        const url = new URL(e.request.url);
        if(url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
          e.respondWith(
            fetch(e.request).catch(()=>caches.match(e.request))
          );
        } else {
          e.respondWith(
            caches.match(e.request).then(r=>r||fetch(e.request))
          );
        }
      });
    `;
    const blob = new Blob([sw], {type:'application/javascript'});
    navigator.serviceWorker.register(URL.createObjectURL(blob)).catch(()=>{});
  });
}

/* ── DRAWER ── */
function openDrawer(){
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawer-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeDrawer(){
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer();});

/* ── ENSURE DRAWER STARTS CLOSED ── */
document.addEventListener('DOMContentLoaded',()=>{
  // Force drawer closed on load
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  if(drawer) drawer.classList.remove('open');
  if(overlay) overlay.classList.remove('open');
  document.body.style.overflow='';

  // Mark active tab
  const path = window.location.pathname;
  if(path.includes('/artigos/')) setActiveTab('artigos');
  else if(path.includes('/loja/')) setActiveTab('loja');
  else if(path.includes('/blog/')) setActiveTab('blog');
  else if(path.includes('/links/')) setActiveTab('links');
  else if(path.includes('/primeiros-socorros/')) setActiveTab('ps');
  else if(path.includes('/membros/')) setActiveTab('membros');
  else setActiveTab('inicio');
});

function setActiveTab(id){
  document.querySelectorAll('.mob-tab,.nav-tabs a').forEach(el=>el.classList.remove('active'));
  const mob=document.getElementById('m-'+id);
  const nav=document.getElementById('t-'+id);
  if(mob) mob.classList.add('active');
  if(nav) nav.classList.add('active');
}

/* ── PWA INSTALL ── */
let deferredPrompt;
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  deferredPrompt=e;
  const b=document.getElementById('install-banner');
  if(b) b.classList.add('show');
});
function installApp(){
  if(deferredPrompt){
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(()=>{deferredPrompt=null;dismissBanner();});
  }
}
function dismissBanner(){
  const b=document.getElementById('install-banner');
  if(b) b.classList.remove('show');
}
