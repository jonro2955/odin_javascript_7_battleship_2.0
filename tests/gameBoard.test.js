import GameBoard from '../src/gameBoard';
import Data from '../src/data';

test('gameBoard', () => {
  const myBoard = GameBoard();
  const origin = { x: 0, y: 0 };
  const patrol = Data().fleet[0];

  //calculateCoords()
  const patrolCoords = myBoard.calculateCoords(origin, patrol, false);
  expect(patrolCoords).toStrictEqual([
    { x: 0, y: 0, hit: false },
    { x: 1, y: 0, hit: false },
  ]);

  //fitsInBoard()
  const doesPatrolFit = myBoard.fitsInBoard(patrolCoords);
  expect(doesPatrolFit).toBeTruthy();

  //placeShip()
  myBoard.placeShip(origin, patrol, false);
  expect(myBoard.getBoard()[0][0]).toStrictEqual({
    shipID: 'patrol',
    hit: false,
  });
  expect(myBoard.getBoard()[1][0]).toStrictEqual({
    shipID: 'patrol',
    hit: false,
  });
  expect(myBoard.getBoard()[0][1]).toStrictEqual({ shipID: null });
  expect(myBoard.getBoard()[2][0]).toStrictEqual({ shipID: null });

  //getBoardShips(), Ship.getCoords()
  let patrolBoardShipCoords = myBoard.getBoardShips()[0].getCoords();
  expect(patrolBoardShipCoords).toStrictEqual([
    { hit: false, x: 0, y: 0 },
    { hit: false, x: 1, y: 0 },
  ]);

  //receiveAttack() 1, allSunk() should be falsy
  myBoard.receiveAttack({ x: 0, y: 0 });
  expect(myBoard.getBoard()[0][0]).toStrictEqual({
    shipID: 'patrol',
    hit: true,
  });
  expect(patrolBoardShipCoords).toStrictEqual([
    { hit: true, x: 0, y: 0 },
    { hit: false, x: 1, y: 0 },
  ]);
  expect(myBoard.allSunk()).toBeFalsy();

  //receiveAttack() 2, allSunk should be truthy
  myBoard.receiveAttack({ x: 1, y: 0 });
  expect(myBoard.getBoard()[1][0]).toStrictEqual({
    shipID: 'patrol',
    hit: true,
  });
  expect(patrolBoardShipCoords).toStrictEqual([
    { hit: true, x: 0, y: 0 },
    { hit: true, x: 1, y: 0 },
  ]);
  expect(myBoard.allSunk()).toBeTruthy();
});
