import logo from "./logo.svg";
import "./App.css";
import React, { useEffect } from "react";

function App() {
  let ctx = {};
  const setFillStyle = () => {
    ctx.fillStyle = "rgb(0, 0, 0)";
  };
  const CELL_SIZE = 10;
  const RECT_WIDTH = CELL_SIZE,
    RECT_HEIGHT = CELL_SIZE,
    SPACING = 3;
  const placeRect = (x, y) => {
    ctx.fillRect(x, y, RECT_WIDTH, RECT_HEIGHT);
  };
  const clearRect = (x, y) => {
    ctx.clearRect(x, y, RECT_WIDTH, RECT_HEIGHT);
  };
  const drawRect = (x, y, w, h) => {
    ctx.fillRect(x, y, w, h);
  };
  let state = [];
  let state_width = 80,
    state_height = 80;
  for (let y = 0; y < state_height; y++) {
    state.push(Array(state_width));
  }
  for (let y = 0; y < state_height; y++) {
    for (let x = 0; x < state_width; x++) {
      state[y][x] = Math.random() > 0.9;
    }
  }

  let interval = null;
  const sample = (x, y) => {
    /**
		|----|----|-----|
		| B  | C  |  D  |
		|----|----|-----|
		| A  | x  |  E  |
		|----|----|-----|
		| H  | G  |  F  |
		|----|----|-----|
		 */
    const x_min_clamp = x - 1 < 0 ? x : x - 1;
    const y_min_clamp = y - 1 < 0 ? y : y - 1;
    let x_max_clamp = x + 1;
    let y_max_clamp = y + 1;
    if (x + 1 >= state.length) {
      x_max_clamp = x;
    }
    if (y + 1 >= state[0].length) {
      y_max_clamp = y;
    }
    const A = state[x_min_clamp][y];
    const B = state[x_min_clamp][y_min_clamp];
    const C = state[x][y_min_clamp];
    const D = state[x_max_clamp][y_min_clamp];
    const E = state[x_max_clamp][y];
    const F = state[x_max_clamp][y_max_clamp];
    const G = state[x][y_max_clamp];
    const H = state[x_min_clamp][y_max_clamp];
    return A + B + C + D + E + F + G + H;
  };
  const step = () => {
    let row = 0,
      col = 0;
    for (row = 0; row < state.length; row++) {
      for (col = 0; col < state[row].length; col++) {
        if (state[row][col]) {
          placeRect(col * CELL_SIZE, row * CELL_SIZE);
        } else {
          clearRect(col * CELL_SIZE, row * CELL_SIZE);
        }
      }
    }
    let count = 0;
    for (row = 0; row < state.length; row++) {
      for (col = 0; col < state[row].length; col++) {
        count = sample(row, col);
        if (state[row][col]) {
          /**
           * Any live cell with fewer than two live neighbours dies, as if by underpopulation
           */
          if (count < 2) {
            state[row][col] = 0;
            continue;
          }
          /**
           * Any live cell with two or three live neighbours lives on to the next generation.
           */
          if (count === 2 || count === 3) {
            continue;
          }
          // Any live cell with more than three live neighbours dies, as if by overpopulation
          if (count > 3) {
            state[row][col] = 0;
            continue;
          }
        } else {
          // dead cell
          // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction
          if (count === 3) {
            state[row][col] = 1;
            continue;
          }
        }
      }
    }
  };
  useEffect(() => {
    const canvas = document.getElementById("tutorial");
    if (canvas.getContext) {
      ctx = canvas.getContext("2d");

      setFillStyle();
      interval = setInterval(step, 100);
    }
  }, []);

  return (
    <div>
      <div className="container-fluid">
        <canvas id="tutorial" width="950" height="950"></canvas>
      </div>
    </div>
  );
}

export default App;
