// YOUR CODE HERE:
let app = {};
app.recentId;
app.server = 'http://parse.la.hackreactor.com/chatterbox/classes/messages'
app.init = function() {
  
};
app.messages = [];
app.friendsList = [];

app.renderMessage = function(message) {
  $('#chats').prepend(`<p> <span class="username">${message.username}</span>: ${message.text}</p>`);
  let current = $('.username')[0];
  $(current).on('click', () => {
    app.handleUsernameClick(message.username)});
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderRoom = function(room) {
  $('#roomSelect').prepend(`<p> ${room} </p>`);
};

app.handleUsernameClick = function(name) {
  if(app.friendsList.includes(name)) {
    console.log(`${name} already added.`)
  } else {
    app.friendsList.push(name);
    console.log(`${name} added.`)
  }
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
        // if (!app.recentId) {
        //   app.recentId = data['results'][9].objectId;
        // }
        //   // console.log(data['results'])
        // for (let element of data['results']) {
        //   if (element.objectId === app.recentId) {
        //     break;
        //   }
        //   console.log(element);
        //   if (element.text && element.username) app.renderMessage(element);
        //   app.recentId = element.objectId;
        //   console.log(element['username'] + ' sent a message');
        // }
        let recentMessage = data['results'][0]
        if(app.recentId !== recentMessage.objectId) {
          // if (app.messageChecker(data['results'][0]))
          if (!!(recentMessage.text && recentMessage.username && !app.messageChecker(recentMessage))) {
            app.renderMessage(recentMessage);
          }
          app.recentId = recentMessage.objectId;
          console.log(recentMessage['username'] + ' sent a message');
        }
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
  });
};
// return true if malicious code exists
app.messageChecker = function (message) {
  return JSON.stringify(message).includes('<script>');
};

setInterval(app.fetch, 100);