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
const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/locationRoutes');
const safeZoneRoutes = require('./routes/safeZoneRoutes');

// Usando as rotas
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/safe-zones', safeZoneRoutes);

// Log de rotas registradas
console.log('🛣️ Rotas registradas:');
console.log('- /api/users');
console.log('- /api/pets');
console.log('- /api/auth');
console.log('- /api/locations');
console.log('- /api/safe-zones');

// Importando a função de inicialização do banco de dados
const { initializeDatabase } = require('./models');

const PORT = process.env.PORT || 3000;

// Chamar a função de inicialização do banco de dados antes de iniciar o servidor
initializeDatabase()
  .then(() => {
    // Iniciar o servidor Express após a inicialização do banco de dados
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌐 URL base: http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('❌ Falha ao iniciar o servidor devido a erro no banco de dados:', error);
    process.exit(1); // Encerrar o processo se o banco de dados não inicializar
  });

app.get('/', (request, response) => {
  return response.send("Servidor Online com NodeJS + Express!")
});