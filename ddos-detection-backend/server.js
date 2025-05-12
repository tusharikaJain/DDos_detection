const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());

// Simulated traffic data
let blockedIPs = new Set();
const suspiciousThreshold = 80; // Any traffic above this is considered suspicious

io.on('connection', (socket) => {
    console.log('New client connected');

    setInterval(() => {
        let trafficData = Math.random() * 100; // Random traffic data
        let ipAddress = `192.168.1.${Math.floor(Math.random() * 255)}`; // Simulated IPs

        // Detect if traffic is suspicious
        if (trafficData > suspiciousThreshold) {
            blockedIPs.add(ipAddress);
            socket.emit('threatAlert', { ip: ipAddress, action: "Blocked", traffic: trafficData });
        }

        // Send traffic update
        socket.emit('trafficUpdate', { trafficData, ipAddress });
    }, 3000);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(5000, () => {
    console.log('Server running on port 5000');
});
