const { validationResult, body } = require("express-validator");

// --- Middleware to handle validation results ---
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// --- Validator rules for registration ---
const registerValidator = [
  body("email")
    .isEmail()
    .withMessage("A valid email address is required."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

// ✅ Export both correctly
module.exports = { registerValidator, validateRequest };
