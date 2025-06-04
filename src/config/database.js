const { Sequelize } = require('sequelize');
require('dotenv').config();

// Criando a conexão com o banco
const sequelize = new Sequelize(
  process.env.DB_NAME || 'coleirainteligente',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || '192.168.18.31',
    dialect: 'mysql',
    logging: console.log, // Ativa logs SQL para debug
  }
);

// Função para testar a conexão
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco:', error);
  }
}

// Função para criar o banco de dados se não existir
async function createDatabase() {
  try {
    // Cria uma conexão temporária sem especificar o banco de dados
    const tempSequelize = new Sequelize(
      'mysql',
      process.env.DB_USER || 'root',
      process.env.DB_PASS || 'root',
      {
        host: process.env.DB_HOST || '192.168.18.31',
        dialect: 'mysql',
        logging: false
      }
    );

    // Cria o banco de dados se não existir
    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'coleirainteligente'};`);
    console.log('✅ Banco de dados criado ou já existente');

    // Fecha a conexão temporária
    await tempSequelize.close();
  } catch (error) {
    console.error('❌ Erro ao criar banco de dados:', error);
  }
}

// Primeiro cria o banco, depois sincroniza
async function initializeDatabase() {
  await createDatabase();
  // Sincroniza as tabelas sem forçar a recriação
  await sequelize.sync();
  console.log('✅ Banco de dados sincronizado');
}

initializeDatabase().catch(error => {
  console.error('❌ Erro ao inicializar banco de dados:', error);
});

// Exportando a conexão e a função de teste
module.exports = { sequelize, testConnection };