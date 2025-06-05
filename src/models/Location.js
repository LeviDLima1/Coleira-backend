const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Location = sequelize.define('Location', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        pet_id: { // Chave estrangeira para o Pet
            type: DataTypes.INTEGER,
            references: {
                model: 'pets', // Nome da tabela como string
                key: 'id',
            },
            allowNull: false,
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        battery_level: { // Nível de bateria da coleira
            type: DataTypes.FLOAT,
            allowNull: true, // Permitir nulo se a coleira não reportar bateria
        },
        status: { // Status da coleira (Online, Offline, etc.)
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'locations', // Nome da tabela no banco de dados
        timestamps: true, // Adiciona createdAt e updatedAt
        underscored: true, // Usa snake_case para nomes de colunas (pet_id ao invés de petId)
    });

    return Location;
}; 