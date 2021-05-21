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

const bird = document.querySelector(".bird");
const score = document.querySelector(".score");
const gameContainer = document.querySelector(".game-container");
const startButton = document.querySelector(".button");

let gravity = 3;
let birdTop;
let birdBot;
let fired = false;
let isJumping = false;

startButton.addEventListener("click", startGame);

function startGame() {
  startButton.style.display = "none";

  function applyGravity() {
    //const bird_rect = bird.getBoundingClientRect();
    birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
    //birdBot = parseInt(
    //  window.getComputedStyle(bird).getPropertyValue("bottom")
    //);
    //console.log(bird_rect);
    //if jumping is pressed, gravity isn't allowed to operate
    if (!isJumping) {
      bird.style.top = birdTop + gravity + "px";
    }
  }

  setInterval(applyGravity, 20);

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
    isJumping = true;
    birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
    if (birdTop <= 90) {
      bird.style.top = birdTop;
    } else {
      bird.style.top = birdTop - gravity * 15 + "px";
    }
    isJumping = false;
  }

  function generatePipe() {
    let pipeLeft = 110;
    const pipe = document.createElement("div");
    pipe.classList.add("pipe");
    gameContainer.appendChild(pipe);
    pipe.style.left = pipeLeft + "vw";

    function movePipe() {
      pipeLeft -= 2;
      pipe.style.left = pipeLeft + "vw";

      if (pipe.style.left <= -10 + "vw") {
        pipe.remove();
      }
    }
    setInterval(movePipe, 40);
  }

  setInterval(generatePipe, 1500);
}
