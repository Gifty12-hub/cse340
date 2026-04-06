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
  const message = req.flash("notice")
  const classificationSelect = await utilities.buildClassificationList() // this a space
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    message,
    classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)

  let nav = await utilities.getNav()

  const itemData = await invModel.getInventoryById(inv_id)

  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  )

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,

    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

module.exports = invCont
  
