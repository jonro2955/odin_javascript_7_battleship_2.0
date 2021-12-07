import player from '../src/player';
import GameBoard from '../src/gameBoard';
import Data from '../src/data';

test('player', () => {
  const compBoard = GameBoard();
  const human = player();
  compBoard.placeShip({ x: 0, y: 0 }, Data().fleet[0], false);

  //attack()
  expect(human.attack({ x: 0, y: 0 }, compBoard)).toBeTruthy();
  expect(human.attack({ x: 0, y: 1 }, compBoard)).toBeFalsy();
  expect(compBoard.allSunk()).toBeFalsy();
  expect(human.attack({ x: 1, y: 0 }, compBoard)).toBeTruthy();
  expect(compBoard.allSunk()).toBeTruthy();

  //generateRandomCoord()
  let randomCoord = human.generateRandomCoord();
  expect(randomCoord['x']).toBeGreaterThanOrEqual(0);
  expect(randomCoord['x']).toBeLessThanOrEqual(9);
  expect(randomCoord['y']).toBeGreaterThanOrEqual(0);
  expect(randomCoord['y']).toBeLessThanOrEqual(9);

  //randomAttack()
  expect(typeof human.randomAttack(compBoard)).toBe('boolean');

  //movesContainsCoord(movesArray, coord)
  // let movesArray = 
  // expect(movesContainsCoord(movesArray, coord)).toBe('boolean');
});
