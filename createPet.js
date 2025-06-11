const mysql = require('mysql2/promise');

async function createPet() {
    try {
        // Criar conexão
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'coleirainteligente'
        });

        // Criar o pet
        const [result] = await connection.execute(
            'INSERT INTO pets (user_id, name, type, breed, age, device_id) VALUES (?, ?, ?, ?, ?, ?)',
            [1, 'Teco', 'Cachorro', 'Vira-lata', 2, '0000000000000000']
        );

        console.log('Pet criado com sucesso! ID:', result.insertId);

        // Consultar o pet criado
        const [rows] = await connection.execute('SELECT * FROM pets WHERE id = ?', [result.insertId]);
        console.log('Pet criado:', rows[0]);

        // Fechar conexão
        await connection.end();
    } catch (error) {
        console.error('Erro:', error);
    }
}

createPet(); 