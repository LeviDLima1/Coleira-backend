const express = require('express');
const router = express.Router();
const safeZoneController = require('../controllers/safeZoneController');
const auth = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(auth);

// Criar uma nova zona segura
router.post('/', safeZoneController.createSafeZone);

// Obter todas as zonas seguras do usuário
router.get('/', safeZoneController.getUserSafeZones);

// Excluir uma zona segura específica
router.delete('/:id', safeZoneController.deleteSafeZone);

module.exports = router; 