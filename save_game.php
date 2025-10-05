<?php
session_start();
if (!isset($_SESSION['email'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['success' => false, 'message' => 'Não autorizado']);
    exit();
}

require_once "src/ConexaoBD.php";

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $x = intval($input['x']);
    $y = intval($input['y']);
    $email = $_SESSION['email'];
    
    $conexao = ConexaoBD::conectar();
    $stmt = $conexao->prepare("UPDATE usuarios SET x = :x, y = :y WHERE email = :email");
    $stmt->bindValue(':x', $x);
    $stmt->bindValue(':y', $y);
    $stmt->bindValue(':email', $email);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Posição salva com sucesso']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao salvar posição']);
    }
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro de banco de dados: ' . $e->getMessage()]);
}
?>