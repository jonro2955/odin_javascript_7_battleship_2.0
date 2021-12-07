import Ship from '../src/ship';

test('create ships and check their ids, lengths and isSunk values', () => {
  const carrierCoords = [
    { x: 0, y: 0, hit: false },
    { x: 0, y: 1, hit: false },
    { x: 0, y: 2, hit: false },
    { x: 0, y: 2, hit: false },
    { x: 0, y: 2, hit: false },
  ];
  const patrolCoords = [
    { x: 0, y: 0, hit: false },
    { x: 0, y: 1, hit: false },
  ];

  const carrier = Ship('carrier', carrierCoords);
  const patrol = Ship('patrol', patrolCoords);

  expect(carrier.getLength()).toBe(5);
  expect(patrol.getLength()).toBe(2);

  expect(carrier.getID()).toBe('carrier');
  expect(patrol.getID()).toBe('patrol');

  patrol.hit({ x: 0, y: 0 });
  expect(patrol.isSunk()).toBe(false);
  patrol.hit({ x: 0, y: 1 });
  expect(patrol.isSunk()).toBe(true);
});

//npm run test
