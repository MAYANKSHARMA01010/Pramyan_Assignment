const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    date: { type: String, required: true }, // stored as 'YYYY-MM-DD'
    status: {
      type: String,
      enum: ['Present', 'Absent', 'On Leave'],
      required: true,
    },
  },
  { timestamps: true }
);

// One record per employee per date
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
