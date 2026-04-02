const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by ID (detail view)
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.id

  const data = await invModel.getInventoryById(inv_id)
  const itemHtml = await utilities.buildItemDetail(data)
  const nav = await utilities.getNav()

  res.render("inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    itemHtml,
  })
}

/* ***************************
*  Throw intentional error to test that error handling is working properly.
* ************************** */
invCont.throwError = async function (req, res) {
  throw new Error("I am an intentional error");
};

/* ****************************************
 * Deliver Inventory Management View
 * *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

/* ****************************************
 * Deliver Add Classification View
 * *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
  })
}

/* ****************************************
 * Process Add Classification
 * *************************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "New classification added successfully.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Failed to add classification.")
    res.redirect("/inv/add-classification")
  }
}

/* ****************************************
 * Deliver Add Inventory View
 * *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
  })
}

/* ****************************************
 * Process Add Inventory
 * *************************************** */
invCont.addInventory = async function (req, res, next) {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  const result = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

  if (result) {
    req.flash("notice", "New vehicle added successfully.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Failed to add vehicle.")
    res.redirect("/inv/add-inventory")
  }
}

module.exports = invCont
  
