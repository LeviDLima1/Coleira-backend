const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Pega o token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Formato do token: "Bearer TOKEN"
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({ error: 'Token mal formatado' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: 'Token mal formatado' });
    }

    try {
        // Verifica se o token é válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adiciona o ID do usuário na requisição
        req.userId = decoded.id;

        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

module.exports = authMiddleware; 