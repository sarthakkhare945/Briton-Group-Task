import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";

const TaskTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [reminder, setReminder] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [error, setError] = useState("");

  const server = import.meta.env.VITE_API_URL;

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${server}/api/task/tasks`);
        console.log('respone data tasks0--',response?.data?.tasks)
        setTasks(response.data.tasks); // Assuming your API returns the tasks array
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // Fetch activity logs
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`${server}/api/task/activity-logs`);
        setActivityLogs(response.data.activityLogs); // Assuming your API returns the activity logs
      } catch (error) {
        console.error("Error fetching activity logs:", error);
      }
    };
    fetchActivity();
  }, []);

  const handleReminderTimeChange = (e) => {
    setReminder(e.target.value);
  };

  const handleMeetingTimeChange = (e) => {
    setMeetingTime(e.target.value);
  };

  const handleAddTask = async () => {
    if (!newTaskText.trim()) {
      setError("Task text is required");
      return;
    }

    try {
      const taskData = {
        description: newTaskText,
        reminderTime: reminder,
        meetingTime: meetingTime,
      };

      const response = await axios.post(`${server}/api/task/tasks`, taskData);

      if (response.data) {
        setTasks((prevTasks) => [
          ...prevTasks,
          response.data.task, // Add the newly created task
        ]);
      }

      setNewTaskText("");
      setReminder("");
      setMeetingTime("");
      setOpenDialog(false);
      setError("");
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task. Please try again later.");
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);



 const handleStatusChange = async (taskId, newStatus) => {
  // Ensure that the taskId is passed correctly as an argument
  const taskToUpdate = taskId;

  try {
    // Update the task status in the backend using the taskId
    const response = await axios.put(
      `${server}/api/task/tasks/${taskToUpdate}/status`,
      { status: newStatus }
    );

    if (response.data) {
      // Update the task status in the local state and remove it from the pending list
      setTasks((prevTasks) => {
        // Remove the task from the list if its status is updated to done or declined
        return prevTasks.filter((task) => task._id !== taskId);
      });
      console.log('response ac change--->',response?.data)
      try {
        const response = await axios.get(`${server}/api/task/activity-logs`);
        setActivityLogs(response.data.activityLogs); // Assuming your API returns the activity logs
      } catch (error) {
        console.error("Error fetching activity logs:", error);
      }
    
      // Add activity log for the status change
      // addActivityLog(taskToUpdate, newStatus);
    }
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};


  return (
    <div className="container mx-auto px-6 py-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">To-Do List</h2>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.filter((task) => task.status === "pending").length === 0 ? (
          <div className="flex justify-center items-center bg-gray-100 p-6 rounded-lg shadow-sm">
            <p className="text-xl text-gray-500">
              No pending tasks available. Add a new task to get started!
            </p>
          </div>
        ) : (
          tasks
            .filter((task) => task.status === "pending")
            .map((task, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-lg text-gray-700">
                    {task.description}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    Reminder:{" "}
                    {task.reminderTime
                      ? moment(task.reminderTime, "HH:mm").format("hh:mm A")
                      : "None"}{" "}
                    | Meeting Time:{" "}
                    {task.meetingTime
                      ? moment(task.meetingTime, "HH:mm").format("hh:mm A")
                      : "None"}{" "}
                    | Status: {task.status}
                  </p>
                </div>
                <div className="flex space-x-2">
                  
                  <button
                    onClick={() => handleStatusChange(task._id, "done")}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                  >
                    Mark as Done
                  </button>
                  <button
                    onClick={() => handleStatusChange(task._id, "declined")}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    Mark as Declined
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      <button
        onClick={handleOpenDialog}
        className="mt-6 w-full sm:w-auto bg-blue-500 text-white rounded-lg px-6 py-3 hover:bg-blue-600 transition duration-200"
      >
        Add Task
      </button>

      {openDialog && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Add New Task
            </h3>
            <span className="text-gray-600 mt-4">Task Description</span>
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            />
            
            <span className="text-gray-600 mt-4">Reminder Time</span>
            <input
              type="time"
              className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3 mt-2"
              min="09:00"
              max="18:00"
              value={reminder}
              onChange={handleReminderTimeChange}
              required
            />

            <span className="text-gray-600 mt-4">Meeting Time</span>
            <input
              type="time"
              className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3 mt-2"
              min="09:00"
              max="18:00"
              value={meetingTime}
              onChange={handleMeetingTimeChange}
              required
            />

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Section */}
      <h2 className="text-3xl font-semibold text-gray-800 mt-8 mb-4">
        Activity Logs
      </h2>

      {/* Activity Logs List */}
      {activityLogs?.length === 0 ? (
        <div className="flex justify-center items-center bg-gray-100 p-6 rounded-lg shadow-sm">
          <p className="text-xl text-gray-500">
            No activities recorded. Add an activity to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activityLogs?.map((log, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              {console.log('log--->',log)}
              <div className="flex-1">
                <h3 className="font-medium text-lg text-gray-700 capitalize">
                  {log?.activityType}: {log?.taskId?.description}
                </h3>
                <p className="text-sm text-gray-600 capitalize">
                  Status changed to: {log?.taskId?.status} | {moment(log.timestamp).fromNow()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskTracker;
