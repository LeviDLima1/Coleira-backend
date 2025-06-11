const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefone: {
      type: DataTypes.STRING,
      unique: false,
    },
    cep: {
      type: DataTypes.STRING,
    },
    rua: {
      type: DataTypes.STRING,
    },
    numero: {
      type: DataTypes.STRING,
    },
    bairro: {
      type: DataTypes.STRING,
    },
    cidade: {
      type: DataTypes.STRING,
    },
    estado: {
      type: DataTypes.STRING,
    },
    foto: {
      type: DataTypes.STRING,
    },
    pushToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
      {
        unique: true,
        fields: ['email']
      }
    ]
  });

  // Hash password before saving
  User.beforeCreate(async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  return User;
}; 