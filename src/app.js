const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware para processar JSON
app.use(express.json());

// Middleware de CORS com configurações mais específicas
app.use(cors({
  origin: '*', // Permitindo todas as origens durante o desenvolvimento
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware de Logger
const logger = require('./middleware/logger');
app.use(logger);

// Log de todas as requisições
app.use((req, res, next) => {
  console.log('📥 Requisição recebida:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
});

// Importando as rotas
const userRoutes = require('./routes/users');
const petRoutes = require('./routes/petRoutes');

// Usando as rotas
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);

// Log de rotas registradas
console.log('🛣️ Rotas registradas:');
console.log('- /api/users');
console.log('- /api/pets');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 URL base: http://localhost:${PORT}`);
});

app.get('/', (request, response) => {
  return response.send("Servidor Online com NodeJS + Express!")
});