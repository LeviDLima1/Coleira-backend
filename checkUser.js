const mysql = require('mysql2/promise');

async function checkUsers() {
    try {
        // Criar conexão
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'coleirainteligente'
        });

        // Consultar os usuários
        const [rows] = await connection.execute('SELECT id, name, email FROM users');
        console.log('Usuários encontrados:', rows);

        // Fechar conexão
        await connection.end();
    } catch (error) {
        console.error('Erro:', error);
    }
}

checkUsers(); 