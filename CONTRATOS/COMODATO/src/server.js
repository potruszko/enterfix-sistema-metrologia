const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const contratoRoutes = require('./routes/contratoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (contratos gerados)
app.use('/contratos', express.static(path.join(__dirname, '../contratos')));

// Rotas da API
app.use('/api/contratos', contratoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Sistema de Contratos Enterfix - Online',
    timestamp: new Date().toISOString()
  });
});

// Servir frontend em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Enterfix rodando na porta ${PORT}`);
  console.log(`📄 API disponível em http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
