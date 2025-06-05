const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Rota para receber dados de localização da coleira/dispositivo
// Não requer autenticação, pois é chamada pelo dispositivo
router.post('/receive', locationController.receiveLocationData);

module.exports = router; 