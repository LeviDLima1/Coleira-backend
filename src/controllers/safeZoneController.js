const db = require('../models');
const SafeZone = db.SafeZone;

exports.createSafeZone = async (req, res) => {
    try {
        const { name, center_latitude, center_longitude, radius } = req.body;
        const user_id = req.userId;

        const safeZone = await SafeZone.create({
            user_id,
            name,
            center_latitude,
            center_longitude,
            radius
        });

        res.status(201).json({
            success: true,
            data: safeZone
        });
    } catch (error) {
        console.error('❌ Erro ao criar zona segura:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getUserSafeZones = async (req, res) => {
    try {
        const user_id = req.userId;
        const safeZones = await SafeZone.findAll({
            where: { user_id },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: safeZones
        });
    } catch (error) {
        console.error('❌ Erro ao obter zonas seguras:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.deleteSafeZone = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.userId;

        const safeZone = await SafeZone.findOne({
            where: { id, user_id }
        });

        if (!safeZone) {
            return res.status(404).json({
                success: false,
                error: 'Zona segura não encontrada'
            });
        }

        await safeZone.destroy();

        res.status(200).json({
            success: true,
            message: 'Zona segura excluída com sucesso'
        });
    } catch (error) {
        console.error('❌ Erro ao excluir zona segura:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}; 