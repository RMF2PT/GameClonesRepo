import { afterEach, beforeEach, expect } from "vitest";
import {
  updateCompletedRows,
  getCompletedRows,
  calculateScore,
  updateScore,
  getScoreValue,
  setScoreValue,
  updateLevel,
  getLevel,
  setLevel,
  setCompletedRows,
  setGameSpeed,
  getGameSpeed,
  gameOver,
  getIsGameOver,
  updateHighscore,
  getHighscore,
  updateGame,
  startGame,
} from "../tetris/src/game";
import { resetGrid } from "../tetris/src/gameElements";

beforeEach(async () => {
  await setLevel(1);
  await setScoreValue(0);
});

// Verify that tests is working correctly
test("testing tests", () => {
  expect(Math.sqrt(4)).toBe(2);
});

describe("Update Completed Rows", () => {
  // Test case: Testing the updateCompletedRows function
  test("Update completedRows with positive value", () => {
    // Call the function to update completedRows with a positive value (e.g., 3)
    updateCompletedRows(3);

    // Assert that completedRows has been updated correctly
    expect(getCompletedRows()).toBe(3);
  });

  // Test case: Testing the updateCompletedRows function with zero
  test("Update completedRows with zero value", () => {
    // Call the function to update completedRows with zero
    updateCompletedRows(0);

    // Assert that completedRows remains unchanged (should still be 0)
    expect(getCompletedRows()).toBe(3);
  });

  // Test case: Testing the updateCompletedRows function with negative value
  test("Update completedRows with negative value", () => {
    // Call the function to update completedRows with a negative value (e.g., -2)
    updateCompletedRows(-2);

    // Assert that completedRows remains unchanged (should still be 0)
    expect(getCompletedRows()).toBe(0);
  });
});

describe("Calculate Score", () => {
  // Test case: Testing single line clear
  test("Calculate score for single line clear", () => {
    // Simulating one full line clear
    const fullLines = [1];
    calculateScore(fullLines);
    expect(getScoreValue()).toBe(200);
  });

  // Test case: Testing double line clear
  test("Calculate score for double line clear", () => {
    // Simulating two full lines cleared
    const fullLines = [1, 2];
    calculateScore(fullLines);
    expect(getScoreValue()).toBe(400);
  });

  // Test case: Testing triple line clear
  test("Calculate score for triple line clear", () => {
    // Simulating three full lines cleared
    const fullLines = [1, 2, 3];
    calculateScore(fullLines);
    expect(getScoreValue()).toBe(600);
  });

  // Test case: Testing tetris line clear
  test("Calculate score for tetris line clear", () => {
    // Simulating four full lines cleared
    const fullLines = [1, 2, 3, 4];
    calculateScore(fullLines);
    expect(getScoreValue()).toBe(900);
  });

  // Test case: Testing no full line
  test("Calculate score for no line clear", () => {
    // Simulating four full lines cleared
    const fullLines = [];
    calculateScore(fullLines);
    expect(getScoreValue()).toBe(0);
  });
});

describe("Update Level", () => {
  // Test case: Testing level update when 10 full lines are completed
  test("Update level and completed rows for 10 full lines", () => {
    // Set the initial level and completed rows
    setLevel(1);
    setCompletedRows(0);

    // Call the updateLevel function with 10 full lines completed
    updateLevel(10);

    // Assert that the level has been updated to 2
    expect(getLevel()).toBe(2);

    // Assert that the completed rows have been updated to 0 (since we completed 10)
    expect(getCompletedRows()).toBe(0);
  });

  // Test case: Testing level update when more than 10 full lines are completed
  test("Update level and completed rows for more than 10 full lines", () => {
    // Set the initial level and completed rows
    setLevel(2);
    setCompletedRows(3); // 3 completed rows from previous level

    // Call the updateLevel function with 15 full lines completed
    updateLevel(15);

    // Assert that the level has been updated to 3
    expect(getLevel()).toBe(3);

    // Assert that the completed rows have been updated to 5 (since we completed 15)
    expect(getCompletedRows()).toBe(5);
  });

  // Test case: Testing level update when less than 10 full lines are completed
  test("No level update for less than 10 full lines", () => {
    // Set the initial level and completed rows
    setLevel(3);
    setCompletedRows(7); // 7 completed rows from previous level

    // Call the updateLevel function with 7 full lines completed (less than 10)
    updateLevel(7);

    // Assert that the level remains the same (level 3)
    expect(getLevel()).toBe(3);

    // Assert that the completed rows have been updated to 4 (since we completed 7)
    expect(getCompletedRows()).toBe(7);
  });
});

describe("Update Score", () => {
  beforeEach(() => {
    // Mock the required DOM elements and methods
    document.body.innerHTML = `
    <div id="score">'0'</div>
    `;
  });
  // Test case: Testing score update with level increase
  test("Update score, level, and game speed when completing 10 full lines", () => {
    // Set initial level, completed rows, and game speed
    setLevel(1);
    setGameSpeed(500);
    setCompletedRows(10);

    // Mock DOM elements and properties
    const scoreEl = document.getElementById("score");

    // Call updateScore with 10 full lines completed
    updateScore(scoreEl);

    // Assert that the level is increased to 2
    expect(getLevel()).toBe(2);

    // Assert that the game speed is updated based on the new level
    expect(getGameSpeed()).toBe(460); // Calculated based on initialGameSpeed - level * 20
  });

  // Test case: Testing score update without level increase
  test("Update score and game speed without level increase", () => {
    // Set initial level, completed rows, and game speed
    setLevel(4);
    setCompletedRows(9); // 2 completed rows from previous level
    setGameSpeed(420);

    // Mock DOM elements and properties
    const scoreEl = document.getElementById("score");

    // Call updateScore with 3 full lines completed (less than 10)
    updateScore(scoreEl);

    // Assert that the level remains the same (level 4)
    expect(getLevel()).toBe(4);

    // Assert that the game speed is updated based on the new level
    expect(getGameSpeed()).toBe(420); // Calculated based on initialGameSpeed - level * 20
  });
});

describe("Game Over", () => {
  // Test case: Test if the game is correctly marked as over (isGameOver is set to true):
  test("Game Over: Check if isGameOver is set to true", () => {
    // Call the gameOver function
    gameOver();

    // Assert that isGameOver is now true
    expect(getIsGameOver()).toBe(true);
  });
});

describe("Update Highscore", () => {
  // Mock the localStorage object
  const localStorageMock = (function () {
    let store = {};

    return {
      getItem: function (key) {
        return store[key] || null;
      },
      setItem: function (key, value) {
        store[key] = value.toString();
      },
      removeItem: function (key) {
        delete store[key];
      },
      clear: function () {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });

  // Test case: Test if updateHighscore updates the highscore in localStorage:
  test("Update Highscore: Set and update highscore in localStorage", () => {
    // Set a previous highscore in localStorage
    localStorage.setItem("tetris-highscore", "300");

    // Call the updateHighscore function
    updateHighscore();

    // Retrieve the updated highscore from localStorage
    const updatedHighscore = localStorage.getItem("tetris-highscore");

    // Assert that the highscore has been updated to the final score
    expect(updatedHighscore).toBe("300");
  });

  // Test case: Test if updateHighscore updates the highscore in localStorage if current score is higher than highscore:
  test("Update Highscore: Set and update highscore in localStorage if score is higher than highscore", () => {
    // Set a previous highscore in localStorage
    localStorage.setItem("tetris-highscore", "300");

    // Set the score
    setScoreValue(400);

    // Call the updateHighscore function
    updateHighscore();

    // Retrieve the updated highscore from localStorage
    const updatedHighscore = localStorage.getItem("tetris-highscore");

    // Assert that the highscore has been updated to the final score
    expect(updatedHighscore).toBe("400");
  });

  // Test case: Test if updateHighscore doesn't updates the highscore in localStorage if current score is lower than highscore:
  test("Update Highscore: Don't set and update highscore in localStorage if score is lower than highscore", () => {
    // Set a previous highscore in localStorage
    localStorage.setItem("tetris-highscore", "500");

    // Set the score
    setScoreValue(400);

    // Call the updateHighscore function
    updateHighscore();

    // Retrieve the updated highscore from localStorage
    const updatedHighscore = localStorage.getItem("tetris-highscore");

    // Assert that the highscore has not been updated to the final score
    expect(updatedHighscore).toBe("500");
  });

  // Test case: Test if updateHighscore doesn't change the highscore in localStorage if current score is equal than highscore:
  test("Update Highscore: Doesn't change highscore in localStorage if score is equal to highscore", () => {
    // Set a previous highscore in localStorage
    localStorage.setItem("tetris-highscore", "900");

    // Set the score
    setScoreValue(900);

    // Call the updateHighscore function
    updateHighscore();

    // Retrieve the updated highscore from localStorage
    const updatedHighscore = localStorage.getItem("tetris-highscore");

    // Assert that the highscore doesn't change
    expect(updatedHighscore).toBe("900");
  });
});

describe("Get Highscore", () => {
  let highscoreEl;

  beforeEach(() => {
    // Clear localStorage and create a mock highscore value
    localStorage.clear();
    localStorage.setItem("tetris-highscore", "500");

    // Create a mock highscore element and add it to the document body
    highscoreEl = document.createElement("div");
    highscoreEl.id = "high-score";
    highscoreEl.textContent = "0";
    document.body.appendChild(highscoreEl);
  });

  afterEach(() => {
    // Clean up the added element
    document.body.removeChild(highscoreEl);
  });

  test("Renders highscore from localStorage", () => {
    // Call the getHighscore function
    getHighscore(highscoreEl);

    // Retrieve the rendered highscore value
    const renderedHighscore = highscoreEl.textContent;

    // Assert that the rendered highscore matches the expected value
    expect(renderedHighscore).toBe("500");
  });

  test("No highscore in localStorage doesn't change highscore element", () => {
    localStorage.clear();
    // Call the getHighscore function
    getHighscore(highscoreEl);

    // Retrieve the rendered highscore value
    const renderedHighscore = highscoreEl.textContent;

    // Assert that the rendered highscore matches the expected value
    expect(renderedHighscore).toBe("0");
  });
});

describe("Update Game", () => {
  test("Piece moves down successfully without collision", () => {
    // Mock functions and variables
    const mockMoveDown = vi.fn();
    const mockCheckCollision = vi.fn(() => false);
    const mockClearPiece = vi.fn();
    const mockGameOver = vi.fn();
    const mockSetTimeout = vi.spyOn(global, "setTimeout");
    const mockGetPiece = vi.fn(() => "");

    // Replace actual functions with mocks
    global.moveDown = mockMoveDown;
    global.checkCollision = mockCheckCollision;
    global.clearPiece = mockClearPiece;
    global.gameOver = mockGameOver;
    global.getPiece = mockGetPiece;

    // Call the updateGame function
    updateGame(mockMoveDown, mockCheckCollision, mockGetPiece);

    // Assert that the moveDown function was called
    expect(mockMoveDown).toHaveBeenCalled();
    // Assert that the setTimeout function was called with the correct arguments
    expect(mockSetTimeout).toHaveBeenCalledWith(
      expect.any(Function),
      getGameSpeed()
    );
    // Ensure that other functions are not called
    // expect(mockCheckCollision).not.toHaveBeenCalled();
    expect(mockClearPiece).not.toHaveBeenCalled();
    expect(mockGameOver).not.toHaveBeenCalled();
  });

  test("Clear piece and Game Over is called when there's a collision", () => {
    // Mock functions and variables
    const mockMoveDown = vi.fn();
    const mockCheckCollision = vi.fn(() => true); // Simulate a collision
    const mockClearPiece = vi.fn();
    const mockGameOver = vi.fn();
    const mockSetTimeout = vi.spyOn(global, "setTimeout");
    const mockGetPiece = vi.fn(() => "");

    // Replace actual functions with mocks
    global.moveDown = mockMoveDown;
    global.checkCollision = mockCheckCollision;
    global.clearPiece = mockClearPiece;
    global.gameOver = mockGameOver;
    global.getPiece = mockGetPiece;

    // Call the updateGame function
    updateGame(
      mockMoveDown,
      mockCheckCollision,
      mockGetPiece,
      mockClearPiece,
      mockGameOver
    );

    // Assert that the moveDown function was called
    expect(mockMoveDown).toHaveBeenCalled();
    // Assert that the setTimeout function was not called
    expect(mockSetTimeout).not.toHaveBeenCalled();
    // Ensure that other functions are called
    expect(mockClearPiece).toHaveBeenCalled();
    expect(mockGameOver).toHaveBeenCalled();
  });
});

// TODO
describe("Start Game", () => {
  beforeEach(() => {
    // Clear localStorage and create a mock highscore value
    localStorage.clear();
    localStorage.setItem("tetris-highscore", "500");

    // Mock the required DOM elements and methods
    document.body.innerHTML = `
    <div id="message-container"></div>
    <audio id="background-music"></audio>
    <div id="score">0</div>
    <div id="high-score">0</div>
    <div id="level">0</div>
    <button id="start-button">Start</button>
    `;

    // Mock the necessary global variables and functions
    global.setInterval = (callback) => {
      // Mock setInterval for game loop
      callback();
      return 1; // Return an interval ID
    };
  });

  test("Starts the game successfully", () => {
    // Set initial game state
    setScoreValue(100);
    setLevel(2);
    resetGrid();

    // Mock DOM elements and properties
    const messageContainerEl = document.getElementById("message-container");
    messageContainerEl.classList.add("hidden");
    const backgroundMusic = document.getElementById("background-music");
    const scoreEl = document.getElementById("score");
    scoreEl.textContent = "200";
    const highscoreEl = document.getElementById("high-score");
    const levelEl = document.getElementById("level");
    const startButton = document.getElementById("start-button");

    // Call the startGame function
    startGame(messageContainerEl, highscoreEl, scoreEl, levelEl);

    // Assert that game state has been reset
    expect(messageContainerEl.classList.contains("hidden")).toBe(true);
    expect(getIsGameOver()).toBe(false);
    expect(scoreEl.textContent).toBe("0");
    expect(highscoreEl.textContent).toBe("500");
    expect(levelEl.textContent).toBe("1");

    // Cleanup
    messageContainerEl.remove();
    backgroundMusic.remove();
    scoreEl.remove();
    highscoreEl.remove();
    levelEl.remove();
    startButton.remove();
  });
});
