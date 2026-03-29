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
async function buildManagement(req, res, next) {
    let message = req.flash("notice"); // Assuming you're using connect-flash
    res.render("inventory/management", {
        title: "Inventory Management",
        message,
    });
}

module.exports = { invCont, buildManagement };
  
