// Sample Battlesnake in JavaScript

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

// Move function - this is where the magic happens
function move(body) {
  // Extract data from the request
  const board = body.board;
  const you = body.you;

  // Find your snake's head coordinates
  const head = you.head;

  // Determine possible moves
  const possibleMoves = ["up", "down", "left", "right"];

  // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
  if (head.x === 0) {
    possibleMoves.splice(possibleMoves.indexOf("left"), 1);
  }
  if (head.y === 0) {
    possibleMoves.splice(possibleMoves.indexOf("down"), 1);
  }
  if (head.x === board.width - 1) {
    possibleMoves.splice(possibleMoves.indexOf("right"), 1);
  }
  if (head.y === board.height - 1) {
    possibleMoves.splice(possibleMoves.indexOf("up"), 1);
  }

  // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
  const myBody = you.body;
  myBody.forEach((segment) => {
    possibleMoves.forEach((dir, index) => {
      if (
        (dir === "up" && head.y - 1 === segment.y && head.x === segment.x) ||
        (dir === "down" && head.y + 1 === segment.y && head.x === segment.x) ||
        (dir === "left" && head.x - 1 === segment.x && head.y === segment.y) ||
        (dir === "right" && head.x + 1 === segment.x && head.y === segment.y)
      ) {
        possibleMoves.splice(index, 1);
      }
    });
  });

  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  const opponents = board.snakes;
  opponents.forEach((snake) => {
    snake.body.forEach((segment) => {
      possibleMoves.forEach((dir, index) => {
        if (
          (dir === "up" && head.y - 1 === segment.y && head.x === segment.x) ||
          (dir === "down" && head.y + 1 === segment.y && head.x === segment.x) ||
          (dir === "left" && head.x - 1 === segment.x && head.y === segment.y) ||
          (dir === "right" && head.x + 1 === segment.x && head.y === segment.y)
        ) {
          possibleMoves.splice(index, 1);
        }
      });
    });
  });

  // Choose a random valid move
  const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

  // Send the response
  return ({
    move: move,
  });
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});