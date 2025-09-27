const express = require('express');
module.exports = (db) => {
  const router = express.Router();
  router.get('/summary', (req, res) => {
    const hoursByPIC = db.tasks.reduce((acc, t) => {
      const k = t.pic || 'Unassigned';
      acc[k] = (acc[k] || 0) + (t.hours || 0);
      return acc;
    }, {});
    res.json({ hoursByPIC });
  });
  return router;
};
