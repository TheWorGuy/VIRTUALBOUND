// "./Images/fly_minigame/fly_game_fly_1.PNG"
// "./Images/fly_minigame/fly_game_fly_2.PNG"
// "./Images/fly_minigame/fly_game_fly_sleep.PNG"
// "./Images/fly_minigame/fly_game_swat.PNG"

// Swatter movement based on cursor position
window.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.querySelector('.game-area');
    const swatter = document.getElementById('swatter');

    if (!gameArea || !swatter) return;

    let areaRect = gameArea.getBoundingClientRect();

    const updateRect = () => {
        areaRect = gameArea.getBoundingClientRect();
    };

    // Fraction offsets of swatter's width to keep consistent scaling cursor alignment 
    const xOffsetFraction = 0/160;
    const yOffsetFraction = 190/160;

    const updateSwatterPosition = (event) => {
        const swatterWidth = swatter.offsetWidth;
        const xOffset = xOffsetFraction * swatterWidth;
        const yOffset = yOffsetFraction * swatterWidth;

        const x = event.clientX - areaRect.left + xOffset;
        const y = event.clientY - areaRect.top + yOffset;

        swatter.style.left = `${x}px`;
        swatter.style.top = `${y}px`;
    };

    window.addEventListener('resize', updateRect);
    document.addEventListener('mousemove', updateSwatterPosition);
});

