/*  Account Router 
    week 4 : Deliver Login */

    const express = require("express")
    const router = new express.Router() 
    const accountController = require("../controllers/accountController")
    const utilities = require("../utilities/")
    const regValidate = require('../utilities/account-validation')


    //an accounts controller
    
       
    /* ****************************************
    *  Deliver login view
    * *************************************** 
    async function buildLogin(req, res, next) {
        let nav = await utilities.getNav()
        res.render(".account/login", {
          title: "Login",
          nav,
        })
      }
    module.exports = { buildLogin }
    */
    
    // week 4 Add a "GET" route for the path that will be sent when the "My Account" link is clicked.
    //The "GET" route must use a function from the account controller, to handle the request.
    router.get("/login", utilities.handleErrors(accountController.buildLogin))
    // week 4 Registration view
    router.get("/register", utilities.handleErrors(accountController.buildRegister))
  // week 4 post Registration data to the database
  //  router.post("/register", utilities.handleErrors(accountController.registerAccount))

  // New validation ofr the post Process the registration data
  router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )


// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

    //Make sure the route(s) are exported for use elsewhere.
    module.exports = router; 