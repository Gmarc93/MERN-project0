'use strict';

process.on('uncaughtException', (err) => {
  console.log('ERROR: UNCAUGHT EXCEPTION ---');
  console.log(err);
  process.exit(1);
});

const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./api/app');

dotenv.config({path: path.join(__dirname, '/config/config.env')});

const port = process.env.PORT || 3000;

const server = app.listen(port, () =>
  console.log(`Server is now live on port ${port}...`)
);

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log('Server is now connected to MongoDB! ');
  } catch (err) {
    console.log(err);
  }
})();

process.on('unhandledRejection', (err) => {
  console.log('ERROR: UNHANDLED REJECTION ---');
  console.log(err);
  server.close(() => process.exit(1));
});
