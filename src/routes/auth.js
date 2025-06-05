const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Rota de login
router.post('/login', UserController.login);

module.exports = router; 