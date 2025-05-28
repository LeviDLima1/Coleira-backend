const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Definindo o modelo Task
const Task = sequelize.define('Task', {
  // Campos do modelo
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pendente', 'em_andamento', 'concluida'),
    defaultValue: 'pendente'
  }
});

module.exports = Task;