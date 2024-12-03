import React from 'react';
import VisualReports from './VisualReports';
import CustomReports from './CustomReports';

const ReportsPage = () => {
    return (
        <div>
            <h2 className="text-4xl text-center font-bold text-gray-800 mb-8">Comprehensive Reports</h2>
            <VisualReports />
            <CustomReports />
        </div>
    );
};

export default ReportsPage;
