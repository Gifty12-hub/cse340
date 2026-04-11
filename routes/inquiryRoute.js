
const express          = require("express");
const router           = express.Router();
const inquiryController = require("../controllers/inquiryController");
const validate         = require("../utilities/inquiry-validation");
const utilities        = require("../utilities");


// ---- Admin route MUST come before /:inv_id ----


// Express matches routes top-to-bottom; if /:inv_id


// comes first, "admin" is treated as the inv_id param.



// GET  /inquiry/admin/list  — View all inquiries (admin)


router.get(


  "/admin/list",


  utilities.handleErrors(inquiryController.buildAdminInquiryList)


);


// GET  /inquiry/:inv_id  — Display inquiry form for a vehicle
router.get(
  "/:inv_id",
  utilities.handleErrors(inquiryController.buildInquiryForm)
);

// POST /inquiry  — Process the submitted inquiry form
router.post(
  "/",
  validate.inquiryRules(),
  validate.checkInquiryData,
  utilities.handleErrors(inquiryController.submitInquiry)
);

module.exports = router;