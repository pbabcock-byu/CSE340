/*  Account Router 
    week 4 : Deliver Login */

    const express = require("express")
    const router = new express.Router() 
    const accountController = require("../controllers/accountController")
    const utilities = require("../utilities/")
    const regValidate = require("../utilities/account-validation")


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

    // week 5 coded added 

    router.get("/",utilities.checkLogin, utilities.handleErrors(accountController.accountManagement))
    //router.get("/", utilities.handleErrors(accountController.accountManagement))


  // New validation ofr the post Process the registration data
  router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )


// week 5 New Login controller - code given
// Process the login request 
 router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin) 
)

// week 5 assignement step 4
// Update uses details
// create the view
router.get("/update-user/:accountId", utilities.handleErrors(accountController.buildEditByAccountId));

// post the changes back to the database
router.post("/update-user",
   // regValidate.editRules(),
    //regValidate.checkEditData,
    utilities.handleErrors(accountController.updateUserInfo)
);


router.get("/update-user", utilities.handleErrors(accountController.buildUpdateUser))




//Make sure the route(s) are exported for use elsewhere.
module.exports = router; 