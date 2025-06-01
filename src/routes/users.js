const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { validateUser } = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');

// Rota pública
router.post('/login', UserController.login);

// Rotas protegidas
router.get('/users', authMiddleware, UserController.listUsers);
router.get('/users/:id', authMiddleware, UserController.listUserById);
router.post('/users', validateUser, UserController.createUser);
router.put('/users/:id', authMiddleware, UserController.updateUser);
router.delete('/users/:id', authMiddleware, UserController.deleteUser);

module.exports = router;
