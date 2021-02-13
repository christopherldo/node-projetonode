const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(req.query);
});

router.get('/posts/:slug', (req, res) => {
  let slug = req.params.slug;

  res.send(slug);
});

router.get('/sobre', (req, res) => {
  res.send('Página SOBRE');
});

module.exports = router;