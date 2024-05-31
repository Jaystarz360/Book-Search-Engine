// Importing necessary modules
const mongoose = require('mongoose');
require('dotenv').config(); // For loading environment variables

// Connecting to MongoDB database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks' , {
  useNewUrlParser: true, // Use new URL parser
  useUnifiedTopology: true // Use new Server Discover and Monitoring engine
});

// Exporting MongoDB connection
module.exports = mongoose.connection;