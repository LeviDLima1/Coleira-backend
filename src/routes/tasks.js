const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');

// Definindo as rotas
router.get('/tasks', TaskController.index);
router.post('/tasks', TaskController.store);

module.exports = router;