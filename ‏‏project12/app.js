let player = "X";
let cells = document.querySelectorAll(".cell");

let scoreX = parseInt(localStorage.getItem("scoreX")) || 0;
let scoreO = parseInt(localStorage.getItem("scoreO")) || 0;

document.getElementById("scoreX").innerText = scoreX;
document.getElementById("scoreO").innerText = scoreO;

window.addEventListener("load", () => {
  loadGame();
});

function makeMove(cell) {
  if (cell.innerText === "") {
    cell.innerText = player;
    saveGame();
    let result = checkWinner();

    if (result === 1) {
      if (player === "X") {
        scoreX++;
        localStorage.setItem("scoreX", scoreX);
        document.getElementById("scoreX").innerText = scoreX;
      } else {
        scoreO++;
        localStorage.setItem("scoreO", scoreO);
        document.getElementById("scoreO").innerText = scoreO;
      }

      setTimeout(() => {
        alert("The winner is " + player);
        clearBoard();
      }, 100);
      return;
    }

    if (result === -1) {
      setTimeout(() => {
        alert("It's a draw!");
        clearBoard();
      }, 100);
      return;
    }

    player = player === "X" ? "O" : "X";
    localStorage.setItem("currentPlayer", player);
  }
}

function checkWinner() {
  let board = Array.from(cells).map((c) => c.innerText);

  if (
    (board[0] && board[0] === board[1] && board[1] === board[2]) ||
    (board[3] && board[3] === board[4] && board[4] === board[5]) ||
    (board[6] && board[6] === board[7] && board[7] === board[8]) ||
    (board[0] && board[0] === board[3] && board[3] === board[6]) ||
    (board[1] && board[1] === board[4] && board[4] === board[7]) ||
    (board[2] && board[2] === board[5] && board[5] === board[8]) ||
    (board[0] && board[0] === board[4] && board[4] === board[8]) ||
    (board[2] && board[2] === board[4] && board[4] === board[6])
  ) {
    return 1;
  }

  if (board.includes("")) return 0;
  return -1;
}

function saveGame() {
  let board = Array.from(cells).map((cell) => cell.innerText);
  localStorage.setItem("board", JSON.stringify(board));
  localStorage.setItem("currentPlayer", player);
}

function loadGame() {
  let savedBoard = JSON.parse(localStorage.getItem("board"));
  let savedPlayer = localStorage.getItem("currentPlayer");

  if (savedBoard && savedPlayer) {
    cells.forEach((cell, index) => {
      cell.innerText = savedBoard[index];
    });
    player = savedPlayer;
  }
}

function clearBoard() {
  cells.forEach((cell) => (cell.innerText = ""));
  player = "X";
  localStorage.removeItem("board");
  localStorage.removeItem("currentPlayer");
}

function resetGame() {
  localStorage.removeItem("scoreX");
  localStorage.removeItem("scoreO");
  document.getElementById("scoreX").innerText = "0";
  document.getElementById("scoreO").innerText = "0";
  clearBoard();
}

cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    makeMove(cell);
  });
});

let restartBtn = document.querySelector(".restart-button");
restartBtn.addEventListener("click", resetGame);
