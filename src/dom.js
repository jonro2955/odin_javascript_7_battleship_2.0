const dom = () => {
  const humanBox = document.querySelector('#humanBox');
  const computerBox = document.querySelector('#computerBox');
  const gameScreen = document.querySelector('#gameScreen');
  const restartBtn = document.querySelector('#restartBtn');
  const messageH = document.querySelector('#messageH');
  const messageC = document.querySelector('#messageC');

  function renderBoards(humanBoard, computerBoard) {
    const humanGrid = createGrid(humanBoard);
    humanBox.append(humanGrid);
    humanGrid.setAttribute('id', 'humanGrid');
    const computerGrid = createGrid(computerBoard);
    computerBox.append(computerGrid);
    computerGrid.setAttribute('id', 'computerGrid');
    gameScreen.style.display = 'flex';
    restartBtn.style.display = 'initial';
    document.querySelectorAll('.boardLabel').forEach((elem) => {
      elem.style.display = 'initial';
    });
  }

  function createGrid(gameBoard) {
    const grid = document.createElement('div');
    grid.classList.add('grid');
    for (let x = 0; x < 10; x++) {
      const column = document.createElement('span');
      column.classList.add('column');
      grid.append(column);
      for (let y = 0; y < 10; y++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        const cellID = gameBoard.getBoardID() + x + y;
        cell.setAttribute('id', cellID);
        cell.setAttribute('data-column', x);
        cell.setAttribute('data-row', y);
        //this if stmt makes only the human's board show ships
        if (gameBoard.getBoardID() === 'human') {
          //if the cell has a shipID key, it's occupied by a ship
          if (gameBoard.getBoard()[x][y]['shipID']) {
            cell.classList.add('occupiedCell');
          }
        }
        column.append(cell);
      }
    }
    return grid;
  }

  function removeExistingBoards() {
    humanBox.innerHTML = '';
    computerBox.innerHTML = '';
    document.querySelectorAll('.boardLabel').forEach((label) => {
      label.style.display = 'none';
    });
  }

  function activateAttackGrid(fn) {
    computerBox.querySelectorAll('.cell').forEach((cell) => {
      cell.addEventListener('click', fn, { once: true });
    });
  }

  function activateAIBtn(fn) {
    aiToggle.addEventListener('click', fn);
  }

  function announceMsgH(msg) {
    messageH.textContent = msg;
    setTimeout(() => {
      messageH.textContent = '';
    }, 500);
  }

  function announceMsgC(msg) {
    messageC.textContent = msg;
    setTimeout(() => {
      messageC.textContent = '';
    }, 500);
  }

  function markComputerBoardHit(clickedTarget) {
    clickedTarget.classList.add('hit');
  }

  function markComputerBoardMiss(clickedTarget) {
    clickedTarget.classList.add('miss');
  }

  function markHumanBoardHit(coord) {
    let x = coord['x'];
    let y = coord['y'];
    const concatCoord = 'human' + x.toString() + y.toString();
    document.getElementById(concatCoord).classList.add('hit');
  }

  function markHumanBoardMiss(coord) {
    const x = coord['x'];
    const y = coord['y'];
    const concatCoord = 'human' + x.toString() + y.toString();
    document.getElementById(concatCoord).classList.add('miss');
  }

  function announceGameOver(msg) {
    document.getElementById('gameOverMsg').textContent = msg;
  }

  function clearAll() {
    announceMsgH('');
    removeExistingBoards();
    announceGameOver('');
    computerSunkList.textContent = '';
    humanSunkList.textContent = '';
  }

  function updateHumanSunk(board) {
    const computerSunkList = document.querySelector('#computerSunkList');
    computerSunkList.textContent = '';
    let sunkShipsArray = board.getSunkShipsArray();
    sunkShipsArray.forEach((sunkShip) => {
      const elem = document.createElement('div');
      elem.textContent = `${sunkShip.getID()} Sunk\n`;
      computerSunkList.prepend(elem);
    });
  }

  function updateComputerSunk(board) {
    const humanSunkList = document.querySelector('#humanSunkList');
    humanSunkList.textContent = '';
    let sunkShipsArray = board.getSunkShipsArray();
    sunkShipsArray.forEach((sunkShip) => {
      const elem = document.createElement('div');
      elem.textContent = `${sunkShip.getID()} Sunk\n`;
      humanSunkList.prepend(elem);
    });
  }

  return {
    renderBoards,
    activateAttackGrid,
    announceMsgH,
    announceMsgC,
    removeExistingBoards,
    markComputerBoardHit,
    markComputerBoardMiss,
    markHumanBoardHit,
    markHumanBoardMiss,
    activateAIBtn,
    announceGameOver,
    clearAll,
    updateHumanSunk,
    updateComputerSunk,
  };
};

export default dom;
