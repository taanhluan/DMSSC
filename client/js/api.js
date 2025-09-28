(function () {
  // Hàm lấy BASE động mỗi lần gọi, tránh race condition
  function _getBASE() {
    var b = (typeof window !== "undefined" && window.API_URL) || "http://localhost:3000/api";
    return String(b).replace(/\/$/, "");
  }

  function _json(r) {
    if (!r.ok) {
      return r.text().catch(function(){return String(r.status)}).then(function(text){
        throw new Error("HTTP " + r.status + " - " + text);
      });
    }
    return r.json();
  }

  function _req(path, opts) {
    opts = opts || {};
    var BASE = _getBASE(); // đọc BASE tại thời điểm request
    var url = BASE + (path.startsWith("/") ? path : ("/" + path));
    var init = Object.assign({ cache: "no-store" }, opts);

    // chỉ set Content-Type nếu có body
    if (init.body && !init.headers) {
      init.headers = { "Content-Type": "application/json" };
    }

    console.log("[DMSSC] API call →", url); // debug
    return fetch(url, init).then(_json);
  }

  // ---- Public API ----
  async function getDashboard() {
    var raw = await _req("/dashboard");
    return Object.assign({}, raw, {
      totalBacklog: raw.backlog ?? 0,
      totalTasks:   raw.tasks  ?? 0,
      totalDone:    raw.done   ?? 0,
      totalOpen:    raw.open   ?? 0,
      totalHours:   raw.hours  ?? 0,
    });
  }

  var listBacklog   = function(){ return _req("/backlog"); };
  var createBacklog = function(body){ return _req("/backlog", { method:"POST", body: JSON.stringify(body) }); };
  var updateBacklog = function(id, body){ return _req("/backlog/" + id, { method:"PUT", body: JSON.stringify(body) }); };
  var deleteBacklog = function(id){ return _req("/backlog/" + id, { method:"DELETE" }); };

  var listTasks   = function(){ return _req("/tasks"); };
  var createTask  = function(body){ return _req("/tasks", { method:"POST", body: JSON.stringify(body) }); };
  var updateTask  = function(id, body){ return _req("/tasks/" + id, { method:"PUT", body: JSON.stringify(body) }); };
  var deleteTask  = function(id){ return _req("/tasks/" + id, { method:"DELETE" }); };

  var reportHoursByPic = function(){ return _req("/reports/hours-by-pic"); };
  var reportHoursBySr  = function(){ return _req("/reports/hours-by-sr"); };
  var reportSummary    = function(){ return _req("/reports/hours-by-pic"); };

  var API_EXPORT = {
    getDashboard,
    listBacklog, createBacklog, updateBacklog, deleteBacklog,
    listTasks, createTask, updateTask, deleteTask,
    reportHoursByPic, reportHoursBySr, reportSummary
  };

  if (typeof window !== "undefined") {
    window.API = API_EXPORT;
  }
})();
