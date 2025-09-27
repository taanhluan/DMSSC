const express = require('express');

module.exports = function(db){
  const r = express.Router();

  // Ví dụ: tổng giờ theo PIC
  r.get('/hours-by-pic', (req, res) => {
    const agg = {};
    db.tasks.forEach(t => {
      const key = t.pic || 'N/A';
      agg[key] = (agg[key] || 0) + (Number(t.hours) || 0);
    });
    res.json(agg);
  });

  // Ví dụ: tổng giờ theo SR
  r.get('/hours-by-sr', (req, res) => {
    const agg = {};
    db.tasks.forEach(t => {
      const key = t.sr || 'N/A';
      agg[key] = (agg[key] || 0) + (Number(t.hours) || 0);
    });
    res.json(agg);
  });

  // Mặc định
  r.get('/', (req, res) => {
    res.json({ ok: true });
  });

  return r;
};
