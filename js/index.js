var choices = ['', 'X', 'O']; //Available choice...Index 0 kept empty to match index with playerTurn

var computer = 2
var currentPlayer = 1; //First Player at start
var computable = true;
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


//Mapping the box elements as a 3*3 matrix for easier management
var boardElem = [];
for(let i = 0; i<3; i++) {
  boardElem.push([]);
  for(let j = 0; j<3; j++) {
    boardElem[i][j] = boxesList[(i*3) + j];
  }
}

window.onload = function(){  
  if(computable==true){
  let a = compute();
  turnUpdate(a[0],a[1]);
  }
} 


//Adding on click event listeners to the boxes to progress the game
for(let i = 0; i<3; i++) {
  for(let j = 0; j<3; j++) {
    boardElem[i][j].addEventListener('click', ()=> {
      turnUpdate(i, j);
      if(computable){
      let a = compute();
      turnUpdate(a[0],a[1]);
      }
    })
  }
}

playAgain.addEventListener('click', ()=> {
  location.reload();
})


function turnUpdate(i, j) {

  //Incorrect choice if box is already filled
  if(board[i][j] != 0) {
    alert('Incorrect choice, please pick a different square');
    computable = false;
    return;
  }
  computable = true;
  board[i][j] = currentPlayer; //fills the matrix with the player number to mark their choices
  
  boardElem[i][j].innerHTML = choices[currentPlayer]; // Adds X or O depending on the player's turn

  if(currentPlayer == 1) {
    boardElem[i][j].classList.add('x'); //Adds class x to one marked X for distinct coloring
  } else {
    boardElem[i][j].classList.add('o'); //Adds class o to one marked O for distinct coloring
  }

  //Checks for win situtation for each player
  for(let i = 1; i<choices.length; i++) {
    if(gameWinCondition(i)) { //Checks if player i won
      computable = false;
      gameWin(i); //Player i won
      return;
    }
  }

  if(gameDraw())
    computable =  false; //Checks for draw situation

  currentPlayer = getNextPlayer(); //Change the player turn
  
  playerTurnDisplay.innerHTML = currentPlayer; //Update player turn display
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
    return true;
  }
  return false;
}

//GameOver Screen for Win for player i
function gameWin(i) {
  gameOverScreen.style.display = "block";
  playerWinnerDisplay.innerHTML = "Player " + i + " Wins!!!";
}

//Computer

function compute(){
  //record of empty boxes
  let record = [];
    for(let i = 0; i<3; i++)
      for(let j = 0; j<3; j++)
        if(board[i][j]==0)
          record.push([i, j]);
  record = shuffle(record);

  if(record.length == 8 &&
    (board[0][0] != 0 ||
      board[2][2] != 0 ||
      board[0][2] != 0 ||
      board[2][0] != 0
      ))
    return [1,1];

  //check for next step
    for(let i = 0; i<record.length; i++){
        if(checkWin(record[i][0], record[i][1], currentPlayer)){
          board[record[i][0]][record[i][1]] = 0;
          return(record[i]);
        }
        board[record[i][0]][record[i][1]] = 0;
    }
    
    for(let i = 0; i<record.length; i++){
      if(checkWin(record[i][0], record[i][1], getNextPlayer())){
        board[record[i][0]][record[i][1]] = 0;
        return(record[i]);
      }
      board[record[i][0]][record[i][1]] = 0;
  }
    
   //check for two steps
 
  for(let i = 0; i<record.length; i++){
      checkWin(record[i][0], record[i][1], currentPlayer);
        for(let j = 0; j<record.length; j++){
          if(j!=i){
            if(checkWin(record[j][0], record[j][1], currentPlayer)){
              board[record[i][0]][record[i][1]] = 0;
              board[record[j][0]][record[j][1]] = 0;
              if((Math.trunc(Math.random()*10))%2 == 0)
                return(record[i]);
              else
                return(record[j]);
            }
          }
          board[record[j][0]][record[j][1]] = 0; 
      }
      board[record[i][0]][record[i][1]] = 0;        
  }

  for(let i = 0; i<record.length; i++){
    checkWin(record[i][0], record[i][1], getNextPlayer());
      for(let j = 0; j<record.length; j++){
        if(j!=i){
          if(checkWin(record[j][0], record[j][1], getNextPlayer())){
            board[record[i][0]][record[i][1]] = 0;
            board[record[j][0]][record[j][1]] = 0;
            if((Math.trunc(Math.random()*10))%2 == 0)
              return(record[i]);
            else
              return(record[j]);
          }
        }
        board[record[j][0]][record[j][1]] = 0; 
    }
    board[record[i][0]][record[i][1]] = 0;        
}

  var choice = record[(Math.trunc(Math.random()*10))%record.length];
  return choice;

}



function checkWin(i, j, player) {
  if(board[i][j] != 0) {
    return false;
  }

  board[i][j] = player; //fills the matrix with the player number to mark their choices

  //Checks for win situation for each player
  if(gameWinCondition(player)){ //Checks if player i won

    return true;
  }

  return false;
}

function getNextPlayer(){
  return (currentPlayer % 2) + 1;
}

function shuffle(array) {
  var currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}