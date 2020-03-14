'use strict';

const express = require('express');
const http = require('http');

const WebSocket = require('ws');

const app = express();
const clients = new Set();


app.use(express.static('public'));

let count = 0;

const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', function (request, socket, head) {

    wss.handleUpgrade(request, socket, head, function (ws) {
        wss.emit('connection', ws, request);
    });
});

wss.on('connection', function (ws, request) {
    // const userId = request.connection.remoteAddress;
    // console.log(request.url);

    clients.add(ws);
    ws.send(count);

    ws.on('message', function (message) {
        count++;
        console.log(count);

        clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(count);
            }
        });
        
        console.log(`Message ${message} from someone`);
    });

    ws.on('close', function () {
        clients.delete(ws);
    });
});


server.listen(3000, function () {
    console.log('Go to http://localhost:3000');
});