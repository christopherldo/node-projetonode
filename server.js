const app = require('./app');
const mongoose = require('mongoose');

require('dotenv').config({
  path: '.env'
});

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.Promise = global.Promise;

mongoose.connection.on('error', (err) => {
  console.error(`Erro: ${err.message}`);
});

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
  console.log(`Servidor rodando na porta: ${server.address().port}`)
});