const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const auth = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(auth);

// Criar um novo pet
router.post('/', petController.createPet);

// Obter todos os pets do usuário
router.get('/', petController.getUserPets);

// Obter um pet específico por ID
router.get('/:id', petController.getPetById);

// Atualizar um pet específico
router.put('/:id', petController.updatePet);

// Deletar um pet específico
router.delete('/:id', petController.deletePet);

// Obter localização do pet por ID (corrigido para usar petId)
router.get('/location/:petId', petController.getPetLocation);

// Atualizar device_id do pet
router.put('/:petId/device', petController.updatePetDeviceId);

module.exports = router; 