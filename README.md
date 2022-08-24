# BattleShip

# [Live Site](https://jonro2955.github.io/odin_javascript_7_battleship_2.0/)

This is an interactive battleship game played against a computer opponent. It features a drag and drop ship placement interface and a semi-smart computer opponent. 

The computer player could have been implemented as a random cell hitter, but I took up the challenge of making the computer play the way a human would play by programming a basic set of hierarchical if-else rules. For example, if the computer's last move was not a hit, it selects a random cell to hit. If it was a single (unconnected) hit, it randomly selects one of the available cells adjacent to the last hit, to hit. If it was an adjacent hit to a previous hit, then it starts hitting in a straight line to one direction until it either misses, runs into a wall, or destroys the vessel. If the vessel is not destroyed, then in the next turn, it will start hitting in the opposite direction. When the vessel is destroyed, the computer will return to making random shots.  

The most challenging parts of this project were (1) Adopting the test-first development approach for the development of the basic objects of the application, (2) getting the drag-and-drop interface to work seamlessly using DOM methods and mouse events, and (3) getting the AI to work the way I wanted it to given the constraints of the initial object design. Specifically, figuring out how the create functions for the computer player to determine whether a hit was an adjacent hit to its previous hit took a bit of effort. And if two ships are touching, it couldn't tell if that was a single ship or not given the initial object design. So I found a workaround by making the random ship placer place the ships so that they did not touch each other. 

<hr/>

### Focus Areas
- Unit tesing 
- Test First Development
- Modular development
- Interactive DOM 

### Tools 
- Jest
- Webpack
- Babel
- Prettier
 
### Acknowledgements

[The Odin Project](https://www.theodinproject.com/)

### License

[ISC](https://opensource.org/licenses/ISC)
