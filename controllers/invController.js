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

/* ***************************
 *  Build Delete Confirmation View
 * ************************** */
invCont.buildDeleteConfirmView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventoryItem(inv_id);

  if (deleteResult.rowCount) {
    req.flash("notice", "The vehicle was successfully deleted.");
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.redirect(`/inv/delete/${inv_id}`);
  }
};

/* ****************************************
*  Deliver Account Update View
* *************************************** */
async function buildUpdateView(req, res, next) {
  let nav = await utilities.getNav();
  
  // Get logged-in user (adjust if your middleware uses different name)
  const accountData = res.locals.accountData || req.user;
  
  if (!accountData) {
    req.flash("notice", "You must be logged in.");
    return res.redirect("/account/login");
  }

  res.render("account/update", {
    title: "Update Account Information",
    nav,
    user: accountData,           // original user data
    errors: null,
    account_firstname: null,     // for sticky on error
    account_lastname: null,
    account_email: null
  });
}

/* ****************************************
*  Process Account Information Update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  try {
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      // Refresh user data after update
      const updatedAccount = await accountModel.getAccountById(account_id);
      
      // Update session/JWT data if needed (optional but recommended)
      // delete updatedAccount.account_password; // already handled in model

      req.flash("notice", "Account information updated successfully.");
      
      // Re-render management view with updated data
      res.render("account/management", {
        title: "Account Management",
        nav,
        user: updatedAccount,
        errors: null
      });
    } else {
      req.flash("notice", "Sorry, the update failed.");
      res.redirect("/account/update/" + account_id);
    }
  } catch (error) {
    // On error, re-render update view with sticky values + errors
    req.flash("notice", "Sorry, there was an error updating your account.");
    res.render("account/update", {
      title: "Update Account Information",
      nav,
      user: res.locals.accountData,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
      errors: error   // or pass validation errors
    });
  }
}

/* ****************************************
*  Process Password Change
* *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_id, new_password } = req.body;

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (updateResult) {
      req.flash("notice", "Password changed successfully.");
      
      // Refresh account data
      const updatedAccount = await accountModel.getAccountById(account_id);
      
      res.render("account/management", {
        title: "Account Management",
        nav,
        user: updatedAccount,
        errors: null
      });
    } else {
      req.flash("notice", "Sorry, the password update failed.");
      res.redirect("/account/update/" + account_id);
    }
  } catch (error) {
    req.flash("notice", "Sorry, there was an error changing your password.");
    res.render("account/update", {
      title: "Update Account Information",
      nav,
      user: res.locals.accountData,
      errors: error
    });
  }
}

module.exports = invCont
  
