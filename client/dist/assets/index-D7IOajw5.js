(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))p(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const t of s.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&p(t)}).observe(document,{childList:!0,subtree:!0});function o(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function p(r){if(r.ep)return;r.ep=!0;const s=o(r);fetch(r.href,s)}})();window.API_URL="https://dmssc-be.onrender.com/api";const U={};function L(e,a){U[e]=a}function G(e,a=!0){const o=document.getElementById("toast")||(()=>{const r=document.createElement("div");return r.id="toast",document.body.appendChild(r),r})(),p=document.createElement("div");p.className=`toast ${a?"ok":"err"}`,p.textContent=e,o.appendChild(p),setTimeout(()=>p.remove(),2400)}const f={toast:G};function K(e){document.querySelectorAll("[data-route]").forEach(a=>{a.getAttribute("href")===e?a.classList.add("active"):a.classList.remove("active")})}function z(){const e=document.getElementById("app"),a=document.getElementById("status");async function o(){const p=location.hash||"#/dashboard",r=U[p];if(a&&(a.textContent=`Route: ${p}`),K(p),!r){e.innerHTML='<div class="card">Not Found</div>';return}e.innerHTML='<div class="card">Loading...</div>';try{const s=await r();if(e.innerHTML=s??"",typeof window.__afterRender=="function")try{window.__afterRender()}catch(t){console.error("[Router] __afterRender error:",t),f.toast("Init error",!1)}finally{window.__afterRender=void 0}window.scrollTo({top:0,behavior:"instant"})}catch(s){console.error("[Router] render error:",s),e.innerHTML=`<div class="card">Render error:<pre>${String(s&&s.stack||s)}</pre></div>`,f.toast("Render error",!1)}}window.addEventListener("hashchange",o),document.addEventListener("click",p=>{const r=p.target.closest("a[data-route]");if(!r)return;const s=r.getAttribute("href")||"";s.startsWith("#/")&&(p.preventDefault(),location.hash!==s&&(location.hash=s))}),o()}async function J(){let e={backlog:0,tasks:0,done:0,open:0,hours:0};try{const a=await fetch("/api/dashboard");if(!a.ok)throw new Error(`HTTP ${a.status}`);const o=await a.json();e={...e,...o}}catch(a){console.error("[Dashboard] fetch error:",a)}return`
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
  `}const d=(e,a=document)=>a.querySelector(e),P=["LOW","MEDIUM","HIGH"],Y=["ON","OFF"],j=[{code:"DLVN",label:"Dai-ichi Life Việt Nam"},{code:"DLKH",label:"Dai-ichi Life Cambodia"},{code:"DLMM",label:"Dai-ichi Life Myanmar"}],I=["PRE","BS","TS","DEV","ST","UAT","GOLIVE"],V={PRE:"01 - Pre-Analysis",BS:"02 - BS",TS:"03 - TS",DEV:"04 - DEV",ST:"05 - ST",UAT:"06 - UAT",GOLIVE:"07 - Go-live"},Q=["NOT_START","IN_PROGRESS","ON_HOLD","COMPLETED"],X=[{label:"Not Start",value:"__NOT_A_PHASE__",disabled:!0},{label:"01 - Pre-Analysis",value:"PRE"},{label:"02 - BS",value:"BS"},{label:"03 - TS",value:"TS"},{label:"04 - DEV",value:"DEV"},{label:"05 - ST",value:"ST"},{label:"06 - UAT",value:"UAT"},{label:"07 - Go-live",value:"GOLIVE"},{label:"COMPLETED",value:"__NOT_A_PHASE__",disabled:!0},{label:"On-Hold",value:"__NOT_A_PHASE__",disabled:!0}],A=(e,a="")=>e.map(o=>`<option ${o===a?"selected":""}>${o}</option>`).join(""),Z=(e="DLVN")=>j.map(a=>`<option value="${a.code}" ${a.code===e?"selected":""}>${a.code} — ${a.label}</option>`).join("");function O(e=[]){const a=new Map((e||[]).map(o=>[o.phase,o]));return I.map(o=>a.get(o)||{phase:o,state:"NOT_START",pic:[],startDate:null,endDate:null,hours:0,progress:null})}function tt(e,a){const o=(e.pic||[]).join(", ");return`<tr data-idx="${a}">
    <td>
      <select class="input phase">
        ${I.map(p=>`<option ${p===e.phase?"selected":""} value="${p}">${V[p]}</option>`).join("")}
      </select>
    </td>
    <td>
      <select class="input state">
        ${Q.map(p=>`<option ${p===e.state?"selected":""}>${p}</option>`).join("")}
      </select>
    </td>
    <td><input class="input pic" placeholder="Ví dụ: Nga, Tuan" value="${o}"></td>
    <td><input class="input sdate" type="date" value="${e.startDate||""}"></td>
    <td><input class="input edate" type="date" value="${e.endDate||""}"></td>
    <td><input class="input hours" type="number" step="0.25" placeholder="0" value="${e.hours??""}"></td>
    <td><input class="input prog" type="number" min="0" max="100" placeholder="%" value="${e.progress??""}"></td>
    <td><button type="button" class="btn ghost t-del">Del</button></td>
  </tr>`}function et(e=[]){return`<div class="tracks-col">${O(e).map(a=>`
      <div class="t-line">
        <span class="t-phase">${V[a.phase]}</span>
        <span class="badge state-${a.state||"NOT_START"}">${(a.state||"NOT_START").replace("_"," ")}</span>
        ${a.progress!=null&&a.progress!==""?`<span class="badge t-prg">${a.progress}%</span>`:""}
      </div>
    `).join("")}</div>`}function st(e=[]){return`<div class="tracks-col">${O(e).map(a=>`
      <div class="t-line">
        <span class="t-pic">${(a.pic||[]).join(", ")||'<span class="muted">—</span>'}</span>
      </div>
    `).join("")}</div>`}function at(e=[]){return`<div class="tracks-col">${O(e).map(a=>`
      <div class="t-line"><span>${a.startDate||'<span class="muted">—</span>'}</span></div>
    `).join("")}</div>`}function it(e=[]){return`<div class="tracks-col">${O(e).map(a=>`
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
    <td class="tracks-cell">${et(e.tracks)}</td>
    <td class="tracks-cell">${st(e.tracks)}</td>
    <td class="tracks-cell">${at(e.tracks)}</td>
    <td class="tracks-cell">${it(e.tracks)}</td>
    <td class="actions">
      <button type="button" class="btn ghost" data-action="edit" data-id="${e.id}">Edit</button>
      <button type="button" class="btn danger" data-action="del" data-id="${e.id}">Del</button>
    </td>
  </tr>`}async function nt(){const e=await window.API.listBacklog();let a=[...e],o=[],p=null;const r=`
  <div class="card">
    <h3>Backlog Filters</h3>
    <div class="row">
      <input class="input" id="f-text" placeholder="Search text..." />
      <select class="input" id="f-site">
        <option value="">All Sites</option>
        ${j.map(s=>`<option value="${s.code}">${s.code} — ${s.label}</option>`).join("")}
      </select>
      <select class="input" id="f-pri">
        <option value="">All Priority</option>
        ${A(P)}
      </select>
      <button type="button" class="btn" id="f-apply">Apply</button>
      <button type="button" class="btn ghost" id="f-clear">Clear</button>
    </div>
  </div>

  <div class="card">
    <h3>Create / Update Backlog</h3>
    <div class="row">
      <select class="input" id="b-site">
        ${Z("DLVN")}
      </select>
      <input class="input" id="b-sr" placeholder="SR" />
      <input class="input" id="b-desc" placeholder="Description" />
    </div>
    <div class="row">
      <input class="input" id="b-owner" placeholder="Owner" />
      <select class="input" id="b-pri">${A(P,"MEDIUM")}</select>
      <input class="input" id="b-due" type="date" title="DueDate" />
    </div>
    <div class="row">
      <select class="input" id="b-onoff">${A(Y,"ON")}</select>
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
          ${X.map(s=>`<option value="${s.value}" ${s.disabled?"disabled":""}>${s.label}</option>`).join("")}
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
  </div>`;return window.__afterRender=()=>{const s=document.getElementById("app"),t=v=>{var l,n;return(n=(l=d(v,s))==null?void 0:l.value)==null?void 0:n.trim()},g=()=>{const v=d("#t-body",s);v.innerHTML=o&&o.length?o.map(tt).join(""):`<tr class="ws-empty"><td colspan="8" class="muted">
            Chưa có pha nào. Chọn <b>STATUS</b> rồi bấm <b>+ Add phase</b>.
          </td></tr>`},T=()=>{["#b-sr","#b-desc","#b-owner","#b-due","#b-progress","#b-complex"].forEach(v=>{const l=d(v,s);l&&(l.value="")}),d("#b-pri",s).value="MEDIUM",d("#b-onoff",s).value="ON",d("#b-site",s).value="DLVN",o=[],p=null,d("#edit-indicator",s).textContent="",g()},E=()=>{const v=(t("#f-text")||"").toLowerCase(),l=d("#f-pri",s).value,n=d("#f-site",s).value,c=e.filter(u=>(!v||(u.description||"").toLowerCase().includes(v)||(u.sr||"").toLowerCase().includes(v)||(u.owner||"").toLowerCase().includes(v))&&(!l||u.priority===l)&&(!n||u.site===n));a=c,d("#tbl",s).innerHTML=c.map(R).join(""),d("#count",s).textContent=c.length};d("#f-apply",s).addEventListener("click",E),d("#f-clear",s).addEventListener("click",()=>{["#f-text","#f-pri","#f-site"].forEach(v=>{const l=d(v,s);l&&(l.value="")}),E()}),d("#ws-add",s).addEventListener("click",()=>{const v=d("#ws-status",s).value;if(v==="__NOT_A_PHASE__"){f.toast("Chọn một pha (01..07) để thêm",!1);return}if(new Set((o||[]).map(n=>n.phase)).has(v)){f.toast("Pha này đã tồn tại",!1);return}o.push({phase:v,state:"NOT_START",pic:[],startDate:"",endDate:"",hours:0,progress:0}),g()}),d("#ws-add-all",s).addEventListener("click",()=>{const v=new Set((o||[]).map(l=>l.phase));I.forEach(l=>{v.has(l)||o.push({phase:l,state:"NOT_START",pic:[],startDate:"",endDate:"",hours:0,progress:0})}),g()}),d("#t-body",s).addEventListener("input",v=>{const l=v.target.closest("tr");if(!l)return;const n=Number(l.dataset.idx);if(!Number.isFinite(n)||!o[n])return;o[n].phase=l.querySelector(".phase").value,o[n].state=l.querySelector(".state").value,o[n].pic=l.querySelector(".pic").value.split(",").map(u=>u.trim()).filter(Boolean),o[n].startDate=l.querySelector(".sdate").value||null,o[n].endDate=l.querySelector(".edate").value||null,o[n].hours=Number(l.querySelector(".hours").value||0);const c=l.querySelector(".prog").value;o[n].progress=c===""?null:Number(c)}),d("#t-body",s).addEventListener("click",v=>{if(!v.target.classList.contains("t-del"))return;const l=v.target.closest("tr"),n=Number(l.dataset.idx);o.splice(n,1),g()}),d("#b-save",s).addEventListener("click",async()=>{const v={site:d("#b-site",s).value||"DLVN",sr:t("#b-sr"),description:t("#b-desc"),owner:t("#b-owner"),priority:d("#b-pri",s).value,dueDate:d("#b-due",s).value||null,onOff:d("#b-onoff",s).value,progress:Number(d("#b-progress",s).value||0),complex:t("#b-complex"),tracks:(o||[]).map(l=>({...l,endDate:l.state==="COMPLETED"&&!l.endDate?new Date().toISOString().slice(0,10):l.endDate}))};if(!v.description){f.toast("Description is required",!1);return}try{p?(await window.API.updateBacklog(p,v),f.toast("Backlog updated")):(await window.API.createBacklog(v),f.toast("Backlog created")),location.hash="#/backlog"}catch{f.toast("Save failed",!1)}}),d("#b-reset",s).addEventListener("click",T),d("#tbl",s).addEventListener("click",async v=>{const l=v.target.closest("button[data-action]");if(!l)return;const n=l.dataset.id,c=l.dataset.action;if(c==="del")try{await window.API.deleteBacklog(n),f.toast("Deleted"),location.hash="#/backlog"}catch{f.toast("Delete failed",!1)}if(c==="edit"){const u=a.find($=>$.id===n);if(!u)return;d("#b-site",s).value=u.site||"DLVN",d("#b-sr",s).value=u.sr||"",d("#b-desc",s).value=u.description||"",d("#b-owner",s).value=u.owner||"",d("#b-pri",s).value=u.priority||"MEDIUM",d("#b-due",s).value=u.dueDate||"",d("#b-onoff",s).value=u.onOff||"ON",d("#b-progress",s).value=u.progress??0,d("#b-complex",s).value=u.complex||"",o=Array.isArray(u.tracks)?JSON.parse(JSON.stringify(u.tracks)):[],g(),p=u.id,d("#edit-indicator",s).textContent=`Editing: ${u.id}`,f.toast(`Loaded ${u.id} to form`),window.scrollTo({top:0,behavior:"smooth"})}}),T();const k=d("#ws-adv",s);k&&(k.open=!1)},r}const i=(e,a=document)=>a.querySelector(e),N=["TODO","IN_PROGRESS","BLOCKED","DONE"],ot=["LOW","MEDIUM","HIGH"],_=["Ta Anh Luan [Sr.BA DMSSC]","Le Thi Hoang Nga [BA DMSSC]","Due, Pham Quang [Sr.Dev DMSSC]","Anh, Nguyen Tuan [Sr.Dev DMSSC]","Phuc, Dinh Pham Hoang [Dev DMSSC]","Tung, Huynh Ngoc Thanh [Dev DMSSC]"],D=["Pre-analysis Working Hour (BA)","Pre-analysis Working Hour (DEV)","BS Working Hour","BS Review Working Hour (DEV)","TS Working Hour","TS Review Working Hour (BA)","Dev Working Hour","ST Working Hour","ST Support Working Hour (DEV)","UAT Support Working Hour (BA)","UAT Support Working Hour (DEV)","Post-Check Working Hour (BA)","Post-Check Working Hour (DEV)","Table-Update/Setup","GOLIVE","COMPLETED","ON-HOLD","Other","Out-of-office"],C=(e,a="")=>e.map(o=>`<option ${o===a?"selected":""}>${o}</option>`).join(""),M=e=>e||"",H=(e=[])=>e.reduce((a,o)=>a+(Number(o)||0),0);function x(e){return`
  <tr>
    <td>${e.id}</td>
    <td>${e.sr||""}</td>
    <td>${e.title||""}</td>
    <td>${e.pic||""}</td>
    <td><span class="badge state-${e.status}">${e.status}</span></td>
    <td>${e.priority||""}</td>
    <td>${M(e.startDate)}</td>
    <td>${M(e.endDate)}</td>
    <td>${e.hours??0}</td>
    <td class="actions">
      <button type="button" class="btn ghost" data-action="edit" data-id="${e.id}">Edit</button>
      <button type="button" class="btn danger" data-action="del" data-id="${e.id}">Del</button>
    </td>
  </tr>`}async function lt(){const[e,a]=await Promise.all([window.API.listTasks(),window.API.listBacklog().catch(()=>[])]),o=new Map(a.map(t=>[String(t.sr||""),t.description||""])),p=new Map(a.map(t=>[String(t.sr||""),t.site||""]));let r=[...e];const s=`
  <div class="card">
    <h3>Task Filters</h3>
    <div class="row">
      <input class="input" id="f-text" placeholder="Search title/note/PIC..." />
      <select class="input" id="f-status">
        <option value="">All Status</option>
        ${C(N)}
      </select>
      <select class="input" id="f-pic">
        <option value="">All PIC</option>
        ${[...new Set([...r.map(t=>t.pic).filter(Boolean),..._])].sort().map(t=>`<option>${t}</option>`).join("")}
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
        ${_.map(t=>`<option value="${t}">${t}</option>`).join("")}
        <option value="__CUSTOM__">Custom…</option>
      </select>
      <input class="input" id="t-pic" placeholder="PIC (free text)" />

      <select class="input" id="t-status">${C(N,"TODO")}</select>
      <select class="input" id="t-pri">${C(ot,"MEDIUM")}</select>
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
    <h3>Task List — Standard <span class="badge" id="count">${r.length}</span></h3>
    <div class="row">
      <div class="kpi card" style="padding:10px;">
        <div class="muted">Total hours</div>
        <div class="num" id="kpi-hours">${H(r.map(t=>t.hours||0))}</div>
      </div>
      <div class="kpi card" style="padding:10px;">
        <div class="muted">Open tasks</div>
        <div class="num" id="kpi-open">${r.filter(t=>t.status!=="DONE").length}</div>
      </div>
      <div class="kpi card" style="padding:10px;">
        <div class="muted">Done</div>
        <div class="num" id="kpi-done">${r.filter(t=>t.status==="DONE").length}</div>
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
        <tbody id="tbl">${r.map(x).join("")}</tbody>
      </table>
    </div>
  </div>`;return window.__afterRender=()=>{const t=document.getElementById("app");let g=null;const T=()=>{const n=i("#t-pic-select",t).value,c=i("#t-pic",t);c.style.display=n==="__CUSTOM__"?"":"none",n&&n!=="__CUSTOM__"&&(c.value=n),n==="__CUSTOM__"&&!c.value&&c.focus()};i("#t-pic-select",t).addEventListener("change",T),T();const E=()=>{const n=i("#t-sr",t).value||"";i("#t-sr-desc",t).value=o.get(n)||"",i("#t-sr-site",t).value=p.get(n)||""};i("#t-sr",t).addEventListener("change",E),E();const k=()=>{const n=i("#t-title-select",t).value,c=i("#t-pic-select",t).value,u=c&&c!=="__CUSTOM__"?c:i("#t-pic",t).value.trim();return{sr:i("#t-sr",t).value||"",title:n,description:i("#t-note",t).value.trim(),pic:u,status:i("#t-status",t).value,priority:i("#t-pri",t).value,startDate:i("#t-start",t).value||null,endDate:i("#t-end",t).value||null,hours:Number(i("#t-hours",t).value||0)}},v=()=>{["#t-note","#t-pic","#t-start","#t-end","#t-hours"].forEach(n=>{const c=i(n,t);c&&(c.value="")}),i("#t-status",t).value="TODO",i("#t-pri",t).value="MEDIUM",i("#t-sr",t).value="",i("#t-title-select",t).value=D[0],i("#t-pic-select",t).value="",i("#t-sr-desc",t).value="",i("#t-sr-site",t).value="",g=null,i("#edit-indicator",t).textContent="",T()},l=()=>{const n=(i("#f-text",t).value||"").toLowerCase(),c=i("#f-status",t).value,u=i("#f-pic",t).value,$=i("#f-sr",t).value,h=i("#f-title",t).value,w=e.filter(b=>(!n||(b.title||"").toLowerCase().includes(n)||(b.description||"").toLowerCase().includes(n)||(b.pic||"").toLowerCase().includes(n))&&(!c||b.status===c)&&(!u||b.pic===u)&&(!$||b.sr===$)&&(!h||b.title===h));r=w,i("#tbl",t).innerHTML=w.map(x).join(""),i("#count",t).textContent=w.length,i("#kpi-hours",t).textContent=H(w.map(b=>b.hours||0)),i("#kpi-open",t).textContent=w.filter(b=>b.status!=="DONE").length,i("#kpi-done",t).textContent=w.filter(b=>b.status==="DONE").length};i("#f-apply",t).addEventListener("click",l),i("#f-clear",t).addEventListener("click",()=>{["#f-text","#f-status","#f-pic","#f-sr","#f-title"].forEach(n=>{const c=i(n,t);c&&(c.value="")}),l()}),i("#t-save",t).addEventListener("click",async()=>{const n=k();if(!n.title){f.toast("Title is required",!1);return}if(!D.includes(n.title)){f.toast("Title must be from standard list",!1);return}if(!n.pic){f.toast("PIC is required",!1);return}try{g?(await window.API.updateTask(g,n),f.toast("Task updated")):(await window.API.createTask(n),f.toast("Task created")),location.hash="#/tasks"}catch{f.toast("Save failed",!1)}}),i("#t-reset",t).addEventListener("click",v),i("#tbl",t).addEventListener("click",async n=>{const c=n.target.closest("button[data-action]");if(!c)return;const u=c.dataset.id,$=c.dataset.action;if($==="del"){try{await window.API.deleteTask(u),f.toast("Deleted"),location.hash="#/tasks"}catch{f.toast("Delete failed",!1)}return}if($==="edit"){const h=r.find(w=>w.id===u);if(!h)return;i("#t-sr",t).value=h.sr||"",i("#t-sr-desc",t).value=o.get(String(h.sr||""))||"",i("#t-sr-site",t).value=p.get(String(h.sr||""))||"",i("#t-title-select",t).value=D.includes(h.title)?h.title:"Other",_.includes(h.pic)?(i("#t-pic-select",t).value=h.pic,i("#t-pic",t).value=""):(i("#t-pic-select",t).value="__CUSTOM__",i("#t-pic",t).value=h.pic||""),T(),i("#t-note",t).value=h.description||"",i("#t-status",t).value=h.status||"TODO",i("#t-pri",t).value=h.priority||"MEDIUM",i("#t-start",t).value=h.startDate||"",i("#t-end",t).value=h.endDate||"",i("#t-hours",t).value=h.hours??"",g=h.id,i("#edit-indicator",t).textContent=`Editing: ${h.id}`,f.toast(`Loaded ${h.id} to form`),window.scrollTo({top:0,behavior:"smooth"})}})},s}async function rt(){const e=await window.API.reportSummary(),a=Object.keys(e.hoursByPIC||{}),o=Object.values(e.hoursByPIC||{}),p=`
    <div class="card">
      <h3>Report: Hours by PIC</h3>
      <canvas id="reportChart" height="140"></canvas>
    </div>
  `;return window.__afterRender=()=>{const r=document.getElementById("reportChart");r&&new Chart(r,{type:"bar",data:{labels:a,datasets:[{label:"Hours",data:o}]},options:{plugins:{legend:{labels:{color:"#e6eef5"}}},scales:{x:{ticks:{color:"#9bb0bf"}},y:{ticks:{color:"#9bb0bf"}}}}})},p}L("#/dashboard",J);L("#/backlog",nt);L("#/tasks",lt);L("#/report",rt);const m=document.getElementById("sidebar"),y=document.getElementById("sbBackdrop"),S=document.getElementById("btnOpenSidebar");document.getElementById("toast");const B=document.getElementById("status");function dt(){m==null||m.setAttribute("data-state","open"),y==null||y.setAttribute("data-show","true"),S==null||S.setAttribute("aria-expanded","true")}function W(){m==null||m.setAttribute("data-state","closed"),y==null||y.removeAttribute("data-show"),S==null||S.setAttribute("aria-expanded","false")}S==null||S.addEventListener("click",()=>{(m==null?void 0:m.getAttribute("data-state"))==="open"?W():dt()});y==null||y.addEventListener("click",W);function q(){window.innerWidth>1024&&(m==null||m.setAttribute("data-state","open"),y==null||y.removeAttribute("data-show"),S==null||S.setAttribute("aria-expanded","true"))}window.addEventListener("resize",q);q();function F(){const e=location.hash||"#/dashboard";document.querySelectorAll("[data-route]").forEach(a=>{a.getAttribute("href")===e?a.classList.add("active"):a.classList.remove("active")}),B&&(B.textContent=`Route: ${e}`)}window.addEventListener("hashchange",F);F();z();
