require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error.middleware');

// Initialize database
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Dynamic CORS origins resolved purely from ENV variables
const envOrigins = [
  process.env.LOCAL_FRONTEND_URL,
  process.env.HOSTED_FRONTEND_URL,
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : []),
]
  .filter(Boolean)
  .map((origin) => origin.trim().replace(/\/$/, ''));

const allowedOrigins = Array.from(new Set(envOrigins));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server, curl, mobile, or requests with no origin header
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.trim().replace(/\/$/, '');
      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(normalizedOrigin) ||
        allowedOrigins.includes('*')
      ) {
        return callback(null, true);
      }

      // Automatically permit any Vercel preview or localhost port dynamically
      if (
        /^https:\/\/.*\.vercel\.app$/.test(normalizedOrigin) ||
        /^http:\/\/localhost(:\d+)?$/.test(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Pramyan HR Management API',
    database: 'MongoDB Atlas',
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/employees', require('./routes/employee.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));

// Centralized Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

module.exports = { app, server };
