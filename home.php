<?php
session_start();
if (!isset($_SESSION['email'])) {
    header("Location: login.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Explorador - Jogo de Exploração</title>
    <link rel="stylesheet" href="static/styles.css">
</head>
<body>
    <div id="gameContainer">
        <canvas id="gameCanvas" width="800" height="600"></canvas>
        
        <div id="ui">
            <div id="coordinates">Posição: X: 0, Y: 0</div>
            <div id="itemsColetados">Itens Coletados: 0/10</div>
            <div id="tempoJogo">Tempo: 0s</div>
        </div>
        
        <div id="startScreen">
            <h1>🌍 EXPLORADOR</h1>
            <p class="instructions">Explore o mapa e colete todos os itens!</p>
            <button onclick="startGame()">COMEÇAR EXPLORAÇÃO</button>
            <div class="instructions">
                <p>🔼 Seta Cima - Mover Para Cima</p>
                <p>🔽 Seta Baixo - Mover Para Baixo</p>
                <p>◀️ Seta Esquerda - Mover Esquerda</p>
                <p>▶️ Seta Direita - Mover Direita</p>
                <p>Shift - Correr (Velocidade Dobrada)</p>
            </div>
        </div>
        
        <div id="gameOverScreen">
            <h1>EXPLORAÇÃO CONCLUÍDA! 🎉</h1>
            <p>Itens coletados: <span id="finalItems">0</span>/10</p>
            <p>Tempo total: <span id="finalTime">0</span> segundos</p>
            <button onclick="restartGame()">EXPLORAR NOVAMENTE</button>
        </div>

        <div id="miniMap">
            <canvas id="miniMapCanvas" width="150" height="150"></canvas>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>