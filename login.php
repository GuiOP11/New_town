<?php
session_start();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="d-flex align-items-center justify-content-center min-vh-100">
    <form action="efetua_login.php" method="post" class="w-50 container mt-3 border rounded p-4">
        <h4 class="text-center">Login</h4>
        
        <?php
        // Mostrar mensagem de sucesso do cadastro
        if (isset($_SESSION['msg_success'])) {
            echo '<div class="alert alert-success" role="alert">';
            echo $_SESSION['msg_success'];
            unset($_SESSION['msg_success']);
            echo '</div>';
        }
        
        // Mostrar mensagem de erro
        if (isset($_SESSION['msg'])) {
            echo '<div class="alert alert-danger" role="alert">';
            echo $_SESSION['msg'];
            unset($_SESSION['msg']);
            echo '</div>';
        } 
        
        // Mostrar mensagem informativa apenas se não houver outras mensagens
        if (!isset($_SESSION['msg_success']) && !isset($_SESSION['msg'])) {
            echo '<div class="alert alert-info" role="alert">';
            echo 'Informe seu email e senha para entrar.';
            echo '</div>';
        }
        ?>        
        
        <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" name="email" class="form-control" required>
        </div>
        
        <div class="mb-3">
            <label class="form-label">Senha</label>
            <input type="password" name="senha" class="form-control" required>
        </div>
        
        <button type="submit" class="btn btn-primary w-100">Entrar</button>

        <div class="text-center mt-3">
            <a href="index.php">Ainda não sou usuário</a>
        </div>
    </form>
</body>
</html> 