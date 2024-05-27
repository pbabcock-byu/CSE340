const bcrypt = require("bcryptjs")
const utilities = require('../utilities/')
const accountModel = require("../models/account-model")

// Week 5 : 2 lines of code given
// required for the "jsonwebtoken" and "dotenv" packages
const jwt = require("jsonwebtoken")
require("dotenv").config()


//const accountController = {} 

/* this is for the login page*/
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();

    //const grid = await utilities.buildLogin();
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* this is for the registration page*/
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    //const grid = await utilities.buildRegister();
    
    res.render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations ${account_firstname}, you are registered . Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}


/* ****************************************
 *  Week 5 Code Given Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
  })
  return
}
try {
  if (await bcrypt.compare(account_password, accountData.account_password)) {
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
    if(process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
    return res.redirect("/account/")
  }
} catch (error) {
  return new Error('Access Forbidden')
}
}

 /* ****************************************
 *  Week 5 created
 * Build the function in the accountController to process the request and deliver the account Managementview.
 * ************************************ */
 async function accountManagement(req, res, next){
  let nav = await utilities.getNav()
  res.render("account/management",{
      title: "Account Management",
      nav,
      errors: null,
  })
}
 

 /* ****************************************
 *  Week 5 Assignement created step 4
 *  You will create a new view where clients can update their account data - first name, last name, email address and password:
 * ************************************ */

 async function buildUpdateUser (req, res) {
  let nav = await utilities.getNav();
  res.render("account/update-user", {
      title: "Update Account",
      nav,
      errors: null,
  });
  }


 /* ****************************************
 *  Week 5 Assignement created step 5
 *  Users can update their account data - first name, last name, email address:
 * ************************************ */

 async function updateUserInfo (req, res) {
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    const updateResult = await accountModel.updateUserInfo(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )
  
    const UserNewdetails = await accountModel.getUserInfobyId(account_id)
    res.locals.accountData.account_firstname = UserNewdetails.account_firstname
    res.locals.accountData.account_lastname = UserNewdetails.account_lastname
    res.locals.accountData.account_email = UserNewdetails.account_email

    if (updateResult) {
      req.flash("notice", "Your Information has been updated.")
      return res.redirect("/account")
  
    } else {
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("account/update-user", {
        title: "Edit User Information",
        nav,
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
      })
    }
  }

 /* ****************************************
 *  Week 5 Assignement created step 5
 *  Users can update their Password
 * ************************************ */
 async function updateUserPassword(req, res) {
  const { account_id, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error updating your password.')
    res.status(500).render("account/edit-account", {
      title: "Edit User Information",
      nav,
      errors: null,
      account_id
    })
  }



  const updateResult = await accountModel.updateUserPassword(
    account_id,
    hashedPassword
  )
  if (updateResult) {
    req.flash("notice","Your password was successfully changed.")
    return res.redirect("/account")

  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update-user", {
      title: "Edit User Information",
      nav,
      errors: null,
      account_id,
    })
  }
}


 /* ****************************************
 *  Week 5 Assignement step 6
 *  logout process 
 * ************************************ */


async function accountLogOut(req, res) {
  res.clearCookie('jwt'); 
  req.flash("notice", "You are logged out")
  res.redirect('/'); 
};

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  accountManagement,
  buildUpdateUser,
  updateUserInfo,
  updateUserPassword,
  accountLogOut,
}