import player from './player';
import GameBoard from './gameBoard';

test('human attacks', () => {
  const compBoard = GameBoard();
  const human = player();
  compBoard.placeShip(0, 0, 1, false);
  compBoard.placeShip(1, 10, 2, false);
  human.attack(0, compBoard);
  human.attack(10, compBoard);
  expect(compBoard.allSunk()).toBeFalsy();
  human.attack(11, compBoard);
  expect(compBoard.allSunk()).toBeTruthy();
});

test('computer attacks', () => {
  const humanBoard = GameBoard();
  const comp = player();
  comp.attack(0, humanBoard);
  comp.attack(10, humanBoard);
  expect(humanBoard.getMisses().length).toBe(2);
});
