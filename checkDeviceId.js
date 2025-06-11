const mysql = require('mysql2/promise');

async function checkDeviceId() {
    try {
        // Criar conexão
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'coleirainteligente'
        });

        // Buscar o pet com ID 2
        const [rows] = await connection.execute('SELECT * FROM pets WHERE id = ?', [2]);
        const pet = rows[0];

        if (pet) {
            console.log('Pet encontrado:');
            console.log('ID:', pet.id);
            console.log('Nome:', pet.name);
            console.log('Device ID:', pet.device_id);
            console.log('Device ID length:', pet.device_id.length);
            console.log('Device ID type:', typeof pet.device_id);
            console.log('Device ID bytes:', Buffer.from(pet.device_id).toString('hex'));
            
            // Verificar se há espaços extras
            console.log('Device ID com trim:', pet.device_id.trim());
            console.log('Device ID bytes com trim:', Buffer.from(pet.device_id.trim()).toString('hex'));
        } else {
            console.log('Pet não encontrado');
        }

        // Fechar conexão
        await connection.end();
    } catch (error) {
        console.error('Erro:', error);
    }
}

checkDeviceId(); 