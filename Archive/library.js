document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);


function keyDownHandler(k) {
    if (k.code == 'KeyD' || k.code == 'ArrowRight') {
        action.moveRight = true;
    }
    if (k.code == 'KeyA' || k.code == 'ArrowLeft') {
        action.moveLeft = true;
    }
    if (k.code == 'KeyW' || k.code == 'ArrowUp') {
        action.moveLeft = true;
    }
    if (k.code == 'KeyS' || k.code == 'ArrowDown') {
        action.moveLeft = true;
    }
    if (k.code == 'Space') {
        action.start = true;
    }
}

function keyUpHandler(k) {
    if (k.code == 'KeyD' || k.code == 'ArrowRight') {
        action.moveRight = false;
    }
    if (k.code == 'KeyA' || k.code == 'ArrowLeft') {
        action.moveLeft = false;
    }
    if (k.code == 'KeyW' || k.code == 'ArrowUp') {
        action.moveLeft = false;
    }
    if (k.code == 'KeyS' || k.code == 'ArrowDown') {
        action.moveLeft = false;
    }
    if (k.code == 'Space') {
        action.start = false;
    }
}


function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
    ctx.fillStyle = ball.fillStyle;
    ctx.strokeStyle = ball.strokeStyle;
    ctx.lineWidth = ball.lineWidth;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function drawPaddle(paddle) {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = paddle.fillStyle;
    ctx.strokeStyle = paddle.strokeStyle;
    ctx.lineWidth = paddle.lineWidth;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function drawBrick(brickInit) {
    for (let l = 0; l < brickInit.lineCount; l++) {
        for (let r = 0; r < brickInit.rowCount; r++) {
            if (brick[l][r].alive == true) {
                ctx.beginPath();
                ctx.rect(brick[l][r].x, brick[l][r].y, brickInit.width, brickInit.height);
                // console.log(brick[0][0].x, brick[0][0].y, brickInit.width, brickInit.height);
                ctx.fillStyle = brickInit.fillStyle;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawText(text, textStyle) {
    ctx.font = textStyle.font;
    ctx.fillStyle = textStyle.fillStyle;
    ctx.fillText(text, textStyle.x, textStyle.y);
    // console.log({ctx});
}

function collisionDetection(ball, target) {
    let output = {
        direction: null,
        offset: {
            x: null,
            y: null,
            px: null,
            py: null
        }
    }

    function collisionOutput() {
        output.offset.x = Math.round((ball.x - (target.x * 2 + target.width) / 2) * 100) / 100;
        output.offset.y = Math.round((ball.y - (target.y * 2 + target.height) / 2) * 100) / 100;
        output.offset.px = Math.round(output.offset.x / (target.width / 2) * 100) / 100;
        output.offset.py = Math.round(output.offset.y / (target.height / 2) * 100) / 100;
    }

    if (
        ball.x >= target.x
        && ball.x <= target.x + target.width
        && ball.y >= target.y - ball.r
        && ball.y <= target.y
    ) {
        output.direction = 'up';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x
        && ball.x <= target.x + target.width
        && ball.y >= target.y + target.height
        && ball.y <= target.y + target.height + ball.r
    ) {
        output.direction = 'down';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x - ball.r
        && ball.x <= target.x
        && ball.y >= target.y
        && ball.y <= target.y + target.height
    ) {
        output.direction = 'left';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x + target.width
        && ball.x <= target.x + target.width + ball.r
        && ball.y >= target.y
        && ball.y <= target.y + target.height
    ) {
        output.direction = 'right';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x - ball.r
        && ball.x <= target.x
        && ball.y >= target.y - ball.r
        && ball.y <= target.y
    ) {
        output.direction = 'topleft';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x + target.width
        && ball.x <= target.x + target.width + ball.r
        && ball.y >= target.y - ball.r
        && ball.y <= target.y
    ) {
        output.direction = 'topright';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x - ball.r
        && ball.x <= target.x
        && ball.y >= target.y + target.height
        && ball.y <= target.y + target.height + ball.r
        && Math.pow(Math.pow(ball.y - target.y - target.height, 2) + Math.pow(ball.x - target.x, 2), 0.5) < ball.r
    ) {
        output.direction = 'bottomleft';
        collisionOutput()
        return output;
    }
    if (
        ball.x >= target.x + target.width
        && ball.x <= target.x + target.width + ball.r
        && ball.y >= target.y + target.height
        && ball.y <= target.y + target.height + ball.r
    ) {
        output.direction = 'bottomright';
        collisionOutput()
        return output;
    }
    return output;

}

function tragectoryCurve(ball, hitOffset, curveCoefficient) {
    ball.velocity = Math.pow(ball.vx * ball.vx + ball.vy * ball.vy, 0.5);
    ball.angle = Math.atan(ball.vx / ball.vy) / Math.PI * 180
        + hitOffset * curveCoefficient;
    return {
        vx: Math.round(Math.sin(ball.angle * Math.PI / 180) * 100) / 100,
        vy: Math.round(Math.cos(ball.angle * Math.PI / 180) * 100) / 100
    }
}