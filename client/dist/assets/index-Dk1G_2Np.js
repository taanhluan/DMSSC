(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))v(l);new MutationObserver(l=>{for(const s of l)if(s.type==="childList")for(const t of s.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&v(t)}).observe(document,{childList:!0,subtree:!0});function n(l){const s={};return l.integrity&&(s.integrity=l.integrity),l.referrerPolicy&&(s.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?s.credentials="include":l.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function v(l){if(l.ep)return;l.ep=!0;const s=n(l);fetch(l.href,s)}})();window.API_URL="https://dmssc-be.onrender.com/api";(function(){function e(){var d=typeof window<"u"&&window.API_URL||"http://localhost:3000/api";return String(d).replace(/\/$/,"")}function a(d){return d.ok?d.json():d.text().catch(function(){return String(d.status)}).then(function(f){throw new Error("HTTP "+d.status+" - "+f)})}function n(d,f){f=f||{};var w=e(),m=w+(d.startsWith("/")?d:"/"+d),O=Object.assign({cache:"no-store"},f);return O.body&&!O.headers&&(O.headers={"Content-Type":"application/json"}),console.log("[DMSSC] API call →",m),fetch(m,O).then(a)}async function v(){var d=await n("/dashboard");return Object.assign({},d,{totalBacklog:d.backlog??0,totalTasks:d.tasks??0,totalDone:d.done??0,totalOpen:d.open??0,totalHours:d.hours??0})}var l=function(){return n("/backlog")},s=function(d){return n("/backlog",{method:"POST",body:JSON.stringify(d)})},t=function(d,f){return n("/backlog/"+d,{method:"PUT",body:JSON.stringify(f)})},g=function(d){return n("/backlog/"+d,{method:"DELETE"})},k=function(){return n("/tasks")},$=function(d){return n("/tasks",{method:"POST",body:JSON.stringify(d)})},E=function(d,f){return n("/tasks/"+d,{method:"PUT",body:JSON.stringify(f)})},h=function(d){return n("/tasks/"+d,{method:"DELETE"})},r=function(){return n("/reports/hours-by-pic")},o=function(){return n("/reports/hours-by-sr")},u=function(){return n("/reports/hours-by-pic")},p={getDashboard:v,listBacklog:l,createBacklog:s,updateBacklog:t,deleteBacklog:g,listTasks:k,createTask:$,updateTask:E,deleteTask:h,reportHoursByPic:r,reportHoursBySr:o,reportSummary:u};typeof window<"u"&&(window.API=p)})();const j={};function L(e,a){j[e]=a}function J(e,a=!0){const n=document.getElementById("toast")||(()=>{const l=document.createElement("div");return l.id="toast",document.body.appendChild(l),l})(),v=document.createElement("div");v.className=`toast ${a?"ok":"err"}`,v.textContent=e,n.appendChild(v),setTimeout(()=>v.remove(),2400)}const b={toast:J};function K(e){document.querySelectorAll("[data-route]").forEach(a=>{a.getAttribute("href")===e?a.classList.add("active"):a.classList.remove("active")})}function z(){const e=document.getElementById("app"),a=document.getElementById("status");async function n(){const v=location.hash||"#/dashboard",l=j[v];if(a&&(a.textContent=`Route: ${v}`),K(v),!l){e.innerHTML='<div class="card">Not Found</div>';return}e.innerHTML='<div class="card">Loading...</div>';try{const s=await l();if(e.innerHTML=s??"",typeof window.__afterRender=="function")try{window.__afterRender()}catch(t){console.error("[Router] __afterRender error:",t),b.toast("Init error",!1)}finally{window.__afterRender=void 0}window.scrollTo({top:0,behavior:"instant"})}catch(s){console.error("[Router] render error:",s),e.innerHTML=`<div class="card">Render error:<pre>${String(s&&s.stack||s)}</pre></div>`,b.toast("Render error",!1)}}window.addEventListener("hashchange",n),document.addEventListener("click",v=>{const l=v.target.closest("a[data-route]");if(!l)return;const s=l.getAttribute("href")||"";s.startsWith("#/")&&(v.preventDefault(),location.hash!==s&&(location.hash=s))}),n()}async function Y(){let e={backlog:0,tasks:0,done:0,open:0,hours:0};try{const a=await fetch("/api/dashboard");if(!a.ok)throw new Error(`HTTP ${a.status}`);const n=await a.json();e={...e,...n}}catch(a){console.error("[Dashboard] fetch error:",a)}return`
    <div class="card">
      <h3>DMSSC Overview</h3>
      <div class="grid">
        <div class="card kpi"><div class="muted">Backlog</div><div class="num">${e.backlog}</div></div>
        <div class="card kpi"><div class="muted">Tasks</div><div class="num">${e.tasks}</div></div>
        <div class="card kpi"><div class="muted">Open</div><div class="num">${e.open}</div></div>
        <div class="card kpi"><div class="muted">Done</div><div class="num">${e.done}</div></div>
        <div class="card kpi"><div class="muted">Total Hours</div><div class="num">${e.hours}</div></div>
      </div>
    </div>
  `}const c=(e,a=document)=>a.querySelector(e),N=["LOW","MEDIUM","HIGH"],Q=["ON","OFF"],V=[{code:"DLVN",label:"Dai-ichi Life Việt Nam"},{code:"DLKH",label:"Dai-ichi Life Cambodia"},{code:"DLMM",label:"Dai-ichi Life Myanmar"}],P=["PRE","BS","TS","DEV","ST","UAT","GOLIVE"],W={PRE:"01 - Pre-Analysis",BS:"02 - BS",TS:"03 - TS",DEV:"04 - DEV",ST:"05 - ST",UAT:"06 - UAT",GOLIVE:"07 - Go-live"},X=["NOT_START","IN_PROGRESS","ON_HOLD","COMPLETED"],Z=[{label:"Not Start",value:"__NOT_A_PHASE__",disabled:!0},{label:"01 - Pre-Analysis",value:"PRE"},{label:"02 - BS",value:"BS"},{label:"03 - TS",value:"TS"},{label:"04 - DEV",value:"DEV"},{label:"05 - ST",value:"ST"},{label:"06 - UAT",value:"UAT"},{label:"07 - Go-live",value:"GOLIVE"},{label:"COMPLETED",value:"__NOT_A_PHASE__",disabled:!0},{label:"On-Hold",value:"__NOT_A_PHASE__",disabled:!0}],_=(e,a="")=>e.map(n=>`<option ${n===a?"selected":""}>${n}</option>`).join(""),tt=(e="DLVN")=>V.map(a=>`<option value="${a.code}" ${a.code===e?"selected":""}>${a.code} — ${a.label}</option>`).join("");function A(e=[]){const a=new Map((e||[]).map(n=>[n.phase,n]));return P.map(n=>a.get(n)||{phase:n,state:"NOT_START",pic:[],startDate:null,endDate:null,hours:0,progress:null})}function et(e,a){const n=(e.pic||[]).join(", ");return`<tr data-idx="${a}">
    <td>
      <select class="input phase">
        ${P.map(v=>`<option ${v===e.phase?"selected":""} value="${v}">${W[v]}</option>`).join("")}
      </select>
    </td>
    <td>
      <select class="input state">
        ${X.map(v=>`<option ${v===e.state?"selected":""}>${v}</option>`).join("")}
      </select>
    </td>
    <td><input class="input pic" placeholder="Ví dụ: Nga, Tuan" value="${n}"></td>
    <td><input class="input sdate" type="date" value="${e.startDate||""}"></td>
    <td><input class="input edate" type="date" value="${e.endDate||""}"></td>
    <td><input class="input hours" type="number" step="0.25" placeholder="0" value="${e.hours??""}"></td>
    <td><input class="input prog" type="number" min="0" max="100" placeholder="%" value="${e.progress??""}"></td>
    <td><button type="button" class="btn ghost t-del">Del</button></td>
  </tr>`}function st(e=[]){return`<div class="tracks-col">${A(e).map(a=>`
      <div class="t-line">
        <span class="t-phase">${W[a.phase]}</span>
        <span class="badge state-${a.state||"NOT_START"}">${(a.state||"NOT_START").replace("_"," ")}</span>
        ${a.progress!=null&&a.progress!==""?`<span class="badge t-prg">${a.progress}%</span>`:""}
      </div>
    `).join("")}</div>`}function at(e=[]){return`<div class="tracks-col">${A(e).map(a=>`
      <div class="t-line">
        <span class="t-pic">${(a.pic||[]).join(", ")||'<span class="muted">—</span>'}</span>
      </div>
    `).join("")}</div>`}function nt(e=[]){return`<div class="tracks-col">${A(e).map(a=>`
      <div class="t-line"><span>${a.startDate||'<span class="muted">—</span>'}</span></div>
    `).join("")}</div>`}function it(e=[]){return`<div class="tracks-col">${A(e).map(a=>`
      <div class="t-line"><span>${a.endDate||'<span class="muted">—</span>'}</span></div>
    `).join("")}</div>`}function R(e){return`<tr>
    <td>${e.id}</td>
    <td>${e.site||""}</td>
    <td>${e.sr||""}</td>
    <td>${e.description||""}</td>
    <td>${e.owner||""}</td>
    <td>${e.priority||""}</td>
    <td>${e.dueDate||""}</td>
    <td>${e.onOff||""}</td>
    <td>${e.progress??0}</td>
    <td>${e.complex||""}</td>
    <td class="tracks-cell">${st(e.tracks)}</td>
    <td class="tracks-cell">${at(e.tracks)}</td>
    <td class="tracks-cell">${nt(e.tracks)}</td>
    <td class="tracks-cell">${it(e.tracks)}</td>
    <td class="actions">
      <button type="button" class="btn ghost" data-action="edit" data-id="${e.id}">Edit</button>
      <button type="button" class="btn danger" data-action="del" data-id="${e.id}">Del</button>
    </td>
  </tr>`}async function ot(){const e=await window.API.listBacklog();let a=[...e],n=[],v=null;const l=`
  <div class="card">
    <h3>Backlog Filters</h3>
    <div class="row">
      <input class="input" id="f-text" placeholder="Search text..." />
      <select class="input" id="f-site">
        <option value="">All Sites</option>
        ${V.map(s=>`<option value="${s.code}">${s.code} — ${s.label}</option>`).join("")}
      </select>
      <select class="input" id="f-pri">
        <option value="">All Priority</option>
        ${_(N)}
      </select>
      <button type="button" class="btn" id="f-apply">Apply</button>
      <button type="button" class="btn ghost" id="f-clear">Clear</button>
    </div>
  </div>

  <div class="card">
    <h3>Create / Update Backlog</h3>
    <div class="row">
      <select class="input" id="b-site">
        ${tt("DLVN")}
      </select>
      <input class="input" id="b-sr" placeholder="SR" />
      <input class="input" id="b-desc" placeholder="Description" />
    </div>
    <div class="row">
      <input class="input" id="b-owner" placeholder="Owner" />
      <select class="input" id="b-pri">${_(N,"MEDIUM")}</select>
      <input class="input" id="b-due" type="date" title="DueDate" />
    </div>
    <div class="row">
      <select class="input" id="b-onoff">${_(Q,"ON")}</select>
      <input class="input" id="b-progress" type="number" min="0" max="100" placeholder="%Overall (optional)" />
      <input class="input" id="b-complex" placeholder="Complex (S/M/L)" />
    </div>

    <!-- Workstreams (Advanced) -->
    <details id="ws-adv" class="ws">
      <summary>
        <strong>Workstreams (chọn pha cần quản lý)</strong>
        <span class="muted">Chọn pha trong dropdown <b>STATUS</b>, mỗi pha sẽ tạo 1 dòng</span>
      </summary>

      <div class="row">
        <select class="input" id="ws-status">
          ${Z.map(s=>`<option value="${s.value}" ${s.disabled?"disabled":""}>${s.label}</option>`).join("")}
        </select>
        <button type="button" class="btn" id="ws-add">+ Add phase</button>
        <button type="button" class="btn ghost" id="ws-add-all">+ Add remaining phases</button>
        <span class="muted">Mỗi dòng: Phase • State • PIC(s) • Start • End • Hours • %</span>
      </div>

      <div style="overflow:auto">
        <table class="table">
          <thead>
            <tr>
              <th>Phase</th><th>State</th><th>PIC(s)</th><th>Start</th><th>End</th><th>Hours</th><th>%</th><th></th>
            </tr>
          </thead>
          <tbody id="t-body">
            <tr class="ws-empty"><td colspan="8" class="muted">
              Chưa có pha nào. Chọn <b>STATUS</b> rồi bấm <b>+ Add phase</b>.
            </td></tr>
          </tbody>
        </table>
      </div>
    </details>

    <div class="row">
      <button type="button" class="btn primary" id="b-save">Save</button>
      <button type="button" class="btn ghost" id="b-reset">Reset</button>
      <span id="edit-indicator" class="muted" style="margin-left:8px"></span>
    </div>
  </div>

  <div class="card">
    <h3>Backlog List <span class="badge" id="count">${a.length}</span></h3>
    <div style="overflow:auto">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th><th>Site</th><th>SR</th><th>Description</th><th>Owner</th><th>Priority</th>
            <th>Due</th><th>On/Off</th><th>%Overall</th><th>Complex</th>
            <th>Phase / State / %</th><th>PIC(s)</th><th>Start</th><th>End</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="tbl">${a.map(R).join("")}</tbody>
      </table>
    </div>
  </div>`;return window.__afterRender=()=>{const s=document.getElementById("app"),t=h=>{var r,o;return(o=(r=c(h,s))==null?void 0:r.value)==null?void 0:o.trim()},g=()=>{const h=c("#t-body",s);h.innerHTML=n&&n.length?n.map(et).join(""):`<tr class="ws-empty"><td colspan="8" class="muted">
            Chưa có pha nào. Chọn <b>STATUS</b> rồi bấm <b>+ Add phase</b>.
          </td></tr>`},k=()=>{["#b-sr","#b-desc","#b-owner","#b-due","#b-progress","#b-complex"].forEach(h=>{const r=c(h,s);r&&(r.value="")}),c("#b-pri",s).value="MEDIUM",c("#b-onoff",s).value="ON",c("#b-site",s).value="DLVN",n=[],v=null,c("#edit-indicator",s).textContent="",g()},$=()=>{const h=(t("#f-text")||"").toLowerCase(),r=c("#f-pri",s).value,o=c("#f-site",s).value,u=e.filter(p=>(!h||(p.description||"").toLowerCase().includes(h)||(p.sr||"").toLowerCase().includes(h)||(p.owner||"").toLowerCase().includes(h))&&(!r||p.priority===r)&&(!o||p.site===o));a=u,c("#tbl",s).innerHTML=u.map(R).join(""),c("#count",s).textContent=u.length};c("#f-apply",s).addEventListener("click",$),c("#f-clear",s).addEventListener("click",()=>{["#f-text","#f-pri","#f-site"].forEach(h=>{const r=c(h,s);r&&(r.value="")}),$()}),c("#ws-add",s).addEventListener("click",()=>{const h=c("#ws-status",s).value;if(h==="__NOT_A_PHASE__"){b.toast("Chọn một pha (01..07) để thêm",!1);return}if(new Set((n||[]).map(o=>o.phase)).has(h)){b.toast("Pha này đã tồn tại",!1);return}n.push({phase:h,state:"NOT_START",pic:[],startDate:"",endDate:"",hours:0,progress:0}),g()}),c("#ws-add-all",s).addEventListener("click",()=>{const h=new Set((n||[]).map(r=>r.phase));P.forEach(r=>{h.has(r)||n.push({phase:r,state:"NOT_START",pic:[],startDate:"",endDate:"",hours:0,progress:0})}),g()}),c("#t-body",s).addEventListener("input",h=>{const r=h.target.closest("tr");if(!r)return;const o=Number(r.dataset.idx);if(!Number.isFinite(o)||!n[o])return;n[o].phase=r.querySelector(".phase").value,n[o].state=r.querySelector(".state").value,n[o].pic=r.querySelector(".pic").value.split(",").map(p=>p.trim()).filter(Boolean),n[o].startDate=r.querySelector(".sdate").value||null,n[o].endDate=r.querySelector(".edate").value||null,n[o].hours=Number(r.querySelector(".hours").value||0);const u=r.querySelector(".prog").value;n[o].progress=u===""?null:Number(u)}),c("#t-body",s).addEventListener("click",h=>{if(!h.target.classList.contains("t-del"))return;const r=h.target.closest("tr"),o=Number(r.dataset.idx);n.splice(o,1),g()}),c("#b-save",s).addEventListener("click",async()=>{const h={site:c("#b-site",s).value||"DLVN",sr:t("#b-sr"),description:t("#b-desc"),owner:t("#b-owner"),priority:c("#b-pri",s).value,dueDate:c("#b-due",s).value||null,onOff:c("#b-onoff",s).value,progress:Number(c("#b-progress",s).value||0),complex:t("#b-complex"),tracks:(n||[]).map(r=>({...r,endDate:r.state==="COMPLETED"&&!r.endDate?new Date().toISOString().slice(0,10):r.endDate}))};if(!h.description){b.toast("Description is required",!1);return}try{v?(await window.API.updateBacklog(v,h),b.toast("Backlog updated")):(await window.API.createBacklog(h),b.toast("Backlog created")),location.hash="#/backlog"}catch{b.toast("Save failed",!1)}}),c("#b-reset",s).addEventListener("click",k),c("#tbl",s).addEventListener("click",async h=>{const r=h.target.closest("button[data-action]");if(!r)return;const o=r.dataset.id,u=r.dataset.action;if(u==="del")try{await window.API.deleteBacklog(o),b.toast("Deleted"),location.hash="#/backlog"}catch{b.toast("Delete failed",!1)}if(u==="edit"){const p=a.find(d=>d.id===o);if(!p)return;c("#b-site",s).value=p.site||"DLVN",c("#b-sr",s).value=p.sr||"",c("#b-desc",s).value=p.description||"",c("#b-owner",s).value=p.owner||"",c("#b-pri",s).value=p.priority||"MEDIUM",c("#b-due",s).value=p.dueDate||"",c("#b-onoff",s).value=p.onOff||"ON",c("#b-progress",s).value=p.progress??0,c("#b-complex",s).value=p.complex||"",n=Array.isArray(p.tracks)?JSON.parse(JSON.stringify(p.tracks)):[],g(),v=p.id,c("#edit-indicator",s).textContent=`Editing: ${p.id}`,b.toast(`Loaded ${p.id} to form`),window.scrollTo({top:0,behavior:"smooth"})}}),k();const E=c("#ws-adv",s);E&&(E.open=!1)},l}const i=(e,a=document)=>a.querySelector(e),M=["TODO","IN_PROGRESS","BLOCKED","DONE"],rt=["LOW","MEDIUM","HIGH"],C=["Ta Anh Luan [Sr.BA DMSSC]","Le Thi Hoang Nga [BA DMSSC]","Due, Pham Quang [Sr.Dev DMSSC]","Anh, Nguyen Tuan [Sr.Dev DMSSC]","Phuc, Dinh Pham Hoang [Dev DMSSC]","Tung, Huynh Ngoc Thanh [Dev DMSSC]"],D=["Pre-analysis Working Hour (BA)","Pre-analysis Working Hour (DEV)","BS Working Hour","BS Review Working Hour (DEV)","TS Working Hour","TS Review Working Hour (BA)","Dev Working Hour","ST Working Hour","ST Support Working Hour (DEV)","UAT Support Working Hour (BA)","UAT Support Working Hour (DEV)","Post-Check Working Hour (BA)","Post-Check Working Hour (DEV)","Table-Update/Setup","GOLIVE","COMPLETED","ON-HOLD","Other","Out-of-office"],I=(e,a="")=>e.map(n=>`<option ${n===a?"selected":""}>${n}</option>`).join(""),H=e=>e||"",B=(e=[])=>e.reduce((a,n)=>a+(Number(n)||0),0);function x(e){return`
  <tr>
    <td>${e.id}</td>
    <td>${e.sr||""}</td>
    <td>${e.title||""}</td>
    <td>${e.pic||""}</td>
    <td><span class="badge state-${e.status}">${e.status}</span></td>
    <td>${e.priority||""}</td>
    <td>${H(e.startDate)}</td>
    <td>${H(e.endDate)}</td>
    <td>${e.hours??0}</td>
    <td class="actions">
      <button type="button" class="btn ghost" data-action="edit" data-id="${e.id}">Edit</button>
      <button type="button" class="btn danger" data-action="del" data-id="${e.id}">Del</button>
    </td>
  </tr>`}async function lt(){const[e,a]=await Promise.all([window.API.listTasks(),window.API.listBacklog().catch(()=>[])]),n=new Map(a.map(t=>[String(t.sr||""),t.description||""])),v=new Map(a.map(t=>[String(t.sr||""),t.site||""]));let l=[...e];const s=`
  <div class="card">
    <h3>Task Filters</h3>
    <div class="row">
      <input class="input" id="f-text" placeholder="Search title/note/PIC..." />
      <select class="input" id="f-status">
        <option value="">All Status</option>
        ${I(M)}
      </select>
      <select class="input" id="f-pic">
        <option value="">All PIC</option>
        ${[...new Set([...l.map(t=>t.pic).filter(Boolean),...C])].sort().map(t=>`<option>${t}</option>`).join("")}
      </select>
      <select class="input" id="f-sr">
        <option value="">All SR</option>
        ${a.map(t=>`<option value="${t.sr}">${t.sr} — ${t.description||""}</option>`).join("")}
      </select>
      <select class="input" id="f-title">
        <option value="">All Task Types</option>
        ${D.map(t=>`<option>${t}</option>`).join("")}
      </select>
      <button type="button" class="btn" id="f-apply">Apply</button>
      <button type="button" class="btn ghost" id="f-clear">Clear</button>
    </div>
  </div>

  <div class="card">
    <h3>Create / Update Task</h3>

    <!-- SR + SR Description (read-only) + Site (read-only) + TITLE -->
    <div class="row">
      <select class="input" id="t-sr">
        <option value="">SR (optional)</option>
        ${a.map(t=>`<option value="${t.sr}">${t.sr} — ${t.description||""}</option>`).join("")}
      </select>
      <input class="input" id="t-sr-desc" placeholder="SR Description (read-only)" readonly />
      <input class="input" id="t-sr-site" placeholder="Site (read-only)" readonly />
      <select class="input" id="t-title-select">
        ${D.map(t=>`<option value="${t}">${t}</option>`).join("")}
      </select>
    </div>

    <div class="row">
      <!-- PIC configurable (select hoặc nhập tay) -->
      <select class="input" id="t-pic-select">
        <option value="">PIC (select…)</option>
        ${C.map(t=>`<option value="${t}">${t}</option>`).join("")}
        <option value="__CUSTOM__">Custom…</option>
      </select>
      <input class="input" id="t-pic" placeholder="PIC (free text)" />

      <select class="input" id="t-status">${I(M,"TODO")}</select>
      <select class="input" id="t-pri">${I(rt,"MEDIUM")}</select>
    </div>

    <div class="row">
      <input class="input" id="t-start" type="date" title="Start date" />
      <input class="input" id="t-end" type="date" title="End date" />
      <input class="input" id="t-hours" type="number" step="0.25" min="0" placeholder="Hours" />
    </div>

    <div class="row">
      <input class="input" id="t-note" placeholder="Task Note (optional)" />
    </div>

    <div class="row">
      <button type="button" class="btn primary" id="t-save">Save</button>
      <button type="button" class="btn ghost" id="t-reset">Reset</button>
      <span id="edit-indicator" class="muted" style="margin-left:8px"></span>
    </div>
  </div>

  <div class="card">
    <h3>Task List — Standard <span class="badge" id="count">${l.length}</span></h3>
    <div class="row">
      <div class="kpi card" style="padding:10px;">
        <div class="muted">Total hours</div>
        <div class="num" id="kpi-hours">${B(l.map(t=>t.hours||0))}</div>
      </div>
      <div class="kpi card" style="padding:10px;">
        <div class="muted">Open tasks</div>
        <div class="num" id="kpi-open">${l.filter(t=>t.status!=="DONE").length}</div>
      </div>
      <div class="kpi card" style="padding:10px;">
        <div class="muted">Done</div>
        <div class="num" id="kpi-done">${l.filter(t=>t.status==="DONE").length}</div>
      </div>
    </div>
    <div style="overflow:auto">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th><th>SR</th><th>Title</th><th>PIC</th><th>Status</th>
            <th>Priority</th><th>Start</th><th>End</th><th>Hours</th><th></th>
          </tr>
        </thead>
        <tbody id="tbl">${l.map(x).join("")}</tbody>
      </table>
    </div>
  </div>`;return window.__afterRender=()=>{const t=document.getElementById("app");let g=null;const k=()=>{const o=i("#t-pic-select",t).value,u=i("#t-pic",t);u.style.display=o==="__CUSTOM__"?"":"none",o&&o!=="__CUSTOM__"&&(u.value=o),o==="__CUSTOM__"&&!u.value&&u.focus()};i("#t-pic-select",t).addEventListener("change",k),k();const $=()=>{const o=i("#t-sr",t).value||"";i("#t-sr-desc",t).value=n.get(o)||"",i("#t-sr-site",t).value=v.get(o)||""};i("#t-sr",t).addEventListener("change",$),$();const E=()=>{const o=i("#t-title-select",t).value,u=i("#t-pic-select",t).value,p=u&&u!=="__CUSTOM__"?u:i("#t-pic",t).value.trim();return{sr:i("#t-sr",t).value||"",title:o,description:i("#t-note",t).value.trim(),pic:p,status:i("#t-status",t).value,priority:i("#t-pri",t).value,startDate:i("#t-start",t).value||null,endDate:i("#t-end",t).value||null,hours:Number(i("#t-hours",t).value||0)}},h=()=>{["#t-note","#t-pic","#t-start","#t-end","#t-hours"].forEach(o=>{const u=i(o,t);u&&(u.value="")}),i("#t-status",t).value="TODO",i("#t-pri",t).value="MEDIUM",i("#t-sr",t).value="",i("#t-title-select",t).value=D[0],i("#t-pic-select",t).value="",i("#t-sr-desc",t).value="",i("#t-sr-site",t).value="",g=null,i("#edit-indicator",t).textContent="",k()},r=()=>{const o=(i("#f-text",t).value||"").toLowerCase(),u=i("#f-status",t).value,p=i("#f-pic",t).value,d=i("#f-sr",t).value,f=i("#f-title",t).value,w=e.filter(m=>(!o||(m.title||"").toLowerCase().includes(o)||(m.description||"").toLowerCase().includes(o)||(m.pic||"").toLowerCase().includes(o))&&(!u||m.status===u)&&(!p||m.pic===p)&&(!d||m.sr===d)&&(!f||m.title===f));l=w,i("#tbl",t).innerHTML=w.map(x).join(""),i("#count",t).textContent=w.length,i("#kpi-hours",t).textContent=B(w.map(m=>m.hours||0)),i("#kpi-open",t).textContent=w.filter(m=>m.status!=="DONE").length,i("#kpi-done",t).textContent=w.filter(m=>m.status==="DONE").length};i("#f-apply",t).addEventListener("click",r),i("#f-clear",t).addEventListener("click",()=>{["#f-text","#f-status","#f-pic","#f-sr","#f-title"].forEach(o=>{const u=i(o,t);u&&(u.value="")}),r()}),i("#t-save",t).addEventListener("click",async()=>{const o=E();if(!o.title){b.toast("Title is required",!1);return}if(!D.includes(o.title)){b.toast("Title must be from standard list",!1);return}if(!o.pic){b.toast("PIC is required",!1);return}try{g?(await window.API.updateTask(g,o),b.toast("Task updated")):(await window.API.createTask(o),b.toast("Task created")),location.hash="#/tasks"}catch{b.toast("Save failed",!1)}}),i("#t-reset",t).addEventListener("click",h),i("#tbl",t).addEventListener("click",async o=>{const u=o.target.closest("button[data-action]");if(!u)return;const p=u.dataset.id,d=u.dataset.action;if(d==="del"){try{await window.API.deleteTask(p),b.toast("Deleted"),location.hash="#/tasks"}catch{b.toast("Delete failed",!1)}return}if(d==="edit"){const f=l.find(w=>w.id===p);if(!f)return;i("#t-sr",t).value=f.sr||"",i("#t-sr-desc",t).value=n.get(String(f.sr||""))||"",i("#t-sr-site",t).value=v.get(String(f.sr||""))||"",i("#t-title-select",t).value=D.includes(f.title)?f.title:"Other",C.includes(f.pic)?(i("#t-pic-select",t).value=f.pic,i("#t-pic",t).value=""):(i("#t-pic-select",t).value="__CUSTOM__",i("#t-pic",t).value=f.pic||""),k(),i("#t-note",t).value=f.description||"",i("#t-status",t).value=f.status||"TODO",i("#t-pri",t).value=f.priority||"MEDIUM",i("#t-start",t).value=f.startDate||"",i("#t-end",t).value=f.endDate||"",i("#t-hours",t).value=f.hours??"",g=f.id,i("#edit-indicator",t).textContent=`Editing: ${f.id}`,b.toast(`Loaded ${f.id} to form`),window.scrollTo({top:0,behavior:"smooth"})}})},s}async function dt(){const e=await window.API.reportSummary(),a=Object.keys(e.hoursByPIC||{}),n=Object.values(e.hoursByPIC||{}),v=`
    <div class="card">
      <h3>Report: Hours by PIC</h3>
      <canvas id="reportChart" height="140"></canvas>
    </div>
  `;return window.__afterRender=()=>{const l=document.getElementById("reportChart");l&&new Chart(l,{type:"bar",data:{labels:a,datasets:[{label:"Hours",data:n}]},options:{plugins:{legend:{labels:{color:"#e6eef5"}}},scales:{x:{ticks:{color:"#9bb0bf"}},y:{ticks:{color:"#9bb0bf"}}}}})},v}L("#/dashboard",Y);L("#/backlog",ot);L("#/tasks",lt);L("#/report",dt);const y=document.getElementById("sidebar"),S=document.getElementById("sbBackdrop"),T=document.getElementById("btnOpenSidebar");document.getElementById("toast");const U=document.getElementById("status");function ct(){y==null||y.setAttribute("data-state","open"),S==null||S.setAttribute("data-show","true"),T==null||T.setAttribute("aria-expanded","true")}function q(){y==null||y.setAttribute("data-state","closed"),S==null||S.removeAttribute("data-show"),T==null||T.setAttribute("aria-expanded","false")}T==null||T.addEventListener("click",()=>{(y==null?void 0:y.getAttribute("data-state"))==="open"?q():ct()});S==null||S.addEventListener("click",q);function F(){window.innerWidth>1024&&(y==null||y.setAttribute("data-state","open"),S==null||S.removeAttribute("data-show"),T==null||T.setAttribute("aria-expanded","true"))}window.addEventListener("resize",F);F();function G(){const e=location.hash||"#/dashboard";document.querySelectorAll("[data-route]").forEach(a=>{a.getAttribute("href")===e?a.classList.add("active"):a.classList.remove("active")}),U&&(U.textContent=`Route: ${e}`)}window.addEventListener("hashchange",G);G();z();
