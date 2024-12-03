const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  reminderTime: {
    type: String,
    required: true,
  },
  meetingTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'done','decline'],
    default: 'pending',  // Default status is "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
