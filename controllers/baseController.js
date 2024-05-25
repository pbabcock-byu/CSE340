/* Old code pre week 5 assignment 1
const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
  req.flash("notice", "This is a flash message.")
} 
module.exports = baseController */


const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  const accountData = res.locals.accountData.account_firstname
  const userName= accountData.account_firstname

  res.render("index", {title: "Home", nav, userName})
}

baseController.buildError = async function(req, res){
  const nav = await utilities.getNav()
  const accountData = res.locals.accountData.account_firstname
  const userName= accountData.account_firstname
  res.render("index", {title: "Home", nav, userName})
}

module.exports = baseController