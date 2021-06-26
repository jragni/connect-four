/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

/** Game
 * class Game creates game 
 */

class Game {
  
  /** Attributes */
  height;  // height of the board
  width;  // width of the board
  currPlayer;  // either player one or player two
  board = [];  // state of the game board

  constructor(width = 7, height = 6){
    
    // initialize game state and board
    this.height = width;
    this.width = height;
    //Player handler
    let playerOne = new Player(document.getElementById("p1Input").value);
    let playerTwo = new Player(document.getElementById('p2Input').value);
    this.currPlayer = 1;
    // binding 
    this.handleClick = this.handleClick.bind(this);
    this.startGame = this.startGame.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
    // start game upon button start
    this.makeHtmlBoard();
    this.makeBoard();
    const startButton = document.getElementById("start");
    startButton.addEventListener("click", this.startGame);

    
  }

  /** start game: start game by creating event listener for mouseclicks */

  startGame(evt){
    evt.preventDefault();
    let clickListener = document.getElementById("column-top")
    // if click listener exists, disable click listener, otherwise enable
    let isListeningForClick = clickListener.getAttribute("listening");
    if(isListeningForClick == 'true'){
      clickListener.removeEventListener('click', this.handleClick);
      clickListener.setAttribute('listening', false);
      this.resetBoard();
    }else{
      clickListener.addEventListener('click', this.handleClick);
      clickListener.setAttribute('listening', true)
    }
    
    // reset html board
  }

  /** resetBoard: resets in-JS board Structure and HTML */
  
  resetBoard(){
    // set the entire board value to null and remove html
    for(let y = 0; y < this.height; y++){
      for(let x = 0; x < this.width; x++ ){
        let htmlPiece = document.getElementById(`${y}-${x}`); 
        this.board[y][x] = null;
        if(htmlPiece.childNodes[0]){
          htmlPiece.childNodes[0].remove();
        }
        
      } 
    }
    
  }
  /** makeBoard: create in-JS board structure:
  *   board = array of rows, each row is array of cells  (board[y][x])
  */
  //TODO: Modify code so that make board calls on the methods and attributes
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }
  /** makeHtmlBoard: make HTML table and row of column tops. */
  
  makeHtmlBoard() {
    const board = document.getElementById('board');
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.setAttribute('listening', 'false')

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${this.currPlayer}`);
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
    let clickListener = document.getElementById("column-top");
    clickListener.removeEventListener("click", this.handleClick)
  }


  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)

    const y = this.findSpotForCol(x)
    if (y === null) {
      return;
    }
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    } 
    // switch players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    let currentGame = this;
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < currentGame.height &&
          x >= 0 &&
          x < currentGame.width &&
          currentGame.board[y][x] === currentGame.currPlayer
      );
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
  // TODO: make a method to restart the game
} 

/**
 * Player: class that sets the player and color
 */
class Player{
  constructor(color){
    this.color = color;
  }
}

let game = new Game(6,7);



/** Commented out for refactoring */
