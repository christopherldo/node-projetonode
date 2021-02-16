const express = require('express');
const mustache = require('mustache-express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

const router = require('./routes/index');

const helpers = require('./helpers');
const errorHandler = require('./handlers/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use(cookieParser(process.env.SECRET_KEY));
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.helpers = helpers;
  res.locals.flashes = req.flash();
  next();
});

app.use('/', router);

app.use(errorHandler.notFound);

app.engine('mustache', mustache(__dirname + '/views/partials', '.mustache'));
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

module.exports = app;