// =============================================
// W06 Final Enhancement: Inquiry Controller
// controllers/inquiryController.js
// =============================================

const inquiryModel = require("../models/inquiry-model");
const invModel     = require("../models/inventory-model");
const utilities    = require("../utilities/");
const { validationResult } = require("express-validator");

/* **************************************
 * GET — Build the Inquiry Form view
 * Route: GET /inquiry/:inv_id
 * ************************************** */
async function buildInquiryForm(req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);

    // Validate that inv_id is a positive integer
    if (!inv_id || inv_id <= 0 || isNaN(inv_id)) {
      const error = new Error("Invalid vehicle ID.");
      error.status = 400;
      return next(error);
    }

    // Look up the vehicle so we can display it on the form
    const vehicle = await invModel.getInventoryById(inv_id);
    if (!vehicle) {
      const error = new Error("Vehicle not found.");
      error.status = 404;
      return next(error);
    }

    const nav = await utilities.getNav();

    res.render("inquiry/inquiry-form", {
      title: `Inquire About ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      errors: null,
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      message: "",
    });
  } catch (error) {
    console.error("buildInquiryForm error:", error);
    next(error);
  }
}

/* **************************************
 * POST — Process Inquiry Form Submission
 * Route: POST /inquiry
 * Runs after express-validator middleware
 * ************************************** */
async function submitInquiry(req, res, next) {
  try {
    const { inv_id, customer_name, customer_email, customer_phone, message } = req.body;

    // ---- Server-side validation (express-validator) ----
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const nav = await utilities.getNav();
      const vehicle = await invModel.getInventoryById(inv_id);

      return res.status(400).render("inquiry/inquiry-form", {
        title: `Inquire About ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
        nav,
        vehicle,
        errors: errors.array(),   // pass errors back to view
        customer_name,
        customer_email,
        customer_phone,
        message,
      });
    }

    // ---- Save to database ----
    const result = await inquiryModel.createInquiry(
      inv_id,
      customer_name,
      customer_email,
      customer_phone,
      message
    );

    if (result) {
      req.flash("notice", "Your inquiry has been submitted! We will contact you soon.");
      res.redirect(`/inv/detail/${inv_id}`);
    } else {
      req.flash("notice", "Sorry, the inquiry could not be submitted. Please try again.");
      res.redirect(`/inquiry/${inv_id}`);
    }
  } catch (error) {
    console.error("submitInquiry error:", error);
    next(error);
  }
}

/* **************************************
 * GET — Admin: View All Inquiries
 * Route: GET /inquiry/admin
 * ************************************** */
async function buildAdminInquiryList(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const inquiries = await inquiryModel.getAllInquiries();

    res.render("inquiry/inquiry-list", {
      title: "Customer Inquiries",
      nav,
      inquiries,
      errors: null,
    });
  } catch (error) {
    console.error("buildAdminInquiryList error:", error);
    next(error);
  }
}

module.exports = { buildInquiryForm, submitInquiry, buildAdminInquiryList };