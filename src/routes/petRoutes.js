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

// Atualizar um pet específico
router.put('/:id', petController.updatePet);

// Deletar um pet específico
router.delete('/:id', petController.deletePet);

module.exports = router; 