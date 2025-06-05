const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const config = require(__dirname + '/../config/database.js').development; // Importar configurações
const UserModel = require('./UserModel');
const Pet = require('./Pet');
const Location = require('./Location');
const SafeZone = require('./SafeZone');

// Definir associações (já podem estar definidas nos arquivos de modelo individuais, mas garantir aqui pode ajudar)
// Ex: User.hasMany(Pet, { foreignKey: 'user_id' });
// Ex: Pet.belongsTo(UserModel, { foreignKey: 'user_id' });
// Ex: Pet.hasMany(Location, { foreignKey: 'pet_id' });
// Ex: Location.belongsTo(Pet, { foreignKey: 'pet_id' });
// Ex: User.hasMany(SafeZone, { foreignKey: 'user_id' });
// Ex: SafeZone.belongsTo(UserModel, { foreignKey: 'user_id' });

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

// Carregar todos os arquivos de modelo e definir os modelos na instância sequelize
fs
    .readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== path.basename(__filename) &&
            file.slice(-3) === '.js'
        );
    })
    .forEach(file => {
        // Importar a função que define o modelo e chamá-la com a instância sequelize e DataTypes
        const model = require(path.join(__dirname, file))(sequelize, DataTypes);
        db[model.name] = model;
    });

// Definir associações se as associações estão nos arquivos de modelo individuais com método `associate`
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Se as associações estão definidas diretamente nos arquivos de modelo (como fizemos):
// É essencial que todos os modelos que participam das associações já estejam definidos em 'db'
// Exemplo de associações (verifique se já não estão nos arquivos de modelo e ajuste conforme necessário):
// db.User.hasMany(db.Pet, { foreignKey: 'user_id' });
// db.Pet.belongsTo(db.User, { foreignKey: 'user_id' });
// db.Pet.hasMany(db.Location, { foreignKey: 'pet_id' });
// db.Location.belongsTo(db.Pet, { foreignKey: 'pet_id' });
// db.User.hasMany(db.SafeZone, { foreignKey: 'user_id' });
// db.SafeZone.belongsTo(db.User, { foreignKey: 'user_id' });

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