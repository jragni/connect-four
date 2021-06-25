"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

var currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])


/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // Game mechanics code  -- to keep track of the game state
  for(let row = 0; row < HEIGHT; row++){
    let currentRow = [];
    for(let columns = 0; columns < WIDTH; columns++){
      currentRow.push(null);
    }
    board.push(currentRow);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  
  let htmlBoard = document.getElementById('board');

  // Creates row for user interface to handle which column player selects to drop game piece.
  var top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  var clearButton = document.getElementById("reset-button").addEventListener("click", resetBoard);

  // Creates column for user interface to handle which column player selects to drop game piece.
  for (var x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (var y = 0; y < HEIGHT; y++) {

    let currRow = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      let currCell = document.createElement("td");
      currCell.id = `${y}-${x}`
      currRow.append(currCell);
    }
    htmlBoard.append(currRow);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] === null) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  let piece = document.createElement("div");
  piece.className = "piece";
  piece.classList.add(`p${currPlayer}`)
  let target = document.getElementById(`${y}-${x}`);
  target.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // board.every(row => row.every(col => col !== null)))
  if (board[0].every(cell => cell)) {
    return endGame('Tie!');
  }

  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */

  /**
   * _wins 
   * @param {*} cells -- list of coordinates of the game state board 
   */

  function _win(cells) {
    let [y, x] = cells[0];  
    let currentPlayer = board[y][x];
    if (currentPlayer !== null) {

      return cells.every( cell => {
        return validCoord(cell) && board[cell[0]][cell[1]] === currentPlayer
      })

    }    
    return false;
  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
     

      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x] ] ;
      let diagDL = [ [y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      let diagDR = [ [y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

/** Takes in coordinate and returns boolean if X and Y are valid */
function validCoord(coord) {
  let [y, x] = [coord[0], coord[1]]
  if (x >= WIDTH || x < 0 || y >= HEIGHT || y < 0) {
    return false;
  } 
  return true;
}

function resetBoard(evt){
  evt.preventDefault();

  for(let y = 0; y < HEIGHT; y++){
    for(let x = 0; x < WIDTH; x++){
      // check the game board's value if its 
      board[y][x] = null;
      // remove the html chip
      let currentCell = document.getElementById(`${y}-${x}`);
    
      if(currentCell.children[0]){
        currentCell.removeChild(currentCell.children[0]);
      }
    }
  }
  
}


makeBoard();
makeHtmlBoard();
