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
  // added for the sort page
  list += '<li><a href="inv/sort-vehlist" title="Sort page">Vehicles by Price</a></li>'
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
* ************************************ 

Util.buildDetailGrid = async function(data) {
  let grid
  grid = `<h1>Car make: ${data.inv_make}</h1>`
  return grid
}*/

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


 /* ****************************************
* Week 5 assignment task 2 - 
* Check for Admin || Employee account_type before
* allowing access to /inv. If Client, redirect to /account/login 
* ************************************ */



Util.invAccess = (req, res, next) => {

  const account_type = res.locals.accountData.account_type
  if (account_type === 'Employee' || account_type === 'Admin') {

  //const account_type = res.locals.account_type

  //if (account_type === 'Admin' || account_type === 'Employee') { 
    next()
  } else {
    req.flash("notice", "Access denied");
    return res.redirect("/account/login");
  }
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
 * Week 6 building list

 **************************************** */
Util.sortList = async function (classification_id = null) {

  //let data = await invModel.getClassifications()
  let sortList
 
  //sortList = `<select id="classification_id" name="classification_id" required>`
   /* data.rows.forEach(element => {
      classificationList += `<option value="` + element.classification_id + `"`
      if (classification_id != null && element.classification_id == classification_id){
        classificationList += ` selected`
      }
      classificationList += `>` + element.classification_name + `</option>`
    });
  classificationList += `</select>` */

  sortList=`<select id="sortList_id" name="sortList_id" required>
    <option>Select a sort option</option>
      <option value="classification_name">classification</option>
      <option value="inv_make">Make</option>
      <option value="inv_model">Model</option>
      <option value="inv_year">Year</option>
      <option value="inv_miles">Miles</option>
      <option value="inv_price">Price</option>
    </select>`
  
  return sortList

}




/* **************************************
* Build the classification view HTML
* ************************************ */

Util.buildSortGrid = async function (data) {
  let grid = "<thead>";
  let carprice = 0;
  let carmiles = 0;
  if (data.length > 0) {
    grid +=
      "<tr><td>Make</td><td>Model</td><td>Color</td><td>Year</td><td>Miles</td><td>Price</td></tr>";
    grid += "</thead>";
    grid += "<tbody>";
    // Iterate over all vehicles in inventory and put each in a row
    data.forEach(function (element) {
      //console.log(element.inv_id + ", " + element.inv_model);
      grid += `<tr><td>${element.inv_make} </td>`;
      grid += `<td>${element.inv_model}</td>`;
      grid += `<td>${element.inv_color}</td>`;
      grid += `<td>${element.inv_year}</td>`;
      carmiles = (new Intl.NumberFormat('en-US').format(element.inv_miles))
      grid += `<td>${carmiles}</td>`;
      carprice = "$" + (new Intl.NumberFormat('en-US').format(element.inv_price))
      //grid += `<td>${new Intl.NumberFormat('en-US').format{element.inv_price}</td>`;
      grid += `<td>${carprice}</td>`;
      //$${new Intl.NumberFormat('en-US').format(data.inv_price)}</span>
      grid += `</tr>`;
    });
    grid += "</tbody>";
    return grid;
  }
};



module.exports = Util



