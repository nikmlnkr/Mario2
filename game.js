class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        
        // Game objects
        this.player = new Player(50, 300);
        this.platforms = [];
        this.enemies = [];
        this.coins = [];
        
        // Input handling
        this.keys = {};
        this.setupEventListeners();
        
        // Initialize game
        this.init();
        
        // Start game loop
        this.gameLoop();
    }
    
    init() {
        // Create platforms
        this.platforms = [
            new Platform(0, 350, 800, 50), // Ground
            new Platform(200, 250, 100, 20),
            new Platform(400, 200, 100, 20),
            new Platform(600, 150, 100, 20),
            new Platform(100, 100, 100, 20),
            new Platform(500, 300, 100, 20)
        ];
        
        // Create enemies
        this.enemies = [
            new Enemy(300, 320, 1),
            new Enemy(500, 270, -1),
            new Enemy(650, 120, 1)
        ];
        
        // Create coins
        this.coins = [
            new Coin(250, 200),
            new Coin(450, 150),
            new Coin(650, 100),
            new Coin(150, 50),
            new Coin(550, 250)
        ];
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });
    }
    
    restart() {
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.player = new Player(50, 300);
        this.init();
        this.updateUI();
    }
    
    update() {
        if (this.gameOver) return;
        
        // Update player
        this.player.update(this.keys, this.platforms);
        
        // Update enemies
        this.enemies.forEach(enemy => {
            enemy.update(this.platforms);
        });
        
        // Update coins
        this.coins.forEach(coin => {
            coin.update();
        });
        
        // Check collisions
        this.checkCollisions();
        
        // Check if player fell off screen
        if (this.player.y > this.canvas.height) {
            this.lives--;
            this.player = new Player(50, 300);
            this.updateUI();
            
            if (this.lives <= 0) {
                this.gameOver = true;
            }
        }
    }
    
    checkCollisions() {
        // Player vs Enemies
        this.enemies.forEach(enemy => {
            if (this.player.checkCollision(enemy)) {
                if (this.player.vy > 0 && this.player.y < enemy.y) {
                    // Player jumped on enemy
                    this.enemies = this.enemies.filter(e => e !== enemy);
                    this.score += 100;
                    this.player.vy = -10; // Bounce
                } else {
                    // Player hit enemy
                    this.lives--;
                    this.player = new Player(50, 300);
                    this.updateUI();
                    
                    if (this.lives <= 0) {
                        this.gameOver = true;
                    }
                }
            }
        });
        
        // Player vs Coins
        this.coins.forEach((coin, index) => {
            if (this.player.checkCollision(coin)) {
                this.coins.splice(index, 1);
                this.score += 50;
                this.updateUI();
            }
        });
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.drawBackground();
        
        // Draw platforms
        this.platforms.forEach(platform => platform.draw(this.ctx));
        
        // Draw coins
        this.coins.forEach(coin => coin.draw(this.ctx));
        
        // Draw enemies
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        
        // Draw player
        this.player.draw(this.ctx);
        
        // Draw game over screen
        if (this.gameOver) {
            this.drawGameOver();
        }
    }
    
    drawBackground() {
        // Draw clouds
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(100, 80, 30, 0, Math.PI * 2);
        this.ctx.arc(130, 80, 40, 0, Math.PI * 2);
        this.ctx.arc(160, 80, 30, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(500, 60, 25, 0, Math.PI * 2);
        this.ctx.arc(530, 60, 35, 0, Math.PI * 2);
        this.ctx.arc(560, 60, 25, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText('Click Restart to play again!', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.vx = 0;
        this.vy = 0;
        this.speed = 5;
        this.jumpPower = 15;
        this.gravity = 0.8;
        this.onGround = false;
        this.direction = 1; // 1 for right, -1 for left
    }
    
    update(keys, platforms) {
        // Handle input
        if (keys['ArrowLeft']) {
            this.vx = -this.speed;
            this.direction = -1;
        } else if (keys['ArrowRight']) {
            this.vx = this.speed;
            this.direction = 1;
        } else {
            this.vx = 0;
        }
        
        if (keys['Space'] && this.onGround) {
            this.vy = -this.jumpPower;
            this.onGround = false;
        }
        
        // Apply gravity
        this.vy += this.gravity;
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Check platform collisions
        this.onGround = false;
        platforms.forEach(platform => {
            if (this.checkCollision(platform)) {
                if (this.vy > 0 && this.y < platform.y) {
                    // Landing on platform
                    this.y = platform.y - this.height;
                    this.vy = 0;
                    this.onGround = true;
                } else if (this.vy < 0 && this.y > platform.y + platform.height) {
                    // Hitting platform from below
                    this.y = platform.y + platform.height;
                    this.vy = 0;
                } else if (this.vx > 0 && this.x < platform.x) {
                    // Hitting platform from left
                    this.x = platform.x - this.width;
                } else if (this.vx < 0 && this.x > platform.x + platform.width) {
                    // Hitting platform from right
                    this.x = platform.x + platform.width;
                }
            }
        });
    }
    
    checkCollision(obj) {
        return this.x < obj.x + obj.width &&
               this.x + this.width > obj.x &&
               this.y < obj.y + obj.height &&
               this.y + this.height > obj.y;
    }
    
    draw(ctx) {
        // Draw Mario-like character
        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw hat
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - 2, this.y - 5, this.width + 4, 8);
        
        // Draw overalls
        ctx.fillStyle = '#0066cc';
        ctx.fillRect(this.x + 5, this.y + 15, 8, 15);
        ctx.fillRect(this.x + 17, this.y + 15, 8, 15);
        
        // Draw eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x + 8, this.y + 5, 4, 4);
        ctx.fillRect(this.x + 18, this.y + 5, 4, 4);
        
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + 9, this.y + 6, 2, 2);
        ctx.fillRect(this.x + 19, this.y + 6, 2, 2);
        
        // Draw mustache
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(this.x + 10, this.y + 12, 10, 3);
    }
}

class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    draw(ctx) {
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add some texture
        ctx.fillStyle = '#654321';
        for (let i = 0; i < this.width; i += 20) {
            ctx.fillRect(this.x + i, this.y, 2, this.height);
        }
    }
}

class Enemy {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 25;
        this.vx = direction * 2;
        this.direction = direction;
    }
    
    update(platforms) {
        this.x += this.vx;
        
        // Check if enemy should turn around
        let onPlatform = false;
        platforms.forEach(platform => {
            if (this.x + this.width > platform.x && 
                this.x < platform.x + platform.width &&
                this.y + this.height >= platform.y &&
                this.y + this.height <= platform.y + 5) {
                onPlatform = true;
            }
        });
        
        if (!onPlatform || this.x <= 0 || this.x + this.width >= 800) {
            this.vx *= -1;
            this.direction *= -1;
        }
    }
    
    draw(ctx) {
        // Draw Goomba-like enemy
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw angry face
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x + 5, this.y + 5, 4, 4);
        ctx.fillRect(this.x + 16, this.y + 5, 4, 4);
        
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + 6, this.y + 6, 2, 2);
        ctx.fillRect(this.x + 17, this.y + 6, 2, 2);
        
        // Draw angry eyebrows
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x + 4, this.y + 3, 6, 2);
        ctx.fillRect(this.x + 15, this.y + 3, 6, 2);
        
        // Draw mouth
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + 10, this.y + 15, 5, 2);
    }
}

class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 15;
        this.height = 15;
        this.angle = 0;
    }
    
    update() {
        this.angle += 0.1;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        
        // Draw coin
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2, this.height / 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#b8860b';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw $ symbol
        ctx.fillStyle = '#b8860b';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('$', 0, 4);
        
        ctx.restore();
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
});