import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Connect to your backend WebSocket server
const socket = io("http://localhost:5000");

const TrafficLogs = () => {
  // State to store logs received from backend
  const [logs, setLogs] = useState([]);
  
  // For filtering logs
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states: current page and logs per page
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Update logs from the socket every time new data arrives
  useEffect(() => {
    socket.on("trafficUpdate", (data) => {
      const newLog = {
        ip: data.ipAddress,
        traffic: data.trafficData,
        status: data.trafficData > 80 ? "Blocked" : "Normal",
        timestamp: new Date().toLocaleTimeString(),
      };
      setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 99)]); // Keep last 100 logs
    });

    return () => {
      socket.off("trafficUpdate");
    };
  }, []);

  // Filter logs based on the searchQuery
  const filteredLogs = logs.filter(log => 
    log.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.timestamp.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination: calculate the logs to display on the current page
  const indexOfLastLog = currentPage * pageSize;
  const indexOfFirstLog = indexOfLastLog - pageSize;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  // Function to handle page change
  const goToNextPage = () => {
    if (indexOfLastLog < filteredLogs.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to export logs as CSV
  const exportCSV = () => {
    // Prepare CSV header
    const header = "IP Address,Traffic,Status,Timestamp\n";
    // Map filtered logs to CSV rows
    const rows = filteredLogs.map(log => 
      `${log.ip},${log.traffic.toFixed(2)},${log.status},${log.timestamp}`
    ).join("\n");
    
    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a link to download the CSV file
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `logs_${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">📋 Threat Logs</h2>
        <div className="mt-2 sm:mt-0 flex space-x-2">
          {/* Search Bar */}
          <input
            type="text"
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => { 
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset page on new search
            }}
          />
          {/* Export CSV Button */}
          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Scrollable Table Container */}
      <div className="overflow-y-auto max-h-[400px] border border-gray-300 rounded-md">
        <table className="min-w-full table-auto text-sm text-left border-collapse">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="px-4 py-2">IP Address</th>
              <th className="px-4 py-2">Traffic (pps)</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log, idx) => (
              <tr key={idx} className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-t`}>
                <td className="px-4 py-2">{log.ip}</td>
                <td className="px-4 py-2">{log.traffic.toFixed(2)}</td>
                <td className={`px-4 py-2 font-semibold ${log.status === "Blocked" ? "text-red-600" : "text-green-600"}`}>
                  {log.status}
                </td>
                <td className="px-4 py-2">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={goToPrevPage}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {Math.ceil(filteredLogs.length / pageSize)}
        </span>
        <button
          onClick={goToNextPage}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
          disabled={indexOfLastLog >= filteredLogs.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TrafficLogs;
