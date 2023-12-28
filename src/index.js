const express = require('express');
require('express-async-errors');

const app = express();

const cors = require('./app/middlewares/cors');
const routes = require('./routes');
const errorHandler = require('./app/middlewares/errorHandler');

app.use(express.json());

app.use(cors);

app.use(routes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server running in http://localhost:3000');
});
