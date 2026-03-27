// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
// Needed Resources
const utilities = require("../utilities");

// Route to build account
router.get("/login", utilities.handleErrors(accountController.buildLogin));

module.exports = router;