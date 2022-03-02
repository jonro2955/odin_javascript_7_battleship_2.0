/**Must test fitsInBoard() */

import Ship from './ship';
import Data from '../src/data';

const gameBoard = (name) => {
  let board = initializeBoard();
  let boardShips = [];
  let sunkShipsArray = [];
  let missedShots = [];
  let id = name;

  /**The board is an array of 10 arrays (columns) each having 10 cells
   * that start out as { shipID: null, avail: true }. When a ship is placed,
   * we'll give the 'shipID' property an actual string, the 'avail' property
   * becomes false, and we give it a new property 'hit' which is initially
   * false*/
  function initializeBoard() {
    let container = [];
    for (let x = 0; x < 10; x++) {
      let column = [];
      for (let y = 0; y < 10; y++) {
        column.push({ shipID: null, avail: true });
      }
      container.push(column);
    }
    return container;
  }

  /**This is needed to make the user place ships on the board so that they do 
   * not touch each other. For the current ai algorithm to work, the ships cannot 
   * touch.*/
  function makeSurroundingCellsUnavailable(coords) {
    coords.forEach((coord) => {
      let x = coord['x'];
      let y = coord['y'];
      //top left corner cell: make east/southeast/south cells unavailable
      if (x === 0 && y === 0) {
        //e
        board[x + 1][y]['avail'] = false;
        //se
        board[x + 1][y + 1]['avail'] = false;
        //s
        board[x][y + 1]['avail'] = false;
      }
      //top right corner
      else if (x === 9 && y === 0) {
        //s
        board[x][y + 1]['avail'] = false;
        //sw
        board[x - 1][y + 1]['avail'] = false;
        //w
        board[x - 1][y]['avail'] = false;
      }
      //bottom left corner
      else if (x === 0 && y === 9) {
        //n
        board[x][y - 1]['avail'] = false;
        //ne
        board[x + 1][y - 1]['avail'] = false;
        //e
        board[x + 1][y]['avail'] = false;
      }
      //bottom right corner
      else if (x === 9 && y === 9) {
        //w
        board[x - 1][y]['avail'] = false;
        //nw
        board[x - 1][y - 1]['avail'] = false;
        //n
        board[x][y - 1]['avail'] = false;
      }
      //top row inner cells
      else if (y === 0) {
        //e
        board[x + 1][y]['avail'] = false;
        //se
        board[x + 1][y + 1]['avail'] = false;
        //s
        board[x][y + 1]['avail'] = false;
        //sw
        board[x - 1][y + 1]['avail'] = false;
        //w
        board[x - 1][y]['avail'] = false;
      }
      //bottom row inner cells
      else if (y === 9) {
        //w
        board[x - 1][y]['avail'] = false;
        //nw
        board[x - 1][y - 1]['avail'] = false;
        //n
        board[x][y - 1]['avail'] = false;
        //ne
        board[x + 1][y - 1]['avail'] = false;
        //e
        board[x + 1][y]['avail'] = false;
      }
      //left column inner cells
      else if (x === 0) {
        //n
        board[x][y - 1]['avail'] = false;
        //ne
        board[x + 1][y - 1]['avail'] = false;
        //e
        board[x + 1][y]['avail'] = false;
        //se
        board[x + 1][y + 1]['avail'] = false;
        //s
        board[x][y + 1]['avail'] = false;
      }
      //right column inner cells
      else if (x === 9) {
        //s
        board[x][y + 1]['avail'] = false;
        //sw
        board[x - 1][y + 1]['avail'] = false;
        //w
        board[x - 1][y]['avail'] = false;
        //nw
        board[x - 1][y - 1]['avail'] = false;
        //n
        board[x][y - 1]['avail'] = false;
      }
      //all else: full 360 degrees
      else {
        //n
        board[x][y - 1]['avail'] = false;
        //ne
        board[x + 1][y - 1]['avail'] = false;
        //e
        board[x + 1][y]['avail'] = false;
        //se
        board[x + 1][y + 1]['avail'] = false;
        //s
        board[x][y + 1]['avail'] = false;
        //sw
        board[x - 1][y + 1]['avail'] = false;
        //w
        board[x - 1][y]['avail'] = false;
        //nw
        board[x - 1][y - 1]['avail'] = false;
      }
    });
  }

  /**Random placement without touching:
   * Repeat the following 5 times for each ship in the fleet:
   * 1. Place a ship randomly until it fits.
   * 2. For each coordinate of this new ship, make all of its
   * surrounding cells 'unavailable'. The corner and edge cells
   * are not completely surrounded by cells, so you have to deal
   * with them differently than the inner cells which has 8
   * surrounding cells.*/
  function shuffleAddShipsNoTouch() {
    for (let i = 0; i < 5; i++) {
      let coords = placeShipRandomly(Data().fleet[i]);
      while (!coords) {
        coords = placeShipRandomly(Data().fleet[i]);
      }
      makeSurroundingCellsUnavailable(coords);
    }
  }

  /**ship input is one of the Data().fleet ships.
   * Places the input ship at a random location and returns the
   * coordinates of the ship or 'false' as per placeShip()*/
  function placeShipRandomly(ship) {
    let randomOrigin = {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
    };
    let randomOrientation = Math.floor(Math.random() * 2);
    return placeShip(randomOrigin, ship, randomOrientation);
  }

  /**startingCoord has form: {x:0, y:0}
   * vessel is one of data.fleet objects like { id: 'patrol', length: 2 }
   * isVertical is a boolean
   * The function either places the ship with the given parameters and then
   * returns the coordinates or returns false if the ship doesn't fit*/
  function placeShip(startingCoord, vessel, isVertical) {
    let coords = calculateCoords(startingCoord, vessel, isVertical);
    if (fitsInBoard(coords)) {
      coords.forEach((coord) => {
        let x = coord['x'];
        let y = coord['y'];
        board[x][y]['shipID'] = vessel['id'];
        board[x][y]['avail'] = false;
        board[x][y]['hit'] = false;
      });
      boardShips.push(Ship(vessel['id'], coords));
      return coords;
    } else {
      /**ship dn fit.*/
      return false;
    }
  }

  /**same inputs as placeShip(). Returns an array of coords like
   * [ {x:0, y:0}, {x:0, y:1} ] */
  function calculateCoords(startingCoord, vessel, isVertical) {
    let coords = [];
    for (let i = 0; i < vessel['length']; i++) {
      if (isVertical) {
        coords.push({
          x: Number(startingCoord['x']),
          y: Number(startingCoord['y']) + i,
        });
      } else {
        coords.push({
          x: Number(startingCoord['x']) + i,
          y: Number(startingCoord['y']),
        });
      }
    }
    return coords;
  }

  /**Input format:  {x:1, y:0}. Takes a coordinate, checks if there
   * is a ship on the board at that coordinate, and if there is,
   * marks the corresponding board cell as 'hit', hits the corresponding
   * board ship, and returns true. If there is no ship, returns false.*/
  function receiveAttack(coord) {
    let result;
    let x = coord['x'],
      y = coord['y'];
    if (board[x][y]['shipID'] === null) {
      //miss
      missedShots.push(coord);
      result = false;
    } else if (board[x][y]['hit'] === false) {
      //hit - Mark the board cell as hit
      board[x][y]['hit'] = true;
      result = true;
      boardShips.forEach((ship) => {
        //find the ship and hit it
        if (ship.getID() === board[x][y]['shipID']) {
          ship.hit({ x: x, y: y });
          //if ship is then sunk, console.log
          if (ship.isSunk()) {
            // console.log(`${name}'s`, ship.getID(), ' is sunk');
            sunkShipsArray.push(ship);
            // console.log(sunkShips);
          }
        }
      });
    }
    return result;
  }

  /**input format: array of coords like [ {x:0, y:0}, {x:0, y:1} ] */
  function fitsInBoard(coordArray) {
    let returnVal = true;
    coordArray.forEach((coord) => {
      let x = coord['x'],
        y = coord['y'];
      if (x < 0 || x > 9 || y < 0 || y > 9) {
        //out of bounds
        returnVal = false;
      } else if (board[x][y]['avail'] === false) {
        //occupied cell
        returnVal = false;
      }
    });
    return returnVal;
  }

  /**For testing */
  function sampleAddShips() {
    placeShip({ x: 1, y: 1 }, Data().fleet[4], false);
    placeShip({ x: 6, y: 3 }, Data().fleet[3], false);
    placeShip({ x: 2, y: 5 }, Data().fleet[2], false);
    placeShip({ x: 3, y: 7 }, Data().fleet[1], false);
    placeShip({ x: 4, y: 9 }, Data().fleet[0], false);
  }

  function allSunk() {
    return boardShips.every((ship) => {
      return ship.isSunk();
    });
  }

  function getBoard() {
    return board;
  }

  function getBoardShips() {
    return boardShips;
  }

  function getBoardID() {
    return id;
  }

  function getSunkShipsArray() {
    return sunkShipsArray;
  }

  function reset() {
    board = initializeBoard();
    boardShips = [];
    missedShots = [];
    sunkShipsArray = [];
  }

  return {
    getBoard,
    calculateCoords,
    placeShip,
    allSunk,
    receiveAttack,
    getBoardShips,
    fitsInBoard,
    reset,
    getBoardID,
    sampleAddShips,
    shuffleAddShipsNoTouch,
    getSunkShipsArray,
    makeSurroundingCellsUnavailable,
  };
};

export default gameBoard;
