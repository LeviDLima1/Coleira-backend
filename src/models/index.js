const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const config = require(__dirname + '/../config/database.js').development; // Importar configurações

const db = {};

// Criar a instância do Sequelize aqui
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

db.sequelize = sequelize; // Adicionar a instância ao objeto db
db.Sequelize = Sequelize; // Adicionar a classe ao objeto db

// Carregar modelos explicitamente para controlar a ordem
db.User = require('./UserModel')(sequelize, DataTypes);
db.Pet = require('./Pet')(sequelize, DataTypes);
db.Location = require('./Location')(sequelize, DataTypes);
db.SafeZone = require('./SafeZone')(sequelize, DataTypes);
db.Alert = require('./Alert')(sequelize, DataTypes); // Carregar o modelo Alert

// Definir associações explicitamente após carregar todos os modelos
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Definir associações baseadas na estrutura conhecida
db.User.hasMany(db.Pet, { foreignKey: 'user_id' });
db.Pet.belongsTo(db.User, { foreignKey: 'user_id' });

db.Pet.hasMany(db.Location, { foreignKey: 'pet_id' });
db.Location.belongsTo(db.Pet, { foreignKey: 'pet_id' });

db.User.hasMany(db.SafeZone, { foreignKey: 'user_id' });
db.SafeZone.belongsTo(db.User, { foreignKey: 'user_id' });

db.Pet.hasMany(db.Alert, { foreignKey: 'pet_id' }); // Um Pet pode ter muitos Alerts
db.Alert.belongsTo(db.Pet, { foreignKey: 'pet_id' }); // Um Alert pertence a um Pet

// Função para sincronizar o banco de dados
db.initializeDatabase = async () => {
    try {
        // Opcional: criar o banco de dados se não existir (requer conexão sem database)
        // await createDatabase(); // Se você mover createDatabase para cá e ajustar

        // Sincroniza as tabelas, permitindo alterações (CUIDADO EM PRODUÇÃO!)
        await sequelize.sync({ alter: true });
        console.log('✅ Banco de dados sincronizado (alter: true)');
    } catch (error) {
        console.error('❌ Erro ao sincronizar banco de dados:', error);
        throw error; // Re-lançar o erro para ser capturado na inicialização da app
    }
};

module.exports = db; 