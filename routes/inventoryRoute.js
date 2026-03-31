// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Needed Resources
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

/// Vehicle Detail Route
router.get("/detail/:id", utilities.handleErrors(invController.buildByInventoryId));

// Broken route
router.get("/broken", utilities.handleErrors(invController.throwError));

// Route to management view
router.get("/", invController.buildManagement);

// Routes for Task 2 and Task 3 will need to exist too:
// router.get("/add-classification", invController.buildAddClassification);
// router.get("/add-inventory", invController.buildAddInventory);

module.exports = router;