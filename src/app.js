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

// Rota de teste
app.get('/', (request, response) => {
  return response.json({ message: "Servidor Online com NodeJS + Express!" });
});

// Rota de teste da API
app.get('/api/test', (request, response) => {
  return response.json({ message: "API está funcionando!" });
});

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
const HOST = '0.0.0.0'; // Permitindo conexões de qualquer IP

// Chamar a função de inicialização do banco de dados antes de iniciar o servidor
initializeDatabase()
  .then(() => {
    // Iniciar o servidor Express após a inicialização do banco de dados
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
      console.log(`🌐 URL local: http://localhost:${PORT}`);
      console.log(`🌐 URL rede: http://192.168.1.2:${PORT}`);
      console.log(`📝 Rotas disponíveis:`);
      console.log(`   - GET  /`);
      console.log(`   - GET  /api/test`);
      console.log(`   - POST /api/auth/login`);
      console.log(`   - POST /api/auth/register`);
      console.log(`   - GET  /api/pets`);
      console.log(`   - POST /api/pets`);
    });
  })
  .catch(error => {
    console.error('❌ Falha ao iniciar o servidor devido a erro no banco de dados:', error);
    process.exit(1); // Encerrar o processo se o banco de dados não inicializar
  });