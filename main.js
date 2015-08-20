var express = require('express');
var app = express();
var http = require('http').createServer(app);
var _ = require('underscore');
var io = require('socket.io').listen(http);
var bodyParser = require('body-parser');

var participants = [];

console.log("**** application is running ****");

app.set('ipaddr', '127.0.0.1');
app.set('port', 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.render('index');
});

app.post('/message', function (req, res) {
  var message = req.body.message;

  if (_.isUndefined(message) || message.trim() === '') {
    return res.json(400, { error: 'Bad request' });
  }

  var name = req.body.name;
  io.sockets.emit('incomingMessage', { name: name, message: message });

  res.json(200, { message: 'Success' });
});

io.on('connection', function (socket) {
  socket.on('newUser', function (data) {
    participants.push({ id: data.id, name: data.name });
    io.sockets.emit('newConnection', { participants: participants });
  });

  socket.on('nameChange', function (data) {
    var participant = _.findWhere(participants, { id: socket.id })
    participant.name = data.name;
    io.sockets.emit('nameChanged', { id: data.id, name: data.name });
  });

  socket.on('disconnect', function () {
    var leaving_participant = _.findWhere(participants, { id: socket.id });
    participants = _.without(participants, leaving_participant);
    io.sockets.emit('userDisconnected', { id: socket.id, sender: 'system' });
  });
});

http.listen(app.get('port'), app.get('ipaddr'));
