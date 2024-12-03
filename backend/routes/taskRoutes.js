const express = require('express');
const { createTask, getAllTasks, markStatus } = require('../controllers/taskController');
const {getActivityLog } = require('../controllers/activityLogController');
const router = express.Router();

// Route to create a new task
router.post('/tasks', createTask);

// Route to get all tasks
router.get('/tasks', getAllTasks);


// Route to mark a task as done
router.put('/tasks/:id/status', markStatus);

// Route to create a new activity log (for email, call, meeting)
router.get('/activity-logs', getActivityLog);
// router.post('/activity-log', createActivityLog);

module.exports = router;
