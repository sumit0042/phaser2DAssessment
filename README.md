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
- Implement Player Profile using session id. Currently, more than 2 players can play if they have the link to the game. Avoid this, allow more instances of game for new joinees or provide them with spectator role
- Move Game Logic to Backend. This includes rook movement constraints, timer and turns, win condition
- Add Game Over Animations, Blinking Animation for hint and reward, Hover Animation etc 
