const board = document.getElementById("board");
const rollBtn = document.getElementById("rollBtn");
const diceResult = document.getElementById("diceResult");
const turnInfo = document.getElementById("turnInfo");

let playerPos = 1;
let botPos = 1;
let playerTurn = true;

const snakes = {
  16: 6,
  48: 30,
  62: 19,
  88: 24,
  95: 56,
  97: 78,
};

const ladders = {
  3: 22,
  8: 26,
  20: 29,
  27: 55,
  50: 91,
  72: 92,
};

// Generate 10x10 board
function createBoard() {
  let isLeftToRight = true;
  for (let row = 9; row >= 0; row--) {
    let rowCells = [];
    for (let col = 0; col < 10; col++) {
      let number = row * 10 + (isLeftToRight ? col + 1 : 10 - col);
      let cell = document.createElement("div");
      cell.className = "cell";
      cell.id = `cell-${number}`;
      cell.innerText = number;
      rowCells.push(cell);
    }
    isLeftToRight = !isLeftToRight;
    rowCells.forEach((cell) => board.appendChild(cell));
  }
}

// Update token positions
function updateTokens() {
  document.querySelectorAll(".token").forEach((t) => t.remove());

  const playerToken = document.createElement("div");
  playerToken.className = "token player";
  document.getElementById(`cell-${playerPos}`)?.appendChild(playerToken);

  const botToken = document.createElement("div");
  botToken.className = "token bot";
  document.getElementById(`cell-${botPos}`)?.appendChild(botToken);
}

// Lempar dadu
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

// Proses giliran
async function moveTokenStepByStep(currentPos, steps, isPlayer) {
  for (let i = 0; i < steps; i++) {
    if (isPlayer) playerPos++;
    else botPos++;

    if (playerPos > 100) playerPos = 100;
    if (botPos > 100) botPos = 100;

    updateTokens();
    await new Promise((res) => setTimeout(res, 300));
  }

  let finalPos = isPlayer ? playerPos : botPos;
  if (ladders[finalPos]) finalPos = ladders[finalPos];
  else if (snakes[finalPos]) finalPos = snakes[finalPos];

  if (isPlayer) playerPos = finalPos;
  else botPos = finalPos;

  updateTokens();
}

async function playTurn() {
  let roll = rollDice();
  diceResult.innerText = `🎲 Dadu: ${roll}`;
  rollBtn.disabled = true;

  await moveTokenStepByStep(playerPos, roll, true);

  if (playerPos === 100) {
    alert("🎉 Kamu Menang!");
    return;
  }

  playerTurn = false;
  turnInfo.innerText = "Giliran: Bot";

  setTimeout(botTurn, 800);
}

async function botTurn() {
  let roll = rollDice();
  diceResult.innerText = `🎲 Dadu Bot: ${roll}`;

  await moveTokenStepByStep(botPos, roll, false);

  if (botPos === 100) {
    alert("💀 Bot Menang!");
    return;
  }

  playerTurn = true;
  turnInfo.innerText = "Giliran: Kamu";
  rollBtn.disabled = false;
}

rollBtn.addEventListener("click", playTurn);

createBoard();
updateTokens();
