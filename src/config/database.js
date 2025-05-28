const { Sequelize } = require('sequelize');
require('dotenv').config();

// Criando a conexão com o banco
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    // Configurações adicionais
    logging: false, // Desativa logs SQL
  }
);

// Função para testar a conexão
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco estabelecida com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao banco:', error);
  }
}

sequelize.sync()
  .then(() => {
    console.log('Banco de dados sincronizado');
  })
  .catch((error) => {
    console.error('Erro ao sincronizar banco de dados:', error);
  });

// Exportando a conexão e a função de teste
module.exports = { sequelize, testConnection };