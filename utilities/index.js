const invModel = require("../models/inventory-model")
const Util = {}

// Week 5 : 2 lines of code given
// required for the "jsonwebtoken" and "dotenv" packages
const jwt = require("jsonwebtoken")
require("dotenv").config()

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

/* **************************************
* Assignment 4 tasks 3 
* This builds the list for  buildClassificationList for the add-invertory view
* ************************************ */

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList

  classificationList = `<select id="classification_id" name="classification_id" required>`
    data.rows.forEach(element => {
      classificationList += `<option value="` + element.classification_id + `"`
      if (classification_id != null && element.classification_id == classification_id){
        classificationList += ` selected`
      }
      classificationList += `>` + element.classification_name + `</option>`
    });
  classificationList += `</select>`

  return classificationList
}
  
  
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */

Util.handleErrors = function(fn) {
  return function(req, res, next) {
      fn(req, res, next).catch(next);
  }
}


/* ****************************************
* Middleware to check token validity - code given
**************************************** */
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

/* ****************************************
* Week 5 point 3 - code given
*Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }




module.exports = Util



