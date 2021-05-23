//FLAPPY BIRD
//BIRD FALLS UNLESS TAPPING SCREEN/ PRESSING SPACE. BIRD FIXED IN X DIRECTION
//IF BIRD HITS GROUND -> GAME OVER
//PIPES MOVE RIGHT TO LEFT WITH SET INTERVAL, AND SET GAP BETWEEN PAIRS OF PIPES, BUT WITH RANDOM PLACEMENT OF GAPS.
//SCORE INCREASES BY 1 AS PLAYER PASSES THROUGH EACH GAP. IF BIRD HITS PIPE -> GAME OVER.

//MAKE BIRD FALL
//MAKE BIRD NOT FALL IF TAPPING BUTTON OR CLICKING
//MAKE START BUTTON BEGIN BIRD FALLING, OTHERWISE NOT FALLING
//MAKE PIPES MOVE RIGHT TO LEFT
//MAKE COLLISION LOGIC
//INCREASE SCORE WITH SUCCESS AT DODGING.
//RESET ALL VALUES IF DEATH.
//NOTE: PIXEL VALUES OPERATE AT 0,0 FROM THE TOP LEFT OF THE DISPLAY, SO AS BIRD FALLS, PIXEL POSITION INCREASES

//DIFFIULTY? DECREASE GAP SIZE OVER TIME? RANDOM GAP SIZE IN A RANGE?
//Rainbow colours of pipes
//Different character choices
//Particle effects

const bird = document.querySelector(".bird");
const score = document.querySelector(".score");
const gameContainer = document.querySelector(".game-container");
const startButton = document.querySelector(".button");

let gravity = 5;
let pipeGapX = 0;
let birdTop;
let birdBot;
let fired = false;
let jumping = 0;

startButton.addEventListener("click", startGame);

function startGame() {
  startButton.style.display = "none";

  function applyGravity() {
    birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
    birdBot = parseInt(
      window.getComputedStyle(bird).getPropertyValue("bottom")
    );
    //if jumping is pressed, gravity isn't allowed to operate
    if (jumping === 0) {
      bird.style.top = birdTop + gravity * 1.2 + "px";
    }

    if (birdBot <= 0) {
      setTimeout(gameOver, 1);
    }
    requestAnimationFrame(applyGravity);
  }

  applyGravity();

  document.addEventListener("keydown", () => {
    if (!fired) {
      fly();
      fired = true;
    }
  });

  document.addEventListener("keyup", () => {
    fired = false;
  });

  function fly() {
    jumping = 1;
    let jumpCount = 0;
    let jumpInterval = setInterval(function () {
      birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
      if (birdTop >= 90 && jumpCount < 15) {
        bird.style.top = birdTop - gravity + "px";
      }
      if (jumpCount > 20) {
        clearInterval(jumpInterval);
        jumping = 0;
        jumpCount = 0;
      }
      jumpCount++;
    }, 10);
  }

  function generatePipe() {
    if (pipeGapX > 100) {
      pipeGapX = 0;
      let pipeLeft = 110;
      let pipeHole = 30;
      //Math.random() * (max - min) + min; gives a number within the bounds we set as max and min
      let randomHeight = Math.random() * (60 - 90) + 90;

      //Creating pipe on ground
      const pipe = document.createElement("div");
      pipe.style.top = randomHeight + "vh";
      pipe.classList.add("pipe");
      gameContainer.appendChild(pipe);
      pipe.style.left = pipeLeft + "vw";

      //Creating pipe on ceiling
      const pipe_inverse = document.createElement("div");
      pipe_inverse.classList.add("pipe");
      pipe_inverse.style.top = randomHeight - pipeHole - 70 + "vh";
      gameContainer.appendChild(pipe_inverse);
      pipe_inverse.style.left = pipeLeft + "vw";

      //MOVE PIPES FROM RIGHT TO LEFT, DESPAWNING THEM IF OUT OF CONTAINER
      function movePipe() {
        pipeLeft -= 2;
        pipe.style.left = pipeLeft + "vw";
        pipe_inverse.style.left = pipeLeft + "vw";

        if (pipe.style.left <= -10 + "vw") {
          pipe.remove();
          pipe_inverse.remove();
        } else {
          //COLLISION LOGIC
          let pipe_rect = pipe.getBoundingClientRect();
          let pipe_inverse_rect = pipe_inverse.getBoundingClientRect();
          bird_rect = bird.getBoundingClientRect();

          if (
            bird_rect.left <= pipe_rect.right &&
            bird_rect.right > pipe_rect.left &&
            bird_rect.top <= pipe_rect.bottom &&
            bird_rect.bottom >= pipe_rect.top
          ) {
            alert("Game over");
          }

          //
        }
      }
      setInterval(movePipe, 40);
    }

    pipeGapX++;
    requestAnimationFrame(generatePipe);
  }
  generatePipe();
}

function gameOver() {
  console.log("Dead");
}
