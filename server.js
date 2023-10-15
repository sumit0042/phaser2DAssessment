var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};

var rookState = {
    xRook:7,
    yRook:7,
}

app.use(express.static(__dirname + '/pH'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

/* 
IO Events
<< connection disconnect newPlayer
>> currentPlayers
Game Events
<< rookMovement
>> rookMoved
*/

io.on('connection', function (socket) {
  console.log('a user connected: ', socket.id);

  players[socket.id] = {
    playerId: socket.id,
  };
  console.log(players)
  // send the players object to the new player
  socket.emit('currentPlayers', players);
  // send the rookState object to the new player
  socket.emit('rookMoved', rookState);
  // update the other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
  });

  // when a player moves, update the rookState data
  socket.on('rookMovement', function (p_rookState) {
    console.log(`Received Rook Movement Event. New Rook Position ${p_rookState.xRook}, ${p_rookState.yRook}`)
    rookState.xRook = p_rookState.xRook;
    rookState.yRook = p_rookState.yRook;
    // emit a message to all players about the rook that moved
    socket.broadcast.emit('rookMoved', rookState);
    if (p_rookState.xRook == 0 && p_rookState.yRook == 0) {
      console.log('Game Over')
      rookState = {xRook:7, yRook:7}
    }
  });
});

server.listen(8081, function () {
    console.log(`Listening on ${server.address().port}`);
});