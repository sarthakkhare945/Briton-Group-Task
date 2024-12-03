import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [metrics, setMetrics] = useState([
    { title: 'Open Leads', value: 24, icon: '📋', visible: true },
    { title: 'Sales Pipeline', value: '$12,000', icon: '💼', visible: true },
    { title: 'Tasks', value: 8, icon: '✅', visible: true },
    { title: 'Recent Activities', value: 15, icon: '🔔', visible: true },
  ]);
  const [layout, setLayout] = useState('grid'); // Options: grid or list
  const [themeColor, setThemeColor] = useState('blue'); // Theme colors
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getThemeClasses = () => {
    switch (themeColor) {
      case 'green':
        return 'border-green-500 text-green-500';
      case 'red':
        return 'border-red-500 text-red-500';
      case 'purple':
        return 'border-purple-500 text-purple-500';
      default:
        return 'border-blue-500 text-blue-500';
    }
  };

 // Function to make the API call and fetch recent activities and tasks
 const fetchMetricsData = async () => {
  try {
    const server = import.meta.env.VITE_API_URL;

    // Fetch all activities
    const allactivity = await axios.get(`${server}/api/task/activity-logs`);
    const totalActivities = allactivity.data.activityLogs.length; // Get the length of activity logs

    // Fetch all tasks
    const alltasks = await axios.get(`${server}/api/task/tasks`);

    // Fetch all leads
    const getContactLead = await axios.get(`${server}/api/contacts`);
    console.log('get contact lead-->',getContactLead.data)

    const Leads = getContactLead.data.filter(lead=>lead.status === 'Lead')
    const totalLeads = Leads.length;
    // Filter tasks with a "pending" status
    const pendingTasks = alltasks.data.tasks.filter(task => task.status === 'pending');
    const totalPendingTasks = pendingTasks.length; // Count the tasks with "pending" status

    // Update the metrics state with the fetched data
    setMetrics((prevMetrics) =>
      prevMetrics.map((metric) =>
        metric.title === 'Recent Activities'
          ? { ...metric, value: totalActivities }
          : metric.title === 'Tasks'
          ? { ...metric, value: totalPendingTasks }
          : metric.title === 'Open Leads'
          ? { ...metric, value: totalLeads }
          : metric
      )
    );
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

useEffect(() => {
  fetchMetricsData(); // Fetch the data when the component mounts
}, []); // Empty dependency array ensures it runs once when the component mounts
  // Toggle widget visibility
  const toggleWidgetVisibility = (index) => {
    setMetrics((prev) =>
      prev.map((metric, i) =>
        i === index ? { ...metric, visible: !metric.visible } : metric
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 lg:mb-0">
          CRM Dashboard
        </h1>
        <div className="flex gap-6 items-center">
          {/* Layout Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">Layout:</span>
            <button
              onClick={() => setLayout('grid')}
              className={`px-4 py-2 rounded-lg font-medium ${
                layout === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`px-4 py-2 rounded-lg font-medium ${
                layout === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              List
            </button>
          </div>

          {/* Theme Color Selector */}
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">Theme:</span>
            {['blue', 'green', 'red', 'purple'].map((color) => (
              <button
                key={color}
                onClick={() => setThemeColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  themeColor === color
                    ? `${getThemeClasses()}`
                    : 'border-gray-300 hover:border-gray-500'
                }`}
                style={{ backgroundColor: color }}
              ></button>
            ))}
          </div>

          {/* Customize Widgets */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
          >
            Customize Widgets
          </button>
        </div>
      </div>

      {/* Metrics Section */}
      <div
        className={`${
          layout === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
            : 'space-y-6'
        }`}
      >
        {metrics
          .filter((metric) => metric.visible)
          .map((metric, index) => (
            <div
              key={index}
              className={`relative p-6 bg-white shadow-md rounded-lg border-t-4 ${getThemeClasses()}`}
            >
              {/* Icon */}
              <div className="absolute -top-6 left-6 w-12 h-12 bg-gray-100 flex items-center justify-center rounded-full shadow-md">
                <span className="text-2xl">{metric.icon}</span>
              </div>

              {/* Metric Content */}
              <h2 className="text-lg font-semibold text-gray-700 mt-6">{metric.title}</h2>
              <p className={`text-3xl font-bold mt-2 ${getThemeClasses()}`}>{metric.value}</p>
            </div>
          ))}
      </div>

      {/* Modal for Widget Customization */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Customize Widgets</h2>
            <div className="space-y-4">
              {metrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{metric.title}</span>
                  <input
                    type="checkbox"
                    checked={metric.visible}
                    onChange={() => toggleWidgetVisibility(index)}
                    className="h-5 w-5 text-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
