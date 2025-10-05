<?php
session_start();
if (!isset($_SESSION['email'])) {
    header("Location: login.php");
    exit();
}

// Usar suas classes existentes
require_once "ConexaoBD.php";
require_once "UsuarioDAO.php";

// Pegar dados do usuário logado
try {
    $conexao = ConexaoBD::conectar();
    $email = $_SESSION['email'];
    
    $stmt = $conexao->prepare("SELECT * FROM usuarios WHERE email = :email");
    $stmt->bindValue(':email', $email);
    $stmt->execute();
    
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    
} catch (PDOException $e) {
    // Em caso de erro, usar valores padrão
    $usuario = ['usuario' => 'Explorador', 'nivel' => 1, 'xp' => 0];
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
                <div>Jogador: <?php echo $usuario['usuario'] ?? 'Visitante'; ?></div>
                <div>Nível: <span id="playerLevel"><?php echo $usuario['nivel'] ?? 1; ?></span></div>
                <div>XP: <span id="playerXP"><?php echo $usuario['xp'] ?? 0; ?></span></div>
            </div>
            <div id="coordinates">Posição: X: 0, Y: 0</div>
            <div id="itemsColetados">Itens Coletados: 0/10</div>
            <div id="tempoJogo">Tempo: 0s</div>
            <div id="personagemSelecionado">Personagem: Pinguim</div>
        </div>
        
        <div id="startScreen">
            <h1>🌍 EXPLORADOR PINGUIM</h1>
            <p class="instructions">Bem-vindo, <strong><?php echo $usuario['usuario'] ?? 'Explorador'; ?></strong>!</p>
            <p class="instructions">Nível: <?php echo $usuario['nivel'] ?? 1; ?> | XP: <?php echo $usuario['xp'] ?? 0; ?></p>
            <p class="instructions">Explore o mapa e colete todos os itens para ganhar XP!</p>
            
            <!-- SELEÇÃO DE PERSONAGENS -->
            <div id="characterSelection">
                <h2>🎭 Escolha seu Personagem</h2>
                <div class="characters-grid">
                    <div class="character-card selected" data-character="pinguim" onclick="selectCharacter('pinguim')">
                        <div class="character-icon">🐧</div>
                        <div class="character-name">Pinguim</div>
                        <div class="character-desc">Velocidade: Normal</div>
                    </div>
                    
                    <div class="character-card" data-character="pinguim_rapido" onclick="selectCharacter('pinguim_rapido')">
                        <div class="character-icon">⚡🐧</div>
                        <div class="character-name">Pinguim Veloz</div>
                        <div class="character-desc">Velocidade: +20%</div>
                    </div>
                    
                    <div class="character-card" data-character="pinguim_forte" onclick="selectCharacter('pinguim_forte')">
                        <div class="character-icon">💪🐧</div>
                        <div class="character-name">Pinguim Forte</div>
                        <div class="character-desc">Tamanho: Grande</div>
                    </div>
                    
                    <div class="character-card" data-character="pinguim_ninja" onclick="selectCharacter('pinguim_ninja')">
                        <div class="character-icon">🥷🐧</div>
                        <div class="character-name">Pinguim Ninja</div>
                        <div class="character-desc">Furtividade: Alta</div>
                    </div>
                </div>
                
                <div id="selectedCharacterInfo">
                    <p>Personagem selecionado: <span id="currentCharacter">Pinguim</span></p>
                </div>
            </div>
            
            <button id="startButton" onclick="startGame()">COMEÇAR EXPLORAÇÃO</button>
            
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
            <p>XP Ganho: <span id="xpGanho">0</span></p>
            <p>Personagem: <span id="finalCharacter">Pinguim</span></p>
            <button onclick="restartGame()">EXPLORAR NOVAMENTE</button>
        </div>
        
        <div style="position: absolute; top: 10px; right: 10px; z-index: 1000;">
            <a href="logout.php" style="color: white; background: #dc3545; padding: 8px 15px; text-decoration: none; border-radius: 4px;">Sair</a>
        </div>
        
        <div id="miniMap">
            <canvas id="miniMapCanvas" width="150" height="150"></canvas>
        </div>
    </div>

    <script src="script.js"></script>
    <script>
        // Sistema de seleção de personagem CORRIGIDO
        let selectedCharacter = 'pinguim';
        
        function selectCharacter(character) {
            console.log('Selecionando personagem:', character);
            selectedCharacter = character;
            
            // Remover seleção anterior
            document.querySelectorAll('.character-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Adicionar seleção atual
            const currentCard = document.querySelector(`[data-character="${character}"]`);
            if (currentCard) {
                currentCard.classList.add('selected');
            }
            
            // Atualizar info - CORRIGIDO os nomes
            const characterNames = {
                'pinguim': 'Pinguim',
                'pinguim_rapido': 'Pinguim Veloz', 
                'pinguim_forte': 'Pinguim Forte',
                'pinguim_ninja': 'Pinguim Ninja'
            };
            
            document.getElementById('currentCharacter').textContent = characterNames[character] || 'Pinguim';
        }

        // Função startGame CORRIGIDA
        function startGame() {
            console.log('=== INICIANDO JOGO ===');
            console.log('Personagem selecionado:', selectedCharacter);
            
            // Esconder tela inicial
            const startScreen = document.getElementById('startScreen');
            if (startScreen) {
                startScreen.style.display = 'none';
                console.log('Tela inicial escondida');
            }
            
            // Iniciar o jogo principal
            if (typeof initGame === 'function') {
                initGame(selectedCharacter);
            } else {
                console.error('Função initGame não encontrada!');
                alert('Erro: Jogo não pode ser iniciado. Verifique o console.');
            }
        }

        // Função restartGame
        function restartGame() {
            console.log('Reiniciando jogo...');
            document.getElementById('gameOverScreen').style.display = 'none';
            document.getElementById('startScreen').style.display = 'flex';
        }

        // Debug inicial
        console.log('=== JOGO CARREGADO ===');
        console.log('Funções disponíveis:');
        console.log('- selectCharacter:', typeof selectCharacter);
        console.log('- startGame:', typeof startGame);
        console.log('- restartGame:', typeof restartGame);
    </script>
</body>
</html>