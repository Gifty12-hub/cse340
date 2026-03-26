const invModel = require("../models/inventory-model")
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
  let grid
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
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
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

module.exports = Util



