'use strict';

var gQuests;
var gCurrQuestIdx = 0;
var gNextId = 1;

function initGame() {
  gQuests = createQuests();
  renderQuest();
}

function createQuest(opts, correctOptIndex) {
  var quest = {
    id: gNextId++,
    opts,
    correctOptIndex,
  };

  return quest;
}

function createQuests() {
  var quests = [];
  quests[0] = createQuest(['Pikachu', 'Charmander', 'Squirtle'], 0);

  quests[1] = createQuest(['Chikorita', 'Treecko', 'Totodile'], 0);

  quests[2] = createQuest(['Meow', 'MewTwo', 'Mew'], 2);

  return quests;
}

function renderQuest() {
  var currQuest = gQuests[gCurrQuestIdx];
  var strHtml = '';
  strHtml += `<tr><td><img src="img/${currQuest.id}.png"/></td></tr>`;
  var options = currQuest.opts;
  for (var i = 0; i < options.length; i++) {
    strHtml += `<tr><td onclick="checkAnswer(${i})">${options[i]}</td></tr>`;
  }
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHtml;
}

function checkAnswer(optIdx) {
  var correctOptIndex = gQuests[gCurrQuestIdx].correctOptIndex;
  var elH1 = document.querySelector('h1');
  var elBtn = document.querySelector('button');
  var elH3 = document.querySelector('h3');
  console.log(gCurrQuestIdx);
  if (gCurrQuestIdx < gQuests.length) {
    if (optIdx === correctOptIndex) {
      //add if else checks if this the last quest(victory) else move to net quest
      gCurrQuestIdx++;
      renderQuest();
    } else {
      elH3.style.display = 'block';
      setTimeout(function () {
        elH3.style.display = 'none';
      }, 800);
    }
  } else {
    elH1.innerText = 'Victory!!!';
    elBtn.style.display = 'block';
  }
}

function resetGame(elBtn) {
  var elH1 = document.querySelector('h1');
  gCurrQuestIdx = 0;
  renderQuest();
  elBtn.style.display = 'none';
  elH1.innerText = 'Choose the right answer:';
}


// if (gCurrQuestIdx < gQuests.length - 1) {
//   if (optIdx === correctOptIndex) {
//     gCurrQuestIdx++;
//     renderQuest();
//   } else {
//     elH3.style.display = 'block';
//     setTimeout(function () {
//       elH3.style.display = 'none';
//     }, 800);
//   }
// } else {
//   elH1.innerText = 'Victory!!!';
//   elBtn.style.display = 'block';
// }