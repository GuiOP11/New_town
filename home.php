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
            <div id="playerInfo">
                <div>Jogador: <?php echo htmlspecialchars($usuario['usuario'] ?? 'Explorador'); ?></div>
                <div>Nível: <span id="playerLevel"><?php echo $usuario['nivel'] ?? 1; ?></span></div>
                <div>XP: <span id="playerXP"><?php echo $usuario['xp'] ?? 0; ?></span></div>
            </div>
            <div id="coordinates">Posição: X: 0, Y: 0</div>
            <div id="itemsColetados">Itens Coletados: 0/10</div>
            <div id="tempoJogo">Tempo: 0s</div>
            <div id="personagemSelecionado">Personagem: Pinguim</div>
        </div>
        
        <!-- No seu home.php existente, adicione: -->
<div style="text-align: center; margin: 20px;">
    <a href="game.php" style="display: inline-block; padding: 15px 30px; 
       background: #4CAF50; color: white; text-decoration: none; 
       border-radius: 8px; font-size: 18px; font-weight: bold;">
       🎮 JOGAR HABBO SIMPLES
    </a>
</div>
</body>
</html>