const express = require('express');
const dashboardRoutes = require('./dashboard');
const backlogRoutes = require('./backlog');
const taskRoutes = require('./tasks');
const reportRoutes = require('./reports');

const router = express.Router();

router.use('/dashboard', dashboardRoutes);
router.use('/backlog', backlogRoutes);
router.use('/tasks', taskRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
