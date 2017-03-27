function userSocketConnectionInit(socket) {
  socket.emit('init', { freshnessTimestamp: new Date() });
}

function socketHandler(socket) {

  userSocketConnectionInit(socket);

  socket.on('login', function (data) {
    console.log(data);
		userSocketConnectionInit(socket);
  });
}

module.exports = socketHandler;
