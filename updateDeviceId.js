const db = require('./src/models');

async function updatePetDeviceId() {
    try {
        // Atualizar o device_id do pet com ID 1
        const pet = await db.Pet.findByPk(1);
        if (!pet) {
            console.log('Pet não encontrado');
            return;
        }

        // Atualizar com um device_id padrão (0000000000000000)
        await pet.update({ device_id: '0000000000000000' });
        console.log('Device ID atualizado com sucesso!');
        console.log('Pet:', pet.toJSON());
    } catch (error) {
        console.error('Erro ao atualizar device_id:', error);
    } finally {
        process.exit();
    }
}

updatePetDeviceId(); 