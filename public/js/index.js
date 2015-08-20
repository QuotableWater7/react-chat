function init() {
  var serverBaseUrl = document.domain;
  var socket = io.connect(serverBaseUrl);
  var sessionId = '';

  function updateParticipants(participants) {
    var $participants_collection = participants.map(function (participant) {
      var $participant = $('<p id="' + participant.id + '">' + participant.name + '</p>');

      return $participant;
    });

    $('#participants').html($participants_collection);
  }

  socket.on('connect', function () {
    sessionId = socket.io.engine.id;
    console.log('connected ' + sessionId);
    socket.emit('newUser', { id: sessionId, name: $('#name').val() });
  });

  socket.on('newConnection', function (data) {
    updateParticipants(data.participants);
  });

  socket.on('userDisconnected', function (data) {
    $('#' + data.id).remove();
  });

  socket.on('nameChanged', function (data) {
    $('#' + data.id).text(data.name);
  });

  socket.on('incomingMessage', function (data) {
    var $message = $('<div><b>' + data.name + '</b>: ' + data.message + '</div>');
    $('#messages').prepend($message);
  });

  socket.on('error', function (reason) {
    console.log('Error: ' + reason);
  });

  function sendMessage() {
    var outgoingMessage = $('#outgoingMessage').val();
    var name = $('#name').val();

    $.ajax({
      url:  '/message',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({message: outgoingMessage, name: name})
    });
  }

  function outgoingMessageKeyDown(event) {
    if (event.which == 13) {
      event.preventDefault();
      if ($('#outgoingMessage').val().trim().length <= 0) {
        return;
      }
      sendMessage();
      $('#outgoingMessage').val('');
    }
  }

  function outgoingMessageKeyUp() {
    var outgoingMessageValue = $('#outgoingMessage').val();
    $('#send').attr('disabled', (outgoingMessageValue.trim()).length > 0 ? false : true);
  }

  function nameFocusOut() {
    var name = $('#name').val();
    socket.emit('nameChange', {id: sessionId, name: name});
  }

  /* Elements setup */
  $('#outgoingMessage').on('keydown', outgoingMessageKeyDown);
  $('#outgoingMessage').on('keyup', outgoingMessageKeyUp);
  $('#name').on('focusout', nameFocusOut);
  $('#send').on('click', sendMessage);
}

$(document).on('ready', init);
