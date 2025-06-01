const validateUser = (req, res, next) => {
    const { name, email, password } = req.body;

    // Validação do nome
    if (!name || name.length < 3) {
        return res.status(400).json({
            error: 'Nome é obrigatório e deve ter pelo menos 3 caracteres'
        });
    }

    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            error: 'Email inválido'
        });
    }

    // Validação da senha
    if (!password || password.length < 8) {
        return res.status(400).json({
            error: 'Senha é obrigatória e deve ter pelo menos 8 caracteres'
        });
    }

    next();
};

module.exports = {
    validateUser
}; 