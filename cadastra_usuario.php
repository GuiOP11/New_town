<?php
session_start();
require_once "src/UsuarioDAO.php";

if ($_POST['usuario'] && $_POST['email'] && $_POST['senha']) {
    $resultado = UsuarioDAO::cadastrarUsuario($_POST);
    
    if ($resultado === true) {
        $_SESSION['msg_success'] = "Cadastro confirmado com sucesso! Faça login.";
        header("Location: login.php");
        exit();
    } else {
        $_SESSION['msg'] = $resultado;
        header("Location: index.php");
        exit();
    }
} else {
    $_SESSION['msg'] = "Preencha todos os campos!";
    header("Location: index.php");
    exit();
}
?>