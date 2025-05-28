const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Adicionar CORS
app.use(cors({
    origin: '*', // Em desenvolvimento, permite todas as origens
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
// Middleware para processar JSON
app.use(express.json());

// Importando as rotas
const userRoutes = require('./routes/users');

// Usando as rotas (removendo o /api duplicado)
app.use(userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });