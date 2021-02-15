const express = require('express');
const mustache = require('mustache-express');
const router = require('./routes/index');
const helpers = require('./helpers');
const errorHandler = require('./handlers/errorHandler');

const app = express();

app.use((req, res, next) => {
  res.locals.helpers = helpers;
  next();
});

app.use(express.json());

app.use('/', router);

app.use(errorHandler.notFound);

app.engine('mustache', mustache(__dirname + '/views/partials', '.mustache'));
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

module.exports = app;