const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util

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



/* **************************************
* Assignment 3 
* file that will take the specific vehicle's information and wrap it up in HTML to deliver to the view
* ************************************ */

Util.buildDetailGrid = async function(data) {
  let grid
  grid = `<h1>Car make: ${data.inv_make}</h1>`
  return grid
}

Util.buildDetailGrid = async function(data) {
  let grid
  grid = `
  <div id="det-invdisplay"> 
    <div id="det-invimg">
      <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}">
    </div>
    <div id="det-invdetails">
      <h2 id="det-invsubtitle">${data.inv_year} ${data.inv_make} ${data.inv_model} Details</h2>
      <span id="det-invmiles">Mileage: ${data.inv_miles.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
      <span id="det-invcolor">Color: ${data.inv_color.charAt(0).toUpperCase()}${data.inv_color.slice(1).toLowerCase()}</span>
      <h3 id="det-invdescriptionhead">Description</h3> 
      <p id="det-invdescription"> ${data.inv_description}</p>

      <span id="det-invprice">No-Haggle Price: $${new Intl.NumberFormat('en-US').format(data.inv_price)}</span>
    </div>
  </div>
  `


  return grid
  }


  


/* Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next) */