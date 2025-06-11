const mysql = require('mysql2/promise');

async function deleteUsers() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'coleiraInteligente'
        });

        // Primeiro deletar registros relacionados
        await connection.execute('DELETE FROM alerts');
        await connection.execute('DELETE FROM locations');
        await connection.execute('DELETE FROM safe_zones');
        await connection.execute('DELETE FROM pets');
        
        // Depois deletar os usuários
        await connection.execute('DELETE FROM users');
        
        console.log('✅ Todos os usuários e registros relacionados foram deletados com sucesso!');
        
        await connection.end();
    } catch (error) {
        console.error('❌ Erro:', error);
    }
}

deleteUsers(); 