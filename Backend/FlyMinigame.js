// TODO: make the FlyController class separable into another file
// NOTE: DEBUG_MODE is referenced below but declared in another script (external global)

// CONSTANTS
const RATE = 60; // ms (lower = faster buzzing) - used in FlyController
const FLY_SPEED = 0.01;
const PAGE_NUM = 77; // guaranteed to be index 77

// DOM REFERENCES
const gameArea = document.querySelector('.game-area');
const gameText = document.getElementById('game-text');
const gameArrows = document.getElementById('game-arrows');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('previous');
const fly = document.getElementById('fly');
const swatter = document.getElementById('swatter');
const flyMusic = document.getElementById('fly-music');

const debugBox = document.createElement('div');
const flyDebugBox = document.createElement('div');
const resultMedia = document.createElement('video');

// GAME STATE GLOBALS
let gameActive = true;      // Flag to control game state
let result = true;          // true = win, false = lose
let timeRemaining = 15000;  // 15000 = 15 seconds in ms - change for debugging
let timerStarted = false;
let flyController;          // fly object

// INITIAL CONDITIONS
nextButton.style.display = 'none';

// PAGE ROUTER INIT
async function initFlyMinigame() { // get json (router)
    await initRouter();

    setCurrPage(77);

    displayPageNumber();
    console.log(getCurrentPage());
}
document.addEventListener("DOMContentLoaded", initFlyMinigame);

// INITIALIZATION (DOMContentLoaded)
// Split into small init functions so each piece stays isolated
// (a guard clause in one won't block the others from running)
function initNavigationButtons() {
    if (!nextButton || !prevButton) {
        console.log("Buttons not found");
        return;
    }

    // initial state
    nextButton.style.display = 'none';

    prevButton.addEventListener('click', () => {
        console.log("Prev clicked");

        if (gameActive) {
            goToPage(76);
        } else {
            window.location.reload();
        }
    });

    nextButton.addEventListener('click', () => {
        console.log("Next clicked");
        goToPage(80);
    });
}

function initFlyController() {
    if (!gameArea || !fly) return;
    flyController = new FlyController(fly, gameArea, swatter);

    if (DEBUG_MODE) { // debug
        debugBox.style.position = 'fixed';
        debugBox.style.border = '2px solid green';
        debugBox.style.pointerEvents = 'none';
        debugBox.style.zIndex = '2';
        document.body.appendChild(debugBox);

        flyDebugBox.style.position = 'fixed';
        flyDebugBox.style.border = '2px solid red';
        flyDebugBox.style.pointerEvents = 'none';
        flyDebugBox.style.zIndex = '2';
        document.body.appendChild(flyDebugBox);
    }
    startTimer();
}

// Swatter movement based on cursor position
function initSwatterMovement() {
    if (!gameArea || !swatter) return;

    let areaRect = gameArea.getBoundingClientRect();

    const updateRect = () => {
        areaRect = gameArea.getBoundingClientRect();
    };

    // Fraction offsets of swatter's width to keep consistent scaling cursor alignment
    const xOffsetFraction = 0 / 160;
    const yOffsetFraction = 240 / 160;
    const maxTopBoundaryFraction = 235 / 160; // swatter top boundary

    const updateSwatterPosition = (event) => {
        const swatterWidth = swatter.offsetWidth;
        const xOffset = xOffsetFraction * swatterWidth;
        const yOffset = yOffsetFraction * swatterWidth;
        const maxTopBoundary = maxTopBoundaryFraction * swatterWidth;

        const currentAreaRect = gameArea.getBoundingClientRect();

        const x = event.clientX - currentAreaRect.left + xOffset;
        let y = event.clientY - currentAreaRect.top + yOffset;

        y = Math.max(y, maxTopBoundary);

        swatter.style.left = `${x}px`;
        swatter.style.top = `${y}px`;
    };

    window.addEventListener('resize', updateRect);
    document.addEventListener('mousemove', updateSwatterPosition);
}

window.addEventListener('DOMContentLoaded', () => {
    initNavigationButtons();
    initFlyController();
    initSwatterMovement();
});


// GAME LOGIC FUNCTIONS
function startMusic() {
    if (!flyMusic) {
        console.log("flyMusic not found");
        return;
    }

    console.log("Trying to play music...");

    flyMusic.currentTime = 0;
    flyMusic.loop = true;

    flyMusic.play().then(() => {
        console.log("Music started");
    }).catch(err => {
        console.log("Play failed:", err);
    });
}

function stopMusic() {
    if (!flyMusic) return;

    flyMusic.pause();
    flyMusic.currentTime = 0;
}

function checkGameState() {
    if (gameActive) {
        nextButton.style.display = 'none';
        gameArea.style.cursor = 'none';
    } else {
        stopMusic();

        // Show cursor again
        gameArea.style.cursor = 'auto';  // or 'default'

        // Hide game elements
        fly.style.display = 'none';
        swatter.style.display = 'none';
        if (gameText) gameText.style.display = 'none';
        if (gameArrows) gameArrows.style.display = 'none';

        const bg = gameArea.querySelector('.game-bg');
        if (bg) bg.style.display = 'none';

        resultMedia.autoplay = true;
        resultMedia.loop = true;
        resultMedia.muted = false;
        resultMedia.playsInline = true;
        resultMedia.style.width = '100%';
        resultMedia.style.height = '100%';
        resultMedia.style.objectFit = 'contain';
        resultMedia.style.display = 'block';

        if (result) loadWin();
        else loadLose();

        gameArea.appendChild(resultMedia);
        gameArea.style.display = 'block';
    }
}

function loadWin() {
    nextButton.style.display = 'inline';
    resultMedia.src = './Images/80.MOV';

    const resultText = document.getElementById('result-text');
    if (resultText) resultText.textContent = "SWATTED";

    setCurrPage(79);
    displayPageNumber();
}

function loadLose() {
    resultMedia.src = './Images/79.MOV';

    const resultText = document.getElementById('result-text');
    if (resultText) resultText.textContent = "Don't swat yourself dumbass!";

    prevButton.textContent = "<Retry";
    setCurrPage(78);
    displayPageNumber();
}

function startTimer() {
    if (timerStarted) return;
    if (!flyController) return;

    timerStarted = true;
    const interval = setInterval(() => {
        timeRemaining -= 100;
        if (timeRemaining <= 0) {
            clearInterval(interval);
            stopMusic();
            flyController.enterSleepMode();
        }
    }, 100);
}

function checkHitOrMiss() {
    if (!flyController) return;

    const flyRect = flyController.getFlyHitbox();
    const swatterRect = flyController.getSwatterHeadRect();

    const hit =
        flyRect.right > swatterRect.left &&
        flyRect.left < swatterRect.right &&
        flyRect.bottom > swatterRect.top &&
        flyRect.top < swatterRect.bottom;

    result = hit; // true if hit, false if miss
    console.log(hit ? "Hit" : "Miss");
}

// EVENT LISTENERS (music activation, click / swat)
window.addEventListener('mousedown', () => { // activate music
    if (gameActive) {
        //startMusic();
    }
}, { once: true });

// listens for clicks
if (gameArea) {
    gameArea.addEventListener('mousedown', () => {
        if (!gameActive) return;

        checkHitOrMiss();
        gameActive = false;

        stopMusic();

        checkGameState();
    });
}