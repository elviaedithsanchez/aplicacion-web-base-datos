CREATE DATABASE IF NOT EXISTS pension_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE pension_db;

DROP TABLE IF EXISTS pensions;

CREATE TABLE pensions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    anios_servicio INT NOT NULL,
    salario_mensual DECIMAL(10, 2) NOT NULL,
    pension_calculada DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO pensions (nombre, anios_servicio, salario_mensual, pension_calculada) VALUES
('Juan Pérez García', 25, 15000.00, 7500.00),
('María López Hernández', 30, 20000.00, 12000.00),
('Carlos Ramírez Torres', 20, 12000.00, 4800.00),
('Ana Martínez Sánchez', 35, 25000.00, 17500.00),
('Pedro González Ruiz', 15, 10000.00, 3000.00);

SELECT * FROM pensions;

DESCRIBE pensions;

