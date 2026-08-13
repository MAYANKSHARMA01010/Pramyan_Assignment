const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    let token = null;

    // 1. Check Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Fallback to cookie
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token && req.cookies?.hr_token) {
      token = req.cookies.hr_token;
    }

    if (!token) {
      return res.status(401).json({
        message: 'Authentication required. No access token provided.',
        code: 'NO_TOKEN',
      });
    }

    // Verify access token using dedicated JWT_ACCESS_SECRET from ENV
    const accessSecret =
      process.env.JWT_ACCESS_SECRET ||
      process.env.JWT_SECRET ||
      'pramyan_access_token_secret_auth_2026_x89a1b2c3';

    const decoded = jwt.verify(token, accessSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Access token expired. Please refresh your session.',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(401).json({
      message: 'Invalid access token.',
      code: 'INVALID_TOKEN',
    });
  }
};

module.exports = authMiddleware;
