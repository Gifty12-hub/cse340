const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const staticRoute = require("./routes/static")  // ← rename to avoid conflict with reserved word
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities")
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require("./routes/accountRoute")
const inquiryRoute = require("./routes/inquiryRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

// Session
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Flash messages
app.use(require('connect-flash')())
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Cookie parser + JWT check — ONCE only
app.use(cookieParser())
app.use(utilities.checkJWTToken)

// View engine
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

// Static files
app.use(express.static("public"))

// Routes
app.use(staticRoute)
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
app.use("/inquiry", inquiryRoute)

// 404 handler
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

// Error handler
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  const message = err.status == 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?'
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

const port = process.env.PORT
const host = process.env.HOST
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})