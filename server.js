var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);


/* 
IO Events
<< connection disconnect newPlayer
>> connect currentPlayers
Game Events
<< rookMovement changeOfTurn over
>> rookMoved turn gameOver
*/


var players = {};

var rookState = {
    xRook:7,
    yRook:7,
}

var turnState = {
  playerNo:0,
  startTime:0
}

var plDisconnected = 0

app.use(express.static(__dirname + '/pH'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


/*==============================================================
==============================================================*/


// Disconnect each Connection after 10 minutes
function disconnectSocketAfterDelay(socket) {
  setTimeout(() => {
    socket.disconnect();
    console.log('Socket disconnected after 1 minute.');
  }, 600000); // 600,000 milliseconds = 10 minute
}

io.on('connection', function (socket) {
  
  console.log('a user connected: ', socket.id);
  
  // If already 2 players, reject connection
  if (Object.keys(players).length > 1) {
    socket.disconnect()
    return
  }

  // Player Number can be 1 or 2
  let plNumber = plDisconnected
  if (plNumber == 0) {
    plNumber = 1 + Object.keys(players).length
  }
  players[socket.id] = {
    playerId: socket.id,
    playerNo: plNumber
  };
  console.log(players)
  console.log(`There are total ${Object.keys(players).length} players`)

  // Send current players data on new connection
  io.emit('currentPlayers', players);

  // Disconnect after 10 minutes
  disconnectSocketAfterDelay(socket)
  

  // Socket Disconnected
  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    plDisconnected = players[socket.id].playerNo
    delete players[socket.id];
    if (Object.keys(players).length == 0) {
      plDisconnected = 0;
    }
    io.emit('currentPlayers', players);
  });


  //Game Start Event
  socket.on('start', (data)=>{
    console.log('Received Start Data')
    console.log(data)
    if (data.playerNo) { // From Preload Scene
      turnState.playerNo = data.playerNo
      console.log(`Match Started by player ${turnState.playerNo} at ${turnState.startTime}`)
      io.emit('ready')
    }
    else { // From Main Scene
      turnState.startTime = data.startTime
      console.log('Received Start Time')
      console.log(data.startTime)
      io.emit('ready')
      io.emit('turnChanged', turnState);
      io.emit('rookMoved', rookState);
    }
  })


  //Rook Movement Event
  socket.on('rookMovement', function (p_rookState) {
    console.log(`Received Rook Movement Event. New Rook Position ${p_rookState.xRook}, ${p_rookState.yRook}`)
    rookState.xRook = p_rookState.xRook;
    rookState.yRook = p_rookState.yRook;
    io.emit('rookMoved', rookState);
  });


  //Change of turn even
  socket.on('changeOfTurn', (turnData) => {
    turnState.playerNo = turnState.playerNo == 1 ? 2:1
    turnState.startTime = turnData.startTime
    console.log(`New Turn Player ${turnState.playerNo}`)
    io.emit('turnChanged', turnState)
  })

  
  //Game Over Event
  socket.on('over', (winData) => {
    console.log(`Game Over. Player ${winData.playerNo} wins`)
    rookState = {xRook:7, yRook:7}
    turnState = {playerNo:0, startTime:0}
    io.emit('gameOver', winData)
  })
});


/*==============================================================
==============================================================*/


server.listen(8081, function () {
    console.log(`Listening on ${server.address().port}`);
});