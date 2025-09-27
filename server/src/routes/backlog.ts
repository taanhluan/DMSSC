const express = require('express');

module.exports = function(db){
  const r = express.Router();

  // Tạo ID đơn giản (không cần uuid)
  const newId = (prefix) => `${prefix}-${String(Math.random()).slice(2,8).toUpperCase()}`;

  // LIST
  r.get('/', (req, res) => {
    res.json(db.backlog);
  });

  // CREATE
  r.post('/', (req, res) => {
    const b = req.body || {};
    const item = {
      id: newId('BL'),
      // core fields FE đang dùng
      site: b.site || '',
      sr: b.sr || '',
      description: b.description || '',
      owner: b.owner || '',
      priority: b.priority || 'MEDIUM',
      dueDate: b.dueDate || null,
      onOff: b.onOff || 'ON',
      progress: Number(b.progress || 0),
      complex: b.complex || '',
      // tracks (mảng các phase)
      tracks: Array.isArray(b.tracks) ? b.tracks : []
    };
    db.backlog.push(item);
    res.json(item);
  });

  // UPDATE
  r.put('/:id', (req, res) => {
    const item = db.backlog.find(x => x.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'not found' });
    const b = req.body || {};
    Object.assign(item, {
      site: b.site ?? item.site,
      sr: b.sr ?? item.sr,
      description: b.description ?? item.description,
      owner: b.owner ?? item.owner,
      priority: b.priority ?? item.priority,
      dueDate: b.dueDate ?? item.dueDate,
      onOff: b.onOff ?? item.onOff,
      progress: (b.progress !== undefined) ? Number(b.progress) : item.progress,
      complex: b.complex ?? item.complex,
      tracks: Array.isArray(b.tracks) ? b.tracks : (item.tracks || [])
    });
    res.json(item);
  });

  // DELETE
  r.delete('/:id', (req, res) => {
    const idx = db.backlog.findIndex(x => x.id === req.params.id);
    if (idx < 0) return res.status(404).json({ error: 'not found' });
    const del = db.backlog.splice(idx, 1)[0];
    // Optionally: xóa tasks liên quan SR nếu muốn
    res.json(del);
  });

  return r;
};
