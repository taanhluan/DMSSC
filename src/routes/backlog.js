const express = require('express');
function genId(prefix='BL') {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
}
module.exports = (db) => {
  const router = express.Router();
  router.get('/', (req, res) => res.json(db.backlog));
  router.post('/', (req, res) => {
    const item = { id: genId('BL'), sr:'', description:'', status:'NEW', owner:'', priority:'MEDIUM',
      dueDate:null, onOff:'ON', progress:0, complex:'', ...req.body };
    db.backlog.push(item);
    res.status(201).json(item);
  });
  router.put('/:id', (req, res) => {
    const idx = db.backlog.findIndex(b => b.id === req.params.id);
    if (idx < 0) return res.status(404).json({ error: 'Not found' });
    db.backlog[idx] = { ...db.backlog[idx], ...req.body };
    res.json(db.backlog[idx]);
  });
  router.delete('/:id', (req, res) => {
    const idx = db.backlog.findIndex(b => b.id === req.params.id);
    if (idx < 0) return res.status(404).json({ error: 'Not found' });
    const [removed] = db.backlog.splice(idx, 1);
    res.json(removed);
  });
  return router;
};
