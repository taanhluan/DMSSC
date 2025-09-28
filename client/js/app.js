// ===== Router bindings =====
import "./api.js";  // Global API
import { route, startRouter } from './router.js';
import Dashboard from './views/dashboard.js';
import Backlog from './views/backlog.js';
import Tasks from './views/tasks.js';
import Report from './views/report.js';

route('#/dashboard', Dashboard);
route('#/backlog', Backlog);
route('#/tasks', Tasks);
route('#/report', Report);

// ===== UI glue: sidebar toggle, toast, active link, route status, resize sync =====
const sidebar   = document.getElementById('sidebar');
const backdrop  = document.getElementById('sbBackdrop');
const openBtn   = document.getElementById('btnOpenSidebar');
const toastArea = document.getElementById('toast');
const statusEl  = document.getElementById('status');

// Sidebar open/close
function openSidebar(){
  sidebar?.setAttribute('data-state', 'open');
  backdrop?.setAttribute('data-show', 'true');
  openBtn?.setAttribute('aria-expanded', 'true');
}
function closeSidebar(){
  sidebar?.setAttribute('data-state', 'closed');
  backdrop?.removeAttribute('data-show');
  openBtn?.setAttribute('aria-expanded', 'false');
}
openBtn?.addEventListener('click', () => {
  (sidebar?.getAttribute('data-state') === 'open') ? closeSidebar() : openSidebar();
});
backdrop?.addEventListener('click', closeSidebar);

// Sync khi resize: >1024 mở sidebar, tắt backdrop
function syncSidebarOnResize(){
  if (window.innerWidth > 1024) {
    sidebar?.setAttribute('data-state','open');
    backdrop?.removeAttribute('data-show');
    openBtn?.setAttribute('aria-expanded','true');
  }
}
window.addEventListener('resize', syncSidebarOnResize);
syncSidebarOnResize();

// Toast helper (có thể import ở view khác)
export function pushToast(msg, kind = 'ok'){
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.role = 'status';
  el.innerText = msg;
  toastArea?.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

// Active link theo hash + status
function markActiveRoute(){
  const hash = location.hash || '#/dashboard';
  document.querySelectorAll('[data-route]').forEach(a => {
    if (a.getAttribute('href') === hash) a.classList.add('active');
    else a.classList.remove('active');
  });
  if (statusEl) statusEl.textContent = `Route: ${hash}`;
}
window.addEventListener('hashchange', markActiveRoute);
markActiveRoute();

// ===== Start router =====
startRouter();
