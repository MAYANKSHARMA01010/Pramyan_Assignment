const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');

// @desc    Get all employees with filtering & search
// @route   GET /api/employees
exports.getEmployees = async (req, res) => {
  try {
    const { search, department, status } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (department) {
      filter.department = department;
    }

    if (status) {
      filter.status = status;
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    return res.json(employees);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    return res.json(employee);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching employee', error: error.message });
  }
};

// @desc    Create new employee record
// @route   POST /api/employees
exports.createEmployee = async (req, res) => {
  try {
    const { name, employeeId, department, designation, email, phone, dateOfJoining, status } = req.body;

    // Validate 8 required fields
    if (!name || !employeeId || !department || !designation || !email || !phone || !dateOfJoining) {
      return res.status(400).json({ message: 'All employee fields are required' });
    }

    // Check unique employeeId and email
    const existingId = await Employee.findOne({ employeeId: employeeId.trim() });
    if (existingId) {
      return res.status(400).json({ message: `Employee ID ${employeeId.trim()} is already in use` });
    }

    const existingEmail = await Employee.findOne({ email: email.trim().toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: `Email ${email.trim()} is already registered` });
    }

    const employee = await Employee.create({
      name: name.trim(),
      employeeId: employeeId.trim(),
      department: department.trim(),
      designation: designation.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      dateOfJoining: new Date(dateOfJoining),
      status: status || 'Active',
    });

    return res.status(201).json(employee);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating employee', error: error.message });
  }
};

// @desc    Update employee record
// @route   PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
  try {
    const { name, employeeId, department, designation, email, phone, dateOfJoining, status } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check duplicate ID if changed
    if (employeeId && employeeId.trim() !== employee.employeeId) {
      const duplicateId = await Employee.findOne({
        employeeId: employeeId.trim(),
        _id: { $ne: req.params.id },
      });
      if (duplicateId) {
        return res.status(400).json({ message: `Employee ID ${employeeId.trim()} is already in use` });
      }
    }

    // Check duplicate email if changed
    if (email && email.trim().toLowerCase() !== employee.email.toLowerCase()) {
      const duplicateEmail = await Employee.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: req.params.id },
      });
      if (duplicateEmail) {
        return res.status(400).json({ message: `Email ${email.trim()} is already in use` });
      }
    }

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        name: name !== undefined ? name.trim() : employee.name,
        employeeId: employeeId !== undefined ? employeeId.trim() : employee.employeeId,
        department: department !== undefined ? department.trim() : employee.department,
        designation: designation !== undefined ? designation.trim() : employee.designation,
        email: email !== undefined ? email.trim().toLowerCase() : employee.email,
        phone: phone !== undefined ? phone.trim() : employee.phone,
        dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : employee.dateOfJoining,
        status: status !== undefined ? status : employee.status,
      },
      { new: true, runValidators: true }
    );

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating employee', error: error.message });
  }
};

// @desc    Delete employee record and associated attendance history
// @route   DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Delete attendance records for this employee
    await Attendance.deleteMany({ employeeId: employee._id });
    await Employee.findByIdAndDelete(req.params.id);

    return res.json({ message: `Employee ${employee.name} deleted successfully` });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting employee', error: error.message });
  }
};
