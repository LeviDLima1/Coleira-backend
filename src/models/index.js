const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database').development;

const db = {};

// Criar a instância do Sequelize aqui
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        logging: config.logging,
        define: {
            timestamps: true,
            underscored: true,
        }
    }
);

db.sequelize = sequelize; // Adicionar a instância ao objeto db
db.Sequelize = Sequelize; // Adicionar a classe ao objeto db

// Carregar modelos explicitamente para controlar a ordem
db.User = require('./User')(sequelize);
db.Pet = require('./Pet')(sequelize);
db.Location = require('./Location')(sequelize);
db.SafeZone = require('./SafeZone')(sequelize);
db.Alert = require('./Alert')(sequelize); // Carregar o modelo Alert

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

// Função para inicializar o banco de dados
async function initializeDatabase() {
    try {
        // Testar a conexão
        await sequelize.authenticate();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');

        // Sincronizar os modelos com o banco de dados
        await sequelize.sync({ alter: true }); // Usando alter: true para manter os dados
        console.log('✅ Banco de dados sincronizado com sucesso.');

        return true;
    } catch (error) {
        console.error('❌ Erro ao sincronizar banco de dados:', error);
        throw error;
    }
}

// Exportar modelos e função de inicialização
module.exports = {
    sequelize,
    User: db.User,
    Pet: db.Pet,
    Location: db.Location,
    SafeZone: db.SafeZone,
    Alert: db.Alert,
    initializeDatabase
}; 