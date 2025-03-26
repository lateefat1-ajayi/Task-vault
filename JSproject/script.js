const canvas = document.getElementById("gameCanvas")
const scoreDisplay = document.getElementById("score")

const gameMessage = document.getElementById("gameMessage")

const messageText = document.getElementById("messageText")


const ctx = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 320;

let score = 0;

const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 8,
    dx: 3,
    dy: -3,
    color: "#ff6f61"
};

const paddle = {
    width: 80,
    height: 10,
    x: (canvas.width - 80) / 2,
    dx: 7,
    color: "#4caf50"
}

// Brick properties

const brickRowCount = 3;
const brickColumnCount = 6;
const brickWidth = 70;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 15;

let bricks = [];


for(let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];

    for(let r = 0; r < brickRowCount; r++) {

        bricks[c][r] = {x: 0, y: 0, status: 1, color: randomColor() }
    }
}





function randomColor() {
    const colors = ["#ff5733", "#6d1dc", "#36d1dc", "6610f2", "#e91e63", "#2196f3"];


    const unfloored = Math.random() * colors.length;

    const randNum = Math.floor(unfloored)

    return colors [randNum]
}


let rightPressed = false;
let leftPressed = false;


function keyDownHandler (e) {
    if(e.key === "Right" || e.key === "ArrowRight"){

        rightPressed = true;
    } else if(e.key ==="Left" || e.key === "ArrowLeft"){

        leftPressed = true
    }
}


function keyUpHandler (e) {
    if(e.key === "Right" || e.key === "ArrowRight"){

        rightPressed = false;
    } else if(e.key ==="Left" || e.key === "ArrowLeft"){

        leftPressed = false
    }
}


document.addEventListener("keydown", keyDownHandler)
document.addEventListener("keyup", keyUpHandler);


function drawBall() {
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

    ctx.fillstyle = ball.color;
    ctx.fill ();
    ctx.closePath();
}

function drawPaddle () {
    ctx.beginPath()
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height )
    ctx.fillstyle = paddle.color;
    ctx.fill ();
    ctx.closePath();
}

function drawBricks() {

    for(let c = 0; c < brickColumnCount; c++) {

        for(let r = 0; r < brickRowCount; r++) {

            if(bricks[c][r].status === 1) {
                
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].color;

                ctx.fill();
                ctx.closePath();
            };
        }
    }
}

function collisionDetection() {
    for(let c = 0; c < brickColumnCount; c++) {

        for(let r = 0; r < brickRowCount; r++) {

            let brick =bricks [c][r];

            if(brick.status === 1) {

                if(ball.x > brick.x && ball.x < (brick.x + brickWidth) && 
            
                ball.y > brick.y && ball.y < (brick.y + brickHeight)) {


                    ball.dy = -ball.dy
                    brick.status = 0;
                    score += 10;
                    scoreDisplay.innerText = `Score: ${score}`

                    if(score === brickRowCount *  brickColumnCount * 10) {

                        showMessage("You win!")

                    }
                }
            }
        }
    }
}



function showMessage(text) {
    messageText.innerText = text;
    gameMessage.style.display =  "block"
}


function update () {

    ball.x += ball.dx;
    ball.y += ball.dy;

    if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0 ) {
        ball.dx = -ball.dx;
    }

    if(ball.y - ball.radius < 0) {

        ball.dy = - ball.dy;
    } else if(ball.y + ball.radius > canvas.height) {
        showMessage("Game Over!")
    }

    if(ball.y + ball.radius > (canvas.height - paddle.height) &&

    ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        ball.dy = -ball.dy
    }


    collisionDetection();

    if(rightPressed && paddle.x < canvas.width - paddle.width) {

        paddle.x += paddle.dx;
    }else if(leftPressed && paddle.x > 0) {

        paddle.x -= paddle.dx
    }
}


function restartGame() {
    document.location.reload();
}

function gameLoop() {
    ctx.clearRect(0,0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();
    update();
    requestAnimationFrame(gameLoop)
}

gameLoop()