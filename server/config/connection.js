const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb+srv://racevedoslaughter12:323585rs@cluster0.6wdkwmq.mongodb.net/LEARNIFY_DB?retryWrites=true&w=majority'
);

module.exports = mongoose.connection;
