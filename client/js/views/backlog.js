// client/js/views/backlog.js
import { UI } from '../router.js';
const $ = (s, root=document) => root.querySelector(s);

/* ====== Constants ====== */
const PRIORITY_LIST = ['LOW','MEDIUM','HIGH'];
// Dữ liệu thật trong DB: "On Track" / "Hold" / "Risk"
const ONOFF_LIST = ['On Track','Hold','Risk'];

/* ---- Sites ---- */
const SITE_LIST = [
  { code: 'DLVN', label: 'Dai-ichi Life Việt Nam' },
  { code: 'DLKH', label: 'Dai-ichi Life Cambodia' },
  { code: 'DLMM', label: 'Dai-ichi Life Myanmar' },
];

/* ---- Phases ---- */
const PHASE_ORDER = ['PRE','BS','TS','DEV','ST','UAT','GOLIVE'];
const PHASE_LABEL = {
  PRE: '01 - Pre-Analysis',
  BS: '02 - BS',
  TS: '03 - TS',
  DEV: '04 - DEV',
  ST: '05 - ST',
  UAT: '06 - UAT',
  GOLIVE: '07 - Go-live'
};
const TRACK_STATE = ['NOT_START','IN_PROGRESS','ON_HOLD','COMPLETED'];

/* ---- STATUS picker (UI hướng dẫn) ---- */
const STATUS_PICKER = [
  { label:'Not Start', value:'__NOT_A_PHASE__', disabled:true },
  { label:'01 - Pre-Analysis', value:'PRE' },
  { label:'02 - BS', value:'BS' },
  { label:'03 - TS', value:'TS' },
  { label:'04 - DEV', value:'DEV' },
  { label:'05 - ST', value:'ST' },
  { label:'06 - UAT', value:'UAT' },
  { label:'07 - Go-live', value:'GOLIVE' },
  { label:'COMPLETED', value:'__NOT_A_PHASE__', disabled:true },
  { label:'On-Hold', value:'__NOT_A_PHASE__', disabled:true },
];

/* ====== Helpers ====== */
const optList = (list, selected='') =>
  list.map(x => `<option ${x===selected?'selected':''}>${x}</option>`).join('');

const siteOptions = (selected='DLVN') =>
  SITE_LIST.map(s => `<option value="${s.code}" ${s.code===selected?'selected':''}>${s.code} — ${s.label}</option>`).join('');

function orderedTracks(tracks=[]) {
  const map = new Map((tracks||[]).map(t => [t.phase, t]));
  return PHASE_ORDER.map(ph => map.get(ph) || {
    phase: ph, state:'NOT_START', pic:[], startDate:null, endDate:null, hours:0, progress:null
  });
}

// ISO -> YYYY-MM-DD cho <input type="date">
function toYMD(iso) {
  if (!iso) return '';
  try { return new Date(iso).toISOString().slice(0,10); } catch { return ''; }
}

/* ====== Form track row ====== */
function trackRow(t, idx){
  const pics = (t.pic || []).join(', ');
  return `<tr data-idx="${idx}">
    <td>
      <select class="input phase">
        ${PHASE_ORDER.map(p=>`<option ${p===t.phase?'selected':''} value="${p}">${PHASE_LABEL[p]}</option>`).join('')}
      </select>
    </td>
    <td>
      <select class="input state">
        ${TRACK_STATE.map(s=>`<option ${s===t.state?'selected':''}>${s}</option>`).join('')}
      </select>
    </td>
    <td><input class="input pic" placeholder="Ví dụ: Nga, Tuan" value="${pics}"></td>
    <td><input class="input sdate" type="date" value="${t.startDate||''}"></td>
    <td><input class="input edate" type="date" value="${t.endDate||''}"></td>
    <td><input class="input hours" type="number" step="0.25" placeholder="0" value="${t.hours ?? ''}"></td>
    <td><input class="input prog" type="number" min="0" max="100" placeholder="%" value="${t.progress ?? ''}"></td>
    <td><button type="button" class="btn ghost t-del">Del</button></td>
  </tr>`;
}

/* ====== Tracks columns (list view) ====== */
function tracksPhaseCol(tracks=[]) {
  return `<div class="tracks-col">${
    orderedTracks(tracks).map(t => `
      <div class="t-line">
        <span class="t-phase">${PHASE_LABEL[t.phase]}</span>
        <span class="badge state-${t.state||'NOT_START'}">${(t.state||'NOT_START').replace('_',' ')}</span>
        ${t.progress!=null && t.progress!=='' ? `<span class="badge t-prg">${t.progress}%</span>` : ''}
      </div>
    `).join('')
  }</div>`;
}
function tracksPicCol(tracks=[]) {
  return `<div class="tracks-col">${
    orderedTracks(tracks).map(t => `
      <div class="t-line">
        <span class="t-pic">${(t.pic||[]).join(', ') || '<span class="muted">—</span>'}</span>
      </div>
    `).join('')
  }</div>`;
}
function tracksStartCol(tracks=[]) {
  return `<div class="tracks-col">${
    orderedTracks(tracks).map(t => `
      <div class="t-line"><span>${t.startDate || '<span class="muted">—</span>'}</span></div>
    `).join('')
  }</div>`;
}
function tracksEndCol(tracks=[]) {
  return `<div class="tracks-col">${
    orderedTracks(tracks).map(t => `
      <div class="t-line"><span>${t.endDate || '<span class="muted">—</span>'}</span></div>
    `).join('')
  }</div>`;
}

/* ====== Table Row (list) ====== */
function row(b){
  return `<tr>
    <td>${b.id}</td>
    <td>${b.site || ''}</td>
    <td>${b.sr||''}</td>
    <td>${b.description||''}</td>
    <td>${b.owner||''}</td>
    <td>${b.priority||''}</td>
    <td>${b.startDate ? toYMD(b.startDate) : ''}</td>
    <td>${b.onOff||''}</td>
    <td>${b.progress??0}</td>
    <td>${b.complex||''}</td>
    <td class="tracks-cell">${tracksPhaseCol(b.tracks)}</td>
    <td class="tracks-cell">${tracksPicCol(b.tracks)}</td>
    <td class="tracks-cell">${tracksStartCol(b.tracks)}</td>
    <td class="tracks-cell">${tracksEndCol(b.tracks)}</td>
    <td class="actions">
      <button type="button" class="btn ghost" data-action="edit" data-id="${b.id}">Edit</button>
      <button type="button" class="btn danger" data-action="del" data-id="${b.id}">Del</button>
    </td>
  </tr>`;
}

/* ====== View ====== */
export default async function Backlog(){
  const data = await window.API.listBacklog();
  let items = [...data];

  // State form
  let tracks = [];
  let editingId = null;

  const html = `
  <div class="card">
    <h3>Backlog Filters</h3>
    <div class="row">
      <input class="input" id="f-text" placeholder="Search text..." />
      <select class="input" id="f-site">
        <option value="">All Sites</option>
        ${SITE_LIST.map(s=>`<option value="${s.code}">${s.code} — ${s.label}</option>`).join('')}
      </select>
      <select class="input" id="f-pri">
        <option value="">All Priority</option>
        ${optList(PRIORITY_LIST)}
      </select>
      <button type="button" class="btn" id="f-apply">Apply</button>
      <button type="button" class="btn ghost" id="f-clear">Clear</button>
    </div>
  </div>

  <div class="card">
    <h3>Create / Update Backlog</h3>
    <div class="row">
      <div class="field">
        <label>Site</label>
        <select class="input" id="b-site">${siteOptions('DLVN')}</select>
      </div>
      <div class="field">
        <label>SR</label>
        <input class="input" id="b-sr" placeholder="VD: SR18913" />
      </div>
      <div class="field" style="grid-column:1 / -1">
        <label>Description</label>
        <textarea class="input" id="b-desc" placeholder="Mô tả ngắn"></textarea>
      </div>
    </div>
    <div class="row">
      <div class="field"><label>Owner</label><input class="input" id="b-owner" placeholder="VD: Luan, Ta Anh [Tech/DMSSC]" /></div>
      <div class="field"><label>Priority</label><select class="input" id="b-pri">${optList(PRIORITY_LIST,'MEDIUM')}</select></div>
      <div class="field"><label>Start Date</label><input class="input" id="b-start" type="date" /></div>
    </div>
    <div class="row">
      <div class="field"><label>On/Off</label><select class="input" id="b-onoff">${optList(ONOFF_LIST,'On Track')}</select></div>
      <div class="field"><label>% Overall</label><input class="input" id="b-progress" type="number" min="0" max="100" placeholder="0..100" /></div>
      <div class="field"><label>Complex</label><input class="input" id="b-complex" placeholder="S/M/L hoặc số" /></div>
    </div>

    <!-- Workstreams (Advanced) -->
    <details id="ws-adv" class="ws">
      <summary>
        <strong>Workstreams (chọn pha cần quản lý)</strong>
        <span class="muted">Chọn pha trong dropdown <b>STATUS</b>, mỗi pha sẽ tạo 1 dòng</span>
      </summary>

      <div class="row">
        <select class="input" id="ws-status">
          ${STATUS_PICKER.map(o => `<option value="${o.value}" ${o.disabled?'disabled':''}>${o.label}</option>`).join('')}
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
    <h3>Backlog List <span class="badge" id="count">${items.length}</span></h3>
    <div style="overflow:auto">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th><th>Site</th><th>SR</th><th>Description</th><th>Owner</th><th>Priority</th>
            <th>Start</th><th>On/Off</th><th>%Overall</th><th>Complex</th>
            <th>Phase / State / %</th><th>PIC(s)</th><th>Start</th><th>End</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="tbl">${items.map(row).join('')}</tbody>
      </table>
    </div>
  </div>`;

  window.__afterRender = () => {
    const app = document.getElementById('app');
    const getVal = id => $(id, app)?.value?.trim();

    /* ---- render tracks ---- */
    const renderTracks = () => {
      const body = $('#t-body', app);
      body.innerHTML = (tracks && tracks.length)
        ? tracks.map(trackRow).join('')
        : `<tr class="ws-empty"><td colspan="8" class="muted">
            Chưa có pha nào. Chọn <b>STATUS</b> rồi bấm <b>+ Add phase</b>.
          </td></tr>`;
    };

    /* ---- reset form ---- */
    const resetForm = () => {
      ['#b-sr','#b-desc','#b-owner','#b-start','#b-progress','#b-complex'].forEach(sel => { const el=$(sel,app); if(el) el.value=''; });
      $('#b-pri',app).value='MEDIUM';
      $('#b-onoff',app).value='On Track';
      $('#b-site',app).value='DLVN';
      tracks = [];
      editingId = null;
      $('#edit-indicator',app).textContent='';
      renderTracks();
    };

    /* ---- Filters ---- */
    const applyFilters = () => {
      const q  = (getVal('#f-text') || '').toLowerCase();
      const pr = $('#f-pri', app).value;
      const site = $('#f-site', app).value;

      const filtered = data.filter(x =>
        (!q || (x.description||'').toLowerCase().includes(q) || (x.sr||'').toLowerCase().includes(q) || (x.owner||'').toLowerCase().includes(q)) &&
        (!pr || x.priority === pr) &&
        (!site || x.site === site)
      );

      items = filtered;
      $('#tbl', app).innerHTML = filtered.map(row).join('');
      $('#count', app).textContent = filtered.length;
    };
    $('#f-apply', app).addEventListener('click', applyFilters);
    $('#f-clear', app).addEventListener('click', ()=>{ ['#f-text','#f-pri','#f-site'].forEach(s=>{const el=$(s,app); if(el) el.value='';}); applyFilters(); });

    /* ---- STATUS picker → Add phase ---- */
    $('#ws-add', app).addEventListener('click', () => {
      const val = $('#ws-status', app).value;
      if (val === '__NOT_A_PHASE__') { UI.toast('Chọn một pha (01..07) để thêm', false); return; }
      const have = new Set((tracks||[]).map(t=>t.phase));
      if (have.has(val)) { UI.toast('Pha này đã tồn tại', false); return; }
      tracks.push({ phase: val, state:'NOT_START', pic:[], startDate:'', endDate:'', hours:0, progress:0 });
      renderTracks();
    });

    $('#ws-add-all', app).addEventListener('click', () => {
      const have = new Set((tracks||[]).map(t=>t.phase));
      PHASE_ORDER.forEach(p => { if (!have.has(p)) tracks.push({ phase:p, state:'NOT_START', pic:[], startDate:'', endDate:'', hours:0, progress:0 }); });
      renderTracks();
    });

    $('#t-body', app).addEventListener('input', (e) => {
      const tr = e.target.closest('tr'); if (!tr) return;
      const i = Number(tr.dataset.idx); if (!Number.isFinite(i) || !tracks[i]) return;
      tracks[i].phase     = tr.querySelector('.phase').value;
      tracks[i].state     = tr.querySelector('.state').value;
      tracks[i].pic       = tr.querySelector('.pic').value.split(',').map(s=>s.trim()).filter(Boolean);
      tracks[i].startDate = tr.querySelector('.sdate').value || null;
      tracks[i].endDate   = tr.querySelector('.edate').value || null;
      tracks[i].hours     = Number(tr.querySelector('.hours').value || 0);
      const pv = tr.querySelector('.prog').value;
      tracks[i].progress  = pv==='' ? null : Number(pv);
    });
    $('#t-body', app).addEventListener('click', (e) => {
      if (!e.target.classList.contains('t-del')) return;
      const tr = e.target.closest('tr');
      const i = Number(tr.dataset.idx);
      tracks.splice(i,1);
      renderTracks();
    });

    /* ---- Save ---- */
    $('#b-save', app).addEventListener('click', async () => {
      const body = {
        site: $('#b-site',app).value || 'DLVN',
        sr: getVal('#b-sr'),
        description: getVal('#b-desc'),
        owner: getVal('#b-owner'),
        priority: $('#b-pri',app).value,
        startDate: $('#b-start',app).value || null,
        onOff: $('#b-onoff',app).value,
        progress: Number($('#b-progress',app).value || 0),
        complex: getVal('#b-complex'),
        tracks: (tracks||[]).map(t => ({
          ...t,
          endDate: (t.state === 'COMPLETED' && !t.endDate) ? new Date().toISOString().slice(0,10) : t.endDate
        }))
      };

      if (!body.description) { UI.toast('Description is required', false); return; }

      try {
        if (editingId) {
          await window.API.updateBacklog(editingId, body);
          UI.toast('Backlog updated');
        } else {
          await window.API.createBacklog(body);
          UI.toast('Backlog created');
        }
        location.hash = '#/backlog';
      } catch(e){ UI.toast('Save failed', false); }
    });

    /* ---- Reset ---- */
    $('#b-reset', app).addEventListener('click', resetForm);

    /* ---- List actions ---- */
    $('#tbl', app).addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;

      if (action === 'del') {
        try {
          await window.API.deleteBacklog(id);
          UI.toast('Deleted'); location.hash = '#/backlog';
        } catch(e){ UI.toast('Delete failed', false); }
      }

      if (action === 'edit') {
        const it = items.find(x=>x.id===id); if (!it) return;
        $('#b-site',app).value = it.site || 'DLVN';
        $('#b-sr',app).value = it.sr || '';
        $('#b-desc',app).value = it.description || '';
        $('#b-owner',app).value = it.owner || '';
        $('#b-pri',app).value = it.priority || 'MEDIUM';
        $('#b-start',app).value = toYMD(it.startDate) || '';
        $('#b-onoff',app).value = it.onOff || 'On Track';
        $('#b-progress',app).value = it.progress ?? 0;
        $('#b-complex',app).value = it.complex || '';
        tracks = Array.isArray(it.tracks) ? JSON.parse(JSON.stringify(it.tracks)) : [];
        renderTracks();
        editingId = it.id;
        $('#edit-indicator',app).textContent = `Editing: ${it.id}`;
        UI.toast(`Loaded ${it.id} to form`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    /* ---- init ---- */
    resetForm();
    const adv = $('#ws-adv', app); if (adv) adv.open = false;
  };

  return html;
}
