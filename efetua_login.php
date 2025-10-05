<?php
session_start();
require_once "src/UsuarioDAO.php";

if ($_POST['email'] && $_POST['senha']) {
    $dados = [
        'email' => $_POST['email'],
        'senha' => $_POST['senha']
    ];
    
    if (UsuarioDAO::validarUsuario($dados)) {
        
        $_SESSION['email'] = $_POST['email']; 
        header("Location: home.php"); 
        exit();
    } else {
        $_SESSION['msg'] = "Email ou senha inválidos!";
        header("Location: login.php");
        exit();
    }
} else {
    $_SESSION['msg'] = "Preencha todos os campos!";
    header("Location: login.php");
    exit();
}
?>