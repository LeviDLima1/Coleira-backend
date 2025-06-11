const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createUser() {
    try {
        // Criar conexão
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'coleirainteligente'
        });

        // Hash da senha
        const hashedPassword = await bcrypt.hash('123456', 10);

        // Criar o usuário
        const [result] = await connection.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            ['Usuário Teste', 'teste@email.com', hashedPassword]
        );

        console.log('Usuário criado com sucesso! ID:', result.insertId);

        // Consultar o usuário criado
        const [rows] = await connection.execute('SELECT id, name, email FROM users WHERE id = ?', [result.insertId]);
        console.log('Usuário criado:', rows[0]);

        // Fechar conexão
        await connection.end();
    } catch (error) {
        console.error('Erro:', error);
    }
}

createUser(); 