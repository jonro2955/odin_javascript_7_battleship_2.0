import Data from '../src/data';

/**dragNDrop(hBoard, startGameCallBack):
 * @param hBoard: gameBoard object.
 * @param startGameCallBack: A callback function to start the game once
 * the hBoard is populated.
 */
const dragNDrop = (hBoard, startGameCallBack) => {
  /**
  1. Display a setup grid 
  */
  const humanSetupGrid = document.querySelector('#humanSetupGrid');
  //first clear humanSetupGrid, since dragNDrop() will be reused on restarts
  humanSetupGrid.innerHTML = '';
  const setupBoardLabel = document.createElement('div');
  humanSetupGrid.append(setupBoardLabel);
  const setupContainer = document.createElement('div');
  setupContainer.classList.add('grid');
  for (let x = 0; x < 10; x++) {
    const column = document.createElement('span');
    column.classList.add('column');
    setupContainer.append(column);
    for (let y = 0; y < 10; y++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      const cellID = 'setup' + x + y;
      cell.setAttribute('id', cellID);
      cell.setAttribute('data-column', x);
      cell.setAttribute('data-row', y);
      column.append(cell);
    }
  }
  humanSetupGrid.append(setupContainer);
  humanSetupGrid.style.display = 'initial';

  /**
  2. Insert and wire up the orientation toggle button
  */
  const orientationBtn = document.createElement('button');
  orientationBtn.setAttribute('id', 'orientationBtn');
  orientationBtn.textContent = 'Horizontal';
  humanSetupGrid.append(orientationBtn);
  orientationBtn.addEventListener('click', () => {
    if (orientationBtn.textContent !== 'Horizontal') {
      orientationBtn.textContent = 'Horizontal';
    } else {
      orientationBtn.textContent = 'Vertical';
    }
  });

  /**
  3. Put hover listeners in each cell so that upon hover,  
  we get a pre-rendering of the current ship.
  
  If the user hovers to a cell which cannot be used as the origin 
  of the current ship as it will not fit, then there should be no 
  pre-rendering.
  */

  /**setMouseListeners(shipNum, hBoard):
   * https://jsdoc.app/about-getting-started.html 

   * @param shipNum: A number used to access a ship in Data().fleet
   * @param hBoard: gameBoard object passed in from the parent function
   *
   * Adds mouse event listeners to cells in humanSetupGrid.
   *
   * On hover, the proposed ship cells are highlighted given
   * the current ship's length and its orientation (if it fits).
   *
   * On click, the ship gets placed on the hBoard if it fits.
   * If it did fit, currentShip # is reduced by 1 and the function will
   * call itself with this new reduced parameter to replace the mouse
   * event listeners for the next ship in the fleet.
   *
   * On the first click, it will place ship #4, the carrier,
   * then it will call itself with a new parameter, shipNum = 3.
   * Once all 5 ships have been placed (when shipNum = -1), the
   * callback startGameCallBack() is called to run the startGamePlay()
   * function in index.js
   */
  function setMouseListeners(shipNum, hBoard) {
    setupBoardLabel.textContent = `Place ${Data().fleet[shipNum]['id']}`;
    setupBoardLabel.setAttribute('class', 'blink');
    humanSetupGrid.querySelectorAll('.cell').forEach((cell) => {
      cell.onmouseover = () => {
        //preview ship placement if it fits at currently hovered cell
        let startingCoord = {
          x: cell.getAttribute('data-column'),
          y: cell.getAttribute('data-row'),
        };
        let vessel = Data().fleet[shipNum];
        let isVertical =
          orientationBtn.textContent === 'Horizontal' ? true : false;
        let coords = hBoard.calculateCoords(startingCoord, vessel, isVertical);
        if (hBoard.fitsInBoard(coords)) {
          coords.forEach((coord) => {
            let x = coord['x'];
            let y = coord['y'];
            let id = 'setup' + x + y;
            document.getElementById(id).classList.add('proposedCell');
          });
        }
      };
      cell.onmouseout = () => {
        //remove preview highlighting from all cells on mouseout
        humanSetupGrid.querySelectorAll('.cell').forEach((cell) => {
          cell.classList.remove('proposedCell');
        });
      };
      cell.onclick = () => {
        //place ship at clicked cell if it fits
        let startingCoord = {
          x: cell.getAttribute('data-column'),
          y: cell.getAttribute('data-row'),
        };
        let vessel = Data().fleet[shipNum];
        let isVertical =
          orientationBtn.textContent === 'Horizontal' ? true : false;
        let placedCoords = hBoard.placeShip(startingCoord, vessel, isVertical);
        if (placedCoords) {
          hBoard.makeSurroundingCellsUnavailable(placedCoords);
          currentShip--;
          //mark occupied cells
          placedCoords.forEach((coord) => {
            let x = coord['x'];
            let y = coord['y'];
            let id = 'setup' + x + y;
            document.getElementById(id).classList.remove('proposedCell');
            document.getElementById(id).classList.add('occupiedCell');
          });
        }
        if (currentShip >= 0) {
          //reset cell listeners with new currentShip
          setMouseListeners(currentShip, hBoard);
        } else {
          //start gameplay
          humanSetupGrid.style.display = 'none';
          startGameCallBack();
        }
      };
    });
  }

  //starting ship number
  let currentShip = 4;
  setMouseListeners(currentShip, hBoard);
};

export default dragNDrop;
