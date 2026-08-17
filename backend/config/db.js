const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined.');
    }
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
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
    process.exit(1);
  }
};

module.exports = connectDB;
