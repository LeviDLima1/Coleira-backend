const Pet = require('../models/Pet');

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
            order: [['createdAt', 'DESC']]
        });

        const petsResponse = pets.map(pet => ({
            id: pet.id,
            nome: pet.name,
            tipo: pet.type,
            raca: pet.breed,
            idade: pet.age,
            foto: pet.image,
            createdAt: pet.createdAt
        }));

        res.status(200).json({
            success: true,
            data: petsResponse
        });
    } catch (error) {
        res.status(400).json({
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