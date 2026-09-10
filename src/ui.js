class UIManager {
    constructor() {
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('dino_highscore')) || 0;
        this.gameOver = false;
        
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.finalScoreElement = document.getElementById('final-score');
        
        this.updateDisplay();
    }
    
    updateScore(points) {
        this.score += points;
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.scoreElement.textContent = `Score: ${Math.floor(this.score)}`;
        this.highScoreElement.textContent = `High Score: ${Math.floor(this.highScore)}`;
    }
    
    showGameOver() {
        this.gameOver = true;
        this.gameOverScreen.classList.remove('hidden');
        this.finalScoreElement.textContent = `Score: ${Math.floor(this.score)}`;
        
        // Update high score if needed
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('dino_highscore', Math.floor(this.highScore));
            this.updateDisplay();
        }
    }
    
    hideGameOver() {
        this.gameOver = false;
        this.gameOverScreen.classList.add('hidden');
    }
    
    reset() {
        this.score = 0;
        this.gameOver = false;
        this.hideGameOver();
        this.updateDisplay();
    }
    
    isGameOver() {
        return this.gameOver;
    }
}
