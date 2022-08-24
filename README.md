# BattleShip

# [Live Site](https://jonro2955.github.io/odin_javascript_7_battleship_2.0/)

This is an interactive battleship game played against a computer opponent. It features a drag and drop ship placement interface and a semi-smart computer opponent. 

The computer player could have been implemented as a random cell hitter, but I took up the challenge of making the computer play the way a human would play by programming a basic set of hierarchical if-else rules. For example, if the computer's last move was not a hit, it selects a random cell to hit. If it was a single (unconnected) hit, it randomly selects one of the available cells adjacent to the last hit, to hit. If it was an adjacent hit to a previous hit, then it starts hitting in a straight line to one direction until it either misses, runs into a wall, or destroys the vessel. If the vessel is not destroyed, then in the next turn, it will start hitting in the opposite direction. When the vessel is destroyed, the computer will return to making random shots.  

Some challenges for this project were (1) Adopting the test-first development approach for the development of the basic objects of the application, (2) getting the drag-and-drop interface to work seamlessly, and (3) getting the AI to work the way I wanted it to given the constraints of the initial object design. Specifically, creating functions to determine whether a hit was an adjacent hit to another hit took a bit of creative tinkering. And if two ships are touching, the computer would think that a ship was longer than it really was, given the initial object design. So I found a workaround by preventing the ships from being placed if they are touching each other. 

If I were to do this project over, I would redesign the objects differently with additional properties and methods so that the AI functions are easier to implement. I would also use functional programming to eliminate side effects and make the program easier to decypher rather than scrolling up and down to see which variable changes at each line. Lastly, I would add responsive design for mobile viewports, and make the visual design of the game more aesthetic.

<hr/>

### Focus Areas
- Unit tesing 
- Test First Development
- Object oriented design
- Modular development
- DOM event handling 

### Tools 
- Jest
- Webpack
- Babel
- Prettier
 
### Acknowledgements

[The Odin Project](https://www.theodinproject.com/)

### License

[ISC](https://opensource.org/licenses/ISC)
