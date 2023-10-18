# Rook Game

## How to Run
Clone the repository. Stay on the master branch. Then run:
- `npm i` 
- `npm start`

Alternately, the game has been hosted on [AWS](http://3.6.37.218:8081/) in the meantime. Open it to start playing
## How to Play
- Each player should open [http://localhost:8081](http://localhost:8081/) in a separate tab or window in their browser
- Click Start to Start playing
- Take alternate turns to move the rook
- Use mouse to move the rook to the new position
## Further Improvements
- Currently, no more than 2 players can play if they have the link to the game. Avoid this, allow more instances of game for new joinees or provide them with spectator role.
- Add Game Over Animations, Blinking Animation for hint and reward, Hover Animation etc
- Add Design Documentation and Code Comments for latest commmit
## Logic
The logic for the main scene can be found in file [/pH/src/scenes/Level.js](https://github.com/sumit0042/phaser2DAssessment/blob/master/pH/src/scenes/Level.js)

On refactoring, it will be split to multiple files: 
- Timer will go in its own component
- Socket events will be handled in a separate SocketManager class
## Design
Server handles following event types
- `IO Events`: These are related to new connections and broken connections. The server maintains at max 2 connections at a time, this is because it is a 1v1 game
- `Game Update Events`: This constitutes the `rookMoved` event from server to client and `rookMovement` event from client to server. The purpose of the event is to sync the state of the rook (its position on the 8x8 chessboard) across both the player's devices
- `Turn Events`: This event syncronises the player's turn on both devices. Moving it to the server has security related advantages because otherwise, the game's client side build on the browser can be tweaked to manipulate turns.

Client contains the following:
- The Phaser game object. The game object is extended to a multiplayer game object. This is done to store current player and all player's profile. It handle socket's events described above and emits those events to the game scenes. The file is at [/pH/src/game.js](https://github.com/sumit0042/phaser2DAssessment/blob/master/pH/src/game.js)
- The Preload Scene. It contains the load screen with the start button. Can be found at [/pH/src/scenes/Preload.js](https://github.com/sumit0042/phaser2DAssessment/blob/master/pH/src/scenes/Preload.js)
- The Main Game Scene. It contains the main scene at [/pH/src/scenes/Level.js](https://github.com/sumit0042/phaser2DAssessment/blob/master/pH/src/scenes/Level.js) It processes events from the server and emits them as `onRookMoved` scene event. On this event the rook position is updated. On turn change event, turns are toggled. The `update` function handles timers and game over due to timeout.
