const express = require('express');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./utils/globalErrorHandler');
const userRouter = require('./routers/userRouter');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res, next) => res.send('Welcome to the home page!'));
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => next(new AppError('Page not found.', 404)));

// Error handler
app.use(globalErrorHandler);

module.exports = app;
