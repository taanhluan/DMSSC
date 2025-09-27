const express = require('express');

module.exports = function(db){
  const r = express.Router();

  r.get('/', (req, res) => {
    const totalTasks = db.tasks.length;
    const done = db.tasks.filter(t => t.status === 'DONE').length;
    const open = totalTasks - done;
    const hours = db.tasks.reduce((a, b) => a + (Number(b.hours) || 0), 0);
    res.json({
      backlog: db.backlog.length,
      tasks: totalTasks,
      done,
      open,
      hours
    });
  });

  return r;
};
