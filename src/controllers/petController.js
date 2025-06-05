const db = require('../models');
const Pet = db.Pet;
const Location = db.Location;

exports.createPet = async (req, res) => {
    try {
        console.log('📝 Criando novo pet:', {
            body: req.body,
            userId: req.userId
        });

        const { nome, tipo, raca, idade, foto } = req.body;
        const userId = req.userId;

        console.log('🔍 Dados do pet:', {
            nome,
            tipo,
            raca,
            idade,
            foto,
            userId
        });

        const pet = await Pet.create({
            userId,
            name: nome,
            type: tipo,
            breed: raca,
            age: idade,
            image: foto
        });

        console.log('✅ Pet criado:', pet);

        const petResponse = {
            id: pet.id,
            nome: pet.name,
            tipo: pet.type,
            raca: pet.breed,
            idade: pet.age,
            foto: pet.image,
            createdAt: pet.createdAt
        };

        res.status(201).json({
            success: true,
            data: petResponse
        });
    } catch (error) {
        console.error('❌ Erro ao criar pet:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getUserPets = async (req, res) => {
    try {
        const userId = req.userId;
        const pets = await Pet.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            // Incluir a última localização diretamente na consulta, se possível com Sequelize e a relação hasOne/hasMany
            // Exemplo (pode variar dependendo da sua configuração de associação):
            /*
            include: [{
                model: Location,
                as: 'latestLocation', // Use o alias definido na associação
                limit: 1,
                order: [['timestamp', 'DESC']],
                required: false // Usar false para LEFT JOIN, para incluir pets sem localização
            }]
            */
        });

        const petsResponse = await Promise.all(pets.map(async (pet) => {
            // Se a inclusão direta na consulta não for viável, buscar a última localização individualmente
            const latestLocation = await Location.findOne({
                where: { pet_id: pet.id },
                order: [['timestamp', 'DESC']],
            });

            let petStatus = 'Offline'; // Status padrão
            if (latestLocation) {
                // Exemplo de lógica de status: verificar se há uma localização recente ou usar o campo status do modelo
                const now = new Date();
                const lastUpdate = new Date(latestLocation.timestamp);
                const timeDiff = (now.getTime() - lastUpdate.getTime()) / (1000 * 60); // Diferença em minutos

                if (timeDiff < 10) { // Considerar online se a última atualização foi nos últimos 10 minutos
                    petStatus = latestLocation.status || 'Online'; // Usar status do modelo ou Online
                } else {
                    petStatus = latestLocation.status || 'Última atualização há mais tempo';
                }
                // TODO: Implementar lógica mais sofisticada para "Dentro da Zona Segura" se você tiver zonas geográficas
                // petStatus = verificarZonaSegura(latestLocation) ? "Dentro da Zona Segura" : "Fora da Zona Segura";

            }

            return {
                id: pet.id,
                nome: pet.name,
                tipo: pet.type,
                raca: pet.breed,
                idade: pet.age,
                foto: pet.image,
                createdAt: pet.createdAt,
                status: petStatus, // Status dinâmico
            };
        }));

        res.status(200).json({
            success: true,
            data: petsResponse
        });
    } catch (error) {
        console.error('❌ Erro ao obter pets do usuário:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getPetById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        console.log(`Attempting to get pet with ID: ${id} for user ID: ${userId}`);

        const pet = await Pet.findOne({
            where: { id, userId }
        });

        if (!pet) {
            console.log(`Pet with ID ${id} not found for user ${userId}`);
            return res.status(404).json({
                success: false,
                error: 'Pet não encontrado ou não pertence a este usuário'
            });
        }

        const petResponse = {
            id: pet.id,
            nome: pet.name,
            tipo: pet.type,
            raca: pet.breed,
            idade: pet.age,
            foto: pet.image,
            createdAt: pet.createdAt
        };

        console.log(`Found pet with ID ${id} for user ${userId}:`, petResponse);
        res.status(200).json({
            success: true,
            data: petResponse
        });

    } catch (error) {
        console.error('❌ Erro ao obter pet por ID:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.updatePet = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, tipo, raca, idade, foto } = req.body;
        const userId = req.userId;

        const [updated] = await Pet.update({
            name: nome,
            type: tipo,
            breed: raca,
            age: idade,
            image: foto
        }, {
            where: { id, userId }
        });

        if (!updated) {
            return res.status(404).json({
                success: false,
                error: 'Pet não encontrado'
            });
        }

        const pet = await Pet.findOne({
            where: { id, userId }
        });

        const petResponse = {
            id: pet.id,
            nome: pet.name,
            tipo: pet.type,
            raca: pet.breed,
            idade: pet.age,
            foto: pet.image,
            createdAt: pet.createdAt
        };

        res.status(200).json({
            success: true,
            data: petResponse
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.deletePet = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const deleted = await Pet.destroy({
            where: { id, userId }
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Pet não encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getPetLocation = async (req, res) => {
    try {
        const { petId } = req.params;
        console.log(`Attempting to get pet location for pet ID: ${petId}`);

        const petLocation = await Location.findOne({
            where: { pet_id: petId },
            order: [['timestamp', 'DESC']],
        });

        if (petLocation) {
            console.log(`Found location for pet ${petId}:`, petLocation);
            const responseData = {
                latitude: petLocation.latitude,
                longitude: petLocation.longitude,
                timestamp: petLocation.timestamp.toISOString(),
                batteryLevel: petLocation.batteryLevel,
                status: petLocation.status,
            };

            res.status(200).json({
                success: true,
                data: responseData
            });
        } else {
            console.log(`No location found for pet ${petId}`);
            res.status(404).json({
                success: false,
                error: 'Localização do pet não encontrada'
            });
        }

    } catch (error) {
        console.error('❌ Erro ao obter localização do pet:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}; 