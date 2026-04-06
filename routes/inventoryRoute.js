// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

/// Vehicle Detail Route
router.get("/detail/:id", utilities.handleErrors(invController.buildByInventoryId));

// Broken route
router.get("/broken", utilities.handleErrors(invController.throwError));

// Route to management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Display Add Classification form
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Process Add Classification form
router.post(
  "/add-classification",
  utilities.classificationRules(),
  utilities.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Display Add Inventory form
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Process Add Inventory form
router.post(
  "/add-inventory",
  utilities.inventoryRules(),
  utilities.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

//new route to get inventory by classification id in JSON format
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
)

// Process Update Inventory
router.post(
  "/update",
  utilities.inventoryRules(),
  utilities.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router;