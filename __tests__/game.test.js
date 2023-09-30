/**
 * @vitest-environment happy-dom
 */
import { beforeEach, expect, test, vi } from "vitest";
// TODO check this reference to test the DOM: https://github.com/capricorn86/happy-dom/wiki/Getting-started#installation
// import { Window } from "happy-dom";
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
} from "../tetris/src/game";

beforeEach(async () => {
  await setLevel(1);
  await setScoreValue(0);
});

// Verify that tests is working correctly
test("testing tests", () => {
  expect(Math.sqrt(4)).toBe(2);
});

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

// Test case: Testing score update with level increase
test("Update score, level, and game speed when completing 10 full lines", () => {
  // Set initial level, completed rows, and game speed
  setLevel(1);
  setGameSpeed(500);
  setCompletedRows(10);

  // Call updateScore with 10 full lines completed
  updateScore();

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

  // Call updateScore with 3 full lines completed (less than 10)
  updateScore();

  // Assert that the level remains the same (level 4)
  expect(getLevel()).toBe(4);

  // Assert that the game speed is updated based on the new level
  expect(getGameSpeed()).toBe(420); // Calculated based on initialGameSpeed - level * 20
});

// Test case: Test if the game is correctly marked as over (isGameOver is set to true):
test("Game Over: Check if isGameOver is set to true", () => {
  // Set up initial game state (e.g., isGameOver is initially false)
  // Call the gameOver function
  gameOver();

  // Assert that isGameOver is now true
  expect(getIsGameOver()).toBe(true); // Replace getIsGameOver with your actual getter function
});
