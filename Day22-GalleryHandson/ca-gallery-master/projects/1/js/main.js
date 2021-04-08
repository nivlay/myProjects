'use strict';
const MINE_IMG = '🦠';
const EMPTY_IMG = '';
const FLAGE_IMG = '🚩';
var gBoard;
var gLevel = { SIZE: 4, MINES: 2, LIFE: 2 };
var gTimerInterval;
var gDuration;
var gGame;
var gSafeClickCount;
var gFirstClick = true;
var gHints;
var gHintsCount;

function initGame() {
  var elEmoji = document.querySelector('.emoji');
  var elH2 = document.querySelector('h2');
  var elScore = document.querySelector('.score span');
  var elSafeClickCount = document.querySelector(`.hints span`);
  var elHints = document.querySelectorAll(`.hints p`);
  elH2.style.display = 'none';
  elScore.innerText = 0;
  elEmoji.innerText = '😁';

  for (var i = 0; i < elHints.length; i++) {
    elHints[i].innerText = '🌕';
  }

  gGame = { isOn: false, shownCount: 0, markedCount: 0 };
  // if (!gGame.isOn) {
  //   gGame.isOn = true;
  // }
  gHints = false;
  gHintsCount = 3;
  gDuration = 0;
  gSafeClickCount = 3;
  elSafeClickCount.innerText = gSafeClickCount;
  gTimerInterval = null;
  gBoard = getBoard();
  changeLevel();
  renderBoard(gBoard);
  renderTimer();
}

function getBoard() {
  var board = createMat(gLevel.SIZE);
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
      board[i][j] = cell;
    }
  }

  return board;
}

function changeLevel() {
  var elLife = document.querySelector('.life span');

  if (gBoard.length === 4) {
    gLevel.LIFE = 2;
    elLife.innerText = 2;
  } else if (gBoard.length === 8) {
    gLevel.LIFE = 3;
    elLife.innerText = 3;
  } else {
    gLevel.LIFE = 4;
    elLife.innerText = 4;
  }
}

function getRandomMines(board, i, j) {
  for (var mines = 0; mines < gLevel.MINES; mines++) {
    var randomI = getRandomInt(0, board.length - 1);
    var randomJ = getRandomInt(0, board.length - 1);
    while (board[randomI][randomJ].isMine || (randomI === i && randomJ === j)) {
      randomI = getRandomInt(0, board.length - 1);
      randomJ = getRandomInt(0, board.length - 1);
    }
    board[randomI][randomJ].isMine = true;
  }
}

function renderBoard(board) {
  var strHTML = '<table border="1"><tbody>';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < board[0].length; j++) {
      var className = `cell cell${i}-${j} `;
      strHTML += `<td oncontextmenu="onRightClick(event,${i},${j})" onClick="cellClicked(${i},${j})" class="${className}"></td>`;
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';

  var elContainer = document.querySelector('.board-container');
  elContainer.innerHTML = strHTML;
}

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      board[i][j].minesAroundCount = getMinesCount(board, i, j);
    }
  }
}

function getMinesCount(board, row, col) {
  var count = 0;
  for (var i = row - 1; i <= row + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = col - 1; j <= col + 1; j++) {
      if (j < 0 || j >= board[0].length) continue;
      if (i === row && j === col) continue;
      if (board[i][j].isMine) count++;
    }
  }

  return count;
}

function expandShown(board, row, col) {
  var cell = board[row][col];
  if (cell.isShown) return;

  cell.isShown = true;
  gGame.shownCount++;
  if (cell.minesAroundCount > 0) {
    renderCell(row, col, cell.minesAroundCount);
    return;
  }
  renderCell(row, col, EMPTY_IMG);

  for (var i = row - 1; i <= row + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = col - 1; j <= col + 1; j++) {
      if (j < 0 || j >= board[0].length) continue;
      if (i === row && j === col) continue;
      expandShown(board, i, j);
    }
  }
}

function cellClicked(i, j) {
  if (gFirstClick) {
    gGame.isOn = true;
    getRandomMines(gBoard, i, j);
    setMinesNegsCount(gBoard, i, j);
    renderBoard(gBoard);
    gFirstClick = false;
  }
  var elH2 = document.querySelector('h2');
  var elH3 = document.querySelector('h3');
  var cell = gBoard[i][j];
  var elBtn = document.querySelector('.emoji');
  var elLife = document.querySelector('.life span');
  elLife.innerText = gLevel.LIFE;
  // if (gHints) {
  //   exposeHints(i, j);
  //   gHints = false;
  //   return;
  // }

  if (!gTimerInterval) {
    createTimer();
  }

  if (!cell.isShown) {
    cell.isShown = true;
    if (!cell.isMine) {
      gGame.shownCount++;
    }
  }
  if (cell.isMarked) {
    return;
  }
  if (cell.isMine) {
    if (gLevel.LIFE > 0) {
      gLevel.LIFE--;
      elLife.innerText = gLevel.LIFE;
      elH3.style.display = 'block';
      cell.isShown = false;
      setTimeout(function () {
        elH3.style.display = 'none';
      }, 2000);
    } else {
      handleMine();
      renderCell(i, j, MINE_IMG);
      gGame.isOn = false;
      clearInterval(gTimerInterval);
      gTimerInterval = null;
      elBtn.innerText = '😭';
      elH2.style.display = 'block';
      elH2.innerText = 'Game Over';
    }
  } else if (cell.minesAroundCount > 0) {
    renderCell(i, j, cell.minesAroundCount);
    checkGameOver();
  } else if (cell.minesAroundCount === 0) {
    //cell.isShown = false;
    //gGame.shownCount--;
    //expandShown(gBoard, i, j);
    renderCell(i, j, EMPTY_IMG);
    checkGameOver();
  }
}

function onRightClick(ev, i, j) {
  ev.preventDefault();
  if (!gGame.isOn) return;
  if (!gTimerInterval) {
    createTimer();
  }
  var cell = gBoard[i][j];
  if (cell.isShown) return;
  if (!cell.isMarked) {
    cell.isMarked = true;
    gGame.markedCount++;
    renderCell(i, j, FLAGE_IMG);
  } else {
    cell.isMarked = false;
    gGame.markedCount--;
    renderCell(i, j, EMPTY_IMG);
  }
  checkGameOver();
}

function renderCell(i, j, value) {
  var elCell = document.querySelector(`.cell${i}-${j}`);
  var cell = gBoard[i][j];
  if (cell.isShown) {
    elCell.style.backgroundColor = 'rgb(181, 115, 126)';
  } else {
    elCell.style.backgroundImage = 'url("../img/abstract.jpeg")';
  }
  elCell.innerText = value;
}

function renderEmptyCell(i, j) {
  var elCell = document.querySelector(`.cell${i}-${j}`);

  elCell.style.backgroundImage = 'url("../img/abstract.jpeg")';
  elCell.innerText = EMPTY_IMG;
}

function handleMine() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true;
        renderCell(i, j, MINE_IMG);
      }
    }
  }
}

function checkGameOver() {
  var elH2 = document.querySelector('h2');
  var elBtn = document.querySelector('.emoji');
  var elScore = document.querySelector('.score span');

  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (
        gGame.markedCount === gLevel.MINES &&
        gGame.shownCount === gLevel.SIZE ** 2 - gLevel.MINES
      ) {
        elH2.innerText = 'You are a winner!';
        elH2.style.display = 'block';
        elBtn.innerText = '😎';
        if (gDuration < 60) {
          elScore.innerText = `  ${gDuration} Sec`;
        } else {
          elScore.innerText = `  ${gDuration} Min`;
        }
        clearInterval(gTimerInterval);
      }
    }
  }
}

function resetGame() {
  clearInterval(gTimerInterval);
  gTimerInterval = null;
  gGame = { isOn: false, shownCount: 0, markedCount: 0 };
  gFirstClick = true;
  initGame();
}

function getDifficulty(elBtn) {
  if (elBtn.getAttribute('class') === 'difficulty beginner') {
    gLevel = { SIZE: 4, MINES: 2, LIFE: 2 };
  }
  if (elBtn.getAttribute('class') === 'difficulty medium') {
    gLevel = { SIZE: 8, MINES: 12, LIFE: 3 };
  }
  if (elBtn.getAttribute('class') === 'difficulty expert') {
    gLevel = { SIZE: 12, MINES: 30, LIFE: 4 };
  }
  clearInterval(gTimerInterval);
  gTimerInterval = null;
  gFirstClick = true;
  initGame();
}

function handleSafeClick() {
  var elSafeClickCount = document.querySelector(`.hints span`);
  if (!gSafeClickCount) return;
  var randomI = getRandomInt(0, gBoard.length - 1);
  var randomJ = getRandomInt(0, gBoard.length - 1);
  var cell = gBoard[randomI][randomJ];
  while (cell.isShown || cell.isMine) {
    randomI = getRandomInt(0, gBoard.length - 1);
    randomJ = getRandomInt(0, gBoard.length - 1);
    cell = gBoard[randomI][randomJ];
  }
  var elCell = document.querySelector(`.cell${randomI}-${randomJ}`);
  elCell.style.boxShadow = '10px 10px 10px yellow';
  setTimeout(function () {
    elCell.style.boxShadow = '0 0 0 0 yellow';
  }, 1000);
  gSafeClickCount--;
  elSafeClickCount.innerText = gSafeClickCount;
}

function handleHints(elBtn) {
  if (!gGame.isOn) return;
  if (gHintsCount > 0) {
    elBtn.innerText = '🌑';
    gHints = true;
    gHintsCount--;
  } else {
    gHints = false;
  }
}

function exposeHints(row, col) {
  for (var i = row - 1; i <= row + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = col - 1; j <= col + 1; j++) {
      if (j < 0 || j >= gBoard[0].length) continue;
      var cell = gBoard[i][j];
      cell.isShown = true;
      if (cell.isMine) {
        renderCell(i, j, MINE_IMG);
      } else if (cell.minesAroundCount > 0) {
        renderCell(i, j, cell.minesAroundCount);
      } else {
        renderCell(i, j, EMPTY_IMG);
      }

      setTimeout(function () {
        hideHints(row, col);
      }, 1000);
    }
  }
}

function hideHints(row, col) {
  for (var i = row - 1; i <= row + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = col - 1; j <= col + 1; j++) {
      if (j < 0 || j >= gBoard[0].length) continue;
      var cell = gBoard[i][j];
      cell.isShown = false;
      renderCell(i, j, EMPTY_IMG);
    }
  }
}

function createTimer() {
  gTimerInterval = setInterval(function () {
    gDuration++;
    renderTimer();
  }, 2000);
}

function renderTimer() {
  var elTimer = document.querySelector('.timer span');
  elTimer.innerText = new Date(gDuration * 1000).toISOString().substr(11, 8);
}



function clickBtn(elBtn) {
  var currCorrectOpt = gQuests[gCurrQuestIdx].correctOptIndex
  var currQstIdx = gQuests[ gCurrQuestIdx ];
  if (elBtn.innerText === currQstIdx.opt[currCorrectOpt]) {
    gCurrQuestIdx++
    if (gCurrQuestIdx < gQuests.length)
      renderQuest()
    if (gCurrQuestIdx === gQuests.length) winModal()

  }
}