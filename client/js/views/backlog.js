// client/js/views/backlog.js
import { UI } from '../router.js';
const $ = (s, root=document) => root.querySelector(s);

/* ====== Constants ====== */
const PRIORITY_LIST = ['LOW','MEDIUM','HIGH'];
const ONOFF_LIST = ['On Track','Hold','Risk'];

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

function toYMD(iso) {
  if (!iso) return '';
  try { return new Date(iso).toISOString().slice(0,10); } catch { return ''; }
}

/** Chuẩn hoá mảng tracks theo thứ tự phase */
function orderedTracks(tracks=[]) {
  const map = new Map((tracks||[]).map(t => [t.phase, t]));
  return PHASE_ORDER.map(ph => map.get(ph) || {
    phase: ph, state:'NOT_START', pic:[], startDate:null, endDate:null, hours:0, progress:null
  });
}

/** Chỉ giữ dòng có dữ liệu thực (tránh rác) */
function nonEmptyTracks(tracks=[]) {
  return orderedTracks(tracks).filter(t =>
    (t.pic && t.pic.length) || t.startDate || t.endDate ||
    (t.progress !== null && t.progress !== undefined) ||
    (t.state && t.state !== 'NOT_START')
  );
}

/** Badge state */
function stateBadge(state='NOT_START'){
  const s = String(state||'NOT_START');
  const label = s.replace('_',' ');
  if (s === 'IN_PROGRESS')  return `<span class="badge state-IN_PROGRESS">${label}</span>`;
  if (s === 'ON_HOLD')      return `<span class="badge state-ON_HOLD">${label}</span>`;
  if (s === 'COMPLETED')    return `<span class="badge state-COMPLETED">${label}</span>`;
  return `<span class="badge">${label}</span>`;
}

/** Compact summary (hiển thị khi thu gọn) */
function compactSummary(tracks=[]) {
  const list = nonEmptyTracks(tracks);
  if (!list.length) return '<span class="muted">—</span>';
  const top2 = list.slice(0,2).map(t => {
    const short = PHASE_LABEL[t.phase]?.split(' - ')[1] || t.phase;
    const prg = (t.progress!=null) ? ` ${t.progress}%` : '';
    return `${short}${prg}`;
  });
  return top2.join(' • ');
}

/** === Expanded tracks grid (có Edit/Del) === */
function renderTracksGrid(item){
  const list = nonEmptyTracks(item?.tracks||[]);
  if (!list.length) {
    return `<div class="muted" style="padding:8px">Không có dữ liệu workstream</div>`;
  }

  const rows = list.map((t, i) => `
    <div class="tg-row" data-track-idx="${i}">
      <div class="tg-cell tg-phase">${PHASE_LABEL[t.phase]||t.phase}</div>
      <div class="tg-cell tg-state">
        ${stateBadge(t.state||'NOT_START')}
        ${t.progress!=null ? `<span class="badge t-prg">${t.progress}%</span>` : ''}
      </div>
      <div class="tg-cell tg-pic">${(t.pic||[]).join(', ') || '<span class="muted">—</span>'}</div>
      <div class="tg-cell tg-date">${t.startDate || '<span class="muted">—</span>'}</div>
      <div class="tg-cell tg-date">${t.endDate || '<span class="muted">—</span>'}</div>
      <div class="tg-cell tg-actions">
        <button type="button" class="btn sm ghost" data-track-edit="${i}" data-id="${item.id}">Edit</button>
        <button type="button" class="btn sm danger" data-track-del="${i}" data-id="${item.id}">Del</button>
      </div>
    </div>
  `).join('');

  return `
    <div class="tracks-grid">
      <div class="tg-head">
        <div class="tg-h">Phase</div>
        <div class="tg-h">State / %</div>
        <div class="tg-h">PIC(s)</div>
        <div class="tg-h">Start</div>
        <div class="tg-h">End</div>
        <div class="tg-h"></div>
      </div>
      <div class="tg-body">${rows}</div>
    </div>
  `;
}

/* ====== Form track row (trong phần tạo/sửa) ====== */
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
    <td><button type="button" class="btn sm ghost t-del">Del</button></td>
  </tr>`;
}

/* ====== Table Row (list) ====== */
function row(b){
  const summary = compactSummary(b.tracks);
  return `<tr data-row="${b.id}">
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

    <!-- Phase column: compact + nút expand -->
    <td class="tracks-cell">
      <div class="tracks-compact">${summary}</div>
      <button type="button" class="btn sm ghost t-exp" data-id="${b.id}">Expand</button>
    </td>

    <!-- giữ 3 cột placeholder để khung không lệch -->
    <td class="tracks-cell muted">—</td>
    <td class="tracks-cell muted">—</td>
    <td class="tracks-cell muted">—</td>

    <td class="actions">
      <button type="button" class="btn sm ghost" data-action="edit" data-id="${b.id}">Edit</button>
      <button type="button" class="btn sm danger" data-action="del" data-id="${b.id}">Del</button>
    </td>
  </tr>`;
}

/* ====== Sorting ====== */
const SORT_FIELDS = [
  { value:'startDate', label:'Start Date' },
  { value:'priority',  label:'Priority' },
  { value:'progress',  label:'% Overall' },
  { value:'updatedAt', label:'UpdatedAt' },
];
function priorityRank(p){ return p==='HIGH'?3 : p==='MEDIUM'?2 : 1; }
function cmp(a,b){ return a<b?-1:a>b?1:0; }
function sortItems(list, field, dir){
  if (!field) return list;
  const k = String(field);
  const sign = dir==='desc'?-1:1;
  const arr = [...list];
  arr.sort((x,y) => {
    let ax, ay;
    if (k==='priority'){ ax = priorityRank(x.priority||''); ay = priorityRank(y.priority||''); }
    else if (k==='progress'){ ax = Number(x.progress||0); ay = Number(y.progress||0); }
    else { ax = x[k] ? String(x[k]) : ''; ay = y[k] ? String(y[k]) : ''; }
    return sign * cmp(ax, ay);
  });
  return arr;
}

/* ====== View ====== */
export default async function Backlog(){
  const data = await window.API.listBacklog();
  let items = [...data];

  // State form (create/update)
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

      <!-- Sort -->
      <select class="input" id="f-sort">
        <option value="">Sort: None</option>
        ${SORT_FIELDS.map(s=>`<option value="${s.value}">${s.label}</option>`).join('')}
      </select>
      <select class="input" id="f-dir">
        <option value="asc">Asc</option>
        <option value="desc" selected>Desc</option>
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

    <!-- Workstreams -->
    <details id="ws-adv" class="ws" open>
      <summary>
        <strong>Workstreams (chọn pha cần quản lý)</strong>
        <span class="muted">Điền nhanh ở thanh dưới rồi bấm <b>+ Add phase</b> để tạo dòng.</span>
      </summary>

      <!-- QUICK ADD BAR -->
      <div class="row">
        <select class="input" id="ws-status">
          ${STATUS_PICKER.map(o => `<option value="${o.value}" ${o.disabled?'disabled':''}>${o.label}</option>`).join('')}
        </select>
        <select class="input" id="ws-state">${optList(TRACK_STATE,'NOT_START')}</select>
        <input class="input" id="ws-pic" placeholder="PIC(s): Nga, Tuan" />
        <input class="input" id="ws-sdate" type="date" />
        <input class="input" id="ws-edate" type="date" />
        <input class="input" id="ws-hours" type="number" step="0.25" placeholder="Hours" />
        <input class="input" id="ws-prog" type="number" min="0" max="100" placeholder="%" />
        <button type="button" class="btn" id="ws-add">+ Add phase</button>
        <button type="button" class="btn ghost" id="ws-add-all">+ Add remaining phases</button>
        <span class="muted" style="grid-column:1 / -1">Mỗi dòng: Phase • State • PIC(s) • Start • End • Hours • %</span>
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
              Chưa có pha nào. Chọn <b>Phase/State/PIC/Date</b> ở thanh trên rồi bấm <b>+ Add phase</b>.
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
      <table class="table" id="backlog-table">
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

    const table = $('#backlog-table', app);
    const COLS = table.querySelectorAll('thead th').length;

    const closeAnyDetails = () => {
      table.querySelectorAll('tr.row-details').forEach(tr => tr.remove());
      table.querySelectorAll('button.t-exp[data-open="1"]').forEach(b => { b.dataset.open = '0'; b.textContent = 'Expand'; });
    };

    const renderDetailsRow = (item) => `
      <tr class="row-details" data-row-details="${item.id}">
        <td colspan="${COLS}">
          ${renderTracksGrid(item)}
          <div style="padding:8px 0">
            <button type="button" class="btn sm ghost" data-collapse="${item.id}">Collapse</button>
          </div>
        </td>
      </tr>
    `;

    const toggleDetails = (id) => {
      const btn = table.querySelector(`button.t-exp[data-id="${id}"]`);
      const tr = table.querySelector(`tr[data-row="${id}"]`);
      if (!tr || !btn) return;

      // Đang mở? -> đóng
      if (btn.dataset.open === '1') {
        const next = tr.nextElementSibling;
        if (next && next.classList.contains('row-details')) next.remove();
        btn.dataset.open = '0'; btn.textContent = 'Expand';
        return;
      }

      // Đóng các row khác trước
      closeAnyDetails();

      // Tạo row chi tiết
      const item = items.find(x => x.id === id);
      tr.insertAdjacentHTML('afterend', renderDetailsRow(item));
      btn.dataset.open = '1'; btn.textContent = 'Collapse';
    };

    /* ---- render tracks (form) ---- */
    const renderTracks = () => {
      const body = $('#t-body', app);
      body.innerHTML = (tracks && tracks.length)
        ? tracks.map(trackRow).join('')
        : `<tr class="ws-empty"><td colspan="8" class="muted">
            Chưa có pha nào. Chọn <b>Phase/State/PIC/Date</b> rồi bấm <b>+ Add phase</b>.
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

    /* ---- Filters + Sort ---- */
    const applyFilters = () => {
      const q  = (getVal('#f-text') || '').toLowerCase();
      const pr = $('#f-pri', app).value;
      const site = $('#f-site', app).value;
      const sfield = $('#f-sort', app).value;
      const sdir   = $('#f-dir', app).value;

      let filtered = data.filter(x =>
        (!q || (x.description||'').toLowerCase().includes(q) || (x.sr||'').toLowerCase().includes(q) || (x.owner||'').toLowerCase().includes(q)) &&
        (!pr || x.priority === pr) &&
        (!site || x.site === site)
      );

      filtered = sortItems(filtered, sfield, sdir);

      items = filtered;
      $('#tbl', app).innerHTML = filtered.map(row).join('');
      $('#count', app).textContent = filtered.length;
    };
    $('#f-apply', app).addEventListener('click', applyFilters);
    $('#f-clear', app).addEventListener('click', ()=>{
      ['#f-text','#f-pri','#f-site','#f-sort','#f-dir'].forEach(s=>{const el=$(s,app); if(el){ if(s==='#f-dir') el.value='desc'; else el.value=''; }});
      applyFilters();
    });

    /* ---- QUICK ADD BAR → Add phase ---- */
    $('#ws-add', app).addEventListener('click', () => {
      const ph = $('#ws-status', app).value;
      if (ph === '__NOT_A_PHASE__') { UI.toast('Chọn Phase hợp lệ (01..07)', false); return; }
      const have = new Set((tracks||[]).map(t=>t.phase));
      if (have.has(ph)) { UI.toast('Pha này đã tồn tại', false); return; }

      const state = $('#ws-state', app).value || 'NOT_START';
      const pics  = (getVal('#ws-pic') || '').split(',').map(s=>s.trim()).filter(Boolean);
      const sdate = $('#ws-sdate', app).value || null;
      const edate = $('#ws-edate', app).value || null;
      const hours = Number($('#ws-hours', app).value || 0);
      const prog  = $('#ws-prog', app).value === '' ? null : Number($('#ws-prog', app).value);

      tracks.push({ phase: ph, state, pic:pics, startDate:sdate, endDate:edate, hours, progress:prog });
      renderTracks();
      UI.toast('Đã thêm phase');
    });

    $('#ws-add-all', app).addEventListener('click', () => {
      const have = new Set((tracks||[]).map(t=>t.phase));
      PHASE_ORDER.forEach(p => { if (!have.has(p)) tracks.push({ phase:p, state:'NOT_START', pic:[], startDate:'', endDate:'', hours:0, progress:0 }); });
      renderTracks();
    });

    /* ---- Track table (form) input events ---- */
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

    /* ---- List actions + Expand/Collapse + Track inline edit ---- */
    $('#tbl', app).addEventListener('click', async (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      // collapse details
      if (btn.hasAttribute('data-collapse')) {
        const id = btn.getAttribute('data-collapse');
        const tr = table.querySelector(`tr[data-row="${id}"]`);
        const next = tr?.nextElementSibling;
        if (next && next.classList.contains('row-details')) next.remove();
        const exp = table.querySelector(`button.t-exp[data-id="${id}"]`);
        if (exp) { exp.dataset.open='0'; exp.textContent='Expand'; }
        return;
      }

      // expand toggle
      if (btn.classList.contains('t-exp')) {
        toggleDetails(btn.dataset.id);
        return;
      }

      // edit/delete backlog row
      const id = btn.dataset.id;
      const action = btn.dataset.action;

      if (action === 'del') {
        try {
          await window.API.deleteBacklog(id);
          UI.toast('Deleted'); location.hash = '#/backlog';
        } catch(e){ UI.toast('Delete failed', false); }
        return;
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
        UI.toast(`Loaded ${it.id} to form`);
        renderTracks();
        editingId = it.id;
        $('#edit-indicator',app).textContent = `Editing: ${it.id}`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // ===== Inline edit tracks inside expanded grid =====
      if (btn.hasAttribute('data-track-edit') || btn.hasAttribute('data-track-del') || btn.hasAttribute('data-track-save') || btn.hasAttribute('data-track-cancel')) {
        const itemId = btn.getAttribute('data-id');
        const itIndex = items.findIndex(x => x.id === itemId);
        if (itIndex < 0) return;
        const it = items[itIndex];
        const detailsRow = table.querySelector(`tr.row-details[data-row-details="${itemId}"]`);
        const rowWrap = detailsRow?.querySelector('.tracks-grid');

        // helper to re-render details
        const rerender = () => {
          if (!rowWrap) return;
          detailsRow.querySelector('td').innerHTML = `
            ${renderTracksGrid(items[itIndex])}
            <div style="padding:8px 0">
              <button type="button" class="btn sm ghost" data-collapse="${itemId}">Collapse</button>
            </div>
          `;
        };

        // delete track
        if (btn.hasAttribute('data-track-del')) {
          const i = Number(btn.getAttribute('data-track-del'));
          const newTracks = (it.tracks||[]).filter((_,idx)=>idx!==i);
          try{
            const body = { ...it, tracks:newTracks };
            delete body.id;
            await window.API.updateBacklog(itemId, body);
            items[itIndex] = { ...it, tracks:newTracks };
            rerender();
            UI.toast('Deleted phase');
          }catch(err){ UI.toast('Delete phase failed', false); }
          return;
        }

        // start edit: replace row with editor
        if (btn.hasAttribute('data-track-edit')) {
          const i = Number(btn.getAttribute('data-track-edit'));
          const row = detailsRow.querySelector(`.tg-row[data-track-idx="${i}"]`);
          const t = (it.tracks||[])[i];
          if (!row || !t) return;

          const pics = (t.pic||[]).join(', ');
          row.outerHTML = `
            <div class="tg-row tg-row-edit" data-track-idx="${i}">
              <div class="tg-cell">
                <strong>${PHASE_LABEL[t.phase]||t.phase}</strong>
              </div>
              <div class="tg-cell">
                <select class="input tg-edit-state">${TRACK_STATE.map(s=>`<option ${s===t.state?'selected':''}>${s}</option>`).join('')}</select>
              </div>
              <div class="tg-cell"><input class="input tg-edit-pic" placeholder="PIC(s)" value="${pics}"></div>
              <div class="tg-cell"><input class="input tg-edit-sdate" type="date" value="${t.startDate||''}"></div>
              <div class="tg-cell"><input class="input tg-edit-edate" type="date" value="${t.endDate||''}"></div>
              <div class="tg-cell" style="display:flex;gap:6px;align-items:center">
                <input class="input tg-edit-hours" type="number" step="0.25" placeholder="Hours" value="${t.hours ?? ''}" style="max-width:110px">
                <input class="input tg-edit-prog" type="number" min="0" max="100" placeholder="%" value="${t.progress ?? ''}" style="max-width:90px">
                <button class="btn sm" data-track-save="${i}" data-id="${itemId}">Save</button>
                <button class="btn sm ghost" data-track-cancel="${i}" data-id="${itemId}">Cancel</button>
              </div>
            </div>
          `;
          return;
        }

        // cancel edit -> rerender
        if (btn.hasAttribute('data-track-cancel')) {
          rerender();
          return;
        }

        // save edit
        if (btn.hasAttribute('data-track-save')) {
          const i = Number(btn.getAttribute('data-track-save'));
          const editRow = detailsRow.querySelector(`.tg-row-edit[data-track-idx="${i}"]`);
          if (!editRow) return;
          const state = editRow.querySelector('.tg-edit-state').value;
          const pic   = editRow.querySelector('.tg-edit-pic').value.split(',').map(s=>s.trim()).filter(Boolean);
          const sdate = editRow.querySelector('.tg-edit-sdate').value || null;
          const edate = editRow.querySelector('.tg-edit-edate').value || null;
          const hours = Number(editRow.querySelector('.tg-edit-hours').value || 0);
          const p     = editRow.querySelector('.tg-edit-prog').value;
          const prog  = p==='' ? null : Number(p);

          const newTracks = (it.tracks||[]).map((t,idx)=> idx===i ? { ...t, state, pic, startDate:sdate, endDate:edate, hours, progress:prog } : t);
          try{
            const body = { ...it, tracks:newTracks };
            delete body.id;
            await window.API.updateBacklog(itemId, body);
            items[itIndex] = { ...it, tracks:newTracks };
            rerender();
            UI.toast('Updated phase');
          }catch(err){ UI.toast('Update phase failed', false); }
          return;
        }
      }
    });

    /* ---- init ---- */
    resetForm();
    const adv = $('#ws-adv', app); if (adv) adv.open = true;
  };

  return html;
}
