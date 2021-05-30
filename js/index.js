var choices = ['', 'X', 'O'];

var playerTurn = 1;

var board =
[
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];

var boxesList = document.getElementsByClassName('box-content');

var playerTurnDisplay = document.getElementById('player-turn-number');

var gameOverScreen = document.getElementById('game-over');
var playerWinnerDisplay = document.getElementById('player-winner');

var playAgain = document.getElementById('play-again');
playAgain.addEventListener('click', ()=> {
  location.reload();
})

var boardElem = [];
for(let i = 0; i<3; i++) {
  boardElem.push([]);
  for(let j = 0; j<3; j++) {
    boardElem[i][j] = boxesList[(i*3) + j];
  }
}

for(let i = 0; i<3; i++) {
  for(let j = 0; j<3; j++) {
    boardElem[i][j].addEventListener('click', ()=> {
      turnUpdate(i, j);
    })
  }
}

function turnUpdate(i, j) {

  if(board[i][j] != 0) {
    console.log(board[i][j]);
    alert('Incorrect choice, please pick a different square');
    return;
  }

  board[i][j] = playerTurn;
  boardElem[i][j].innerHTML = choices[playerTurn];

  if(playerTurn == 1) {
    boardElem[i][j].classList.add('x');
  } else {
    boardElem[i][j].classList.add('o');
  }
  playerTurnDisplay.innerHTML = playerTurn;

  for(let i = 1; i<choices.length; i++) {
    if(gameWinCondition(i)) {
      gameWin(i);
      return;
    }
  }

  gameDraw();

  playerTurn = (playerTurn % 2) + 1;
}

function gameWinCondition(i) {
  let row = winRow(i);
  let column = winColumn(i);
  let diagonal = winDiagonal(i);

  return (row || column || diagonal);
}

function winRow(i) {
  for(let j = 0; j<3; j++) {
    let count = 0;
    for(let k = 0; k<3; k++) {
      if(board[j][k] == i) count++;
    }
    if(count == 3) return true;
  }
  return false;
}

function winColumn(i) {
  for(let j = 0; j<3; j++) {
    let count = 0;
    for(let k = 0; k<3; k++) {
      if(board[k][j] == i) count++;
    }
    if(count == 3) return true;
  }
  return false;
}

function winDiagonal(i) {
  return (winL2RDiagonal(i) || winR2LDiagonal(i));
}

function winL2RDiagonal(i) {
  for(let j = 0; j<board[0].length; j++) {
    let count = 0;
    for(let k = 0; j+k<board[0].length; k++) {
      if(board[k][j+k] == i) {
        count++;
        if(count >= 3) return true;
      } else {
        count = 0;
      }
    }
  }
  
  for(let j = 0; j<board[0].length; j++) {
    let count = 0;
    for(let k = 0; j+k<board[0].length; k++) {
      if(board[j+k][k] == i) {
        count++;
        if(count >= 3) return true;
      } else {
        count = 0;
      }
    }
  }

  return false;
}

function winR2LDiagonal(i) {
  for(let j = 0; j<board[0].length; j++) {
    let count = 0;
    for(let k = 0; j-k>=0; k++) {
      if(board[k][j-k] == i) {
        count++;
        if(count >= 3) return true;
      } else {
        count = 0;
      }
    }
  }

  for(let j = 0; j<board[0].length; j++) {
    let count = 0;
    for(let k = 0; j+k<board[0].length; k++) {
      if(board[j + k][board[0].length - 1 -k] == i) {
        count++;
        if(count >= 3) return true;
      } else {
        count = 0;
      }
    }
  }

  return false;
}

function gameDraw() {
  let count = 1;
  for(let i = 0; i<3; i++) {
    for(let j = 0; j<3; j++) {
      count*=board[i][j];
    }
  }

  if(count != 0) {
    gameOverScreen.style.display = "block";
    playerWinnerDisplay.innerHTML = "Players Draw!!!";
  }
}

function gameWin(i) {
  gameOverScreen.style.display = "block";
  playerWinnerDisplay.innerHTML = "Player " + i + " Wins!!!";
}