const User = require('../models/User');
const bcrypt = require('bcryptjs');

const UserController = {
    async register(req, res) {
        try {
            console.log('Recebendo requisição:', req.body);
            const { name, email, password } = req.body;

            // Verifica se o usuário já existe
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                return res.status(400).json({ error: 'Email já cadastrado' });
            }

            // Criptografa a senha
            const hashedPassword = await bcrypt.hash(password, 10);

            // Cria o usuário
            const user = await User.create({
                name,
                email,
                password: hashedPassword
            });

            // Remove a senha do objeto retornado
            const { password: _, ...userWithoutPassword } = user.toJSON();

            return res.status(201).json(userWithoutPassword);
        } catch (error) {
            
            return res.status(500).json({ error: 'Erro ao registrar usuário' }, error);
        }
    }
};

module.exports = UserController;
