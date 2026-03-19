// "./Images/fly_minigame/fly_game_fly_sleep.PNG"

// Constants
const rate = 10; // ms (lower = faster buzzing) - used in FlyController

// Global Variables
let gameActive = true; // Flag to control game state
let result = true; // true = win, false = lose

// Gather all elements needed
const gameArea = document.querySelector('.game-area');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');
const fly = document.getElementById('fly');
const swatter = document.getElementById('swatter');

// Game Loop
checkGameState();


// Functions
function checkGameState() {
    if (gameActive) {
        nextButton.style.display = 'none';
    } else {
        nextButton.style.display = 'inline';
    }
}

// Initialize fly controller
let flyController;
window.addEventListener('DOMContentLoaded', () => {
    if (!gameArea || !fly) return;
    flyController = new FlyController(fly, gameArea, swatter);
});

// Swatter movement based on cursor position
window.addEventListener('DOMContentLoaded', () => {
    if (!gameArea || !swatter) return;

    let areaRect = gameArea.getBoundingClientRect();

    const updateRect = () => {
        areaRect = gameArea.getBoundingClientRect();
    };

    // Fraction offsets of swatter's width to keep consistent scaling cursor alignment 
    const xOffsetFraction = 0/160;
    const yOffsetFraction = 240/160;
    const maxTopBoundaryFraction = 235/160; // swatter top boundary

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
});

// make this into its own file later
export class FlyController {
    constructor(flyElement, gameArea, swatterElem) {
        this.fly = flyElement;
        this.gameArea = gameArea;
        this.swatter = swatterElem;

        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.vx = 0;
        this.vy = 0;
        this.time = 0;
        this.waypointTime = 0;
        this.waypointDuration = Math.random() * 3000 + 1000; // 1-4 seconds per waypoint
        this.noisePhaseX = Math.random() * Math.PI * 2;
        this.noisePhaseY = Math.random() * Math.PI * 2;
        this.isInitialized = false;

        // animation
        this.flyFrames = [
            "./Images/fly_minigame/fly_game_fly_1.PNG",
            "./Images/fly_minigame/fly_game_fly_2.PNG"
        ];
        this.currentFrame = 0;
        this.animationInterval = rate; 
        this.animationTimer = 0;
        
        this.initialize();
        this.generateNewWaypoint();
        this.startAnimation();

        // wall avoidance
        this.wallTime = 0;
        this.wallThreshold = 250; // ms 
        this.wallMargin = 20; // px dist from wall

        // swatter avoidance 
        
    }

    initialize() { // helper
        const rect = this.gameArea.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        // Start fly in center area
        this.x = width * 0.5;
        this.y = height * 0.4;
        this.targetX = this.x;
        this.targetY = this.y;
        this.isInitialized = true;
    }

    generateNewWaypoint() { // helper
        const rect = this.gameArea.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const padding = Math.min(width, height) * 0.15;
        
        // Generate random waypoint (location) within game area 
        this.targetX = padding + Math.random() * (width - padding * 2);
        this.targetY = padding + Math.random() * (height - padding * 2);
        this.waypointTime = 0;
        this.waypointDuration = Math.random() * 2000 + 3000; // 3-5 seconds
        this.noisePhaseX = Math.random() * Math.PI * 2;
        this.noisePhaseY = Math.random() * Math.PI * 2;
    }

    generateEscapeWaypoint() { // helper
        const rect = this.gameArea.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Bias toward center
        const centerX = width * 0.5;
        const centerY = height * 0.5;

        const spread = 0.3; // randomness around center

        this.targetX = centerX + (Math.random() - 0.5) * width * spread;
        this.targetY = centerY + (Math.random() - 0.5) * height * spread;

        this.waypointTime = 0;
        this.waypointDuration = Math.random() * 1500 + 1500; // quicker escape
    }

    getNoiseOffset(phase, time) { // getter
        // Create noise using sine waves at different frequencies
        const amplitude = 8;
        const noise1 = Math.sin(phase + time * 0.003) * amplitude;
        const noise2 = Math.sin(phase * 0.7 + time * 0.002) * amplitude * 0.6;
        return noise1 + noise2;
    }

    update(deltaTime) { // setter
        if (!this.isInitialized) return;

        this.animationTimer += deltaTime;

        if (this.animationTimer >= this.animationInterval) {
            this.animationTimer = 0;
            
            this.currentFrame = (this.currentFrame + 1) % this.flyFrames.length;
            this.fly.src = this.flyFrames[this.currentFrame];
        }

        this.time += deltaTime;
        this.waypointTime += deltaTime;

        // Switch waypoint if duration exceeded
        if (this.waypointTime > this.waypointDuration) {
            this.generateNewWaypoint();
        }

        // Smooth movement toward waypoint with easing
        const progress = Math.min(this.waypointTime / this.waypointDuration, 1);
        const easeProgress = this.easeInOutQuad(progress);
        
        // Calculate start to target movement
        let baseX = this.x + (this.targetX - this.x) * 0.01;
        let baseY = this.y + (this.targetY - this.y) * 0.01;
        
        // Add "noise" to the movement
        const noiseX = this.getNoiseOffset(this.noisePhaseX, this.time);
        const noiseY = this.getNoiseOffset(this.noisePhaseY, this.time);
        
        this.x = baseX + noiseX;
        this.y = baseY + noiseY;
        
        // stay within game area bounds
        const rect = this.gameArea.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const margin = width * 0.05;
        
        this.x = Math.max(margin, Math.min(this.x, width - margin));
        this.y = Math.max(margin, Math.min(this.y, height - margin));

        // detect wall
        const nearLeft = this.x <= this.wallMargin;
        const nearRight = this.x >= width - this.wallMargin;
        const nearTop = this.y <= this.wallMargin;
        const nearBottom = this.y >= height - this.wallMargin;

        const isNearWall = nearLeft || nearRight || nearTop || nearBottom;

        if (isNearWall) {
            this.wallTime += deltaTime;
        } else {
            this.wallTime = 0;
        }

        if (this.wallTime > this.wallThreshold) {
            this.generateEscapeWaypoint();
            this.wallTime = 0;
        }
        
        // Update position
        this.fly.style.left = `${this.x}px`;
        this.fly.style.top = `${this.y}px`;
    }

    easeInOutQuad(t) { // helper
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    startAnimation() { // helper
        let lastTime = Date.now();
        
        const animate = () => {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            
            this.update(deltaTime);
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }
}