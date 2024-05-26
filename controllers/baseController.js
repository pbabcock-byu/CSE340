/* Old code pre week 5 assignment 1
const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
  req.flash("notice", "This is a flash message.")
} 
module.exports = baseController  */




const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
    
  const loginData = res.locals.accountData
  let dynamicHeader = await utilities.getDynamicHeader(loginData)
  
  res.render("index", {title: "Home", nav, dynamicHeader})
}


module.exports = baseController