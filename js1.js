import { randomElementFromArray, wait } from "./fruit1.js";

const foodItemsArray = [
  "🍇",
  "🍉",
  "🍈",
  "🍓",
  "🍍",
  "🍌",
  "🥝",
  "🍏",
  "🍎",
  "🍅",
];
// game display element
const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("span");
const startBtn = document.querySelector(".start-btn");
const keyBtns = document.querySelectorAll(".keys-container button");
// game variable
const width = 15;
const numCells = width * width;
grid.style.width = `${width * 15 * 2}px`;
grid.style.height = `${width * 15 * 2}px`;
// create grid cells
for (let i = 0; i < numCells; i++) {
  const cell = document.createElement("div");
  cell.style.width = `${width * 2}px`;
  cell.style.height = `${width * 2}px`;
  grid.appendChild(cell);
}

const cells = document.querySelectorAll(".grid div");
let currentSnake = [2, 1, 0];
let snakeColor = Math.floor(Math.random() * 360);
let snakeColorIncrement = 10;

function startGame() {
  clearInterval(interval);
  currentSnake.forEach((i) => {
    cells[i].style.background = "none";
    cells[i].classList.remove("snake");
    cells[i].innerText = "";
  });

  currentSnake = [2, 1, 0];
  snakeColor = Math.floor(Math.random() * 360);
  snakeColorIncrement = 10;

  currentSnake.forEach((i) => {
    snakeColor += snakeColorIncrement % 360;
    cells[i].style.background = `hsl(${snakeColor}, 100%, 50%)`;
    cells[i].classList.add("snake");
  });

  direction = 1;
  intervalTime = 200;
  interval = setInterval(gameLoop, intervalTime);
}

startBtn.addEventListener("click", startGame);

let direction = 1;
let intervalTime = 300;
let interval = 0;

function gameLoop() {
  cells[currentSnake[0]].innerText = "";
  const tail = currentSnake.pop();
  cells[tail].classList.remove("snake");
  cells[tail].style.background = "none";
  currentSnake.unshift(currentSnake[0] + direction);

  cells[currentSnake[0]].classList.add("snake");
  cells[currentSnake[0]].innerText = "👀";
  snakeColor += snakeColorIncrement % 360;
  cells[currentSnake[0]].style.background = `hsl(${snakeColor}, 100%, 50%)`;

  if (
    (currentSnake[0] + width >= numCells && direction === width) ||
    (currentSnake[0] % width === width - 1 && direction === 1) ||
    (currentSnake[0] % width === 0 && direction === -1) ||
    (currentSnake[0] - width < 0 && direction === -width) ||
    cells[currentSnake[0] + direction].classList.contains("snake")
  ) {
    grid.classList.add("shake");
    clearInterval(interval);
    return;
  }
  grid.classList.remove("shake");
}

function moveSnake(moveDirection) {
  let directionVal;
  if (moveDirection === "ArrowRight" && direction !== -1) {
    directionVal = 1;
    if (currentSnake[0] + directionVal === currentSnake[1]) return;
    direction = directionVal;
  }
  if (moveDirection === "ArrowLeft" && direction !== 1) {
    directionVal = -1;
    if (currentSnake[0] + directionVal === currentSnake[1]) return;
    direction = directionVal;
  }
  if (moveDirection === "ArrowUp" && direction !== width) {
    directionVal = -width;
    if (currentSnake[0] + directionVal === currentSnake[1]) return;
    direction = directionVal;
  }
  if (moveDirection === "ArrowDown" && direction !== -width) {
    directionVal = width;
    if (currentSnake[0] + directionVal === currentSnake[1]) return;
    direction = directionVal;
  }
}

function handleKeyMove(e) {
  if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) return;
  moveSnake(e.key);
}

document.addEventListener("keydown", handleKeyMove);

let foodItemIndex = 0;
let score = 0;

async function createFood() {
  foodItemIndex = Math.floor(Math.random() * numCells);
  if (currentSnake.includes(foodItemIndex)) {
    await wait(150);
    createFood();
  } else {
    cells[foodItemIndex].classList.add("food-item");
    cells[foodItemIndex].innerText = randomElementFromArray(foodItemsArray);
  }
}

function checkForFoodCollision() {
  if (cells[currentSnake[0]].classList.contains("food-item")) {
    cells[currentSnake[0]].classList.remove("food-item");
    cells[currentSnake[currentSnake.length - 1]].classList.add("snake");
    snakeColor += snakeColorIncrement % 360;
    cells[currentSnake[currentSnake.length - 1]].style.background = `hsl(${snakeColor}, 100%, 50%)`;
    currentSnake.push(currentSnake[currentSnake.length - 1]);
    score+=5;
    scoreDisplay.textContent = score;
    createFood();
  }
}

createFood();
scoreDisplay.innerHTML = score;
interval = setInterval(() => {
  gameLoop();
  checkForFoodCollision();
}, intervalTime);
