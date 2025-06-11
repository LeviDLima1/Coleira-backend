const mysql = require('mysql2/promise');

async function checkPet() {
    try {
        // Criar conexão
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'coleirainteligente'
        });

        // Consultar o pet
        const [rows] = await connection.execute('SELECT * FROM pets WHERE id = 1');
        console.log('Pet encontrado:', rows[0]);

        // Fechar conexão
        await connection.end();
    } catch (error) {
        console.error('Erro:', error);
    }
}

checkPet(); 