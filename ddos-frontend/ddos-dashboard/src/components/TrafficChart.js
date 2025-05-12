import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const socket = io("http://localhost:5000");

const TrafficChart = () => {
  // ✅ Declare states
  const [trafficData, setTrafficData] = useState([]);
  const [labels, setLabels] = useState([]); // ← THIS FIXES YOUR ERROR
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    socket.on("trafficUpdate", (data) => {
      console.log("Received traffic data:", data);
      setTrafficData((prev) => [...prev.slice(-20), data.trafficData]);
      setLabels((prev) => [...prev.slice(-20), new Date().toLocaleTimeString()]);
    });

    socket.on("threatAlert", (alert) => {
      setAlerts((prev) => [...prev, alert]);
    });

    return () => {
      socket.off("trafficUpdate");
      socket.off("threatAlert");
    };
  }, []);

  const chartData = {
    labels: labels.length ? labels : ["Waiting..."],
    datasets: [
      {
        label: "Network Traffic",
        data: trafficData.length ? trafficData : [0],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📊 Real-Time Traffic Graph</h2>
      <Line data={chartData} options={{ responsive: true }} />

      <h2 className="text-xl font-semibold mt-6 text-red-600">🚨 Threat Alerts</h2>
      <ul className="text-sm">
        {alerts.map((alert, index) => (
          <li key={index}>
            <b>{alert.ip}</b> was <span className="text-red-600">{alert.action}</span> (Traffic: {alert.traffic})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrafficChart;
