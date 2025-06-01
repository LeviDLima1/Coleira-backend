const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserController = {
    listUsers: async (req, res) => {
        try {
            const users = await User.findAll();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
    },
    listUserById: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await User.findByPk(id);
            if (!data) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar usuário' });
        }
    },
    createUser: async (req, res) => {
        try {
            // Validação dos campos obrigatórios
            if (!req.body.name || !req.body.email || !req.body.password) {
                return res.status(400).json({
                    error: "Todos os campos são obrigatórios (name, email, password)"
                });
            }

            const data = {
                name: req.body.name,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10) // Criptografando a senha
            };

            // Verifica se já existe um usuário com este email
            const existingUser = await User.findOne({ where: { email: data.email } });
            if (existingUser) {
                return res.status(400).json({ error: "Este email já está em uso" });
            }

            await User.create(data);
            return res.status(201).json({
                message: 'Usuário criado com sucesso',
                data: {
                    name: data.name,
                    email: data.email
                }
            });
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return res.status(500).json({
                error: "Erro ao criar usuário",
                details: error.message
            });
        }
    },
    updateUser: async (req, res) => {
        const { id } = req.params;
        const data = req.body;

        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            await User.update(data, {
                where: {
                    id: id
                }
            });
            return res.status(200).json({
                message: 'Usuário atualizado com sucesso',
                data: data
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Erro ao atualizar usuário',
                details: error.message
            });
        }
    },
    deleteUser: async (req, res) => {
        const { id } = req.params;
        await User.destroy({
            where: {
                id: id
            }
        });
        return res.status(200).json({
            message: 'Usuário deletado com sucesso'
        });
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log('Tentativa de login:', { email });

            // Busca o usuário pelo email
            const user = await User.findOne({ where: { email } });
            console.log('Usuário encontrado:', user ? 'Sim' : 'Não');

            if (!user) {
                return res.status(401).json({ error: 'Usuário não encontrado' });
            }

            // Verifica a senha
            const validPassword = await bcrypt.compare(password, user.password);
            console.log('Senha válida:', validPassword ? 'Sim' : 'Não');

            if (!validPassword) {
                return res.status(401).json({ error: 'Senha inválida' });
            }

            // Gera o token
            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.status(200).json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token
            });
        } catch (error) {
            console.error('Erro no login:', error);
            return res.status(500).json({ error: 'Erro ao fazer login' });
        }
    }
};

module.exports = UserController;
