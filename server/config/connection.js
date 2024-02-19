const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

mongoose.connect(
  process.env.MONGODB_URI
);

module.exports = mongoose.connection;
