const express = require('express');

module.exports = (db) => {
  const router = express.Router();
  router.get('/', (req, res) => {
    const totalBacklog = db.backlog.length;
    const totalTasks = db.tasks.length;
    const doneTasks = db.tasks.filter(t => t.status === 'DONE').length;
    res.json({
      metrics: {
        totalBacklog,
        totalTasks,
        doneTasks,
        progressRate: totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0
      }
    });
  });
  return router;
};
