'use strict';

const express = require('express');
const http = require('http');

const WebSocket = require('ws');

const app = express();
const map = new Map();


app.use(express.static('public'));


const server = http.createServer(app);
const wss = new WebSocket.Server({ port: 3001 });

server.on('upgrade', function (request, socket, head) {


    wss.handleUpgrade(request, socket, head, function (ws) {
        wss.emit('connection', ws, request);
    });
});

wss.on('connection', function (ws, request) {
    const userId = request.connection.remoteAddress;

    map.set(userId, ws);

    ws.on('message', function (message) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
        console.log(`Message ${message} from ${userId}`);
    });

    ws.on('close', function () {
        map.delete(userId);
    });
});


server.listen(3000, function () {
    console.log('Go to http://localhost:3000');
});