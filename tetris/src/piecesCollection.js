const ROWS = 20;
const COLUMNS = 10;
const initialRow = 0;
const initialCol = Math.floor(COLUMNS / 2) - 1; // Center column

const piecesCollection = {
  // Piece I
  I: {
    shape: [
      { row: initialRow, col: initialCol },
      { row: initialRow + 1, col: initialCol },
      { row: initialRow + 2, col: initialCol },
      { row: initialRow + 3, col: initialCol },
    ],
    name: "I",
  },
  // Piece J
  J: {
    shape: [
      { row: initialRow, col: initialCol },
      { row: initialRow + 1, col: initialCol },
      { row: initialRow + 1, col: initialCol + 1 },
      { row: initialRow + 1, col: initialCol + 2 },
    ],
    name: "J",
  },
  // Piece O
  O: {
    shape: [
      { row: initialRow + 1, col: initialCol },
      { row: initialRow + 1, col: initialCol + 1 },
      { row: initialRow, col: initialCol },
      { row: initialRow, col: initialCol + 1 },
    ],
    name: "O",
  },
  // Piece Z
  Z: {
    shape: [
      { row: initialRow, col: initialCol },
      { row: initialRow, col: initialCol + 1 },
      { row: initialRow + 1, col: initialCol + 1 },
      { row: initialRow + 1, col: initialCol + 2 },
    ],
    name: "Z",
  },
  // Piece S
  S: {
    shape: [
      { row: initialRow, col: initialCol + 2 },
      { row: initialRow, col: initialCol + 1 },
      { row: initialRow + 1, col: initialCol },
      { row: initialRow + 1, col: initialCol + 1 },
    ],
    name: "S",
  },
  // Piece T
  T: {
    shape: [
      { row: initialRow + 1, col: initialCol },
      { row: initialRow, col: initialCol + 1 },
      { row: initialRow + 1, col: initialCol + 1 },
      { row: initialRow + 1, col: initialCol + 2 },
    ],
    name: "T",
  },
  // Piece L
  L: {
    shape: [
      { row: initialRow, col: initialCol + 2 },
      { row: initialRow + 1, col: initialCol + 1 },
      { row: initialRow + 1, col: initialCol },
      { row: initialRow + 1, col: initialCol + 2 },
    ],
    name: "L",
  },
};

export { ROWS, COLUMNS, piecesCollection };
