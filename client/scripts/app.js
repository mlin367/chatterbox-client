// YOUR CODE HERE:
let app = {};
app.recentId;
//Most recent data from fetch whenever it is invoked
app.data;
app.server = 'http://parse.la.hackreactor.com/chatterbox/classes/messages'
app.init = function() {
};
//Default room will always be lobby and it will always exist, for now...
app.currentRoom = 'lobby';
app.rooms = ['lobby'];
app.messages = [];
app.friendsList = [];

app.renderMessage = function(message) {
  if (!!(message.text && message.username && !app.messageChecker(message))) {
    if(app.friendsList.includes(message.username)) {
      $('#chats').prepend(`<p> <span class="username">${message.username}</span>: <strong> ${message.text} </strong></p>`);
    } else {
      $('#chats').prepend(`<p> <span class="username">${message.username}</span>: ${message.text}</p>`);
    }
    let current = $('.username')[0];
      $(current).on('click', () => {
        app.handleUsernameClick(message.username)
      });
  } 
  if(app.messageChecker(message)) {
    console.log(`${message.username} tried to send "${message.text}" =\\`)
  }
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderRoom = function(room) {
  $('#selectDrop').prepend(`<option value="${room}">${room}</option>`);
};

//Renders messages for current room only
app.handleDropDownClick = function(room, data) {
  app.clearMessages();
  for(let i = data.length - 1; i >= 0; i--) {
    if(data[i].roomname === room) {
      app.renderMessage(data[i]);
    }
  }
};

app.handleUsernameClick = function(name) {
  if(app.friendsList.includes(name)) {
    console.log(`${name} already added.`)
  } else {
    app.friendsList.push(name);
    $('#friendsList').append('</br>' + name);
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
        $('img').fadeToggle();
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
    roomname: app.currentRoom
  };
  $('img').toggle();
  app.send(message);
};

//Event handlers for submit and drop down
$('#send').on('submit', app.handleSubmit);
$('#selectDrop').on('change', () => {
  $('img').toggle();
  let value = $( "select option:selected" ).text();
  if(value === 'Create Room') {
    let newRoom = prompt('Enter a name for the new room: ');
    if(newRoom === null || newRoom === "") {
      alert('Room creation cancelled');
      $('#selectDrop').val(app.currentRoom).trigger('change');
    } else {
      app.rooms.push(newRoom);
      app.renderRoom(newRoom);
      app.currentRoom = newRoom;
      $('#selectDrop').val(newRoom).trigger('change');
    }
  } else {
    app.currentRoom = value;
  }
  app.handleDropDownClick(app.currentRoom, app.data['results']);
  $('img').fadeToggle();
})


app.fetch = function() {
  $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.la.hackreactor.com/chatterbox/classes/messages',
      data: {order: '-createdAt'},
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        //Tests if the data has changed and only run code below if it has
        if(JSON.stringify(app.data) !== JSON.stringify(data)) {
          app.data = data;
          for(let message of data['results']) {
            if(!app.rooms.includes(message.roomname)) {
              app.rooms.push(message.roomname);
              app.renderRoom(message.roomname);
            }
          }
          app.handleDropDownClick(app.currentRoom, data['results'])
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

app.fetch();
setInterval(app.fetch, 1000);

