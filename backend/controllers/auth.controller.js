const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

// Demo credentials
const ADMIN_USER = {
  id: 'admin_001',
  name: 'HR Admin',
  email: 'admin@pramyan.com',
  password: 'Admin@123',
  role: 'Admin',
};

// Convert string duration (e.g., '15m', '7d', '24h') to milliseconds
const parseDurationToMs = (durationStr, defaultMs) => {
  if (!durationStr) return defaultMs;
  const match = durationStr.match(/^(\d+)([smhd])$/);
  if (!match) return defaultMs;
  const val = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 's':
      return val * 1000;
    case 'm':
      return val * 60 * 1000;
    case 'h':
      return val * 60 * 60 * 1000;
    case 'd':
      return val * 24 * 60 * 60 * 1000;
    default:
      return defaultMs;
  }
};

// Access Token helper (uses JWT_ACCESS_SECRET & JWT_ACCESS_EXPIRES_IN from ENV)
const generateAccessToken = (user) => {
  const secret =
    process.env.JWT_ACCESS_SECRET ||
    process.env.JWT_SECRET ||
    'pramyan_access_token_secret_auth_2026_x89a1b2c3';
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';

  return jwt.sign(
    {
      userId: user.id || user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'Admin',
    },
    secret,
    { expiresIn }
  );
};

// Refresh Token helper (uses JWT_REFRESH_SECRET & JWT_REFRESH_EXPIRES_IN from ENV)
const generateAndStoreRefreshToken = async (user) => {
  const secret =
    process.env.JWT_REFRESH_SECRET || 'pramyan_refresh_token_vault_secret_2026_z98y7x6w5';
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  const durationMs = parseDurationToMs(expiresIn, 7 * 24 * 60 * 60 * 1000);

  // Sign Refresh Token with its dedicated Refresh Secret
  const token = jwt.sign(
    {
      userId: user.id || user._id,
      email: user.email,
      tokenType: 'refresh',
    },
    secret,
    { expiresIn }
  );

  const expiresAt = new Date(Date.now() + durationMs);

  // Persist in MongoDB Atlas for revocation tracking
  await RefreshToken.create({
    token,
    userEmail: user.email,
    role: user.role || 'Admin',
    expiresAt,
  });

  return { token, expiresAt, durationMs };
};

// @desc    Authenticate user & issue 2 distinct tokens with different secrets & expiry via ENV
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (email !== ADMIN_USER.email || password !== ADMIN_USER.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 1. Generate Access Token using JWT_ACCESS_SECRET & JWT_ACCESS_EXPIRES_IN
    const accessToken = generateAccessToken(ADMIN_USER);
    const accessMs = parseDurationToMs(process.env.JWT_ACCESS_EXPIRES_IN || '15m', 15 * 60 * 1000);

    // 2. Generate Refresh Token using JWT_REFRESH_SECRET & JWT_REFRESH_EXPIRES_IN and persist in MongoDB
    const { token: refreshToken, durationMs: refreshMs } = await generateAndStoreRefreshToken(
      ADMIN_USER
    );

    // 3. Set Cookies with respective expiry times from ENV
    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: accessMs,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshMs,
    });

    return res.json({
      message: 'Authentication successful',
      accessToken,
      refreshToken,
      user: {
        id: ADMIN_USER.id,
        name: ADMIN_USER.name,
        email: ADMIN_USER.email,
        role: ADMIN_USER.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};

// @desc    Refresh access token & rotate refresh token using distinct ENV secrets & MongoDB verification
// @route   POST /api/auth/refresh
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    // 1. Cryptographically verify token signature with JWT_REFRESH_SECRET
    const refreshSecret =
      process.env.JWT_REFRESH_SECRET || 'pramyan_refresh_token_vault_secret_2026_z98y7x6w5';
    let decoded;
    try {
      decoded = jwt.verify(token, refreshSecret);
    } catch (err) {
      await RefreshToken.deleteOne({ token });
      return res.status(403).json({ message: 'Invalid or expired refresh token signature' });
    }

    // 2. Verify token existence in MongoDB Atlas
    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken) {
      return res.status(403).json({ message: 'Refresh token has been revoked or does not exist' });
    }

    // 3. Check DB expiry
    if (new Date() > storedToken.expiresAt) {
      await RefreshToken.deleteOne({ token });
      return res.status(403).json({ message: 'Refresh token has expired. Please sign in again.' });
    }

    const userPayload = {
      email: storedToken.userEmail,
      name: ADMIN_USER.name,
      role: storedToken.role,
    };

    // 4. Issue new Access Token (signed with JWT_ACCESS_SECRET)
    const newAccessToken = generateAccessToken(userPayload);
    const accessMs = parseDurationToMs(process.env.JWT_ACCESS_EXPIRES_IN || '15m', 15 * 60 * 1000);

    // 5. Rotate Refresh Token in MongoDB (signed with JWT_REFRESH_SECRET)
    await RefreshToken.deleteOne({ token });
    const { token: newRefreshToken, durationMs: refreshMs } = await generateAndStoreRefreshToken(
      userPayload
    );

    // 6. Set updated cookies
    res.cookie('accessToken', newAccessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: accessMs,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshMs,
    });

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Token refresh error', error: error.message });
  }
};

// @desc    Logout user & revoke refresh token from database
// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (token) {
      await RefreshToken.deleteOne({ token });
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('hr_token');

    return res.json({ message: 'Successfully signed out and revoked active session' });
  } catch (error) {
    return res.status(500).json({ message: 'Logout error', error: error.message });
  }
};

// @desc    Get currently authenticated admin user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  return res.json({
    user: req.user,
  });
};
