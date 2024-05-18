const invModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  ********************
* Assignment 4 :Task Two 
*  Validation for a New Classifcation name 
* ********************** */
validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .notEmpty().withMessage("A classification name is required.")
        .matches(/^[a-zA-Z0-9]+$/).withMessage("Classification name must not contain any special characters or spaces.")
        .custom(async (classification_name) => {
            const classificationExists = await invModel.checkExistingClassificationName(classification_name)
            if (classificationExists){
                throw new Error("Classification Name already exists. Please try a different name.")
            }
        }),
    ]
}

/*  ********************
* Assignment 4 :Task Two 
 * Check data and return errors or continue to registration
 * ********************* */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body.classification_name
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
        })
        return
    }
    next()
}

/*  ********************
* Assignment 4 :Task Three 
 * Check data and return errors or continue to management page
 * ********************* */

validate.inventoryRules = () => {
    return [
        // Make needs to be 3 characters
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please enter a valid make of car."), // on error this message is sent.

        // model needs to be 3 characters
        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please enter a valid model of car."), // on error this message is sent.

        // must be a description
        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
            .withMessage("A description is required."), // on error this message is sent.     

        // price is required and numeric 
        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isCurrency({ symbol: '$', require_symbol: false, allow_negatives: false, thousands_separator: ',', decimal_separator: '.', digits_after_decimal: [2] })
        .withMessage("Please enter a valid price."), // on error this message is sent.               

        // year is required, 4 characters
        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 4, max: 4 })
        .isNumeric({ no_symbols: true })
        .withMessage("Please enter a valid year."), // on error this message is sent.    
        
        // mileage is required and numeric
        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid mileage for the car."), // on error this message is sent.
        
        // Color is required and must be string
        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid color for the car."), // on error this message is sent.

    ]
}

validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationSelect = await utilities.buildClassificationSelect(classification_id)

        res.render("inventory/add-inventory", {
        errors,
        title: "New Inventory",
        nav,
        classificationSelect,
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color,
        })
        return
    }
    next()
}

module.exports = validate;