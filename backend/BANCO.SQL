CREATE DATABASE sistema_banco;
use sistema_banco;

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200),
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    data_de_nascimento VARCHAR(50),
    saldo DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE extrato (
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT,
 destino_id INT,
 valor DECIMAL(10,2),
 descricao VARCHAR(255),
 tipo VARCHAR(50),
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

 FOREIGN KEY (user_id) REFERENCES users(id),
 FOREIGN KEY (destino_id) REFERENCES users(id)
);
