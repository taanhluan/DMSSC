// client/js/api.js
async function _json(r){
  if (!r.ok) {
    const text = await r.text().catch(()=>String(r.status));
    throw new Error(`HTTP ${r.status} - ${text}`);
  }
  return r.json();
}

// Global API để views gọi qua window.API
window.API = {
  // --- Dashboard ---
  async getDashboard(){
    const raw = await fetch('/api/dashboard', { cache:'no-store' }).then(_json);
    // Trả về cả key mới và key cũ để FE nào cũng dùng được
    return {
      ...raw,                                   // { backlog, tasks, done, open, hours }
      totalBacklog: raw.backlog ?? 0,
      totalTasks: raw.tasks ?? 0,
      totalDone: raw.done ?? 0,
      totalOpen: raw.open ?? 0,
      totalHours: raw.hours ?? 0,
    };
  },

  // --- Backlog ---
  async listBacklog(){
    return fetch('/api/backlog', { cache:'no-store' }).then(_json);
  },
  async createBacklog(body){
    return fetch('/api/backlog', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(body)
    }).then(_json);
  },
  async updateBacklog(id, body){
    return fetch(`/api/backlog/${id}`, {
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(body)
    }).then(_json);
  },
  async deleteBacklog(id){
    return fetch(`/api/backlog/${id}`, { method:'DELETE' }).then(_json);
  },

  // --- Tasks ---
  async listTasks(){
    return fetch('/api/tasks', { cache:'no-store' }).then(_json);
  },
  async createTask(body){
    return fetch('/api/tasks', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(body)
    }).then(_json);
  },
  async updateTask(id, body){
    return fetch(`/api/tasks/${id}`, {
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(body)
    }).then(_json);
  },
  async deleteTask(id){
    return fetch(`/api/tasks/${id}`, { method:'DELETE' }).then(_json);
  },

  // --- Reports ---
  // Lưu ý: BE hiện có /api/reports/hours-by-pic và /api/reports/hours-by-sr (không có /summary).
  async reportHoursByPic(){
    return fetch('/api/reports/hours-by-pic', { cache:'no-store' }).then(_json);
  },
  async reportHoursBySr(){
    return fetch('/api/reports/hours-by-sr', { cache:'no-store' }).then(_json);
  },
  // Nếu bạn muốn giữ reportSummary() như FE đang gọi, tạm map sang hours-by-pic:
  async reportSummary(){
    return fetch('/api/reports/hours-by-pic', { cache:'no-store' }).then(_json);
  }
};
