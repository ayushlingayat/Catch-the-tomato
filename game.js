document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const basket = document.getElementById('basket');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const gameOverDisplay = document.getElementById('game-over');
    const restartButton = document.getElementById('restart-button');

    let score = 0;
    let lives = 3;
    let gameInterval;
    let isGameRunning = false;

    const moveBasket = (event) => {
        const gameContainerRect = gameContainer.getBoundingClientRect();
        let x = event.clientX - gameContainerRect.left - basket.offsetWidth / 2;
        x = Math.max(0, Math.min(x, gameContainer.offsetWidth - basket.offsetWidth));
        basket.style.left = `${x}px`;
    };

    const createFallingObject = () => {
        const object = document.createElement('div');
        object.classList.add('absolute', 'top-0', 'falling-object');
        object.style.left = `${Math.random() * (gameContainer.offsetWidth - 30)}px`;
        gameContainer.appendChild(object);

        const fall = () => {
            if (!document.body.contains(object)) return;
            let objectTop = parseInt(window.getComputedStyle(object).top);
            object.style.top = `${objectTop + 5}px`;

            if (objectTop > gameContainer.offsetHeight - 50) {
                const basketRect = basket.getBoundingClientRect();
                const objectRect = object.getBoundingClientRect();

                if (
                    objectRect.left < basketRect.right &&
                    objectRect.right > basketRect.left &&
                    objectRect.bottom > basketRect.top
                ) {
                    
                    score++;
                    
                    scoreDisplay.textContent = `Score: ${score}`;
                    object.remove();
                } else if (objectTop > gameContainer.offsetHeight) {
                    lives--;
                    livesDisplay.textContent = `Lives: ${lives}`;
                    object.remove();
                    if (lives === 0) gameOver();
                }
            }

            requestAnimationFrame(fall);
        };

        requestAnimationFrame(fall);
    };

    const startGame = () => {
        if (isGameRunning) return;
        isGameRunning = true;
        score = 0;
        lives = 3;
        scoreDisplay.textContent = `Score: ${score}`;
        livesDisplay.textContent = `Lives: ${lives}`;
        gameOverDisplay.style.display = 'none';
        restartButton.style.display = 'none';
        gameInterval = setInterval(createFallingObject, 1000);
    };

    const stopGame = () => {
        isGameRunning = false;
        clearInterval(gameInterval);
        document.querySelectorAll('.falling-object').forEach(object => object.remove());
    };

    const gameOver = () => {
        stopGame();
        gameOverDisplay.style.display = 'block';
        restartButton.style.display = 'block';
    };

    restartButton.addEventListener('click', startGame);
    document.addEventListener('mousemove', moveBasket);

    startGame();
});