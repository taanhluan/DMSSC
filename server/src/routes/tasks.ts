const express = require('express');

module.exports = function(db){
  const r = express.Router();
  const newId = (prefix) => `${prefix}-${String(Math.random()).slice(2,8).toUpperCase()}`;

  // LIST
  r.get('/', (req, res) => {
    res.json(db.tasks);
  });

  // CREATE
  r.post('/', (req, res) => {
    const b = req.body || {};
    const item = {
      id: newId('TK'),
      sr: b.sr || '',
      title: b.title || '',
      description: b.description || '', // FE: Task Note map vào description
      pic: b.pic || '',
      status: b.status || 'TODO',
      priority: b.priority || 'MEDIUM',
      startDate: b.startDate || null,
      endDate: b.endDate || null,
      hours: Number(b.hours || 0),
      // gợi ý: nếu muốn lưu site theo SR, có thể map ở FE rồi gửi thêm b.site
      site: b.site || ''
    };
    db.tasks.push(item);
    res.json(item);
  });

  // UPDATE
  r.put('/:id', (req, res) => {
    const item = db.tasks.find(x => x.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'not found' });
    const b = req.body || {};
    Object.assign(item, {
      sr: b.sr ?? item.sr,
      title: b.title ?? item.title,
      description: b.description ?? item.description,
      pic: b.pic ?? item.pic,
      status: b.status ?? item.status,
      priority: b.priority ?? item.priority,
      startDate: b.startDate ?? item.startDate,
      endDate: b.endDate ?? item.endDate,
      hours: (b.hours !== undefined) ? Number(b.hours) : item.hours,
      site: b.site ?? item.site
    });
    res.json(item);
  });

  // DELETE
  r.delete('/:id', (req, res) => {
    const idx = db.tasks.findIndex(x => x.id === req.params.id);
    if (idx < 0) return res.status(404).json({ error: 'not found' });
    const del = db.tasks.splice(idx, 1)[0];
    res.json(del);
  });

  return r;
};
