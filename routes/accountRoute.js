const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const validate = require('../utilities/account-validation')

// Public
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post("/register", validate.registationRules(), validate.checkRegData, utilities.handleErrors(accountController.registerAccount))
router.post("/login", validate.loginRules(), validate.checkLoginData, utilities.handleErrors(accountController.accountLogin))

// Logout
router.get("/logout", utilities.handleErrors(accountController.logout))

// Protected
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))
router.get("/update/:id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateView))
router.post("/update", utilities.checkLogin, validate.updateAccountRules(), validate.checkUpdateData, utilities.handleErrors(accountController.updateAccount))
router.post("/update/password", utilities.checkLogin, validate.updatePasswordRules(), validate.checkUpdatePasswordData, utilities.handleErrors(accountController.updatePassword))

module.exports = router