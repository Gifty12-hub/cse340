// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
// Needed Resources
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Vehicle Detail Route
router.get("/detail/:id", utilities.handleErrors(invController.buildDetail));

// Broken route
router.get("/broken", utilities.handleErrors(invController.throwError));

module.exports = router;