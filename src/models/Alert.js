const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Alert = sequelize.define('Alert', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        pet_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'pets',
                key: 'id',
            },
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        is_resolved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    }, {
        tableName: 'alerts',
        timestamps: false,
        underscored: true,
    });

    // Associações (definidas em index.js)
    // Alert.belongsTo(sequelize.models.Pet, { foreignKey: 'pet_id' });

    return Alert;
}; 