const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const pool = require("../database/")
const regValidate = require('../utilities/account-validation');
const validate = require("../utilities/account-validation");

// Login route
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Register
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Account management route
router.get("/", utilities.handleErrors(accountController.buildAccountManagement));

// registration process
router.post("/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount));

// login process
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

//build management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

module.exports = router;