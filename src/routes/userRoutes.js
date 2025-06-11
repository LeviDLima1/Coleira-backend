const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// ... existing routes ...

// Rota para atualizar token de notificação push
router.post('/push-token', authMiddleware, userController.updatePushToken);

module.exports = router; 