const utilities = require('../utilities/')
const accountModel = require("../models/account-model")

const accountController = {}


/* this is for the login page*/
accountController.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav();
    const grid = await utilities.buildLogin();
    res.render("./account/login", {
        title: "Login",
        nav,
        grid,
    });
}

/* this is for the registration page*/
accountController.buildRegister = async function (req, res, next) {
    let nav = await utilities.getNav()
    const grid = await utilities.buildRegister();
    
    res.render("./account/register", {
      title: "Registration",
      nav,
      grid,
    })
  }


  
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}



module.exports = accountController