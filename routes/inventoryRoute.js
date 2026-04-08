const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// ✅ PUBLIC routes — no auth needed
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:id", utilities.handleErrors(invController.buildByInventoryId));
router.get("/broken", utilities.handleErrors(invController.throwError));

// ✅ Apply middleware BEFORE protected routes
router.use(utilities.checkLogin);
router.use(utilities.checkAccountType);

// 🔒 PROTECTED routes — Employee/Admin only
router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post(
  "/add-classification",
  utilities.classificationRules(),
  utilities.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post(
  "/add-inventory",
  utilities.inventoryRules(),
  utilities.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));
router.post(
  "/update",
  utilities.inventoryRules(),
  utilities.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteConfirmView));
router.post("/delete", utilities.handleErrors(invController.deleteInventoryItem));

module.exports = router;