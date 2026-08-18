const { z } = require('zod');

const markAttendanceSchema = z.object({
  employeeId: z.string().min(1, 'employeeId is required'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD')
    .refine(
      (dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        const day = d.getDay();
        return day !== 0 && day !== 6;
      },
      {
        message: 'Attendance cannot be marked on weekends (Saturday / Sunday).',
      }
    ),
  status: z.enum(['Present', 'Absent', 'On Leave'], {
    errorMap: () => ({ message: 'Status must be Present, Absent, or On Leave' }),
  }),
});

module.exports = {
  markAttendanceSchema,
};
