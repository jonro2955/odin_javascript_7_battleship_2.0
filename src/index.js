import Player from './player.js';
import GameBoard from './gameBoard';
import Dom from './dom';
import DragNDrop from './dragNDrop';

const human = Player();
const computer = Player();
const humanBoard = GameBoard('human');
const computerBoard = GameBoard('computer');
const dom = Dom();
const restartBtn = document.querySelector('#restartBtn');
let gameOver = false;
let aiOn = true;

const aiBtn = document.querySelector('#aiBtn');
aiBtn.addEventListener('click', () => {
  if (aiBtn.textContent === 'AI: On') {
    aiBtn.textContent = 'AI: Off';
    aiOn = false;
  } else {
    aiBtn.textContent = 'AI: On';
    aiOn = true;
  }
});

function shuffleModeStart() {
  gameOver = false;
  dom.clearAll();
  human.reset();
  humanBoard.reset();
  computer.reset();
  computerBoard.reset();
  humanBoard.shuffleAddShipsNoTouch();
  computerBoard.shuffleAddShipsNoTouch();
  dom.renderBoards(humanBoard, computerBoard);
  dom.activateAttackGrid(playerMove);
}

function dragNDropModeStart() {
  restartBtn.style.display = 'none';
  aiBtn.style.display = 'none';
  gameOver = false;
  dom.clearAll();
  humanBoard.reset();
  computerBoard.reset();
  computerBoard.shuffleAddShipsNoTouch();
  DragNDrop(humanBoard, activateGame);
}

function activateGame() {
  dom.renderBoards(humanBoard, computerBoard);
  dom.activateAttackGrid(playerMove);
  restartBtn.style.display = 'initial';
  aiBtn.style.display = 'initial';
}

function playerMove(e) {
  if (!gameOver) {
    const x = Number(e.target.getAttribute('data-column'));
    const y = Number(e.target.getAttribute('data-row'));
    const isHit = human.attack({ x, y }, computerBoard);
    if (isHit) {
      dom.markComputerBoardHit(e.target);
      dom.announceMsgH('HIT');
      dom.updateComputerSunk(computerBoard);
    } else {
      dom.markComputerBoardMiss(e.target);
      dom.announceMsgH('MISS');
    }
    if (computerBoard.allSunk()) {
      gameOver = true;
      dom.announceGameOver('Player Wins! Game Over');
      restartBtn.style.display = 'initial';
    } else {
      computerMove();
    }
  }
}

function computerMove() {
  let attackResult;
  if (!gameOver) {
    if (aiOn) {
      attackResult = computer.smartAttack(humanBoard);
    } else {
      attackResult = computer.randomAttack(humanBoard);
    }
    const lastMoveCoord =
      computer.getMoves()[computer.getMoves().length - 1]['coord'];
    if (attackResult) {
      dom.markHumanBoardHit(lastMoveCoord);
      dom.announceMsgC('HIT');
      dom.updateHumanSunk(humanBoard);
    } else {
      dom.markHumanBoardMiss(lastMoveCoord);
      dom.announceMsgC('MISS');
    }
    if (humanBoard.allSunk()) {
      gameOver = true;
      dom.announceGameOver('Computer Wins! Game Over');
      restartBtn.style.display = 'initial';
    }
  }
}

restartBtn.addEventListener('click', dragNDropModeStart);
dragNDropModeStart();

