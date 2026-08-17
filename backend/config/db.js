const mongoose = require('mongoose');

let isConnected = false;
let retryTimeout = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MongoDB Connection Error: MONGO_URI environment variable is missing.');
    console.error('💡 TIP: Set MONGO_URI in your environment or Render Dashboard -> Environment.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('whitelist') || error.message.includes('Could not connect to any servers')) {
      console.error(
        '💡 TIP: Ensure your MongoDB Atlas Network Access has 0.0.0.0/0 (Allow Access from Anywhere) enabled for Render!'
      );
    }
    if (error.message.includes('bad auth')) {
      console.error(
        '💡 TIP: Check your database username and password in MongoDB Atlas -> Database Access!'
      );
    }

    // Schedule auto-retry after 5 seconds without crashing the server process
    if (!retryTimeout) {
      retryTimeout = setTimeout(() => {
        retryTimeout = null;
        connectDB();
      }, 5000);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠️ MongoDB disconnected. Retrying in 5 seconds...');
  if (!retryTimeout) {
    retryTimeout = setTimeout(() => {
      retryTimeout = null;
      connectDB();
    }, 5000);
  }
});

mongoose.connection.on('connected', () => {
  isConnected = true;
});

module.exports = { connectDB, isConnected: () => isConnected };
