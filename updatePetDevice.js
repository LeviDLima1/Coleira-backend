const mysql = require('mysql2/promise');

async function updatePetDevice() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'coleiraInteligente'
        });

        // Novo device ID fornecido
        const deviceId = '1C6920A2DFE8';
        const petId = 1;

        // Atualizar o device_id do pet
        await connection.execute(
            'UPDATE pets SET device_id = ? WHERE id = ?',
            [deviceId, petId]
        );

        // Verificar se a atualização foi bem sucedida
        const [rows] = await connection.execute(
            'SELECT * FROM pets WHERE id = ?',
            [petId]
        );

        if (rows.length > 0) {
            console.log(`Device ID do pet ${petId} atualizado com sucesso!`);
            console.log(`Device ID usado: ${deviceId}`);
            console.log(`Pet ${petId} atualizado:`, rows[0]);
        } else {
            console.log(`Pet ${petId} não encontrado`);
        }

        await connection.end();
    } catch (error) {
        console.error('Erro:', error);
    }
}

updatePetDevice(); 