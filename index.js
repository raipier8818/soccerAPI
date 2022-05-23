const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');

const api = require('./router/api');

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use('/api', api);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use((req, res, next) => {
  res.status(404).send('404 Not Found');
});

app.use((err, req, res, next) => {
  console.log(err.stact);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});