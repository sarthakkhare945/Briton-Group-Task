const ActivityLog = require('../models/ActivityLog');
const Task = require('../models/Task');  // We need the Task model to handle task completion

const getActivityLog = async (req, res) => {
    try {
        // Fetch all activity logs where the task status is either "done" or "declined"
        const activityLogs = await ActivityLog.find({
            'status': { $in: ['done', 'declined'] }, // Match only tasks that are "done" or "declined"
        }).populate('taskId');  // Optionally populate task details (if needed)

        if (!activityLogs.length) {
            return res.status(404).json({ message: 'No activity logs found for done or declined tasks' });
        }

        // Send the response with the activity logs
        res.status(200).json({ message: 'Activity logs fetched successfully', activityLogs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching activity logs', error });
    }
};



// const getActivityLog = async (req, res) => {
//   try {
//       // Fetch all activity logs where the statusChangedTo is either "done" or "declined"
//       const activityLogs = await ActivityLog.find({
//         activityType.status: { $in: ['done', 'declined'] },  // Match either "done" or "declined"
//       });

//       console.log('Activity log--->', activityLogs);

//       if (!activityLogs.length) {
//           return res.status(404).json({ message: 'No activity logs found for done or declined tasks' });
//       }

//       // Send the response with the activity logs
//       res.status(200).json({ message: 'Activity logs fetched successfully', activityLogs });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error fetching activity logs', error });
//   }
// };

// Function to create a new activity log
// const createActivityLog = async (req, res) => {
//     try {
//       const { activityType, taskId, status, email, username, meetingTime } = req.body;
  
//       // Ensure the task exists
//       // const task = await Task.findById(taskId);
//       // if (!task) {
//       //   return res.status(404).json({ message: 'Task not found' });
//       // }
  
//       // // Validate the activity type and the required fields
//       // if (activityType === 'email' && !email) {
//       //   return res.status(400).json({ message: 'Email is required for email activity type' });
//       // }
  
//       // if (activityType === 'call' && !username) {
//       //   return res.status(400).json({ message: 'Username is required for call activity type' });
//       // }
  
//       // if (activityType === 'meeting' && !meetingTime) {
//       //   return res.status(400).json({ message: 'Meeting time is required for meeting activity type' });
//       // }
  
//       // Create the new activity log
//       const newActivityLog = new ActivityLog({
//         activityType,
//         taskId,
//         taskDescription: task.description,
//         status: status || 'done',  // Default to 'done' if no status is provided
//         email,
//         username,
//         meetingTime,
//       });
  
//       // Save the activity log
//       await newActivityLog.save();
  
//       res.status(201).json({
//         message: 'Activity log created successfully',
//         activityLog: newActivityLog,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error creating activity log', error });
//     }
//   };
  

// Function to add an activity log entry when a task is marked as done
const logTaskCompletion = async (taskId) => {
  try {
    // Find the task by its ID
    const task = await Task.findById(taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    // Create an activity log for task completion
    const activityDetails = `Task "${task.description}" has been marked as done.`;
    const newActivityLog = new ActivityLog({
      activityType: 'task-completion',
      activityDetails,
      taskId: task._id,
    });

    // Save the activity log
    await newActivityLog.save();
  } catch (error) {
    console.error('Error logging task completion:', error);
  }
};

module.exports = {  logTaskCompletion,getActivityLog };
