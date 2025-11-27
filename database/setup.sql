CREATE DATABASE pension_db;

\c pension_db;

DROP TABLE IF EXISTS pensions;

CREATE TABLE pensions (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    anios_servicio INTEGER NOT NULL,
    salario_mensual DECIMAL(10, 2) NOT NULL,
    pension_calculada DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_nombre ON pensions(nombre);
CREATE INDEX idx_created_at ON pensions(created_at);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pensions_updated_at BEFORE UPDATE ON pensions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO pensions (nombre, anios_servicio, salario_mensual, pension_calculada) VALUES
('Juan Pérez García', 25, 15000.00, 7500.00),
('María López Hernández', 30, 20000.00, 12000.00),
('Carlos Ramírez Torres', 20, 12000.00, 4800.00),
('Ana Martínez Sánchez', 35, 25000.00, 17500.00),
('Pedro González Ruiz', 15, 10000.00, 3000.00);

SELECT * FROM pensions;
