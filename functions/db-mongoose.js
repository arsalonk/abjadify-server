
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const functions = require('firebase-functions');
const DATABASE_URL = require('./config').DATABASE_URL || functions.config().database.url;

function dbConnect(url = DATABASE_URL) {
  return mongoose.connect(url)
    .then(() => {
      console.info(`Database connected at ${url}`);
    })
    .catch(err => {
      console.error('Mongoose failed to connect');
      console.error(err);
    });
}

function dbDisconnect() {
  return mongoose.disconnect();
}

function dbGet() {
  return mongoose;
}

module.exports = {
  dbConnect,
  dbDisconnect,
  dbGet
};
