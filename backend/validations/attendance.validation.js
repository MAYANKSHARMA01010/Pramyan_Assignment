const { z } = require('zod');

const markAttendanceSchema = z.object({
  employeeId: z.string().min(1, 'employeeId is required'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  status: z.enum(['Present', 'Absent', 'On Leave'], {
    errorMap: () => ({ message: 'Status must be Present, Absent, or On Leave' }),
  }),
});

module.exports = {
  markAttendanceSchema,
};
