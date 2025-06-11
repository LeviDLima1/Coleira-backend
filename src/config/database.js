require('dotenv').config();

// Exportando apenas as configurações do banco de dados
module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root',
    database: process.env.DB_NAME || 'coleirainteligente',
    host: process.env.DB_HOST || '192.168.1.2',
    dialect: 'mysql',
    logging: console.log, // Ativa logs SQL para debug
  },
  // Você pode adicionar configurações para production, test, etc. aqui
};

// Removidas: Instância do Sequelize, testConnection, createDatabase, initializeDatabase
// Essas lógicas serão movidas para models/index.js