import { ROWS, COLUMNS } from "./piecesCollection.js";

let grid = [];

function getGrid() {
  return grid;
}

function setGrid(newGrid) {
  grid = newGrid;
}

function resetGrid() {
  grid = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
}
/*
class Grid {
  constructor() {
    this.grid = [];
    this.reset();
  }

  get() {
    return this.grid;
  }

  set(newGrid) {
    this.grid = newGrid;
  }

  reset() {
    this.grid = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
  }
}

// Usage
const gameGrid = new Grid();
const currentGridState = gameGrid.get();
gameGrid.reset();
*/

let piece;

function getPiece() {
  return piece;
}

function setPiece(newPiece) {
  piece = newPiece;
}

let nextPiece;

function getNextPiece() {
  return nextPiece;
}

function setNextPiece(newNextPiece) {
  nextPiece = newNextPiece;
}

export {
  getGrid,
  setGrid,
  resetGrid,
  getPiece,
  setPiece,
  getNextPiece,
  setNextPiece,
};
