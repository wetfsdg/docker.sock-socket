const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const exec = require('child_process').execFileSync;
const spawn = require('child_process').spawnSync;
const fs = require('fs');
const http = require('http');
const docker = '/var/run/docker.sock';

var containers = [];
var stats = [];

server.listen(3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function (socket) {

    pollHigh();

    setInterval(pollHigh, 500);

    function pollHigh() {

        for (let i = 0, len = containers.length; i < len; i++) {

            http.get({
                socketPath: docker,
                path: '/containers/' + containers[i].Id + '/stats?stream=false'
            }, function (response) {
                response.setEncoding('utf8');

                response.on('data', function (data) {

                    try {
                        JSON.parse(data);
                    } catch (e) {
                        console.error('Data could not be parsed');
                        return false;
                    }

                    return stats[i] = {
                        Id: containers[i].Id,
                        Info: containers[i],
                        Stats: JSON.parse(data)
                    };
                });
            });
        }

        socket.emit('containers', stats);

    }

    pollLow();

    setInterval(pollLow, 250);

    function pollLow() {

        // Update containers
        http.request({
            socketPath: docker,
            path: "/containers/json",
        }, function(response) {
            response.setEncoding('utf8');

            response.on('data', function (data) {
                try {
                    JSON.parse(data);
                } catch (e) {
                    return false;
                }

                return containers = JSON.parse(data);
            });
        }).end();
    }
});