const express = require('express');
function genId(prefix='TK') {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
}
module.exports = (db) => {
  const router = express.Router();
  router.get('/', (req, res) => res.json(db.tasks));
  router.post('/', (req, res) => {
    const t = { id: genId('TK'), title:'', description:'', status:'TODO', hours:0, sr:'', pic:'', ...req.body };
    db.tasks.push(t);
    res.status(201).json(t);
  });
  router.put('/:id', (req, res) => {
    const idx = db.tasks.findIndex(t => t.id === req.params.id);
    if (idx < 0) return res.status(404).json({ error: 'Not found' });
    db.tasks[idx] = { ...db.tasks[idx], ...req.body };
    res.json(db.tasks[idx]);
  });
  router.delete('/:id', (req, res) => {
    const idx = db.tasks.findIndex(t => t.id === req.params.id);
    if (idx < 0) return res.status(404).json({ error: 'Not found' });
    const [removed] = db.tasks.splice(idx, 1);
    res.json(removed);
  });
  return router;
};
