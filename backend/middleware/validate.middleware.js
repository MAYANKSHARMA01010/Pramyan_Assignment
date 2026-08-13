const { ZodError } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError || error.name === 'ZodError') {
      const issues = error.issues || error.errors || [];
      const errorMessages = issues.map((err) => ({
        field: err.path ? err.path.join('.') : '',
        message: err.message,
      }));
      return res.status(400).json({
        message: issues[0]?.message || 'Validation failed',
        errors: errorMessages,
      });
    }
    return res.status(400).json({ message: 'Invalid request data' });
  }
};

module.exports = validate;
