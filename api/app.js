const express = require('express');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./utils/globalErrorHandler');

const app = express();

app.get('/', (req, res, next) => res.send('Welcome to the home page!'));

app.all('*', (req, res, next) => next(new AppError('Page not found.', 404)));

app.use(globalErrorHandler);

module.exports = app;
