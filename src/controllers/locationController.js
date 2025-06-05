const Location = require('../models/Location'); // Importar o modelo Location

exports.receiveLocationData = async (req, res) => {
    try {
        console.log('📦 Dados de localização recebidos:', req.body);

        // Assumindo que o corpo da requisição contém:
        // { petId: number, latitude: number, longitude: number, batteryLevel?: number, status?: string }
        const { petId, latitude, longitude, batteryLevel, status } = req.body;

        // TODO: Adicionar validação dos dados recebidos
        if (!petId || latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Dados de localização incompletos.'
            });
        }

        // Salvar os dados na tabela locations
        const newLocation = await Location.create({
            pet_id: petId, // Usar pet_id para corresponder ao nome da coluna no DB
            latitude: latitude,
            longitude: longitude,
            timestamp: new Date(), // Usar a data/hora atual do servidor ao receber
            battery_level: batteryLevel,
            status: status,
        });

        console.log('✅ Localização salva no DB:', newLocation);

        res.status(201).json({
            success: true,
            message: 'Dados de localização recebidos e salvos com sucesso.',
            data: newLocation
        });

    } catch (error) {
        console.error('❌ Erro ao receber/salvar dados de localização:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}; 