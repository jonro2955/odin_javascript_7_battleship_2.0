import aiHelpers from './aiHelpers';

const player = () => {
  let moves = [];

  function reset() {
    moves = [];
  }

  /**coord input form:  {x:1, y:0}
   * board is a gameBoard object*/
  function attack(coord, board) {
    let hitResult = board.receiveAttack(coord);
    /*duplicates are eliminated by the { once: true } param inside 
    the addEventListener() of dom.activateAttackGrid(fn) */
    moves.push({ coord: coord, hitResult: hitResult, destroyed: false });
    return hitResult;
  }

  function randomAttack(board) {
    // generateRandomCoord() returns a coord with form { x: 0, y: 9 }
    let randomCoord = generateRandomCoord();
    while (movesContainsCoord(moves, randomCoord)) {
      randomCoord = generateRandomCoord();
    }
    let hitResult = board.receiveAttack(randomCoord);
    moves.push({ coord: randomCoord, hitResult: hitResult, destroyed: false });
    console.log('ramdomAttack: ', randomCoord, 'result: ', hitResult);
    return hitResult;
  }

  /**************************************************************************
   * @smartAttack
   * @param board: a gameBoard object
   * @returns a boolean indicating "hit" (true) or "miss" (false),
   * which is a function of a function such as randomAttack(board),
   * hitAdjacent(bow, moves, board), or attack(coord, board)
   *************************************************************************/
  function smartAttack(board) {
    let enemyShip = [];

    if (moves.length === 0) {
      //step 1(a)
      return randomAttack(board);
    }

    //array.find() returns the first match or returns undefined
    let bow = moves.find((move) => {
      return move['hitResult'] === true && move['destroyed'] === false;
    });

    if (bow === undefined) {
      //step 1(b)
      return randomAttack(board);
    } else {
      //step 2
      enemyShip.push(bow);
    }

    // step 3:
    let stern = aiHelpers().getHitAdjacentCoord(bow, moves);
    if (!stern) {
      //step 3(b)
      return aiHelpers().hitAdjacent(bow, moves, board);
    } else {
      enemyShip.push(stern);
    }

    //step 4:
    let vertical = enemyShip[0]['coord']['y'] - enemyShip[1]['coord']['y'];
    //sort
    if (vertical) {
      enemyShip.sort((a, b) => {
        return a['coord']['y'] - b['coord']['y'];
      });
    } else {
      enemyShip.sort((a, b) => {
        return a['coord']['x'] - b['coord']['x'];
      });
    }
    aiHelpers().fillUpEnemyShip(enemyShip, moves); //tbd
    console.log('enemyShip: ', enemyShip);
    let hitOptionCoord = aiHelpers().getHitOption(enemyShip, moves, vertical); //current
    if (hitOptionCoord) {
      return attack(hitOptionCoord, board);
    } else {
      //Here mark all enemyShip coords in moves as 'destroyed'
      return randomAttack(board);
    }
  } //smartAttack end

  function movesContainsCoord(movesArray, coord) {
    return movesArray.some((move) => {
      return (
        move['coord']['x'] === coord['x'] && move['coord']['y'] === coord['y']
      );
    });
  }

  function generateRandomCoord() {
    let randomX = Math.floor(Math.random() * 10);
    let randomY = Math.floor(Math.random() * 10);
    return { x: randomX, y: randomY };
  }

  function getMoves() {
    return moves;
  }

  return {
    reset,
    attack,
    randomAttack,
    generateRandomCoord,
    getMoves,
    smartAttack,
  };
};

export default player;

/**note: the { once: true } options in dom event listener prevents
 * attacking the same cell twice.*/
