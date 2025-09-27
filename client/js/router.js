// client/js/router.js
export const routes = {};
export function route(path, view) { routes[path] = view; }

// Tiny toast helper
function toast(msg, ok = true) {
  const box = document.getElementById('toast') || (() => {
    const d = document.createElement('div'); d.id = 'toast'; document.body.appendChild(d); return d;
  })();
  const el = document.createElement('div');
  el.className = `toast ${ok ? 'ok' : 'err'}`;
  el.textContent = msg;
  box.appendChild(el);
  setTimeout(() => el.remove(), 2400);
}
export const UI = { toast };

// Highlight link đang active bên sidebar
function setActiveLink(hash) {
  document.querySelectorAll('[data-route]').forEach(a => {
    if (a.getAttribute('href') === hash) a.classList.add('active');
    else a.classList.remove('active');
  });
}

export function startRouter() {
  const app = document.getElementById('app');
  const status = document.getElementById('status');

  async function render() {
    const hash = location.hash || '#/dashboard';
    const view = routes[hash];

    // cập nhật status + active link
    status && (status.textContent = `Route: ${hash}`);
    setActiveLink(hash);

    if (!view) {
      app.innerHTML = '<div class="card">Not Found</div>';
      return;
    }

    app.innerHTML = '<div class="card">Loading...</div>';

    try {
      const html = await view();           // view trả HTML string
      app.innerHTML = html ?? '';          // phòng view trả null/undefined

      // Gọi hook __afterRender an toàn, chỉ 1 lần
      if (typeof window.__afterRender === 'function') {
        try { window.__afterRender(); }
        catch (e) { console.error('[Router] __afterRender error:', e); UI.toast('Init error', false); }
        finally { window.__afterRender = undefined; }
      }

      // Đưa viewport lên đầu sau mỗi lần điều hướng
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      console.error('[Router] render error:', err);
      app.innerHTML = `<div class="card">Render error:<pre>${String((err && err.stack) || err)}</pre></div>`;
      UI.toast('Render error', false);
    }
  }

  // Điều hướng bằng hash
  window.addEventListener('hashchange', render);

  // Điều hướng click nội bộ (nếu sau này bạn thêm link khác có data-route)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-route]');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#/')) { e.preventDefault(); if (location.hash !== href) location.hash = href; }
  });

  // First paint
  render();
}
