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

// app.post('/connection', function (request, response) {
//   io.sockets.emit('newConnection');
// });

io.on('connection', function (socket) {
  connections++;

  socket.on('disconnect', function () {
    connections--;
  });
});

server.listen(app.get('port'), app.get('ipaddr'));
