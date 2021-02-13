const express = require('express');
const router = require('./routes/index');

const app = express();

app.use('/', router);

app.use(express.json());

module.exports = app;
