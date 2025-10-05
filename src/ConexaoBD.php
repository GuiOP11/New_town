<?php
class ConexaoBD{

    public static function conectar():PDO{
        $host = "sql10.freesqldatabase.com";
        $port = "3306";
        $dbname = "sql10801235";
        $username = "sql10801235";
        $password = "a7MdizUutz";
        
        $conexao = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $username, $password);
        
        // Configurar para lançar exceções em caso de erro
        $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        return $conexao;
    }
}

// Testar a conexão
try {
    $conexao = ConexaoBD::conectar();
    echo "Conexão bem-sucedida!";
} catch (PDOException $e) {
    echo "Erro na conexão: " . $e->getMessage();
}