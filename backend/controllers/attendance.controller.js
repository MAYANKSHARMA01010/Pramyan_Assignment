const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// @desc    Get attendance records (by date or employeeId)
// @route   GET /api/attendance
exports.getAttendance = async (req, res) => {
  try {
    const { date, employeeId, department } = req.query;
    const filter = {};

    if (date) {
      filter.date = date;
    }

    if (employeeId) {
      filter.employeeId = employeeId;
    }

    let records = await Attendance.find(filter)
      .populate('employeeId', 'name employeeId department designation status')
      .sort({ date: -1 });

    if (department) {
      records = records.filter((r) => r.employeeId?.department === department);
    }

    return res.json(records);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving attendance', error: error.message });
  }
};

// @desc    Mark / Update attendance for an employee on a specific date (Atomic Upsert)
// @route   POST /api/attendance
exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    if (!employeeId || !date || !status) {
      return res.status(400).json({ message: 'employeeId, date, and status are required' });
    }

    if (!['Present', 'Absent', 'On Leave'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Present, Absent, or On Leave' });
    }

    // Verify employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Upsert attendance record
    const attendance = await Attendance.findOneAndUpdate(
      { employeeId, date },
      { status },
      { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
    ).populate('employeeId', 'name employeeId department designation status');

    return res.json(attendance);
  } catch (error) {
    return res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
};
