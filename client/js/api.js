(function () {
  // ==== Helpers ====
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
    var BASE = _getBASE();
    var url = BASE + (path.startsWith("/") ? path : ("/" + path));
    var init = Object.assign({ cache: "no-store" }, opts);

    if (init.body && !init.headers) {
      init.headers = { "Content-Type": "application/json" };
    }

    // console.log("[DMSSC] API call →", url);
    return fetch(url, init).then(_json);
  }

  function _qs(obj) {
    var p = [];
    Object.keys(obj || {}).forEach(function(k){
      var v = obj[k];
      if (v === undefined || v === null || v === "") return;
      p.push(encodeURIComponent(k) + "=" + encodeURIComponent(String(v)));
    });
    return p.length ? "?" + p.join("&") : "";
  }

  // ==== Dashboard ====
  // Trả về nguyên cấu trúc mới từ BE (totals, breakdown, recent, upcoming)
  // + giữ tương thích ngầm với UI cũ: totalBacklog/totalTasks/totalDone/totalOpen/hours
  async function getDashboard() {
    var raw = await _req("/dashboard");

    var totalBacklog = raw?.totals?.backlogCount ?? 0;
    var totalTasks   = raw?.totals?.taskCount ?? 0;

    var completed = 0;
    if (Array.isArray(raw?.breakdown?.byStatus)) {
      var item = raw.breakdown.byStatus.find(function(x){ return x.key === "COMPLETED"; });
      completed = item ? (item.count || 0) : 0;
    }
    var totalDone = completed;
    var totalOpen = Math.max(0, totalBacklog - totalDone);

    return Object.assign({}, raw, {
      totalBacklog: totalBacklog,
      totalTasks:   totalTasks,
      totalDone:    totalDone,
      totalOpen:    totalOpen,
      totalHours:   0 // hiện BE chưa cung cấp, giữ 0 cho tương thích
    });
  }

  // ==== Backlog CRUD ====
  var listBacklog   = function(){ return _req("/backlog"); };
  var createBacklog = function(body){ return _req("/backlog", { method:"POST", body: JSON.stringify(body) }); };
  var updateBacklog = function(id, body){ return _req("/backlog/" + id, { method:"PUT", body: JSON.stringify(body) }); };
  var deleteBacklog = function(id){ return _req("/backlog/" + id, { method:"DELETE" }); };

  // ==== Task CRUD ====
  var listTasks   = function(){ return _req("/tasks"); };
  var createTask  = function(body){ return _req("/tasks", { method:"POST", body: JSON.stringify(body) }); };
  var updateTask  = function(id, body){ return _req("/tasks/" + id, { method:"PUT", body: JSON.stringify(body) }); };
  var deleteTask  = function(id){ return _req("/tasks/" + id, { method:"DELETE" }); };

  // ==== Reports (mới) ====
  // /api/reports/backlog?from=YYYY-MM-DD&to=YYYY-MM-DD&owner=...&status=...&priority=...&onOff=...&q=...&page=&pageSize=
  function reportBacklog(params) {
    return _req("/reports/backlog" + _qs(params || {}));
  }

  // /api/reports/backlog/summary?from=YYYY-MM-DD&to=YYYY-MM-DD
  function reportBacklogSummary(params) {
    return _req("/reports/backlog/summary" + _qs(params || {}));
  }

  // Trả về URL CSV để mở/tải
  function exportBacklogCsv(params) {
    var url = _getBASE() + "/reports/backlog/export.csv" + _qs(params || {});
    return url; // FE có thể window.open(url) hoặc đặt vào <a download>
  }

  // Giữ các API cũ (placeholder) nếu UI có gọi, nhưng BE chưa có:
  var reportHoursByPic = function(){ 
    console.warn("[DMSSC] reportHoursByPic legacy endpoint not implemented on BE; use reportBacklog/reportBacklogSummary instead.");
    return Promise.resolve([]);
  };
  var reportHoursBySr  = function(){ 
    console.warn("[DMSSC] reportHoursBySr legacy endpoint not implemented on BE; use reportBacklog instead.");
    return Promise.resolve([]);
  };
  var reportSummary    = function(params){ return reportBacklogSummary(params); };

  // ==== Public ====
  var API_EXPORT = {
    getDashboard,
    listBacklog, createBacklog, updateBacklog, deleteBacklog,
    listTasks, createTask, updateTask, deleteTask,
    reportBacklog, reportBacklogSummary, exportBacklogCsv,
    // legacy:
    reportHoursByPic, reportHoursBySr, reportSummary
  };

  if (typeof window !== "undefined") {
    window.API = API_EXPORT;
  }
})();
