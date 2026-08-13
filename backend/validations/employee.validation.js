const { z } = require('zod');

const createEmployeeSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  employeeId: z
    .string()
    .trim()
    .min(2, 'Employee ID must be at least 2 characters')
    .regex(/^[A-Za-z0-9_-]+$/, 'Employee ID can only contain alphanumeric characters, hyphens, and underscores'),
  department: z.string().trim().min(1, 'Department is required'),
  designation: z.string().trim().min(1, 'Designation is required'),
  email: z.string().trim().email('Invalid email address format'),
  phone: z.string().trim().min(7, 'Phone number must be at least 7 characters'),
  dateOfJoining: z.string().min(1, 'Date of Joining is required'),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

const updateEmployeeSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
  employeeId: z
    .string()
    .trim()
    .min(2, 'Employee ID must be at least 2 characters')
    .regex(/^[A-Za-z0-9_-]+$/, 'Employee ID can only contain alphanumeric characters, hyphens, and underscores')
    .optional(),
  department: z.string().trim().min(1, 'Department cannot be empty').optional(),
  designation: z.string().trim().min(1, 'Designation cannot be empty').optional(),
  email: z.string().trim().email('Invalid email address format').optional(),
  phone: z.string().trim().min(7, 'Phone number must be at least 7 characters').optional(),
  dateOfJoining: z.string().min(1, 'Date of Joining is required').optional(),
  status: z.enum(['Active', 'Inactive']).optional(),
});

module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema,
};
