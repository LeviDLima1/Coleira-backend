const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { validateUser } = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');

// Rotas protegidas
router.get('/', authMiddleware, UserController.listUsers);
router.get('/:id', authMiddleware, UserController.listUserById);
router.post('/', validateUser, UserController.createUser);
router.put('/:id', authMiddleware, UserController.updateUser);
router.delete('/:id', authMiddleware, UserController.deleteUser);

// Novas rotas para perfil
router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/profile', authMiddleware, UserController.updateProfile);

module.exports = router;
