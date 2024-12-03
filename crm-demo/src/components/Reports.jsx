import React from 'react';
import VisualReports from './charts/Charts';
import CustomReports from './charts/CustomReports';

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
