const mongoose = require('mongoose');

require('dotenv').config({
  path: '.env'
});

//Conexão
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.Promise = global.Promise;

mongoose.connection.on('error', (err) => {
  console.error(`Erro: ${err.message}`);
});

//Models
require('./models/Post');

const app = require('./app');

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
  console.log(`Servidor rodando na porta: ${server.address().port}`)
});