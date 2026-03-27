const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

// Login route
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Register
router.get("/register", accountController.buildRegister)
router.post('/register', utilities.handleErrors(accountController.registerAccount))

// handle form submission
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  // TODO: validate + save user
  console.log("Registering:", username, email);

  res.redirect("/login"); // after successful registration
});
module.exports = router;