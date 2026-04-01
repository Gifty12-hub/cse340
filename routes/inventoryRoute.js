// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const { validateClassification } = require("../middleware/inventory-validation")

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

// Display Add Classification form
router.get("/add-classification", invController.buildAddClassification)

// Process Add Classification form
router.post(
  "/add-classification",
  validateClassification,
  invController.addClassification
);

module.exports = router;