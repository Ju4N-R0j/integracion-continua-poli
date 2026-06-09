CREATE DATABASE IF NOT EXISTS integracion_db;

USE integracion_db;

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title) VALUES
('Crear repositorio en GitHub'),
('Construir imagen Docker de la API'),
('Ejecutar contenedor MySQL'),
('Comunicar API con base de datos');