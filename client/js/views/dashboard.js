// client/js/views/dashboard.js
export default async function Dashboard () {
  // default để an toàn nếu API lỗi
  let stats = { backlog: 0, tasks: 0, done: 0, open: 0, hours: 0 };

  try {
    const res = await fetch('/api/dashboard');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();            // BE trả: { backlog, tasks, done, open, hours }
    stats = { ...stats, ...data };            // gộp, không dùng totalBacklog nữa
  } catch (err) {
    console.error('[Dashboard] fetch error:', err);
  }

  return `
    <div class="card">
      <h3>DMSSC Overview</h3>
      <div class="grid">
        <div class="card kpi"><div class="muted">Backlog</div><div class="num">${stats.backlog}</div></div>
        <div class="card kpi"><div class="muted">Tasks</div><div class="num">${stats.tasks}</div></div>
        <div class="card kpi"><div class="muted">Open</div><div class="num">${stats.open}</div></div>
        <div class="card kpi"><div class="muted">Done</div><div class="num">${stats.done}</div></div>
        <div class="card kpi"><div class="muted">Total Hours</div><div class="num">${stats.hours}</div></div>
      </div>
    </div>
  `;
}
