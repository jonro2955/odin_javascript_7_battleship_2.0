const aiHelpers = () => {
  /** getHitAdjacentCoordOf(bow, moves): 
  Check in moves if there is a hitmove that is adjacent to bow 
  that is not destroyed. If found, return that move. If not, return false. 
  bow format: { coord: { x: 0, y: 9 }, hitResult: true, destroyed: false }
  The directions from bow to look for a hit move depends on bow's position*/
  function getHitAdjacentCoord(bow, moves) {
    let x = bow['coord']['x'];
    let y = bow['coord']['y'];
    let returnMove;
    moves.forEach((move) => {
      if (x === 0) {
        // if x = 0 (bow is on left edge column), check right
        if (
          move['coord']['x'] === x + 1 &&
          move['coord']['y'] === y &&
          move['hitResult'] === true &&
          move['destroyed'] === false
        ) {
          returnMove = move;
        }
      }
      if (x === 9) {
        //check left
        if (
          move['coord']['x'] === x - 1 &&
          move['coord']['y'] === y &&
          move['hitResult'] === true &&
          move['destroyed'] === false
        ) {
          returnMove = move;
        }
      }
      if (y === 0) {
        //check below
        if (
          move['coord']['x'] === x &&
          move['coord']['y'] === y + 1 &&
          move['hitResult'] === true &&
          move['destroyed'] === false
        ) {
          returnMove = move;
        }
      }
      if (y === 9) {
        //check above
        if (
          move['coord']['x'] === x &&
          move['coord']['y'] === y - 1 &&
          move['hitResult'] === true &&
          move['destroyed'] === false
        ) {
          returnMove = move;
        }
      }
      // //for all other inner cells, check all 4 sides
      else {
        //right
        if (
          move['coord']['x'] === x + 1 &&
          move['coord']['y'] === y &&
          move['hitResult'] === true &&
          move['destroyed'] === false
        ) {
          returnMove = move;
        }
        //left
        if (
          move['coord']['x'] === x - 1 &&
          move['coord']['y'] === y &&
          move['hitResult'] === true &&
          move['destroyed'] === false
        ) {
          returnMove = move;
        }
        //above
        if (
          move['coord']['x'] === x &&
          move['coord']['y'] === y + 1 &&
          move['hitResult'] === true &&
          move['destroyed'] === false
        ) {
          returnMove = move;
        }
        //below
        if (
          move['coord']['x'] === x &&
          move['coord']['y'] === y - 1 &&
          move['hitResult'] === true &&
          move['destroyed'] === false
        ) {
          returnMove = move;
        }
      }
    });
    return returnMove;
  }

  /**Using given moves, return board.receiveAttack(coord) with the 
  coord of one of the cells adjacent to bow that has not been played. 
  */
  function hitAdjacent(bow, moves, board) {
    const directions = ['n', 's', 'w', 'e'];
    let blocked = [];
    let x = bow['coord']['x'];
    let y = bow['coord']['y'];
    moves.forEach((move) => {
      //If bow is on the left edge, block west. Do the same for other 3 edges.
      if (x === 9) {
        blocked.push('e');
      }
      if (x === 0) {
        blocked.push('w');
      }
      if (y === 0) {
        blocked.push('n');
      }
      if (y === 9) {
        blocked.push('s');
      }
      //if theres a move to the east, block east. do the same for ther 3 directions
      if (move['coord']['x'] === x + 1 && move['coord']['y'] === y) {
        blocked.push('e');
      }
      if (move['coord']['x'] === x - 1 && move['coord']['y'] === y) {
        blocked.push('w');
      }
      if (move['coord']['x'] === x && move['coord']['y'] === y - 1) {
        blocked.push('n');
      }
      if (move['coord']['x'] === x && move['coord']['y'] === y + 1) {
        blocked.push('s');
      }
    });
    let options = directions.filter((x) => !blocked.includes(x));
    let direction = options[0];
    let coord, hitResult;
    switch (direction) {
      case 'e':
        coord = { x: x + 1, y: y };
        hitResult = board.receiveAttack(coord);
        moves.push({ coord: coord, hitResult: hitResult, destroyed: false });
        console.log('hitAdjacent(): ', coord, 'hitResult: ', hitResult);
        return hitResult;
      case 'w':
        coord = { x: x - 1, y: y };
        hitResult = board.receiveAttack(coord);
        moves.push({ coord: coord, hitResult: hitResult, destroyed: false });
        console.log('hitAdjacent(): ', coord, 'hitResult: ', hitResult);
        return hitResult;
      case 'n':
        coord = { x: x, y: y - 1 };
        hitResult = board.receiveAttack(coord);
        moves.push({ coord: coord, hitResult: hitResult, destroyed: false });
        console.log('hitAdjacent(): ', coord, 'hitResult: ', hitResult);
        return hitResult;
      case 's':
        coord = { x: x, y: y + 1 };
        hitResult = board.receiveAttack(coord);
        moves.push({ coord: coord, hitResult: hitResult, destroyed: false });
        console.log('hitAdjacent(): ', coord, 'hitResult: ', hitResult);
        return hitResult;
    }
  }

  /*CURRENT: return coordinates for an open endcoord of enemyShip, if it
  exists. Return value format: {x:1, y:0}*/
  function getHitOption(enemyShip, moves, vertical) {
    let returnVal;
    const bow = enemyShip[0];
    const stern = enemyShip[enemyShip.length - 1];
    const bowX = bow['coord']['x'];
    const bowY = bow['coord']['y'];
    const sternX = stern['coord']['x'];
    const sternY = stern['coord']['y'];
    console.log('bow: ', bow['coord'], 'stern: ', stern['coord']);
    if (vertical) {
      //first the above cell
      returnVal = { x: bowX, y: bowY - 1 };
      moves.forEach((move) => {
        if (
          bowY == 0 ||
          (move['coord']['x'] === bowX && move['coord']['y'] === bowY - 1)
        ) {
          returnVal = false;
        }
      });
      //if that didn't work, try below
      if (returnVal === false) {
        returnVal = { x: sternX, y: sternY + 1 };
        moves.forEach((move) => {
          if (
            sternY == 9 ||
            (move['coord']['x'] === sternX && move['coord']['y'] === sternY + 1)
          ) {
            returnVal = false;
          }
        });
      }
    } else {
      /*Horizontal cases. First the left cell*/
      returnVal = { x: bowX - 1, y: bowY };
      moves.forEach((move) => {
        if (
          bowX == 0 ||
          (move['coord']['x'] === bowX - 1 && move['coord']['y'] === bowY)
        ) {
          returnVal = false;
        }
      });
      //if that didn't work, try the right side
      if (returnVal === false) {
        returnVal = { x: sternX + 1, y: sternY };
        moves.forEach((move) => {
          if (
            sternX == 9 ||
            (move['coord']['x'] === sternX + 1 && move['coord']['y'] === sternY)
          ) {
            returnVal = false;
          }
        });
      }
    }

    console.log('getHitOption returnVal: ', returnVal);
    /*And if returnVal is false, we need to set all enemyShip's coords 
    in 'moves' to 'destroyed' */
    if (!returnVal) {
      moves.forEach((move) => {
        enemyShip.forEach((shipPart) => {
          if (move['coord'] == shipPart['coord']) {
            move['destroyed'] = true;
          }
        });
      });
      enemyShip = [];
    }

    return returnVal;
  }

  /**
  enemyShip input has 2 sorted hit cells inside. If there are adjacent cells
  inside moves array along the current orientation of enemyShip, add them to 
  enemyShip
   */
  function fillUpEnemyShip(enemyShip, moves) {
    let bow = enemyShip[0];
    let stern = enemyShip[1];
    let bowX, bowY, sternX, sternY;
    let vertical = bow['coord']['y'] - stern['coord']['y'];
    if (vertical) {
      //first the above cells
      moves.forEach((move) => {
        bowX = bow['coord']['x'];
        bowY = bow['coord']['y'];
        if (
          bowY > 0 &&
          move['coord']['x'] === bowX &&
          move['coord']['y'] === bowY - 1 &&
          move['hitResult'] === true &&
          move['destroyed'] === false
        ) {
          bow = move;
          enemyShip.unshift(move);
        }
      });
      //then, do same for below
      moves.forEach((move) => {
        sternX = stern['coord']['x'];
        sternY = stern['coord']['y'];
        if (
          sternY < 9 &&
          move['coord']['x'] === sternX &&
          move['coord']['y'] === sternY + 1 &&
          move['hitResult'] === true &&
          move['destroyed'] === false
        ) {
          stern = move;
          enemyShip.push(move);
        }
      });
    } else {
      /*Horizontal cases. First the left cell*/
      moves.forEach((move) => {
        bowX = bow['coord']['x'];
        bowY = bow['coord']['y'];
        if (
          bowX > 0 &&
          move['coord']['x'] === bowX - 1 &&
          move['coord']['y'] === bowY &&
          move['hitResult'] === true &&
          move['destroyed'] === false
        ) {
          bow = move;
          enemyShip.unshift(move);
        }
      });
      //then, do same for below
      moves.forEach((move) => {
        sternX = stern['coord']['x'];
        sternY = stern['coord']['y'];
        if (
          sternX < 9 &&
          move['coord']['x'] === sternX + 1 &&
          move['coord']['y'] === sternY &&
          move['hitResult'] === true &&
          move['destroyed'] === false
        ) {
          stern = move;
          enemyShip.push(move);
        }
      });
    }
  }

  return {
    getHitAdjacentCoord,
    hitAdjacent,
    getHitOption,
    fillUpEnemyShip,
  };
};

export default aiHelpers;
