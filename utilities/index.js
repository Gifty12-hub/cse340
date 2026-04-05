const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = ''
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Build the vehicle detail HTML view
 * Formats detailed vehicle information with proper currency and mileage formatting
 **************************************** */
Util.buildItemDetail = function(data) {
  if (!data) {
    return "<p class=\"notice\">No vehicle data available.</p>";
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(data.inv_price);

  const formattedMileage = new Intl.NumberFormat('en-US').format(data.inv_miles);

  return `
    <div class="vehicle-detail-container">
      <div class="vehicle-detail-content">
        <div class="vehicle-detail-image">
          <img src="${data.inv_image}" alt="Full-size image of ${data.inv_year} ${data.inv_make} ${data.inv_model}" />
        </div>
        <div class="vehicle-detail-info">
          <div class="vehicle-detail-highlights">
            <p class="vehicle-year"><strong>Year:</strong> ${data.inv_year}</p>
            <p class="vehicle-price"><strong>Price:</strong> ${formattedPrice}</p>
            <p class="vehicle-mileage"><strong>Mileage:</strong> ${formattedMileage} miles</p>
            <p class="vehicle-color"><strong>Color:</strong> ${data.inv_color}</p>
          </div>
          <div class="vehicle-detail-description">
            <h3>About This Vehicle</h3>
            <p>${data.inv_description}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
 * add inventory
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

/* ****************************************
 * Classification Validation Rules
 * *************************************** */
Util.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isLength({ min: 2 })
      .withMessage("Classification name must be at least 2 characters.")
      .matches(/^[a-zA-Z0-9\s]+$/)
      .withMessage("Classification name can only contain letters, numbers, and spaces."),
  ]
}

/* ****************************************
 * Check Classification Data
 * *************************************** */
Util.checkClassificationData = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.locals.errors = errors.array()
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav: res.locals.nav,
      errors: errors.array(),
    })
  }
  next()
}

/* ****************************************
 * Inventory Validation Rules
 * *************************************** */
Util.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Classification is required."),
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Make is required.")
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters."),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Model is required.")
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters."),
    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Year is required.")
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Year must be between 1900 and 2099."),
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required.")
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters."),
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),
    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Price is required.")
      .isFloat({ min: 0 })
      .withMessage("Price must be a valid number."),
    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Miles is required.")
      .isInt({ min: 0 })
      .withMessage("Miles must be a valid number."),
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color is required.")
      .isLength({ min: 3 })
      .withMessage("Color must be at least 3 characters."),
  ]
}

/* ****************************************
 * Check Inventory Data
 * *************************************** */
Util.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let classificationList = await Util.buildClassificationList(req.body.classification_id)
    res.locals.errors = errors.array()
    return res.render("inventory/add inventory", {
      title: "Add Inventory",
      nav: res.locals.nav,
      errors: errors.array(),
      classificationList: classificationList,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
    })
  }
  next()
}
/*******************
 * Middleware Check token validity
 */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

module.exports = Util



