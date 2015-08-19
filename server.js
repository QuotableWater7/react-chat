var express = require('express');
var app = express();
var http = require('http');
var _ = require('underscore');
var io = require('socket.io').listen(http);
var bodyParser = require('body-parser');
var server = http.createServer(app);

var connections = 0;

app.set('ipaddr', '127.0.0.1');
app.set('port', 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/', function (request, response) {
  response.render('index');
});

io.on('connection', function (socket) {
  connections++;
  socket.emit('newConnect', { numUsers: connections });

  socket.on('disconnect', function () {
    connections--;
    socket.emit('newDisconnect', { numUsers: connections });
  });
});

server.listen(app.get('port'), app.get('ipaddr'));
