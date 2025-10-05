// script.js - CLUBE PINGUIM - CÓDIGO COMPLETO E CORRIGIDO
console.log('=== CARREGANDO SCRIPT.JS ===');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const miniMapCanvas = document.getElementById('miniMapCanvas');
const miniMapCtx = miniMapCanvas.getContext('2d');

// Configurações do jogo
const config = {
    tileSize: 64,
    playerSpeed: 3,
    runMultiplier: 2,
    totalItems: 10,
    mapWidth: 1600,
    mapHeight: 1200
};

// Sistema de personagens CORRIGIDO
const characters = {
    pinguim: {
        name: 'Pinguim',
        speed: 3,
        size: { width: 40, height: 60 },
        color: { body: '#000000', belly: '#FFFFFF' },
        special: null
    },
    pinguim_rapido: {
        name: 'Pinguim Veloz',
        speed: 3.6,
        size: { width: 40, height: 60 },
        color: { body: '#2C3E50', belly: '#ECF0F1' },
        special: 'speed'
    },
    pinguim_forte: {
        name: 'Pinguim Forte',
        speed: 2.5,
        size: { width: 50, height: 70 },
        color: { body: '#E74C3C', belly: '#FADBD8' },
        special: 'strong'
    },
    pinguim_ninja: {
        name: 'Pinguim Ninja',
        speed: 3.2,
        size: { width: 35, height: 55 },
        color: { body: '#2C3E50', belly: '#566573' },
        special: 'stealth'
    }
};

// Estado do jogo
let gameState = {
    player: {
        x: 400,
        y: 300,
        width: 40,
        height: 60,
        speed: 3,
        direction: 'down',
        isRunning: false,
        character: 'pinguim'
    },
    camera: {
        x: 0,
        y: 0
    },
    items: [],
    collectedItems: 0,
    gameTime: 0,
    gameStarted: false,
    gameOver: false,
    lastTime: 0,
    xpGanho: 0
};

// Mapa do jogo
const gameMap = [
    [1,1,1,1,1,2,2,2,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,2,2,2,2,2,1,3,3,3,1,1,4,1,1,1,1,1,1,1,1,1],
    [1,1,1,2,2,2,2,2,2,2,3,3,3,1,1,1,1,1,5,1,1,1,1,1,1],
    [1,1,2,2,2,2,2,2,2,2,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,2,2,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,2,2,2,2,2,2,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,2,2,2,2,1,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,2,2,1,1,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Itens do jogo
const gameItems = ['🎁', '🎣', '⛸️', '🏒', '🧤', '🧣', '🎿', '🕶️', '🧊', '🐟'];

// Cores dos tiles
const tileColors = {
    1: '#E0F7FA', // Neve
    2: '#B3E5FC', // Gelo  
    3: '#81D4FA', // Água
    4: '#E0F7FA', // Casa (com ícone)
    5: '#E0F7FA'  // Igloo (com ícone)
};

// Controles
const keys = {};

// Função principal de inicialização
function initGame(characterType) {
    console.log('Inicializando jogo com personagem:', characterType);
    
    // Configurar personagem
    const character = characters[characterType] || characters.pinguim;
    gameState.player.character = characterType;
    gameState.player.speed = character.speed;
    gameState.player.width = character.size.width;
    gameState.player.height = character.size.height;
    
    // Resetar estado
    gameState.player.x = 400;
    gameState.player.y = 300;
    gameState.camera.x = 0;
    gameState.camera.y = 0;
    gameState.collectedItems = 0;
    gameState.gameTime = 0;
    gameState.gameStarted = true;
    gameState.gameOver = false;
    gameState.xpGanho = 0;
    
    // Gerar itens
    generateItems();
    
    // Configurar controles
    setupControls();
    
    // Iniciar UI
    updateUI();
    
    // Iniciar loop do jogo
    gameState.lastTime = performance.now();
    requestAnimationFrame(gameLoop);
    
    console.log('Jogo inicializado com sucesso!');
}

function generateItems() {
    gameState.items = [];
    for (let i = 0; i < config.totalItems; i++) {
        let validPosition = false;
        let x, y;
        
        while (!validPosition) {
            x = 100 + Math.floor(Math.random() * (config.mapWidth - 200));
            y = 100 + Math.floor(Math.random() * (config.mapHeight - 200));
            
            const distance = Math.sqrt(
                Math.pow(x - gameState.player.x, 2) + 
                Math.pow(y - gameState.player.y, 2)
            );
            
            if (distance > 300) {
                validPosition = true;
            }
        }
        
        gameState.items.push({
            x: x,
            y: y,
            width: 30,
            height: 30,
            type: i,
            collected: false
        });
    }
    console.log('Itens gerados:', gameState.items.length);
}

function setupControls() {
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        if (e.key === 'Shift') gameState.player.isRunning = true;
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
        if (e.key === 'Shift') gameState.player.isRunning = false;
    });
}

function updatePlayer() {
    let speed = gameState.player.speed;
    if (gameState.player.isRunning) {
        speed *= config.runMultiplier;
    }

    if (keys['ArrowUp']) gameState.player.y -= speed;
    if (keys['ArrowDown']) gameState.player.y += speed;
    if (keys['ArrowLeft']) gameState.player.x -= speed;
    if (keys['ArrowRight']) gameState.player.x += speed;

    // Limites do mapa
    gameState.player.x = Math.max(0, Math.min(config.mapWidth - gameState.player.width, gameState.player.x));
    gameState.player.y = Math.max(0, Math.min(config.mapHeight - gameState.player.height, gameState.player.y));

    updateCamera();
}

function updateCamera() {
    gameState.camera.x = gameState.player.x - canvas.width / 2 + gameState.player.width / 2;
    gameState.camera.y = gameState.player.y - canvas.height / 2 + gameState.player.height / 2;

    gameState.camera.x = Math.max(0, Math.min(config.mapWidth - canvas.width, gameState.camera.x));
    gameState.camera.y = Math.max(0, Math.min(config.mapHeight - canvas.height, gameState.camera.y));
}

function checkCollisions() {
    gameState.items.forEach(item => {
        if (!item.collected &&
            gameState.player.x < item.x + item.width &&
            gameState.player.x + gameState.player.width > item.x &&
            gameState.player.y < item.y + item.height &&
            gameState.player.y + gameState.player.height > item.y) {
            
            item.collected = true;
            gameState.collectedItems++;
            gameState.xpGanho += 10; // +10 XP por item
            updateUI();
            
            console.log('Item coletado! Total:', gameState.collectedItems, 'XP:', gameState.xpGanho);
            
            if (gameState.collectedItems === config.totalItems) {
                endGame();
            }
        }
    });
}

function drawMap() {
    const tileSize = config.tileSize;
    
    for (let y = 0; y < gameMap.length; y++) {
        for (let x = 0; x < gameMap[y].length; x++) {
            const tileX = x * tileSize - gameState.camera.x;
            const tileY = y * tileSize - gameState.camera.y;
            
            if (tileX + tileSize > 0 && tileX < canvas.width && 
                tileY + tileSize > 0 && tileY < canvas.height) {
                
                const tileType = gameMap[y][x];
                ctx.fillStyle = tileColors[tileType];
                ctx.fillRect(tileX, tileY, tileSize, tileSize);
                
                if (tileType === 4) {
                    ctx.font = '24px Arial';
                    ctx.fillText('🏠', tileX + 20, tileY + 40);
                } else if (tileType === 5) {
                    ctx.font = '24px Arial';
                    ctx.fillText('⛺', tileX + 20, tileY + 40);
                }
                
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.strokeRect(tileX, tileY, tileSize, tileSize);
            }
        }
    }
}

function drawPlayer() {
    const screenX = gameState.player.x - gameState.camera.x;
    const screenY = gameState.player.y - gameState.camera.y;
    const character = characters[gameState.player.character];

    // Corpo do pinguim
    ctx.fillStyle = character.color.body;
    ctx.fillRect(screenX, screenY, gameState.player.width, gameState.player.height);
    
    // Barriga branca
    ctx.fillStyle = character.color.belly;
    ctx.fillRect(screenX + 5, screenY + 15, gameState.player.width - 10, gameState.player.height - 20);
    
    // Olhos
    ctx.fillStyle = '#000000';
    ctx.fillRect(screenX + 10, screenY + 10, 5, 5);
    ctx.fillRect(screenX + gameState.player.width - 15, screenY + 10, 5, 5);
    
    // Bico
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(screenX + gameState.player.width / 2, screenY + 20);
    ctx.lineTo(screenX + gameState.player.width / 2 - 5, screenY + 30);
    ctx.lineTo(screenX + gameState.player.width / 2 + 5, screenY + 30);
    ctx.fill();
}

function drawItems() {
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    gameState.items.forEach(item => {
        if (!item.collected) {
            const screenX = item.x - gameState.camera.x;
            const screenY = item.y - gameState.camera.y;
            
            if (screenX + item.width > 0 && screenX < canvas.width && 
                screenY + item.height > 0 && screenY < canvas.height) {
                
                ctx.fillText(gameItems[item.type], screenX + 15, screenY + 15);
            }
        }
    });
    
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
}

function drawMiniMap() {
    miniMapCtx.fillStyle = '#2C3E50';
    miniMapCtx.fillRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
    
    const scaleX = miniMapCanvas.width / config.mapWidth;
    const scaleY = miniMapCanvas.height / config.mapHeight;
    
    miniMapCtx.fillStyle = '#E74C3C';
    miniMapCtx.fillRect(
        gameState.player.x * scaleX - 3,
        gameState.player.y * scaleY - 3,
        6, 6
    );
    
    miniMapCtx.fillStyle = '#F1C40F';
    gameState.items.forEach(item => {
        if (!item.collected) {
            miniMapCtx.fillRect(
                item.x * scaleX - 2,
                item.y * scaleY - 2,
                4, 4
            );
        }
    });
}

function updateUI() {
    document.getElementById('coordinates').textContent = 
        `Posição: X: ${Math.floor(gameState.player.x)}, Y: ${Math.floor(gameState.player.y)}`;
    document.getElementById('itemsColetados').textContent = 
        `Itens Coletados: ${gameState.collectedItems}/${config.totalItems}`;
    document.getElementById('tempoJogo').textContent = 
        `Tempo: ${Math.floor(gameState.gameTime)}s`;
    document.getElementById('personagemSelecionado').textContent = 
        `Personagem: ${characters[gameState.player.character].name}`;
}

function gameLoop(currentTime) {
    if (!gameState.gameStarted || gameState.gameOver) return;
    
    const deltaTime = (currentTime - gameState.lastTime) / 1000;
    gameState.lastTime = currentTime;
    gameState.gameTime += deltaTime;
    
    // Limpar canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Atualizar lógica
    updatePlayer();
    checkCollisions();
    
    // Renderizar
    drawMap();
    drawItems();
    drawPlayer();
    drawMiniMap();
    updateUI();
    
    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameState.gameOver = true;
    
    // Calcular XP adicional baseado no tempo
    const xpBonus = Math.max(0, 50 - Math.floor(gameState.gameTime / 10));
    const xpTotal = gameState.xpGanho + xpBonus;
    
    document.getElementById('finalItems').textContent = gameState.collectedItems;
    document.getElementById('finalTime').textContent = Math.floor(gameState.gameTime);
    document.getElementById('xpGanho').textContent = xpTotal;
    document.getElementById('finalCharacter').textContent = characters[gameState.player.character].name;
    document.getElementById('gameOverScreen').style.display = 'block';
    
    console.log('Jogo finalizado! XP Total:', xpTotal);
    
    // Aqui você pode adicionar uma chamada AJAX para salvar o XP no banco
    // saveXPToDatabase(xpTotal);
}

// Debug final
console.log('=== SCRIPT.JS CARREGADO COM SUCESSO ===');
console.log('Função initGame disponível:', typeof initGame);