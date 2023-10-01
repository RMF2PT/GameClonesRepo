import { piecesCollection, ROWS, COLUMNS } from "./piecesCollection.js";
import { updateCompletedRows, calculateScore, updateScore } from "./game.js";
import {
  setPiece,
  getPiece,
  setGrid,
  getGrid,
  setNextPiece,
  getNextPiece,
} from "./gameElements.js";

const gameContainer = document.getElementById("game-container");
const nextPieceContainer = document.getElementById("next-piece-container");
const BLOCK_SIZE = 30;

// TODO create setter and getter for piece, grid and nextpiece - it might be better to move game elements to new file

function createFirstPiece() {
  setPiece(createPiece());
  drawPiece(getPiece());
}

function createPiece() {
  // Randomly select a piece and return it
  const pieces = Object.keys(piecesCollection);
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
  return piecesCollection[randomPiece];
}

function createNextPiece() {
  // Assign the next piece to the current piece
  if (getNextPiece() !== null) {
    setPiece(getNextPiece());
  }
  // Clear any existing display of the next piece
  clearNextPieceDisplay();
  // Create the next piece
  setNextPiece(createPiece());
  // Draw the next piece on the UI
  drawNextPiece(getNextPiece());
}

function reassignPiece(newPiece) {
  setPiece(newPiece);
}

function clearPiece() {
  // Get all blocks with the class block and not landed-block inside the game container
  if (gameContainer) {
    const pieceBlocks = gameContainer.querySelectorAll(
      ".block:not(.landed-block)"
    );
    // Remove each block element from the DOM
    for (const block of pieceBlocks) {
      block.parentNode.removeChild(block);
    }
  }
}

function clearNextPieceDisplay() {
  // Get all blocks with the class next inside the game container
  if (nextPieceContainer) {
    const pieceBlocks = nextPieceContainer.getElementsByClassName("next");
    // Remove each block element from the DOM
    while (pieceBlocks.length > 0) {
      const block = pieceBlocks[0];
      block.parentNode.removeChild(block);
    }
  }
}

function clearAllPieces() {
  // Get all blocks with the class landed-block inside the game container
  if (gameContainer) {
    const pieceBlocks = gameContainer.getElementsByClassName("landed-block");
    // Remove each block element from the DOM
    while (pieceBlocks.length > 0) {
      const block = pieceBlocks[0];
      block.parentNode.removeChild(block);
    }
  }
}

function drawPiece() {
  const piece = getPiece();
  // Get the current piece shape
  const pieceShape = piece.shape;
  // Loop through each block in the piece shape
  for (const block of pieceShape) {
    const { row, col } = block;
    // Create a new block element
    const blockElement = document.createElement("div");
    // Apply the class for block
    blockElement.classList.add("block");
    // Applye the color for the piece
    blockElement.classList.add(`piece-${piece.name}`);
    // Set the position based on row
    blockElement.style.top = row * BLOCK_SIZE + "px";
    // Set the position based on column
    blockElement.style.left = col * BLOCK_SIZE + "px";
    // Append the block element to the game container
    if (gameContainer) {
      gameContainer.appendChild(blockElement);
    }
  }
}

function drawNextPiece() {
  const nextPiece = getNextPiece();
  // Get the next piece shape
  const pieceShape = nextPiece.shape;
  // Loop through each block in the piece shape
  for (const block of pieceShape) {
    const { row, col } = block;
    // Create a new block element
    const blockElement = document.createElement("div");
    // Apply the class for block
    blockElement.classList.add("block");
    // Apply the color for the piece
    blockElement.classList.add(`piece-${nextPiece.name}`);
    // Apply the class for next
    blockElement.classList.add("next");
    // Set the position based on row
    blockElement.style.top = (row + 2) * BLOCK_SIZE + "px";
    // Set the position based on column
    blockElement.style.left = (col - 3) * BLOCK_SIZE + "px";
    // Append the block element to the game container
    if (nextPieceContainer) {
      nextPieceContainer.appendChild(blockElement);
    }
  }
}

function drawLandedBlocks() {
  const grid = getGrid();
  // Loop through the grid and draw the landed blocks
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      if (grid[row][col] === 1) {
        // Add class landed block
        const blockElements = gameContainer.getElementsByClassName("block");
        for (const blockEl of blockElements) {
          blockEl.classList.add("landed-block");
        }
      }
    }
  }
}

function placePieceInGrid() {
  const piece = getPiece();
  const grid = getGrid();
  // Add the current piece to the grid
  for (const block of piece.shape) {
    const { row, col } = block;
    grid[row][col] = 1; // You can use 1 to represent the presence of a block in the grid
  }
  setGrid(grid);
  // After placing the piece in the grid, check and clear completed lines
  clearFullLines();
  // Update the score
  updateScore();
  // Draw landed blocks after checking full lines
  drawLandedBlocks();
  // Draw the next piece
  createNextPiece();
}

function clearFullLines() {
  const grid = getGrid();
  // Initialize an array to store the row indices of full lines
  const fullLines = [];
  // Check each row in the grid
  for (let row = ROWS - 1; row >= 0; row--) {
    // Check if the row is a full line
    if (grid[row].every((block) => block !== null)) {
      // Change the value to 0 to represent a full line
      grid[row] = Array(COLUMNS).fill(0);
      // Add the index of the full line to the array
      fullLines.push(row);
    }
  }
  // Sort the fullLines array in ascending order
  fullLines.sort((a, b) => a - b);
  // Update completed rows by level with full lines
  //completedRows += fullLines.length;
  updateCompletedRows(fullLines.length);
  // Clear all full lines at once and move lines above cleared lines down by the number of cleared lines
  for (const fullRow of fullLines) {
    // Remove blocks in the full line from the DOM
    const blocksInFullLine = gameContainer.querySelectorAll(".block");
    blocksInFullLine.forEach((block) => {
      const blockRow = parseInt(block.style.top) / BLOCK_SIZE;
      if (blockRow === fullRow) {
        // Removes the blocks of the full line
        block.parentNode.removeChild(block);
      }
    });
  }
  for (const fullRow of fullLines) {
    const blocksInFullLine = gameContainer.querySelectorAll(".block");
    blocksInFullLine.forEach((block) => {
      const blockRow = parseInt(block.style.top) / BLOCK_SIZE;
      if (blockRow < fullRow) {
        // Adjusts the positions of the blocks above the full line
        block.style.top = `${parseInt(block.style.top) + BLOCK_SIZE}px`;
      }
    });
  }
  // Clear the rows in the grid for all full lines
  for (const fullRow of fullLines) {
    grid.splice(fullRow, 1); // Remove the full row
    grid.unshift(Array(COLUMNS).fill(null)); // Add an empty row at the top
  }
  setGrid(grid);
  calculateScore(fullLines);
}

export {
  createFirstPiece,
  createNextPiece,
  reassignPiece,
  clearPiece,
  clearAllPieces,
  drawPiece,
  placePieceInGrid,
};
