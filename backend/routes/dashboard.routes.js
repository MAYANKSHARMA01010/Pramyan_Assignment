const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Dashboard routes protected with auth middleware
router.use(authMiddleware);

router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
