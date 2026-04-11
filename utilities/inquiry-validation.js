// =============================================
// W06 Final Enhancement: Inquiry Validation Rules
// utilities/inquiry-validation.js
// =============================================

const { body } = require("express-validator");
const validate  = {};

/* **************************************
 * Rules for the Inquiry Submission Form
 * Both server-side checks that mirror
 * the client-side HTML5 validation
 * ************************************** */
validate.inquiryRules = () => {
  return [
    // inv_id must be a positive integer
    body("inv_id")
      .isInt({ min: 1 })
      .withMessage("A valid vehicle must be selected."),

    // customer_name: required, 2–100 chars, letters/spaces/hyphens only
    body("customer_name")
      .trim()
      .notEmpty()
      .withMessage("Please provide your full name.")
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters.")
      .matches(/^[A-Za-z\s\-']+$/)
      .withMessage("Name may only contain letters, spaces, hyphens, and apostrophes."),

    // customer_email: required, valid email format
    body("customer_email")
      .trim()
      .notEmpty()
      .withMessage("Please provide your email address.")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),

    // customer_phone: optional, but if given must be valid format
    body("customer_phone")
      .optional({ checkFalsy: true })
      .trim()
      .matches(/^[\d\s\-\+\(\)]{7,20}$/)
      .withMessage("Please enter a valid phone number (7–20 digits)."),

    // message: required, 10–1000 chars
    body("message")
      .trim()
      .notEmpty()
      .withMessage("Please enter a message.")
      .isLength({ min: 10, max: 1000 })
      .withMessage("Message must be between 10 and 1,000 characters."),
  ];
};

/* **************************************
 * Middleware: check validation results
 * and return errors to view if invalid
 * ************************************** */
validate.checkInquiryData = async (req, res, next) => {
  // Errors are handled inside the controller (submitInquiry)
  // so we just pass through here
  next();
};

module.exports = validate;