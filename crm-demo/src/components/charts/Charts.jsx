import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const VisualCharts = () => {
  // Sample data for charts
  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sales Performance',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: ['Team A', 'Team B', 'Team C', 'Team D'],
    datasets: [
      {
        label: 'Team Productivity',
        data: [35, 50, 80, 45],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: ['Customer Engagement', 'Inactive Users'],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-8">Visual Reports</h2>

      {/* Line Chart for Sales Performance */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Sales Performance</h3>
        <div style={{ height: '300px', width: '100%' }}>
          <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Bar Chart for Team Productivity */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Team Productivity</h3>
        <div style={{ height: '300px', width: '100%' }}>
          <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Doughnut Chart for Customer Engagement */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Customer Engagement</h3>
        <div style={{ height: '300px', width: '100%' }}>
          <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default VisualCharts;
