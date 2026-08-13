const express = require('express');
const employeeController = require('../controllers/employee.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createEmployeeSchema, updateEmployeeSchema } = require('../validations/employee.validation');

const router = express.Router();

// All employee routes are protected with JWT auth middleware
router.use(authMiddleware);

router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', validate(createEmployeeSchema), employeeController.createEmployee);
router.put('/:id', validate(updateEmployeeSchema), employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
