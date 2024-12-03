const Task = require("../models/Task");
const { logTaskCompletion } = require("./activityLogController");
const ActivityLog = require("../models/ActivityLog");
// Function to convert dd-mm-yy format to Date
const moment = require("moment"); // Import moment.js for date formatting
// Create a new task
const createTask = async (req, res) => {
  try {
    let { description, reminderTime, meetingTime, status } = req.body;

    // Ensure that reminderTime and meetingTime are accepted as strings, not Date objects.
    // Validate that reminderTime and meetingTime are in valid time format (HH:mm)
    if (
      reminderTime &&
      !/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(reminderTime)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid reminderTime format. Use HH:mm" });
    }

    if (
      meetingTime &&
      !/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(meetingTime)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid meetingTime format. Use HH:mm" });
    }

    // Ensure the status is set to "pending" by default if it's not provided
    const newTask = new Task({
      description,
      reminderTime, // Store time as string
      meetingTime, // Store time as string
      status: status || "pending", // Default to "pending" if no status is provided
    });

    // Save the new task to the database
    await newTask.save();

    // Send the response with the new task
    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating task", error });
  }
};

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    // Fetch all tasks from the database
    const tasks = await Task.find();

    // Send the response with all tasks
    res.status(200).json({ message: "All tasks fetched successfully", tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// Function to mark a task as done and create an activity log
// Mark a task as "done" or "declined"
const markStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if the provided status is valid (either "done" or "declined")
    if (!["done", "declined"].includes(status)) {
      return res
        .status(400)
        .json({ message: 'Invalid status. Use "done" or "declined".' });
    }

    // Update the task status in the database
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Initialize the activity log data
    let activityLogData = {
      activityType: status === "done" ? "meeting" : "call", // Set activity type based on status
      taskId: updatedTask._id,
      taskDescription: updatedTask.description,
    };

    // Add meetingTime to activity log if the task status is "done" and meetingTime exists
    if (
      (status === "done" || status === "declined") &&
      updatedTask.meetingTime
    ) {
      activityLogData.meetingTime = updatedTask.meetingTime; // Include meetingTime if available
    }

    // Create the activity log entry
    const activityLog = new ActivityLog(activityLogData);

    await activityLog.save(); // Save the activity log to the database

    // Send a success response
    res.status(200).json({
      message: "Task status updated and activity logged successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating task status", error });
  }
};

module.exports = { createTask, getAllTasks, markStatus };
