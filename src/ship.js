/**A ship has an id and a set of coordinates.
 * The id is a string like 'carrier'.
 * The coords will be array of objects, each  having x, y, and hit values like
 * [{x: 0, y: 0, hit: false}, {x: 0, y: 1, hit: true}, {x: 0, y: 2, shot: false}]
 */
const ship = (id, coordinates) => {
  let coords = coordinates;

  function getID() {
    return id;
  }

  function getCoords() {
    return coords;
  }

  function getLength() {
    return coords.length;
  }

  /**location input will have the structure: {x:0, y:0}*/
  function hit(location) {
    coords.forEach((coord) => {
      if (coord['x'] === location['x'] && coord['y'] === location['y']) {
        // if (coord == location) {
        coord['hit'] = true;
      }
    });
  }

  function isSunk() {
    return coords.every((coord) => {
      return coord['hit'] === true;
    });
  }

  return { getID, getCoords, getLength, hit, isSunk };
};

export default ship;
