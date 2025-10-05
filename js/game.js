class HabboGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.miniMapCanvas = document.getElementById('miniMap');
        this.miniMapCtx = this.miniMapCanvas.getContext('2d');
        
        this.player = {
            x: userData.x * 32,
            y: userData.y * 32,
            width: 32,
            height: 32,
            speed: 3,
            isRunning: false,
            color: '#3498db'
        };
        
        this.map = {
            width: 25,
            height: 19,
            tileSize: 32,
            tiles: []
        };
        
        this.keys = {};
        this.gameLoop = null;
        this.lastTime = 0;
        this.fps = 0;
        
        this.init();
    }
    
    init() {
        this.generateMap();
        this.setupEventListeners();
        this.startGameLoop();
        this.hideLoadingScreen();
    }
    
    generateMap() {
        // Gerar mapa simples com paredes nas bordas e alguns obstáculos
        for (let x = 0; x < this.map.width; x++) {
            this.map.tiles[x] = [];
            for (let y = 0; y < this.map.height; y++) {
                // Bordas são paredes (1), interior é chão (0)
                if (x === 0 || y === 0 || x === this.map.width - 1 || y === this.map.height - 1) {
                    this.map.tiles[x][y] = 1; // Parede
                } else {
                    this.map.tiles[x][y] = 0; // Chão
                }
            }
        }
        
        // Adicionar alguns obstáculos aleatórios
        this.addRandomObstacles(15);
    }
    
    addRandomObstacles(count) {
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * (this.map.width - 4)) + 2;
            const y = Math.floor(Math.random() * (this.map.height - 4)) + 2;
            this.map.tiles[x][y] = 1;
        }
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Shift para correr
            if (e.key === 'Shift') {
                this.player.isRunning = true;
                this.player.speed = 6;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            
            if (e.key === 'Shift') {
                this.player.isRunning = false;
                this.player.speed = 3;
            }
        });
        
        // Botão salvar
        document.getElementById('btnSave').addEventListener('click', () => {
            this.saveGame();
        });
    }
    
    update(deltaTime) {
        this.handleInput();
        this.checkCollisions();
        this.updateUI();
    }
    
    handleInput() {
        let moveX = 0;
        let moveY = 0;
        
        if (this.keys['w'] || this.keys['arrowup']) moveY = -1;
        if (this.keys['s'] || this.keys['arrowdown']) moveY = 1;
        if (this.keys['a'] || this.keys['arrowleft']) moveX = -1;
        if (this.keys['d'] || this.keys['arrowright']) moveX = 1;
        
        // Normalizar movimento diagonal
        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707;
            moveY *= 0.707;
        }
        
        this.player.x += moveX * this.player.speed;
        this.player.y += moveY * this.player.speed;
    }
    
    checkCollisions() {
        // Colisão com paredes do mapa
        const playerTileX = Math.floor(this.player.x / this.map.tileSize);
        const playerTileY = Math.floor(this.player.y / this.map.tileSize);
        
        // Verificar colisão nos 4 cantos do personagem
        const corners = [
            { x: playerTileX, y: playerTileY }, // superior esquerdo
            { x: playerTileX + 1, y: playerTileY }, // superior direito
            { x: playerTileX, y: playerTileY + 1 }, // inferior esquerdo
            { x: playerTileX + 1, y: playerTileY + 1 } // inferior direito
        ];
        
        for (const corner of corners) {
            if (this.isWall(corner.x, corner.y)) {
                // Empurrar o jogador para fora da parede
                if (this.player.x < corner.x * this.map.tileSize) {
                    this.player.x = corner.x * this.map.tileSize - this.player.width;
                }
                if (this.player.x + this.player.width > corner.x * this.map.tileSize) {
                    this.player.x = corner.x * this.map.tileSize + this.map.tileSize;
                }
                if (this.player.y < corner.y * this.map.tileSize) {
                    this.player.y = corner.y * this.map.tileSize - this.player.height;
                }
                if (this.player.y + this.player.height > corner.y * this.map.tileSize) {
                    this.player.y = corner.y * this.map.tileSize + this.map.tileSize;
                }
            }
        }
        
        // Manter jogador dentro dos limites do mapa
        this.player.x = Math.max(0, Math.min(this.player.x, this.canvas.width - this.player.width));
        this.player.y = Math.max(0, Math.min(this.player.y, this.canvas.height - this.player.height));
    }
    
    isWall(x, y) {
        if (x < 0 || x >= this.map.width || y < 0 || y >= this.map.height) {
            return true;
        }
        return this.map.tiles[x][y] === 1;
    }
    
    render() {
        // Limpar canvas
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Desenhar mapa
        this.drawMap();
        
        // Desenhar jogador
        this.drawPlayer();
        
        // Atualizar mini mapa
        this.updateMiniMap();
    }
    
    drawMap() {
        for (let x = 0; x < this.map.width; x++) {
            for (let y = 0; y < this.map.height; y++) {
                const tileX = x * this.map.tileSize;
                const tileY = y * this.map.tileSize;
                
                if (this.map.tiles[x][y] === 1) {
                    // Parede
                    this.ctx.fillStyle = '#7f8c8d';
                    this.ctx.fillRect(tileX, tileY, this.map.tileSize, this.map.tileSize);
                    this.ctx.strokeStyle = '#95a5a6';
                    this.ctx.strokeRect(tileX, tileY, this.map.tileSize, this.map.tileSize);
                } else {
                    // Chão
                    this.ctx.fillStyle = '#34495e';
                    this.ctx.fillRect(tileX, tileY, this.map.tileSize, this.map.tileSize);
                    this.ctx.strokeStyle = '#2c3e50';
                    this.ctx.strokeRect(tileX, tileY, this.map.tileSize, this.map.tileSize);
                }
            }
        }
    }
    
    drawPlayer() {
        // Corpo do personagem
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Detalhes do personagem
        this.ctx.fillStyle = '#2980b9';
        this.ctx.fillRect(this.player.x + 8, this.player.y + 8, 16, 16);
        
        // Olhos
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.player.x + 10, this.player.y + 12, 4, 4);
        this.ctx.fillRect(this.player.x + 18, this.player.y + 12, 4, 4);
    }
    
    updateMiniMap() {
        const scale = 150 / (this.map.width * this.map.tileSize);
        
        // Limpar mini mapa
        this.miniMapCtx.fillStyle = '#1a252f';
        this.miniMapCtx.fillRect(0, 0, this.miniMapCanvas.width, this.miniMapCanvas.height);
        
        // Desenhar mapa no mini mapa
        for (let x = 0; x < this.map.width; x++) {
            for (let y = 0; y < this.map.height; y++) {
                const tileX = x * this.map.tileSize * scale;
                const tileY = y * this.map.tileSize * scale;
                const tileSize = this.map.tileSize * scale;
                
                if (this.map.tiles[x][y] === 1) {
                    this.miniMapCtx.fillStyle = '#7f8c8d';
                } else {
                    this.miniMapCtx.fillStyle = '#34495e';
                }
                
                this.miniMapCtx.fillRect(tileX, tileY, tileSize, tileSize);
            }
        }
        
        // Desenhar jogador no mini mapa
        this.miniMapCtx.fillStyle = '#e74c3c';
        this.miniMapCtx.fillRect(
            this.player.x * scale, 
            this.player.y * scale, 
            this.player.width * scale, 
            this.player.height * scale
        );
    }
    
    updateUI() {
        // Atualizar coordenadas
        document.getElementById('posX').textContent = Math.floor(this.player.x / this.map.tileSize);
        document.getElementById('posY').textContent = Math.floor(this.player.y / this.map.tileSize);
        
        // Atualizar FPS
        document.getElementById('fpsCounter').textContent = `FPS: ${this.fps}`;
    }
    
    startGameLoop() {
        const gameLoop = (currentTime) => {
            const deltaTime = (currentTime - this.lastTime) / 1000;
            this.lastTime = currentTime;
            
            // Calcular FPS
            this.fps = Math.round(1 / deltaTime);
            
            this.update(deltaTime);
            this.render();
            
            requestAnimationFrame(gameLoop);
        };
        
        this.gameLoop = requestAnimationFrame(gameLoop);
    }
    
    async saveGame() {
        try {
            const response = await fetch('save_game.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    x: Math.floor(this.player.x / this.map.tileSize),
                    y: Math.floor(this.player.y / this.map.tileSize)
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Jogo salvo com sucesso!');
            } else {
                alert('Erro ao salvar jogo: ' + result.message);
            }
        } catch (error) {
            alert('Erro ao salvar jogo: ' + error.message);
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new HabboGame();
});