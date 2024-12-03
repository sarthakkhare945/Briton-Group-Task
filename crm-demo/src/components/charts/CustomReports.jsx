import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Make sure the CSS is imported

// Registering necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CustomReports = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Sample data for the bar chart
  const chartData = {
    labels: ['Team A', 'Team B', 'Team C', 'Team D'],
    datasets: [
      {
        label: 'Team Productivity',
        data: [35, 50, 80, 45],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Custom Reports</h2>

      {/* Date Range Picker */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Select Date Range</label>
        <div className="flex space-x-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="p-2 border border-gray-300 rounded shadow-sm"
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="p-2 border border-gray-300 rounded shadow-sm"
            placeholderText="End Date"
          />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-8 max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">Team Productivity</h3>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,  // This will prevent the chart from stretching
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 20, // Optional: adjust tick steps for better visibility
                  },
                },
              },
            }}
            height={350} // Control the height of the chart here
          />
        </div>
      </div>
    </div>
  );
};

export default CustomReports;
