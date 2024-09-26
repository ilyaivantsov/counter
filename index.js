'use strict';
// comment
const express = require('express');
const http = require('http');
const fs = require("fs");

const WebSocket = require('ws');

const app = express();
const clients = new Set();


app.use(express.static('public'));


let data = fs.readFileSync("count.txt", "utf8");
let count = +data;

const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', function (request, socket, head) {

    wss.handleUpgrade(request, socket, head, function (ws) {
        wss.emit('connection', ws, request);
    });
});

wss.on('connection', function (ws, request) {

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

        console.log(`Message ${message}`);
    });

    ws.on('close', function () {
        clients.delete(ws);
    });
});

setInterval(function () {
    fs.readFile("count.txt", "utf8",
        function (error, data) {
            if (error) throw error;
            count = +data;
            clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(count);
                }
            });
        });
}, 60000);

server.listen(3000, function () {
    console.log('Go to http://localhost:3000');
});
