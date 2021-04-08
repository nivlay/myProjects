'use strict';

var gDifficulty = 16;
var gNums;
var gCurrNum;
var gGameInterval;

function init() {
  gNums = resetNumbers();
  gCurrNum = 1;
  gGameInterval = null;
  renderBoard();
}

function renderBoard() {
  var strHtml = '';
  for (var i = 0; i < Math.sqrt(gDifficulty); i++) {
    strHtml += `<tr>`;
    for (var j = 0; j < Math.sqrt(gDifficulty); j++) {
      var num = shuffle();
      strHtml += `<td  onclick="cellClicked(this)">${num}</td>`;
    }
    strHtml += `</tr>`;
  }
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHtml;
}

function cellClicked(clickedNum) {
  var elH1 = document.querySelector('h1');
  var elResetBtn = document.querySelector('.reset');
  if (!gGameInterval) {
    createTimer();
  }
  if (parseInt(clickedNum.innerText) === gCurrNum) {
    gCurrNum++;
    clickedNum.style.backgroundColor = 'rgb(145, 1, 30)';
  }
  if (gCurrNum === gDifficulty + 1) {
    clearInterval(gGameInterval);
    gGameInterval = null;
    elH1.innerText = 'Victory!';
    elResetBtn.style.display = 'block';
  }
}

function resetGame(elBtn) {
  var elH1 = document.querySelector('h1');
  var elTimer = document.querySelector('#timer');
  clearInterval(gGameInterval);
  elH1.innerText = 'Touch The Numbers';
  elBtn.style.display = 'none';
  elTimer.style.display = 'none';
  init();
}

function getDifficulty(elBtn) {
  if (elBtn.getAttribute('id') === 'easy') gDifficulty = 16;
  if (elBtn.getAttribute('id') === 'hard') gDifficulty = 25;
  if (elBtn.getAttribute('id') === 'extreme') gDifficulty = 36;
  elTimer.style.display = 'none';
  clearInterval(gGameInterval);
  init();
}

function shuffle() {
  var idx = getRandomInt(0, gNums.length);
  var num = gNums[idx];
  gNums.splice(idx, 1);
  return num;
}

function resetNumbers() {
  var numbers = [];
  for (var i = 0; i < gDifficulty; i++) {
    numbers[i] = i + 1;
  }
  return numbers;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function createTimer() {
  var seconds = 0;
  var elTimer = document.querySelector('#timer');
  elTimer.style.display = 'block';
  elTimer.innerText = new Date(seconds * 1000).toISOString().substr(11, 8);
  gGameInterval = setInterval(function () {
    seconds++;
    elTimer.innerText = new Date(seconds * 1000).toISOString().substr(11, 8);
  }, 1000);
}
