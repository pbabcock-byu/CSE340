// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const invValidate= require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Assignment 3 an appropriate route as part of the inventory route file,
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// Assignment 4: task 1 Manually entered route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildInventoryManager));


// Assignment 4: task 2 Route to build the add classification view
router.get("/add-classification",utilities.handleErrors(invController.buildAddClassification));
router.post(
    "/add-classification",
     invValidate.classificationRules(),
     invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Assignment 4: task 3 Route to build add-inventory view
router.get("/add-inventory",utilities.handleErrors(invController.buildAddInventory));
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
    )


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by inventory detail view
router.get("/detail/:inventoryId",utilities.handleErrors(invController.buildByInventoryId));

// added week 5 
// Get inventory for AJAX Route - Select inv item activity 
router.get(
    "/getInventory/:classification_id", 
    utilities.handleErrors(invController.getInventoryJSON)
)

module.exports = router;