// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Assignment 3 an appropriate route as part of the inventory route file,
router.get("/detail/:inventoryId", invController.buildByInventoryId);


module.exports = router;