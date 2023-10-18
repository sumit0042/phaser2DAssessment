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
- Implement Player Profile using session id. Currently, no more than 2 players can play if they have the link to the game. Avoid this, allow more instances of game for new joinees or provide them with spectator role. In the meantime, disconnect socket after 10 min of testing. And if new connection, then new game from rook at 7, 7
- Add Game Over Condition and restart for gameover due to timeout
- Add Game Over Animations, Blinking Animation for hint and reward, Hover Animation etc
- Add Design Documentation and Code Comments for latest commmit
## Logic
The logic for the main scene can be found in file [/pH/src/scenes/Level.js](https://github.com/sumit0042/phaser2DAssessment/blob/master/pH/src/scenes/Level.js)

On refactoring, it will be split to multiple files: 
- Timer will go in its own component
- Socket events will be handled in a separate SocketManager class
