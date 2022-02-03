const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./utils/globalErrorHandler');
const userRouter = require('./routers/userRouter');
const productRouter = require('./routers/productRouter');
const reviewRouter = require('./routers/reviewRouter');

// Initialization
const app = express();
const limiter = rateLimit({
  windowMs: 1000 * 60 * 60, // 1 hour
  max: 100, // Limit each IP to 100 requests per `window` (here, per 1 hour)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Middleware
app.use(helmet()); // Secures app by setting various HTTP headers
app.use(express.json()); // Parses incoming requests into req.body
app.use(mongoSanitize()); // Sanitizes data to prevent MongoDB operator injection
app.use(xss()); // Sanitizes data to prevent HTML script injection
app.use(hpp()); // Protects against HTTP parameter pollution attacks
app.use('/api', limiter);

// Routes
app.get('/', (req, res, next) => res.send('Welcome to the home page!'));
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('*', (req, res, next) => next(new AppError('Page not found.', 404)));

// Error handler
app.use(globalErrorHandler);

module.exports = app;
