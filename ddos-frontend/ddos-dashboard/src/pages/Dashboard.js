import React from 'react';
import TrafficChart from '../components/TrafficChart';
import TrafficLogs from '../components/TrafficLogs';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700">📡 DDoS Detection Dashboard</h1>
        <p className="text-gray-600">Monitoring and mitigating network threats in real time.</p>
      </header>

      {/* Grid Layout for Graph + Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart Section */}
        <div className="bg-white p-6 rounded-lg shadow-md h-full">
          <TrafficChart />
        </div>

        {/* Logs Section */}
        <div className="bg-white p-6 rounded-lg shadow-md h-full">
          <TrafficLogs />
        </div>
      </div>

      {/* Footer (optional) */}
      <footer className="mt-10 text-sm text-center text-gray-500">
        &copy; {new Date().getFullYear()} DDoS Shield | Built with ❤️ by Team Id-08
      </footer>
    </div>
  );
};

export default Dashboard;
