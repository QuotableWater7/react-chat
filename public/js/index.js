function runner() {
  var serverBaseUrl = document.domain;
  var socket = io.connect(serverBaseUrl);
  var numUsers = 0;

  socket.on('newConnect', function (data) {
    $('#numUsers').text(data.numUsers);
  });

  socket.on('newDisconnect', function (data) {
    $('#numUsers').text(data.numUsers);
  });
}

$(document).on('ready', runner);
