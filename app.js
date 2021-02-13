const express = require('express');

const router = express.Router();
const app = express();

// Rotas
router.get('/', (req, res) => {
  res.send('Olá, Mundo!');
});

// Configurações
app.use('/', router);

module.exports = app;
