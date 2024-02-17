const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
  connectToDatabase: () => {
    const databaseConnectionString = process.env.MONGODB_URI;

    mongoose.connect(databaseConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    const db = mongoose.connection;

    db.on('connected', () => {
      console.log(`Connected to MongoDB`);
    });

    db.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });
  },
};
