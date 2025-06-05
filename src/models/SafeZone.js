const { Sequelize, DataTypes } = require('sequelize');
// Remova a linha que importa sequelize diretamente do config/database
// const { sequelize } = require('../config/database');

const User = require('./UserModel'); // Importar o modelo User (será usado para associações em index.js)

module.exports = (sequelize) => {
    const SafeZone = sequelize.define('SafeZone', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: { // Chave estrangeira para o User
            type: DataTypes.INTEGER,
            references: {
                model: 'users', // Referência direta ao nome da tabela 'users'
                key: 'id',
            },
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true, // Nome da zona é opcional
        },
        center_latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        center_longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        radius: { // Raio da zona segura em metros
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    }, {
        tableName: 'safe_zones', // Nome da tabela no banco de dados
        timestamps: true, // Adiciona createdAt e updatedAt
        underscored: true, // Usa snake_case
    });

    // Definir associações aqui se necessário (geralmente feito em index.js agora)
    // SafeZone.belongsTo(User, { foreignKey: 'user_id' }); // Removido ou comentado pois a associação deve ser feita em index.js

    return SafeZone;
}; 