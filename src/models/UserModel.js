const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    dataNascimento: {
        type: DataTypes.DATE,
        allowNull: true
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    cep: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rua: {
        type: DataTypes.STRING,
        allowNull: true
    },
    numero: {
        type: DataTypes.STRING,
        allowNull: true
    },
    complemento: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bairro: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cidade: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: true
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = User;
