import { ROWS, COLUMNS } from "./piecesCollection.js";
import {
  grid,
  piece,
  reassignPiece,
  clearPiece,
  drawPiece,
  placePieceInGrid,
} from "./renderer.js";
import { getIsGameOver } from "./game.js";

function checkColision(pieceShape) {
  // If the piece shape is not provided, use the current piece
  if (!pieceShape) {
    pieceShape = piece.shape;
  }
  // Loop through each block in the piece shape
  for (const block of pieceShape) {
    const { row, col } = block;
    // Check for collisions with the game boundaries
    if (row >= ROWS || row < 0 || col < 0 || col >= COLUMNS) {
      return true;
    }
    // Check for collisions with other blocks on the gris
    if (grid[row][col] !== null) {
      return true;
    }
  }
  return false;
}

function moveDown() {
  // Create a copy of the current piece shape
  const newPiece = JSON.parse(JSON.stringify(piece));

  // Move each block of the piece down by one row
  for (const block of newPiece.shape) {
    block.row++;
  }
  // Check if the new position is valid (not colliding with other blocks or going out of bounds
  if (!checkColision(newPiece.shape)) {
    // If new position is valid, update the piece to its new position
    // piece = newPiece;
    reassignPiece(newPiece);
  } else {
    // If there's a collision, the piece cannot move down further
    // You can consider this as a piece that has landed, and it should be placed in the grid
    placePieceInGrid(piece);
  }
  // Clear the current piece from the grid
  clearPiece();
  // Draw new piece on the grid
  drawPiece(piece);
}

function moveLeft() {
  // Create a copy of the current piece shape
  const newPiece = JSON.parse(JSON.stringify(piece));
  // Attempt to move each block of the piece one column to the left
  for (const block of newPiece.shape) {
    block.col--; // Move left by decrementing the column coordinate
  }
  // Check if the new position is valid (not colliding with other blocks or going out of bounds)
  if (!checkColision(newPiece.shape)) {
    // If the new position is valid, update the piece to its new position
    // piece = newPiece;
    reassignPiece(newPiece);
  }
  // Clear the current piece from the grid and the DOM
  clearPiece();
  // Draw the updated piece on the grid and the DOM
  drawPiece(piece);
}

function moveRight() {
  // Create a copy of the current piece shape
  const newPiece = JSON.parse(JSON.stringify(piece));
  // Attempt to move each block of the piece one column to the left
  for (const block of newPiece.shape) {
    block.col++; // Move left by decrementing the column coordinate
  }
  // Check if the new position is valid (not colliding with other blocks or going out of bounds)
  if (!checkColision(newPiece.shape)) {
    // If the new position is valid, update the piece to its new position
    // piece = newPiece;
    reassignPiece(newPiece);
  }
  // Clear the current piece from the grid and the DOM
  clearPiece();
  // Draw the updated piece on the grid and the DOM
  drawPiece(piece);
}

function rotatePieceClockwise() {
  /// Create a copy of the current piece shape
  const newPiece = JSON.parse(JSON.stringify(piece));
  // Calculate the center of rotation (average of all block coordinates)
  const center = { row: 0, col: 0 };
  for (const block of newPiece.shape) {
    center.row += block.row;
    center.col += block.col;
  }

  center.row = Math.round(center.row / newPiece.shape.length);
  center.col = Math.round(center.col / newPiece.shape.length);
  // Attempt to rotate each block of the piece clockwise around the center
  for (const block of newPiece.shape) {
    const rowOffset = block.row - center.row;
    const colOffset = block.col - center.col;
    block.row = center.row - colOffset;
    block.col = center.col + rowOffset;
  }
  // Check if the new position is valid (not colliding with other blocks or going out of bounds)
  if (!checkColision(newPiece.shape)) {
    // If the new position is valid, update the piece to its rotated shape
    // piece = newPiece;
    reassignPiece(newPiece);
  }
  // Clear the current piece from the grid and the DOM
  clearPiece();
  // Draw the updated piece on the grid and the DOM
  drawPiece(piece);
}

// Event handlers
document.addEventListener("keydown", (event) => {
  if (!getIsGameOver()) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveLeft(piece);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      moveRight(piece);
    } else if (event.key === " ") {
      event.preventDefault();
      // Rotate the piece when the space key is pressed
      rotatePieceClockwise(piece);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      moveDown(piece);
    }
  }
});

export { moveDown, moveLeft, moveRight, rotatePieceClockwise, checkColision };
