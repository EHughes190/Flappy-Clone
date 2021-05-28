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
//sound
//Different character choices
//Particle effects
//session storage

//HIGHSCORE IS UNDER CONSTRUCTION

//SELECTORS
const bird = document.querySelector(".bird");
const scoreDiv = document.querySelector(".score");
const scoreText = document.querySelector(".score__text");
const finalScore = document.getElementById("final-score");
const highScore = document.getElementById("highscore");
const gameContainer = document.querySelector(".game-container");
const startButton = document.querySelector(".button");
const menuButton = document.querySelector(".menu-btn");
const heading = document.querySelector(".heading");
const hole = document.querySelector(".hole");
const pipe = document.querySelector(".pipe");
const modalBg = document.querySelector(".modal-bg");

//VARIABLES
let fired = false;
let gameOver = false;
let isPlaying = false;
let gravity = 5;
let jumping = 0;
let score = 0;
let highscore;
let gravityAnim;
let collisionAnim;
const birdPos = window.getComputedStyle(bird).getPropertyValue("top");
// let executed = false;
// let pipeGapX = 0;

//EVENT LISTENERS
startButton.addEventListener("click", startGame);

menuButton.addEventListener("click", reset);

hole.addEventListener("animationiteration", () => {
  if (!gameOver) {
    updateScore();
    setPipeGapHeight();
  }
});

document.addEventListener("keydown", (e) => {
  if (!fired && !gameOver && (e.key === " " || e.key === "ArrowUp")) {
    fly();
    fired = true;
  }
});

document.addEventListener("click", () => {
  if (isPlaying && !gameOver) {
    fly();
  }
});

document.addEventListener("keyup", () => {
  fired = false;
});

//FUNCTIONS
function startGame() {
  isPlaying = true;
  score = -1;
  scoreDiv.classList.add("visible");
  startButton.style.display = "none";
  heading.style.display = "none";
  scoreText.innerHTML = 0;
  hole.classList.add("animated");
  pipe.classList.add("animated");

  sessionStorage.setItem("highscore", 0);
  console.log(highscore);

  if (!gameOver) {
    applyGravity();
    checkCollisions();
    setPipeGapHeight();
    updateScore();
  }
}

const updateScore = () => {
  score++;
  scoreText.innerHTML = score;
};

const setPipeGapHeight = () => {
  let randomHeight = -(Math.random() * (100 - 40) + 30);
  hole.style.top = randomHeight + "vh";
};

const reset = () => {
  modalBg.classList.remove("bg-active");
  hole.classList.remove("animated");
  pipe.classList.remove("animated");
  startButton.style.display = "initial";
  heading.style.display = "initial";
  scoreDiv.classList.remove("visible");
  gameOver = false;
  bird.style.top = birdPos;
};

const updateHighScore = () => {
  highscore = parseInt(sessionStorage.getItem("highscore"));
  if (highscore !== null) {
    if (score > highscore) {
      sessionStorage.setItem("highscore", score);
    }
  } else {
    sessionStorage.setItem("highscore", score);
  }
};

const endGame = () => {
  updateHighScore();
  modalBg.classList.add("bg-active");
  cancelAnimationFrame(gravityAnim);
  cancelAnimationFrame(collisionAnim);
  gameOver = true;
  isPlaying = false;
  score = 0;
  finalScore.innerHTML = scoreText.innerHTML;
  highScore.innerHTML = highscore;
};

const fly = () => {
  jumping = 1;
  let jumpCount = 0;
  let jumpInterval = setInterval(function () {
    let birdTop = parseInt(
      window.getComputedStyle(bird).getPropertyValue("top")
    );
    if (birdTop >= 90 && jumpCount < 20) {
      bird.style.top = birdTop - gravity + "px";
    }
    if (jumpCount > 25) {
      clearInterval(jumpInterval);
      jumping = 0;
      jumpCount = 0;
    }
    jumpCount++;
  }, 10);
};

const applyGravity = () => {
  let birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));

  //if jumping is pressed, gravity isn't allowed to operate
  if (jumping === 0) {
    bird.style.top = birdTop + gravity * 1.2 + "px";
  }

  gravityAnim = requestAnimationFrame(applyGravity);
};

const checkCollisions = () => {
  let birdBot = parseInt(
    window.getComputedStyle(bird).getPropertyValue("bottom")
  );
  let birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
  let holeRect = hole.getBoundingClientRect();
  let pipeRect = pipe.getBoundingClientRect();
  let birdRect = bird.getBoundingClientRect();
  let holeHeight = parseInt(
    window.getComputedStyle(hole).getPropertyValue("height")
  );
  let birdHeight = parseInt(
    window.getComputedStyle(bird).getPropertyValue("height")
  );

  if (
    birdBot <= 0 ||
    (birdRect.left < pipeRect.right &&
      birdRect.right > pipeRect.left &&
      (birdTop < holeRect.top ||
        birdTop > holeRect.top + (holeHeight - birdHeight)))
  ) {
    endGame();
  }
  collisionAnim = requestAnimationFrame(checkCollisions);
};

// function generatePipe() {
//   if (pipeGapX > 100) {
//     pipeGapX = 0;
//     let pipeLeft = 110;
//     let pipeHole = 30;
//     //Math.random() * (max - min) + min; gives a number within the bounds we set as max and min
//     let randomHeight = Math.random() * (60 - 90) + 90;

//     //Creating pipe on ground
//     const pipe = document.createElement("div");
//     pipe.style.top = randomHeight + "vh";
//     pipe.classList.add("pipe");
//     gameContainer.appendChild(pipe);
//     pipe.style.left = pipeLeft + "vw";

//     //Creating pipe on ceiling
//     const pipe_inverse = document.createElement("div");
//     pipe_inverse.classList.add("pipe");
//     pipe_inverse.style.top = randomHeight - pipeHole - 70 + "vh";
//     gameContainer.appendChild(pipe_inverse);
//     pipe_inverse.style.left = pipeLeft + "vw";

//     //MOVE PIPES FROM RIGHT TO LEFT, DESPAWNING THEM IF OUT OF CONTAINER
//     function movePipe() {
//       pipeLeft -= 2;
//       pipe.style.left = pipeLeft + "vw";
//       pipe_inverse.style.left = pipeLeft + "vw";

//       if (pipe.style.left <= -10 + "vw") {
//         pipe.remove();
//         pipe_inverse.remove();
//       } else {
//COLLISION LOGIC
//   let pipe_rect = pipe.getBoundingClientRect();
//   let pipe_inverse_rect = pipe_inverse.getBoundingClientRect();
//   let bird_rect = bird.getBoundingClientRect();

//   if (pipe_rect.right < bird_rect.left ) {
//     pipe
//   }

//   if (
//     (bird_rect.left <= pipe_rect.right &&
//       bird_rect.right > pipe_rect.left &&
//       bird_rect.top <= pipe_rect.bottom &&
//       bird_rect.bottom >= pipe_rect.top) ||
//     (bird_rect.left <= pipe_inverse_rect.right &&
//       bird_rect.right > pipe_inverse_rect.left &&
//       bird_rect.top <= pipe_inverse_rect.bottom &&
//       bird_rect.bottom >= pipe_inverse_rect.top)
//   ) {
//     alert("Game over");
//   } else
// }
//     }
//     setInterval(movePipe, 40);
//   }

//   pipeGapX++;
//   requestAnimationFrame(generatePipe);
// }
// generatePipe();
//}

// function gameOver() {
//   console.log("Dead");
// }

// function updateScore() {
//   if (!executed) {
//     executed = true;
//     // do something
//     score++;
//     console.log(score);
//     scoreText.innerHTML = score;
//   }
