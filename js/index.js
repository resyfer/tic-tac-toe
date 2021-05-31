var choices = ['', 'X', 'O']; //Available choice...Index 0 kept empty to match index with playerTurn

var playerTurn = 1; //First Player at start

//A board representing the game state. 0 is empty, 1 is X, 2 is O
var board =
[
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];

//HTML elements with class box
var boxesList = document.getElementsByClassName('box-content');

//Element to display player's turn
var playerTurnDisplay = document.getElementById('player-turn-number');

//Game Over
var gameOverScreen = document.getElementById('game-over'); //Game Over Screen
var playerWinnerDisplay = document.getElementById('player-winner'); //Which player Won

//Play again button with reload on click
var playAgain = document.getElementById('play-again');
playAgain.addEventListener('click', ()=> {
  location.reload();
})

//Mapping the box elements as a 3*3 matrix for easier management
var boardElem = [];
for(let i = 0; i<3; i++) {
  boardElem.push([]);
  for(let j = 0; j<3; j++) {
    boardElem[i][j] = boxesList[(i*3) + j];
  }
}

//Adding on click event listeners to the boxes to progress the game
for(let i = 0; i<3; i++) {
  for(let j = 0; j<3; j++) {
    boardElem[i][j].addEventListener('click', ()=> {
      turnUpdate(i, j);
    })
  }
}

function turnUpdate(i, j) {

  //Incorrect choice if box is already filled
  if(board[i][j] != 0) {
    alert('Incorrect choice, please pick a different square');
    return;
  }

  board[i][j] = playerTurn; //fills the matrix with the player number to mark their choices
  
  boardElem[i][j].innerHTML = choices[playerTurn]; // Adds X or O depending on the player's turn

  if(playerTurn == 1) {
    boardElem[i][j].classList.add('x'); //Adds class x to one marked X for distinct coloring
  } else {
    boardElem[i][j].classList.add('o'); //Adds class o to one marked O for distinct coloring
  }

  //Checks for win situtation for each player
  for(let i = 1; i<choices.length; i++) {
    if(gameWinCondition(i)) { //Checks if player i won
      gameWin(i); //Player i won
      return;
    }
  }

  gameDraw(); //Checks for draw situation

  playerTurn = (playerTurn % 2) + 1; //Change the player turn
  
  playerTurnDisplay.innerHTML = playerTurn; //Update player turn display
}

/*
  The board var is mapping which player has made a move on a particular block.
  
  ith player, if plays a move on block board[i][j], sets board[i][j] to i.
*/
function gameWinCondition(i) {
  let row = winRow(i); //checks if player i has a winning condition in row
  let column = winColumn(i); //checks if player i has a winning condition in column
  let diagonal = winDiagonal(i); //checks if player i has a winning condition in diagonal

  return (row || column || diagonal); //true if any one is a satisyfing winning condition
}

//Checks rows for match with player i
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

//Checks columns for match with player i
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
  //Check right to left diagonal for win condition or left to right diagonal
  return (winL2RDiagonal(i) || winR2LDiagonal(i));
}

//Checks left to right diagonal for match with player i
function winL2RDiagonal(i) {
  let count = 0;
  for(let j = 0; j<3; j++) {
    if(board[j][j] == i) count++;
  }

  if(count == 3) return true;
  return false;
}

//Checks right to left diagonal for match with player i
function winR2LDiagonal(i) {
  let count = 0;
  for(let j = 0; j<3; j++) {
    if(board[j][2-j] == i) count++;
  }

  if(count == 3) return true;
  return false;
}

function gameDraw() {
  /*
    gameDraw gets called when gameWinCondition is false. So, nobody has won. So
    gameDraw checks if all squares are filled or not, since it's given that nobody
    has won.
  */
  let count = 1;
  for(let i = 0; i<3; i++) {
    for(let j = 0; j<3; j++) {
      count*=board[i][j];
    }
  }

  //GameOver Screen for draw
  if(count != 0) {
    gameOverScreen.style.display = "block";
    playerWinnerDisplay.innerHTML = "Players Draw!!!";
  }
}

//GameOver Screen for Win for player i
function gameWin(i) {
  gameOverScreen.style.display = "block";
  playerWinnerDisplay.innerHTML = "Player " + i + " Wins!!!";
}