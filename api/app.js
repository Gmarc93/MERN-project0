const express = require('express');

const app = express();

app.get('/', (req, res, next) => {
  res.send('Welcome to the homepage!');
});

module.exports = app;
