const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      default: 'Admin',
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Auto-delete document upon expiry using TTL index
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
