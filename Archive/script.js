'use strict';

let canvas = document.getElementById('canvas1');
let ctx = canvas.getContext('2d');
let liveCount = 3;

let game = {
  condition: 'waiting',
  liveCount: 3
}

console.log(canvas);

let action = {
  moveLeft: false,
  moveRight: false,
  start: false
}

let ball = {
  x: Math.round(canvas.width / 2),
  y: 260, //Math.round(canvas.height - canvas.height / 9),
  r: Math.round(Math.min(canvas.width, canvas.height) / 32),
  vx: 0,
  vy: 0,
  lineWidth: 1,
  fillStyle: '#FFFFFF',
  strokeStyle: '#000000',
  clipped: false
}
ball.angle = Math.atan(ball.vx / ball.vy) / Math.PI * 180;
ball.velocity = Math.pow(ball.vx * ball.vx + ball.vy * ball.vy, 0.5);

console.log({ ball });

let paddle = {
  x: canvas.width / 2 - canvas.width / 8,
  y: 280, //canvas.height - canvas.height / 20,
  vx: canvas.width / 300,
  width: canvas.width / 4,
  height: 50, //canvas.height / 32,
  curve: 30,
  lineWidth: 1,
  fillStyle: '#FFFFFF',
  strokeStyle: '#000000'
}

console.log({ paddle });

let textStyle = {
  x: 50,
  y: 100,
  font: '48px serif',
  fillStyle: '#35A1FF'
}

let brickInit = {
  startX: 2,
  startY: 2,
  lineCount: 1,
  rowCount: 8,
  // width: canvas.width/brickInit.lineCount, //160,
  height: 20,
  gapWidth: 200,
  gapHeight: 10,
  fillStyle: '#35A1FF'
}
brickInit.width = (canvas.width - (brickInit.lineCount + 1) * brickInit.gapWidth) / brickInit.lineCount;
brickInit.aliveCount = brickInit.lineCount * brickInit.rowCount;

console.log({ brickInit });

let brick = [];

for (let l = 0; l < brickInit.lineCount; l++) {
  brick[l] = [];
  let x = brickInit.gapWidth + l * (brickInit.width + brickInit.gapWidth);
  let y = brickInit.gapHeight;
  for (let r = 0; r < brickInit.rowCount; r++) {
    brick[l][r] = {
      x: x,
      y: y,
      width: brickInit.width,
      height: brickInit.height,
      alive: true
    }
    y += brickInit.height + brickInit.gapHeight;
  }
}

// console.log({ brick });

function draw() {
  // Движение мяча
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x <= ball.r) {
    ball.x = ball.r;
    ball.vx = -ball.vx;
  }
  if (ball.x >= canvas.width - ball.r) {
    ball.x = canvas.width - ball.r;
    ball.vx = -ball.vx;
  }
  if (ball.y <= ball.r) {
    ball.y = ball.r;
    ball.vy = -ball.vy;
  }
  if (ball.y >= canvas.height - ball.r) {
    ball.y = canvas.height - ball.r
    ball.vy = -ball.vy;
  }

  
  // Взаимодействие мяча с подложкой
  let paddleBallCollision = collisionDetection(ball, paddle);
  if (paddleBallCollision.direction != null && ball.clipped == false) {
    console.log('1', ball.vx);
    ball.clipped = true;
    let ballCurve = tragectoryCurve(ball, paddleBallCollision.offset.px, paddle.curve);
    ball.vx = ballCurve.vx;
    ball.vy = -ballCurve.vy;
    console.log('2', ball.vx);
    console.log(paddleBallCollision);
  }


  if (ball.clipped == true && ball.y > paddle.y - ball.r) { ball.clipped = false }

  // console.log(ball);

  // Условия победы/ поражения
  if (ball.y >= canvas.height - ball.r) {
    game.condition = 'loose';
    ball.vx = 0;
    ball.vy = 0;
  } else if (brickInit.aliveCount == 0) {
    game.condition = 'win';
    ball.vx = 0;
    ball.vy = 0;
  }

  // Столкновения с кирпичами
  for (let l = 0; l < brickInit.lineCount; l++) {
    for (let r = 0, tmp = 0; r < brickInit.rowCount; r++) {
      let collision = collisionDetection(ball, brick[l][r]);
      // console.log(collision);
      if ((collision.direction == 'up' || collision.direction == 'down') && brick[l][r].alive == true) {
        ball.vy = -ball.vy;
        brick[l][r].alive = false;
        brickInit.aliveCount--;
        console.log(collision)
      }
      if ((collision.direction == 'left' || collision.direction == 'right') && brick[l][r].alive == true) {
        ball.vx = -ball.vx;
        brick[l][r].alive = false;
        brickInit.aliveCount--;
        console.log(collision)
      }
      if ((collision.direction == 'topleft' || collision.direction == 'bottomright') && brick[l][r].alive == true) {
        tmp = ball.vx;
        ball.vx = -ball.vy;
        ball.vy = -tmp;
        brick[l][r].alive = false;
        brickInit.aliveCount--;
        console.log(collision)
      }
      if ((collision.direction == 'bottomleft' || collision.direction == 'topright') && brick[l][r].alive == true) {
        tmp = ball.vx;
        ball.vx = ball.vy;
        ball.vy = tmp;
        brick[l][r].alive = false;
        brickInit.aliveCount--;
        console.log(collision)
      }
    }
  }


  // Движение подложки
  if (action.moveRight == true) {
    paddle.x += paddle.vx;
    game.condition == 'waiting' ? ball.x += paddle.vx : 0;
  }
  if (action.moveLeft == true) {
    paddle.x -= paddle.vx;
    game.condition == 'waiting' ? ball.x -= paddle.vx : 0;
  }
  if (paddle.x >= canvas.width - paddle.width) {
    paddle.x = canvas.width - paddle.width;
    game.condition == 'waiting' ? ball.x = canvas.width - paddle.width / 2 : 0;
  }
  if (paddle.x <= 0) {
    paddle.x = 0;
    game.condition == 'waiting' ? ball.x = paddle.width / 2 : 0;

  }

  if (action.start == true && game.condition == 'waiting'
  ) {
    // ball.vy = - Math.random() * 2;
    // ball.vx = Math.pow(2 * 2 - ball.vy * ball.vy, 0.5);
    ball.vy = - 1;
    ball.vx = 0;
    game.condition = 'game';
  }


  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (game.condition == 'game' && game.condition != 'win') {
    drawBall(ball);
    drawPaddle(paddle);
    drawBrick(brickInit);
    requestAnimationFrame(draw);
  } else {
    drawBall(ball);
    drawPaddle(paddle);
    drawBrick(brickInit);
    if (game.condition == 'loose') {
      drawText('Game Over', textStyle);
    } else if (game.condition == 'win') {
      drawText('You Win', textStyle);
    } else {
      drawText('Press Space', textStyle);
    }
    requestAnimationFrame(draw);
  }
}

draw();