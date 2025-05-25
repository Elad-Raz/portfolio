document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");
  const winScreen = document.getElementById("win-screen");

  const player1Input = document.getElementById("player1");
  const player2Input = document.getElementById("player2");
  const levelSelect = document.getElementById("level");

  const startBtn = document.getElementById("startBtn");
  const newGameBtn = document.getElementById("newGameBtn");
  const hintBtn = document.getElementById("hintBtn");
  const restartBtn = document.getElementById("restartBtn");
  const menuBtn = document.getElementById("menuBtn");
  const menuFromWinBtn = document.getElementById("menuFromWinBtn");

  const gameBoard = document.getElementById("game-board");
  const turnIndicator = document.getElementById("turn-indicator");
  const scoreDisplay = document.getElementById("score");
  const winnerMessage = document.getElementById("winner-message");

  let players = [];
  let scores = [0, 0];
  let turn = 0;
  let hintsUsed = [false, false];
  let hintLocked = false;
  let firstCard = null;
  let secondCard = null;
  let lock = false;
  let totalMatches = 0;
  let totalPairs = 10;

  startBtn.onclick = () => {
    const p1 = player1Input.value.trim();
    const p2 = player2Input.value.trim();
    const level = levelSelect.value;

    if (!p1 || !p2) return;

    players = [p1, p2];
    scores = [0, 0];
    hintsUsed = [false, false];
    hintLocked = false;
    turn = 0;
    totalMatches = 0;

    document.body.className = level;

    if (level === "easy") totalPairs = 6;
    if (level === "medium") totalPairs = 10;
    if (level === "hard") totalPairs = 15;

    initGame();

    startScreen.classList.add("hidden");
    winScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
  };

  function initGame() {
    firstCard = null;
    secondCard = null;
    lock = false;
    gameBoard.innerHTML = "";
    updateTurn();
    updateScore();

    const images = [];
    for (let i = 1; i <= totalPairs; i++) {
      images.push(`imgs/img${i}.jpg`);
      images.push(`imgs/img${i}.jpg`);
    }

    images.sort(() => Math.random() - 0.5);

    images.forEach((src) => {
      const card = document.createElement("div");
      card.className = "card";
      const img = document.createElement("img");
      img.src = src;
      card.appendChild(img);
      card.onclick = () => revealCard(card);
      gameBoard.appendChild(card);
    });
  }

  function revealCard(card) {
    if (
      lock ||
      card.classList.contains("revealed") ||
      card.classList.contains("matched")
    )
      return;

    card.classList.add("revealed");

    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      lock = true;

      const img1 = firstCard.querySelector("img").src;
      const img2 = secondCard.querySelector("img").src;

      if (img1 === img2) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        scores[turn]++;
        totalMatches++;
        updateScore();
        resetTurn();

        if (totalMatches === totalPairs) {
          showWinner();
        }
      } else {
        setTimeout(() => {
          firstCard.classList.remove("revealed");
          secondCard.classList.remove("revealed");
          turn = 1 - turn;
          updateTurn();
          resetTurn();
        }, 1000);
      }
    }
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
    lock = false;
    hintLocked = false;
  }

  function updateScore() {
    scoreDisplay.textContent = `${players[0]}: ${scores[0]} | ${players[1]}: ${scores[1]}`;
  }

  function updateTurn() {
    turnIndicator.textContent = `תור: ${players[turn]}`;
  }

  hintBtn.onclick = () => {
    if (hintsUsed[turn]) {
      hintBtn.textContent = "נעשה שימוש ברמז בסבב זה";
      return;
    }
    if (hintLocked) return;

    hintsUsed[turn] = true;
    hintLocked = true;
    hintBtn.textContent = "נעשה שימוש ברמז בסבב זה";

    const allCards = document.querySelectorAll(".card");
    allCards.forEach((card) => card.classList.add("revealed"));

    setTimeout(() => {
      allCards.forEach((card) => {
        if (!card.classList.contains("matched")) {
          card.classList.remove("revealed");
        }
      });
    }, 1000);
  };

  newGameBtn.onclick = () => {
    scores = [0, 0];
    hintsUsed = [false, false];
    hintLocked = false;
    turn = 0;
    totalMatches = 0;
    initGame();
  };

  restartBtn.onclick = () => {
    gameScreen.classList.remove("hidden");
    winScreen.classList.add("hidden");
    newGameBtn.click();
  };

  menuBtn.onclick = () => returnToMenu();
  menuFromWinBtn.onclick = () => returnToMenu();

  function returnToMenu() {
    gameScreen.classList.add("hidden");
    winScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
    document.body.className = "";
    player1Input.value = "";
    player2Input.value = "";
  }

  function showWinner() {
    gameScreen.classList.add("hidden");
    winScreen.classList.remove("hidden");
    if (scores[0] > scores[1]) {
      winnerMessage.textContent = `${players[0]} ניצח!`;
    } else if (scores[1] > scores[0]) {
      winnerMessage.textContent = `${players[1]} ניצח!`;
    } else {
      winnerMessage.textContent = "תיקו!";
    }
  }
});
