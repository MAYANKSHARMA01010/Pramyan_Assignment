const express = require('express');
const attendanceController = require('../controllers/attendance.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { markAttendanceSchema } = require('../validations/attendance.validation');

const router = express.Router();

// All attendance routes are protected with auth middleware
router.use(authMiddleware);

router.get('/', attendanceController.getAttendance);
router.post('/', validate(markAttendanceSchema), attendanceController.markAttendance);

module.exports = router;
