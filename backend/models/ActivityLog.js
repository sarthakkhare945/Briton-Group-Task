// models/ActivityLog.js
const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  activityType: {
    type: String,
    enum: ['email', 'call', 'meeting'],
    required: true,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  taskDescription: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['done', 'declined'],
    default: 'done', // Default status is done unless marked as declined
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },

});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
