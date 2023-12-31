// TODO Create Unit Tests
// TODO increase game music with speed
// TODO make the start button a pause button during in-game
// TODO make a button to quit game in Game Over screen
// TODO put a sound when pieces land
// TODO show a pop-up with the score of the current full lines

import { moveDown, checkCollision } from "./inputHandler.js";
import {
  updateElementTextContent,
  updateHighscoreEl,
  clearPiece,
  clearAllPieces,
  createFirstPiece,
  createNextPiece,
} from "./renderer.js";
import { getPiece, resetGrid } from "./gameElements.js";

const startButton = document.getElementById("start-button");
const messageContainer = document.getElementById("message-container");
const retryButton = document.getElementById("retry-button");
const backgroundMusic = document.getElementById("background-music");
const gameOverMusic = document.getElementById("game-over-music");
const initialGameSpeed = 500;

let scoreValue = 0;
let level = 1;
let completedRows = 0;
let gameSpeed = initialGameSpeed;
let isGameOver = false;

function getScoreValue() {
  return scoreValue;
}

function setScoreValue(newScore) {
  scoreValue = newScore;
}

function getLevel() {
  return level;
}

function setLevel(newLevel) {
  level = newLevel;
}

function getCompletedRows() {
  return completedRows;
}

function setCompletedRows(newCompletedRows) {
  completedRows = newCompletedRows;
}

function getGameSpeed() {
  return gameSpeed;
}

function setGameSpeed(newGameSpeed) {
  gameSpeed = newGameSpeed;
}

function getIsGameOver() {
  return isGameOver;
}

function setIsGameOver(state) {
  isGameOver = state;
}

function calculateScore(fullLines) {
  /* 
  Score Grid:
  Single Line Clear: 100 points
  Double Line Clear: 300 points
  Triple Line Clear: 500 points
  Tetris Line Clear: 800 points
  Level Bonus: 100 points per level
  TODO: implement Soft and Hard Drop
  Soft Drop Score: 1 point per cell moved downward
  Hard Drop Score: 2 points per cell dropped
  */
  const currentLevel = getLevel();
  switch (fullLines.length) {
    case 1:
      setScoreValue(getScoreValue() + 100 + 100 * currentLevel);
      break;
    case 2:
      setScoreValue(getScoreValue() + 300 + 100 * currentLevel);
      break;
    case 3:
      setScoreValue(getScoreValue() + 500 + 100 * currentLevel);
      break;
    case 4:
      setScoreValue(getScoreValue() + 800 + 100 * currentLevel);
      break;
    default:
      break;
  }
}

function updateCompletedRows(fullLines) {
  if (fullLines >= 0) {
    setCompletedRows(getCompletedRows() + fullLines);
  } else {
    setCompletedRows(0);
  }
}

function updateLevel(fullLinesCount) {
  // Level increases by 1 when 10 full lines are completed
  if (fullLinesCount >= 10) {
    setLevel(getLevel() + 1);
    updateElementTextContent("level", getLevel());
    // Full lines above 10 count to next level countdown
    setCompletedRows(fullLinesCount % 10);
  }
}

function updateScore() {
  // Update the displayed score
  updateElementTextContent("score", getScoreValue());
  updateLevel(getCompletedRows());
  // Update game interval delay based on the level
  // Higher level = lower game interval delay
  // Minimum game interval delay = 100
  setGameSpeed(Math.max(100, initialGameSpeed - getLevel() * 20));
}

function gameOver() {
  // Stops the game
  setIsGameOver(true);
  // Stop the background music (e.g., when the game ends)
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
  // Plays game over music
  if (gameOverMusic) {
    gameOverMusic.play();
  }
  // Shows message container
  if (messageContainer) {
    messageContainer.classList.remove("hidden");
  }
  updateHighscore();
  // Enables start button
  if (startButton) {
    startButton.removeAttribute("disabled");
  }
}

function updateHighscore() {
  const finalScore = getScoreValue();
  if (localStorage.getItem("tetris-highscore")) {
    const previousHighscore = localStorage.getItem("tetris-highscore");
    if (finalScore > previousHighscore) {
      localStorage.setItem("tetris-highscore", finalScore);
      updateElementTextContent("highscore", finalScore);
    }
  } else {
    localStorage.setItem("tetris-highscore", finalScore);
  }
}

function updateGame(
  moveDownFunction,
  checkCollisionFunction,
  getPieceFunction,
  clearPieceFunction,
  gameOverFunction
) {
  // Implements the main game loop
  moveDownFunction(getPieceFunction());
  // If the piece coliddes at the first move down, it's game over
  if (checkCollisionFunction(getPieceFunction().shape)) {
    clearPieceFunction();
    gameOverFunction();
    return;
  }
  // Schedule the next execution of updateGame with the updated gameSpeed
  setTimeout(
    () => updateGame(moveDown, checkCollision, getPiece, clearPiece, gameOver),
    getGameSpeed()
  );
}

function startGame(
  moveDownFunction,
  checkCollisionFunction,
  getPieceFunction,
  messageContainerEl,
  startButton,
  backgroundMusic
) {
  // Hide the message container
  if (messageContainerEl && !messageContainerEl.classList.contains("hidden")) {
    messageContainerEl.classList.add("hidden");
  }
  // Start the background music fromthe beginning
  backgroundMusic.currentTime = 0;
  backgroundMusic.play();
  // Initialize game variables and start the game loop
  setIsGameOver(false);
  setScoreValue(0);
  updateElementTextContent("score", "0");
  updateHighscoreEl();
  setLevel(1);
  updateElementTextContent("level", getLevel());
  setGameSpeed(initialGameSpeed);
  resetGrid();
  clearAllPieces();
  createNextPiece();
  createFirstPiece();
  updateGame(
    moveDownFunction,
    checkCollisionFunction,
    getPieceFunction,
    getPiece,
    clearPiece,
    gameOver
  );
  // Disable the start button so that the user doesn't click ingame
  startButton.setAttribute("disabled", "true");
}

// TODO Continue test coverage

// Event Listeners
if (startButton) {
  startButton.addEventListener("click", () => {
    startGame(
      moveDown,
      checkCollision,
      getPiece,
      messageContainer,
      startButton,
      backgroundMusic
    );
  });
}
if (retryButton) {
  retryButton.addEventListener("click", () => {
    startGame(
      moveDown,
      checkCollision,
      getPiece,
      messageContainer,
      startButton,
      backgroundMusic
    );
  });
}

export {
  updateCompletedRows,
  getCompletedRows,
  setCompletedRows,
  updateLevel,
  getLevel,
  setLevel,
  calculateScore,
  getScoreValue,
  setScoreValue,
  updateScore,
  setGameSpeed,
  getGameSpeed,
  gameOver,
  updateHighscore,
  getIsGameOver,
  updateGame,
  startGame,
};
