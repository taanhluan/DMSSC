// client/js/views/tasks.js
import { UI } from '../router.js';

const $ = (s, root=document) => root.querySelector(s);

// ================= Constants =================
const TASK_STATUS = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE'];
const PRIORITY_LIST = ['LOW','MEDIUM','HIGH'];

// PIC List (có thể chọn hoặc nhập tay)
const PIC_LIST = [
  'Ta Anh Luan [Sr.BA DMSSC]',
  'Le Thi Hoang Nga [BA DMSSC]',
  'Due, Pham Quang [Sr.Dev DMSSC]',
  'Anh, Nguyen Tuan [Sr.Dev DMSSC]',
  'Phuc, Dinh Pham Hoang [Dev DMSSC]',
  'Tung, Huynh Ngoc Thanh [Dev DMSSC]',
];

// Title chuẩn (không cho custom)
const TITLE_OPTIONS = [
  'Pre-analysis Working Hour (BA)',
  'Pre-analysis Working Hour (DEV)',
  'BS Working Hour',
  'BS Review Working Hour (DEV)',
  'TS Working Hour',
  'TS Review Working Hour (BA)',
  'Dev Working Hour',
  'ST Working Hour',
  'ST Support Working Hour (DEV)',
  'UAT Support Working Hour (BA)',
  'UAT Support Working Hour (DEV)',
  'Post-Check Working Hour (BA)',
  'Post-Check Working Hour (DEV)',
  'Table-Update/Setup',
  'GOLIVE',
  'COMPLETED',
  'ON-HOLD',
  'Other',
  'Out-of-office',
];

const optList = (list, selected='') =>
  list.map(x => `<option ${x===selected?'selected':''}>${x}</option>`).join('');

// Small helpers
const fmtDate = (s) => s ? s : '';
const sum = (arr=[]) => arr.reduce((a,b)=>a+(Number(b)||0), 0);

// ================= Row render =================
function row(t){
  return `
  <tr>
    <td>${t.id}</td>
    <td>${t.sr || ''}</td>
    <td>${t.title || ''}</td>
    <td>${t.pic || ''}</td>
    <td><span class="badge state-${t.status}">${t.status}</span></td>
    <td>${t.priority || ''}</td>
    <td>${fmtDate(t.startDate)}</td>
    <td>${fmtDate(t.endDate)}</td>
    <td>${t.hours ?? 0}</td>
    <td class="actions">
      <button type="button" class="btn ghost" data-action="edit" data-id="${t.id}">Edit</button>
      <button type="button" class="btn danger" data-action="del" data-id="${t.id}">Del</button>
    </td>
  </tr>`;
}

export default async function Tasks(){
  // fetch tasks + backlog (để map SR -> description & site)
  const [tasks, backlog] = await Promise.all([
    window.API.listTasks(),
    window.API.listBacklog().catch(()=>[])
  ]);

  // Maps nhanh SR -> description/site
  const SR_DESC = new Map(backlog.map(b => [String(b.sr || ''), b.description || '']));
  const SR_SITE = new Map(backlog.map(b => [String(b.sr || ''), b.site || '' ]));

  let items = [...tasks];

  const html = `
  <div class="card">
    <h3>Task Filters</h3>
    <div class="row">
      <input class="input" id="f-text" placeholder="Search title/note/PIC..." />
      <select class="input" id="f-status">
        <option value="">All Status</option>
        ${optList(TASK_STATUS)}
      </select>
      <select class="input" id="f-pic">
        <option value="">All PIC</option>
        ${[...new Set([...items.map(x=>x.pic).filter(Boolean), ...PIC_LIST])].sort().map(p=>`<option>${p}</option>`).join('')}
      </select>
      <select class="input" id="f-sr">
        <option value="">All SR</option>
        ${backlog.map(b=>`<option value="${b.sr}">${b.sr} — ${b.description||''}</option>`).join('')}
      </select>
      <select class="input" id="f-title">
        <option value="">All Task Types</option>
        ${TITLE_OPTIONS.map(t=>`<option>${t}</option>`).join('')}
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
        ${backlog.map(b=>`<option value="${b.sr}">${b.sr} — ${b.description||''}</option>`).join('')}
      </select>
      <input class="input" id="t-sr-desc" placeholder="SR Description (read-only)" readonly />
      <input class="input" id="t-sr-site" placeholder="Site (read-only)" readonly />
      <select class="input" id="t-title-select">
        ${TITLE_OPTIONS.map(t => `<option value="${t}">${t}</option>`).join('')}
      </select>
    </div>

    <div class="row">
      <!-- PIC configurable (select hoặc nhập tay) -->
      <select class="input" id="t-pic-select">
        <option value="">PIC (select…)</option>
        ${PIC_LIST.map(p => `<option value="${p}">${p}</option>`).join('')}
        <option value="__CUSTOM__">Custom…</option>
      </select>
      <input class="input" id="t-pic" placeholder="PIC (free text)" />

      <select class="input" id="t-status">${optList(TASK_STATUS,'TODO')}</select>
      <select class="input" id="t-pri">${optList(PRIORITY_LIST,'MEDIUM')}</select>
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
    <h3>Task List — Standard <span class="badge" id="count">${items.length}</span></h3>
    <div class="row">
      <div class="kpi card" style="padding:10px;">
        <div class="muted">Total hours</div>
        <div class="num" id="kpi-hours">${sum(items.map(x=>x.hours||0))}</div>
      </div>
      <div class="kpi card" style="padding:10px;">
        <div class="muted">Open tasks</div>
        <div class="num" id="kpi-open">${items.filter(x=>x.status!=='DONE').length}</div>
      </div>
      <div class="kpi card" style="padding:10px;">
        <div class="muted">Done</div>
        <div class="num" id="kpi-done">${items.filter(x=>x.status==='DONE').length}</div>
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
        <tbody id="tbl">${items.map(row).join('')}</tbody>
      </table>
    </div>
  </div>`;

  window.__afterRender = () => {
    const app = document.getElementById('app');
    let editingId = null;

    // PIC select ↔ input
    const syncPicInput = () => {
      const sel = $('#t-pic-select',app).value;
      const input = $('#t-pic',app);
      input.style.display = sel === '__CUSTOM__' ? '' : 'none';
      if (sel && sel !== '__CUSTOM__') input.value = sel;
      if (sel === '__CUSTOM__' && !input.value) input.focus();
    };
    $('#t-pic-select',app).addEventListener('change', syncPicInput);
    syncPicInput();

    // SR -> fill SR Description & Site (read-only, ngay lập tức)
    const updateSrMeta = () => {
      const sr = $('#t-sr',app).value || '';
      $('#t-sr-desc',app).value = SR_DESC.get(sr) || '';
      $('#t-sr-site',app).value = SR_SITE.get(sr) || '';
    };
    $('#t-sr',app).addEventListener('change', updateSrMeta);
    updateSrMeta(); // init

    const readForm = () => {
      const title = $('#t-title-select',app).value; // locked list
      const pSel = $('#t-pic-select',app).value;
      const pic  = (pSel && pSel !== '__CUSTOM__') ? pSel : $('#t-pic',app).value.trim();

      return {
        sr: $('#t-sr',app).value || '',
        title,
        description: $('#t-note',app).value.trim(), // Task Note -> description cho BE
        pic,
        status: $('#t-status',app).value,
        priority: $('#t-pri',app).value,
        startDate: $('#t-start',app).value || null,
        endDate: $('#t-end',app).value || null,
        hours: Number($('#t-hours',app).value || 0)
        // Nếu muốn lưu cả site theo SR trên Task (để lọc sau), có thể thêm:
        // site: SR_SITE.get($('#t-sr',app).value || '') || ''
      };
    };

    const resetForm = () => {
      ['#t-note','#t-pic','#t-start','#t-end','#t-hours'].forEach(s=>{ const el=$(s,app); if(el) el.value=''; });
      $('#t-status',app).value='TODO';
      $('#t-pri',app).value='MEDIUM';
      $('#t-sr',app).value='';
      $('#t-title-select',app).value=TITLE_OPTIONS[0]; // default
      $('#t-pic-select',app).value='';
      $('#t-sr-desc',app).value='';
      $('#t-sr-site',app).value='';
      editingId = null;
      $('#edit-indicator',app).textContent='';
      syncPicInput();
    };

    // Filters
    const applyFilters = () => {
      const q = ($('#f-text',app).value || '').toLowerCase();
      const st = $('#f-status',app).value;
      const pic = $('#f-pic',app).value;
      const sr = $('#f-sr',app).value;
      const tt = $('#f-title',app).value;

      const filtered = tasks.filter(t =>
        (!q || (t.title||'').toLowerCase().includes(q) || (t.description||'').toLowerCase().includes(q) || (t.pic||'').toLowerCase().includes(q)) &&
        (!st || t.status === st) &&
        (!pic || t.pic === pic) &&
        (!sr || t.sr === sr) &&
        (!tt || t.title === tt)
      );

      items = filtered;
      $('#tbl',app).innerHTML = filtered.map(row).join('');
      $('#count',app).textContent = filtered.length;
      $('#kpi-hours',app).textContent = sum(filtered.map(x=>x.hours||0));
      $('#kpi-open',app).textContent = filtered.filter(x=>x.status!=='DONE').length;
      $('#kpi-done',app).textContent = filtered.filter(x=>x.status==='DONE').length;
    };
    $('#f-apply',app).addEventListener('click', applyFilters);
    $('#f-clear',app).addEventListener('click', ()=>{
      ['#f-text','#f-status','#f-pic','#f-sr','#f-title'].forEach(s=>{ const el=$(s,app); if(el) el.value=''; });
      applyFilters();
    });

    // Save
    $('#t-save',app).addEventListener('click', async ()=>{
      const body = readForm();
      if (!body.title) { UI.toast('Title is required', false); return; }
      if (!TITLE_OPTIONS.includes(body.title)) { UI.toast('Title must be from standard list', false); return; }
      if (!body.pic) { UI.toast('PIC is required', false); return; }

      try{
        if (editingId) {
          await window.API.updateTask(editingId, body);
          UI.toast('Task updated');
        } else {
          await window.API.createTask(body);
          UI.toast('Task created');
        }
        location.hash = '#/tasks';
      }catch(e){ UI.toast('Save failed', false); }
    });

    // Reset
    $('#t-reset',app).addEventListener('click', resetForm);

    // Actions in table
    $('#tbl',app).addEventListener('click', async (e)=>{
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const id = btn.dataset.id;
      const act = btn.dataset.action;

      if (act === 'del') {
        try{
          await window.API.deleteTask(id);
          UI.toast('Deleted');
          location.hash = '#/tasks';
        }catch(e){ UI.toast('Delete failed', false); }
        return;
      }

      if (act === 'edit') {
        const t = items.find(x=>x.id===id);
        if (!t) return;

        // SR & SR meta (Desc + Site read-only)
        $('#t-sr',app).value = t.sr || '';
        $('#t-sr-desc',app).value = SR_DESC.get(String(t.sr||'')) || '';
        $('#t-sr-site',app).value = SR_SITE.get(String(t.sr||'')) || '';

        // Title
        $('#t-title-select',app).value = TITLE_OPTIONS.includes(t.title) ? t.title : 'Other';

        // PIC
        if (PIC_LIST.includes(t.pic)) {
          $('#t-pic-select',app).value = t.pic;
          $('#t-pic',app).value = '';
        } else {
          $('#t-pic-select',app).value = '__CUSTOM__';
          $('#t-pic',app).value = t.pic || '';
        }
        syncPicInput();

        // Task Note
        $('#t-note',app).value = t.description || '';
        $('#t-status',app).value = t.status || 'TODO';
        $('#t-pri',app).value = t.priority || 'MEDIUM';
        $('#t-start',app).value = t.startDate || '';
        $('#t-end',app).value = t.endDate || '';
        $('#t-hours',app).value = t.hours ?? '';

        editingId = t.id;
        $('#edit-indicator',app).textContent = `Editing: ${t.id}`;
        UI.toast(`Loaded ${t.id} to form`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  return html;
}
