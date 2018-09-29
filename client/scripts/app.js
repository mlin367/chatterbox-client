// YOUR CODE HERE:
let app = {};
app.server = 'http://parse.la.hackreactor.com/chatterbox/classes/messages'
app.init = function() {
};
app.messages = [];
app.friendsList = [];

app.renderMessage = function(message) {
  $('#chats').prepend(`<p> <span class="username">${message.username}</span> : ${message.text} in  ${message.roomname} </p>`);
  let current = $('.username')[0];
  $(current).on('click', app.handleUsernameClick);
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderRoom = function(room) {
  $('#roomSelect').prepend(`<p> ${room} </p>`);
};

app.handleUsernameClick = function() {
  app.friendsList.push($($('.username')[0]).text());
  console.log(`${$($('.username')[0]).text()} added.`)
};


app.send = function(message) {
  $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.la.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
  });
};

app.handleSubmit = function(e) {
  e.preventDefault();
  let content = $('#message').val();
  var message = {
    username: window.location.search.split('=')[1],
    text: content,
    roomname: 'lobby'    
  }
  console.log($('#message').val());
  app.send(message)
};

$('#send').on('submit', app.handleSubmit);

app.fetch = function() {
  $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.la.hackreactor.com/chatterbox/classes/messages',
      data: {order: '-createdAt'},
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        app.renderMessage(data['results'][0]);
        console.log(data['results'][0]['username'] + ' sent a message');
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
  });
};

// setInterval(app.fetch, 2000);