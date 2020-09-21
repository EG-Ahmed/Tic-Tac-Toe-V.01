Array.prototype.slice = function (start = 0, end = this.length, counter = 1) {
  let newList = [];
  while (start < end) {
    newList.push(this[start]);
    start += counter;
  }
  return newList;
};

/**
 **  App's state (variables)
 */
let board;
let turn = 'X';
let movements = 0;
const playerTurnText = "Player's turn: ";

/**
 **  Cached elements reference
 */
let boxes = Array.from(document.querySelectorAll('.box'));
const table = document.querySelector('#board');
let playerTurn = document.querySelector('.turn');

/**
 **  Functions
 */
// Render change in the game

handleCursor = (el) => {
  el.style.cursor = `url('../images/${table.dataset.mark}'), auto`;
};

const changeCursor = () => {
  boxes.forEach((el) => {
    el.addEventListener('mouseover', handleCursor(el));
  });
};

const removeCursor = () => {
  boxes.forEach((el) => {
    el.style.cursor = 'default';
  });
};

const resetBoard = () => {
  board = ['', '', '', '', '', '', '', '', ''];
  movements = 0;
};

const render = () => {
  board.forEach((mark, index) => {
    boxes[index].textContent = mark;
    boxes[index].setAttribute('data-index', index);
  });
  playerTurn.textContent = playerTurnText + 'X';
};
const init = () => {
  resetBoard();
  render();
  changeCursor();
  table.classList.toggle('playing');
};

const isWinner = (position) => {
  let isWinner;
  const topLeft = board[0] == turn;
  const topMid = board[1] == turn;
  const topRight = board[2] == turn;
  const midLeft = board[3] == turn;
  const midMid = board[4] == turn;
  const midRight = board[5] == turn;
  const bottomLeft = board[6] == turn;
  const bottomMid = board[7] == turn;
  const bottomRight = board[8] == turn;

  // check Is Winner Rows
  const isTopRow = topLeft && topMid && topRight;
  const isMidRow = midMid && midLeft && midRight;
  const isBottomRow = bottomLeft && bottomMid && bottomRight;

  // Check is winner Columns
  const isLeftColumn = topLeft && midLeft && bottomLeft;
  const isMidColumn = midMid && topMid && bottomMid;
  const isRightColumn = topRight && midRight && bottomRight;

  // check is Cross
  const isTopRightToBottomLeft = topRight && midMid && bottomLeft;
  const isTopLeftToBottomRight = topLeft && midMid && bottomRight;

  /**
   * helper functions
   */
  const changeColor = (elements) => {
    for (const el of elements) {
      el.childNodes[0].classList.toggle('winner');
      isWinner = true;
    }
  };

  const topRow = () => {
    elements = boxes.slice(0, 3);
    changeColor(elements);
  };

  const midRow = () => {
    elements = boxes.slice(3, 6, 1);
    changeColor(elements);
  };

  const bottomRow = () => {
    elements = boxes.slice(6);
    changeColor(elements);
  };

  const leftColumn = () => {
    elements = boxes.slice(0, boxes.length, 3);
    changeColor(elements);
  };

  const midColumn = () => {
    elements = boxes.slice(1, boxes.length, 3);
    changeColor(elements);
  };

  const rightColumn = () => {
    elements = boxes.slice(2, boxes.length, 3);
    changeColor(elements);
  };

  const TopLeftToBottomRight = () => {
    elements = boxes.slice(0, boxes.length, 4);
    changeColor(elements);
  };

  const TopRightToBottomLeft = () => {
    elements = boxes.slice(2, boxes.length - 1, 2);
    changeColor(elements);
  };
  switch (position) {
    // Top Level
    case 'top-left':
      if (isTopRow) {
        topRow();
      } else if (isLeftColumn) {
        leftColumn();
      } else if (isTopLeftToBottomRight) {
        TopLeftToBottomRight();
      }
      break;
    case 'top-mid':
      if (isTopRow) {
        topRow();
      } else if (isMidColumn) {
        midColumn();
      }
      break;
    case 'top-right':
      if (isTopRow) {
        topRow();
      } else if (isRightColumn) {
        rightColumn();
      } else if (isTopRightToBottomLeft) {
        TopRightToBottomLeft();
      }
      break;

    // Mid level
    case 'mid-left':
      if (isMidRow) {
        midRow();
      } else if (isLeftColumn) {
        leftColumn();
      }

      break;
    case 'mid-mid':
      if (isMidColumn) {
        midColumn();
      } else if (isMidRow) {
        midRow();
      } else if (isTopLeftToBottomRight) {
        TopLeftToBottomRight();
      } else if (isTopRightToBottomLeft) {
        TopRightToBottomLeft();
      }
      break;
    case 'mid-right':
      if (isLeftColumn) {
        leftColumn();
      } else if (isMidRow) {
        midRow();
      }
      break;

    // Bottom level
    case 'bottom-left':
      if (isLeftColumn) {
        leftColumn();
      } else if (isBottomRow) {
        bottomRow();
      } else if (isTopRightToBottomLeft) {
        TopRightToBottomLeft();
      }
      break;
    case 'bottom-mid':
      if (isBottomRow) {
        bottomRow();
      } else if (isMidColumn) {
        midColumn();
      }
      break;
    case 'bottom-right':
      if (isBottomRow) {
        bottomRow();
      } else if (isRightColumn) {
        rightColumn();
      } else if (isTopLeftToBottomRight) {
        TopLeftToBottomRight();
      }
      break;
  }

  return isWinner;
};

const endGame = () => {
  table.removeEventListener('click', handleTurn);
  table.classList.toggle('playing');
  removeCursor();
};

const handleTurn = (e) => {
  const target = e.target;
  const index = target.dataset.index;

  const toggleO = () => {
    turn = 'O';
    table.dataset.mark = 'iconmonstr-circle-2-64.png';
    playerTurn.textContent = playerTurnText + turn;
  };

  const toggleX = () => {
    turn = 'X';
    table.dataset.mark = 'iconmonstr-x-mark-2-48.png';
    playerTurn.textContent = playerTurnText + turn;
  };

  if (index) {
    // Update Mark in UI & State
    let markup;
    if (turn == 'X') {
      markup =
        '<div class="lock" style=":hover{background-color:rgba(119, 187, 63, 0.658)}"><i class="im im-x-mark icon"></i> </div>';
      target.insertAdjacentHTML('afterbegin', markup);
      board[index] = turn;
    } else {
      markup =
        '<div class="lock" style=":hover{background-color:rgba(119, 187, 63, 0.658)}"><i class="im im-circle-o icon"></i></div>';
      target.insertAdjacentHTML('afterbegin', markup);
      board[index] = turn;
    }

    // Update boxes
    movements++;

    if (!isWinner(target.dataset.position)) {
      if (turn == 'X') {
        toggleO();
      } else {
        toggleX();
      }
      // Update turns in State
      changeCursor();
      // e.target.classList.toggle('box');
      // e.target.classList.toggle('box-lock');

      if (movements == 9) {
        console.log('tie');
        playerTurn.textContent = 'Tie';
        endGame();
      }
      // Testing
    } else {
      // there's Winner

      if (turn == 'X') {
        playerTurn.textContent = 'Player One is Winner';
      } else if (turn == 'O') {
        playerTurn.textContent = 'Player Tow is Winner';
      }
      endGame();
    }
  }
};

const reset = () => {
  resetBoard();
  render();
  table.addEventListener('click', handleTurn);
  changeCursor();
  if (!table.classList.contains('playing')) {
    table.classList.toggle('playing');
  }
};

/**
 **  even listeners
 */

// Change turn
table.addEventListener('click', handleTurn);

// Reset button
document.querySelector('.btn-reset').addEventListener('click', reset);

// Start the game
init();
