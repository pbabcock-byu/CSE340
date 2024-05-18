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
 * Check data and return errors or continue to registration
 * ********************* */





module.exports = validate;