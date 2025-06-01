const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const ip = req.ip;

    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

    // Registra o tempo de resposta
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${timestamp}] ${method} ${url} - Status: ${res.statusCode} - Duração: ${duration}ms`);
    });

    next();
};

module.exports = logger; 