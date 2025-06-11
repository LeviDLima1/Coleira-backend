const mysql = require('mysql2/promise');

async function listPets() {
    try {
        // Criar conexão
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'coleirainteligente'
        });

        // Listar todos os pets
        const [rows] = await connection.execute('SELECT * FROM pets');
        console.log('Pets encontrados:', rows);

        // Fechar conexão
        await connection.end();
    } catch (error) {
        console.error('Erro:', error);
    }
}

listPets(); 