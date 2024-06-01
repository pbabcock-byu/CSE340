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
// added utilities.invAccess to restrict access to the inv updates
// Protect Inv Route so only Admin || Employee have access, else redirect to login 
router.get("/", utilities.invAccess, utilities.handleErrors(invController.buildInventoryManager));


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
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// added week 5
//Update Inventory Information (Step 1)
router.get("/edit/:inventoryId", utilities.handleErrors(invController.buildEditInventory))

// added week 5
// (Step 2)
router.post("/update/",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

// added week 5: Delete for get Route
//  Add a "get" route to match the path that already exists in the inventory management view for the "Delete" link.
router.get('/delete/:inventoryId', utilities.handleErrors(invController.loadDeleteInventory))
router.post('/delete/',utilities.handleErrors(invController.deleteInventory)
)

// My projects
router.get("/sort-vehlist/",invController.buildByPrice)
//router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;

