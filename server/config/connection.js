// Importing necessary module
const mongoose = require('mongoose');

// Loading environment variables from .env file
require('dotenv').config();

// Connecting to MongoDB database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks' , {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Exporting the Mongoose connection
module.exports = mongoose.connection;
