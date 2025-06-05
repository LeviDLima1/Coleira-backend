const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Pet = sequelize.define('Pet', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'name'
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'type'
        },
        breed: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'breed'
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'age'
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
            field: 'image'
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at'
        }
    }, {
        tableName: 'pets',
        timestamps: false
    });

    return Pet;
}; 