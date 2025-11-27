const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || '',
  process.env.DB_USER || '',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexión a la base de datos establecida correctamente.');
    return true;
  } catch (error) {
    console.error('✗ Error al conectar con la base de datos:', error.message);
    return false;
  }
};

module.exports = { sequelize, testConnection };
