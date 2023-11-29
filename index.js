// Welcome to
// ... (your banner)
// This file can be a nice home for your Battlesnake logic and helper functions.
// For more info see docs.battlesnake.com

import runServer from './server.js';

function info() {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "snakesonaplane",
    color: "#47dc7a",
    head: "do-sammy",
    tail: "do-sammy",
  };
}

function start(gameState) {
  console.log("GAME START");
}

function end(gameState) {
  console.log("GAME OVER\n");
}

function move(gameState) {

  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true
  };

  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {
    isMoveSafe.left = false;

  } else if (myNeck.x > myHead.x) {
    isMoveSafe.right = false;

  } else if (myNeck.y < myHead.y) {
    isMoveSafe.down = false;

  } else if (myNeck.y > myHead.y) {
    isMoveSafe.up = false;
  }

  // Step 1 - Prevent your Battlesnake from moving out of bounds
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;

  if (myHead.x === 0) {
    isMoveSafe.left = false;
  }
  if (myHead.y === 0) {
    isMoveSafe.down = false;
  }
  if (myHead.x === boardWidth - 1) {
    isMoveSafe.right = false;
  }
  if (myHead.y === boardHeight - 1) {
    isMoveSafe.up = false;
  }

  // Step 2 - Prevent your Battlesnake from colliding with itself
  const myBody = gameState.you.body;
  myBody.forEach((segment) => {
    Object.keys(isMoveSafe).forEach((dir) => {
      if (
        (dir === "up" && myHead.y - 1 === segment.y && myHead.x === segment.x) ||
        (dir === "down" && myHead.y + 1 === segment.y && myHead.x === segment.x) ||
        (dir === "left" && myHead.x - 1 === segment.x && myHead.y === segment.y) ||
        (dir === "right" && myHead.x + 1 === segment.x && myHead.y === segment.y)
      ) {
        isMoveSafe[dir] = false;
      }
    });
  });

  // Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  const opponents = gameState.board.snakes;
  opponents.forEach((snake) => {
    snake.body.forEach((segment) => {
      Object.keys(isMoveSafe).forEach((dir) => {
        if (
          (dir === "up" && myHead.y - 1 === segment.y && myHead.x === segment.x) ||
          (dir === "down" && myHead.y + 1 === segment.y && myHead.x === segment.x) ||
          (dir === "left" && myHead.x - 1 === segment.x && myHead.y === segment.y) ||
          (dir === "right" && myHead.x + 1 === segment.x && myHead.y === segment.y)
        ) {
          isMoveSafe[dir] = false;
        }
      });
    });
  });

  const safeMoves = Object.keys(isMoveSafe).filter((key) => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  // Step 4 - Move towards food instead of random, to regain health and survive longer
  const food = gameState.board.food;
  const headX = myHead.x;
  const headY = myHead.y;

  const foodMoves = food.map((foodItem) => {
    const dx = foodItem.x - headX;
    const dy = foodItem.y - headY;

    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? "right" : "left";
    } else {
      return dy > 0 ? "up" : "down";
    }
  });

  const validFoodMoves = foodMoves.filter((move) => isMoveSafe[move]);
  const nextMove = validFoodMoves.length > 0 ? validFoodMoves[0] : safeMoves[0];

  console.log(`MOVE ${gameState.turn}: ${nextMove}`);
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});
