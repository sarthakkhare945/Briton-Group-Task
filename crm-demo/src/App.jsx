import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ContactManagement from './components/ContactManagement';
import TaskTracker from './components/TaskTracker';
import Reports from './components/Reports';

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{padding: '20px', width: '100%' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/contacts" element={<ContactManagement />} />
            <Route path="/tasks" element={<TaskTracker />} />
            <Route path="/reports" element={<Reports />} />
            {/* <Route path="/contacts" element={<ContactManagement />} />
            <Route path="/tasks" element={<TaskTracker />} />
            <Route path="/reports" element={<Reports />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
