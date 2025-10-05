<?php
require_once "ConexaoBD.php";

class UsuarioDAO {
    
    public static function validarUsuario($dados) {
        try {
            $conexao = ConexaoBD::conectar();
            
            $stmt = $conexao->prepare("SELECT * FROM usuarios WHERE email = :email AND senha = :senha");
            $stmt->bindValue(':email', $dados['email']);
            $stmt->bindValue(':senha', $dados['senha']);
            $stmt->execute();
            
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return $usuario !== false;
            
        } catch (PDOException $e) {
            return false;
        }
    }
    
    public static function cadastrarUsuario($dados) {
        try {
            $conexao = ConexaoBD::conectar();
            
            // Verificar se email já existe
            $stmt = $conexao->prepare("SELECT id FROM usuarios WHERE email = :email");
            $stmt->bindValue(':email', $dados['email']);
            $stmt->execute();
            
            if ($stmt->fetch()) {
                return "Email já cadastrado!";
            }
            
            // Inserir novo usuário
            $stmt = $conexao->prepare("INSERT INTO usuarios (usuario, email, senha, xp, nivel) 
                                     VALUES (:usuario, :email, :senha, 0, 1)");
            
            $stmt->bindValue(':usuario', $dados['usuario']);
            $stmt->bindValue(':email', $dados['email']);
            $stmt->bindValue(':senha', $dados['senha']);
            
            $stmt->execute();
            
            return true;
            
        } catch (PDOException $e) {
            return "Erro ao cadastrar: " . $e->getMessage();
        }
    }
}
?>