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

// Importando as rotas
const userRoutes = require('./routes/users');

// Usando as rotas
app.use(userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.get('/', (request, response) => {
  return response.send("Servidor Online com NodeJS + Express!")
});