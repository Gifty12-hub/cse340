const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", { title: "Login", nav })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", { title: "Register", nav, errors: null })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    return res.status(500).render("account/register", { title: "Registration", nav, errors: null })
  }
  const regResult = await accountModel.registerAccount(
    account_firstname, account_lastname, account_email, hashedPassword
  )
  if (regResult) {
    req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
    return res.status(201).render("account/login", { title: "Login", nav })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/register", { title: "Registration", nav, errors: null })
  }
}

/* ****************************************
*  Process Login
* *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", { title: "Login", nav, errors: null, account_email })
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      const cookieOptions = { httpOnly: true, maxAge: 3600 * 1000 }
      if (process.env.NODE_ENV !== 'development') cookieOptions.secure = true
      res.cookie("jwt", accessToken, cookieOptions)
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", { title: "Login", nav, errors: null, account_email })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Build Account Management View
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    user: res.locals.accountData,  // ← from JWT middleware
  })
}

/* ****************************************
*  Deliver Account Update View
* *************************************** */
async function buildUpdateView(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.id)
  const user = await accountModel.getAccountById(account_id)
  if (!user) {
    req.flash("notice", "Account not found.")
    return res.redirect("/account/")
  }
  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    user,
  })
}

/* ****************************************
*  Process Account Info Update
* *************************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const updateResult = await accountModel.updateAccount(
    account_id, account_firstname, account_lastname, account_email
  )
  if (updateResult) {
    // Refresh JWT with updated data
    const updatedUser = await accountModel.getAccountById(account_id)
    const accessToken = jwt.sign(updatedUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    const cookieOptions = { httpOnly: true, maxAge: 3600 * 1000 }
    if (process.env.NODE_ENV !== 'development') cookieOptions.secure = true
    res.cookie("jwt", accessToken, cookieOptions)
    res.locals.accountData = updatedUser
    req.flash("notice", "Account successfully updated.")
    return res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      user: updatedUser,
    })
  } else {
    req.flash("notice", "Account update failed. Please try again.")
    const user = await accountModel.getAccountById(account_id)
    return res.render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
      user,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

/* ****************************************
*  Process Password Update
* *************************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, new_password } = req.body
  const hashedPassword = bcrypt.hashSync(new_password, 10)
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword)
  const user = await accountModel.getAccountById(account_id)
  if (updateResult) {
    req.flash("notice", "Password successfully updated.")
    return res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      user,
    })
  } else {
    req.flash("notice", "Password update failed. Please try again.")
    return res.render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
      user,
    })
  }
}

/* ****************************************
*  Logout
* *************************************** */
async function logout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildUpdateView,
  updateAccount,
  updatePassword,
  logout,
}