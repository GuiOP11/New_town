// Configurações do jogo
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const miniMapCanvas = document.getElementById('miniMapCanvas');
const miniMapCtx = miniMapCanvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const coordinatesElement = document.getElementById('coordinates');
const itemsElement = document.getElementById('itemsColetados');
const tempoElement = document.getElementById('tempoJogo');
const finalItemsElement = document.getElementById('finalItems');
const finalTimeElement = document.getElementById('finalTime');

// Variáveis do jogo
let game = {
    running: false,
    itemsColetados: 0,
    totalItems: 10,
    tempoInicio: 0,
    tempoAtual: 0
};

// Mapa maior para exploração
const mapa = {
    largura: 2000,
    altura: 2000,
    tiles: []
};

// Jogador
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 25,
    height: 35,
    speed: 3,
    color: '#4a69bd',
    direcao: 'down' // down, up, left, right
};

// Câmera
const camera = {
    x: 0,
    y: 0
};

// Itens para coletar
let itens = [];

// Controles
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Shift: false
};

// Inicializar mapa
function inicializarMapa() {
    // Gerar tiles do mapa (grama, água, pedras)
    for (let x = 0; x < mapa.largura; x += 50) {
        for (let y = 0; y < mapa.altura; y += 50) {
            const tipo = Math.random() > 0.9 ? 'water' : 
                        Math.random() > 0.85 ? 'rock' : 'grass';
            mapa.tiles.push({ x, y, tipo });
        }
    }
    
    // Gerar itens aleatórios
    itens = [];
    for (let i = 0; i < game.totalItems; i++) {
        itens.push({
            x: Math.random() * (mapa.largura - 30),
            y: Math.random() * (mapa.altura - 30),
            width: 20,
            height: 20,
            coletado: false,
            tipo: ['diamond', 'star', 'coin'][Math.floor(Math.random() * 3)],
            cor: ['#ff6b6b', '#ffe66d', '#4ecdc4'][Math.floor(Math.random() * 3)]
        });
    }
}

// Event listeners para controles
window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
        updatePlayerDirection();
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
        updatePlayerDirection();
    }
});

function updatePlayerDirection() {
    if (keys.ArrowUp) player.direcao = 'up';
    else if (keys.ArrowDown) player.direcao = 'down';
    else if (keys.ArrowLeft) player.direcao = 'left';
    else if (keys.ArrowRight) player.direcao = 'right';
}

// Funções do jogo
function startGame() {
    startScreen.style.display = 'none';
    game.running = true;
    game.itemsColetados = 0;
    game.tempoInicio = Date.now();
    player.x = mapa.largura / 2;
    player.y = mapa.altura / 2;
    inicializarMapa();
    updateUI();
    gameLoop();
}

function restartGame() {
    gameOverScreen.style.display = 'none';
    startGame();
}

function updateCamera() {
    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;
    
    // Limites da câmera
    camera.x = Math.max(0, Math.min(camera.x, mapa.largura - canvas.width));
    camera.y = Math.max(0, Math.min(camera.y, mapa.altura - canvas.height));
}

function updatePlayer() {
    let speed = keys.Shift ? player.speed * 2 : player.speed;
    
    if (keys.ArrowUp) player.y -= speed;
    if (keys.ArrowDown) player.y += speed;
    if (keys.ArrowLeft) player.x -= speed;
    if (keys.ArrowRight) player.x += speed;
    
    // Limites do jogador no mapa
    player.x = Math.max(player.width / 2, Math.min(player.x, mapa.largura - player.width / 2));
    player.y = Math.max(player.height / 2, Math.min(player.y, mapa.altura - player.height / 2));
    
    updateCamera();
}

function checkItemCollision() {
    itens.forEach(item => {
        if (!item.coletado &&
            player.x < item.x + item.width &&
            player.x + player.width > item.x &&
            player.y < item.y + item.height &&
            player.y + player.height > item.y) {
            
            item.coletado = true;
            game.itemsColetados++;
            updateUI();
            
            if (game.itemsColetados >= game.totalItems) {
                gameComplete();
            }
        }
    });
}

function updateUI() {
    coordinatesElement.textContent = `Posição: X: ${Math.floor(player.x)}, Y: ${Math.floor(player.y)}`;
    itemsElement.textContent = `Itens Coletados: ${game.itemsColetados}/${game.totalItems}`;
    
    if (game.running) {
        game.tempoAtual = Math.floor((Date.now() - game.tempoInicio) / 1000);
        tempoElement.textContent = `Tempo: ${game.tempoAtual}s`;
    }
}

function gameComplete() {
    game.running = false;
    finalItemsElement.textContent = game.itemsColetados;
    finalTimeElement.textContent = game.tempoAtual;
    gameOverScreen.style.display = 'flex';
}

// Funções de desenho
function drawMap() {
    // Desenhar tiles visíveis
    mapa.tiles.forEach(tile => {
        const screenX = tile.x - camera.x;
        const screenY = tile.y - camera.y;
        
        if (screenX > -50 && screenX < canvas.width && screenY > -50 && screenY < canvas.height) {
            switch(tile.tipo) {
                case 'grass':
                    ctx.fillStyle = '#27ae60';
                    break;
                case 'water':
                    ctx.fillStyle = '#3498db';
                    break;
                case 'rock':
                    ctx.fillStyle = '#7f8c8d';
                    break;
            }
            ctx.fillRect(screenX, screenY, 50, 50);
            
            // Detalhes nos tiles
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.strokeRect(screenX, screenY, 50, 50);
        }
    });
}

function drawPlayer() {
    const screenX = player.x - camera.x;
    const screenY = player.y - camera.y;
    
    // Corpo do jogador
    ctx.fillStyle = player.color;
    ctx.fillRect(screenX - player.width / 2, screenY - player.height / 2, player.width, player.height);
    
    // Detalhes do jogador baseado na direção
    ctx.fillStyle = '#2c3e50';
    
    // Olhos
    switch(player.direcao) {
        case 'up':
            ctx.fillRect(screenX - 5, screenY - 10, 4, 4);
            ctx.fillRect(screenX + 1, screenY - 10, 4, 4);
            break;
        case 'down':
            ctx.fillRect(screenX - 5, screenY + 6, 4, 4);
            ctx.fillRect(screenX + 1, screenY + 6, 4, 4);
            break;
        case 'left':
            ctx.fillRect(screenX - 8, screenY - 5, 4, 4);
            ctx.fillRect(screenX - 8, screenY + 1, 4, 4);
            break;
        case 'right':
            ctx.fillRect(screenX + 4, screenY - 5, 4, 4);
            ctx.fillRect(screenX + 4, screenY + 1, 4, 4);
            break;
    }
}

function drawItems() {
    itens.forEach(item => {
        if (!item.coletado) {
            const screenX = item.x - camera.x;
            const screenY = item.y - camera.y;
            
            if (screenX > -30 && screenX < canvas.width && screenY > -30 && screenY < canvas.height) {
                ctx.fillStyle = item.cor;
                
                switch(item.tipo) {
                    case 'diamond':
                        // Diamante
                        ctx.beginPath();
                        ctx.moveTo(screenX + item.width / 2, screenY);
                        ctx.lineTo(screenX + item.width, screenY + item.height / 2);
                        ctx.lineTo(screenX + item.width / 2, screenY + item.height);
                        ctx.lineTo(screenX, screenY + item.height / 2);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case 'star':
                        // Estrela
                        ctx.beginPath();
                        for (let i = 0; i < 5; i++) {
                            const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
                            const x = screenX + item.width / 2 + Math.cos(angle) * item.width / 2;
                            const y = screenY + item.height / 2 + Math.sin(angle) * item.height / 2;
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case 'coin':
                        // Moeda
                        ctx.beginPath();
                        ctx.arc(screenX + item.width / 2, screenY + item.height / 2, item.width / 2, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = '#ffeaa7';
                        ctx.beginPath();
                        ctx.arc(screenX + item.width / 2, screenY + item.height / 2, item.width / 4, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                }
                
                // Brilho
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.arc(screenX + 5, screenY + 5, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });
}

function drawMiniMap() {
    // Limpar minimapa
    miniMapCtx.fillStyle = 'rgba(12, 36, 97, 0.9)';
    miniMapCtx.fillRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
    
    // Escala para o minimapa
    const scaleX = miniMapCanvas.width / mapa.largura;
    const scaleY = miniMapCanvas.height / mapa.altura;
    
    // Desenhar jogador no minimapa
    miniMapCtx.fillStyle = player.color;
    miniMapCtx.fillRect(
        player.x * scaleX - 3,
        player.y * scaleY - 3,
        6, 6
    );
    
    // Desenhar itens no minimapa
    itens.forEach(item => {
        if (!item.coletado) {
            miniMapCtx.fillStyle = item.cor;
            miniMapCtx.fillRect(
                item.x * scaleX - 2,
                item.y * scaleY - 2,
                4, 4
            );
        }
    });
    
    // Borda do minimapa
    miniMapCtx.strokeStyle = '#4a69bd';
    miniMapCtx.lineWidth = 2;
    miniMapCtx.strokeRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
}

// Loop principal do jogo
function gameLoop() {
    if (!game.running) return;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar e atualizar
    drawMap();
    drawItems();
    drawPlayer();
    drawMiniMap();
    
    updatePlayer();
    checkItemCollision();
    updateUI();
    
    requestAnimationFrame(gameLoop);
}

// Inicialização
inicializarMapa();
drawMap();
drawItems();
drawPlayer();
drawMiniMap();