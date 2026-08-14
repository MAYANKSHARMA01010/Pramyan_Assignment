import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address (e.g. name@company.com)'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export const employeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters'),
  employeeId: z
    .string()
    .trim()
    .min(2, 'Employee ID must be at least 2 characters')
    .regex(
      /^[A-Za-z0-9_-]+$/,
      'Employee ID may only contain letters, numbers, hyphens, and underscores'
    ),
  department: z
    .string()
    .trim()
    .min(1, 'Please select a department'),
  designation: z
    .string()
    .trim()
    .min(2, 'Designation / Role must be at least 2 characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid corporate email address'),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone number must be at least 7 digits'),
  dateOfJoining: z
    .string()
    .min(1, 'Date of Joining is required'),
  status: z
    .enum(['Active', 'Inactive'])
    .default('Active'),
});
