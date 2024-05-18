const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
*  Assignment 
*  Build inventory by classification view
* ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
*  Assignment 3 a controller function, which is part of the inventory controller,
*  Build inventory by detail view
* ************************** */

invCont.buildByInventoryId = async function(req, res, next) {
    const inventoryId = req.params.inventoryId
    const data = await invModel.getInventoryByInventoryId(inventoryId)
    const grid = await utilities.buildDetailGrid(data)
    let nav = await utilities.getNav()
    const vehmake = data.inv_make 
    const vehmodel = data.inv_model 

    res.render("./inventory/detail", {
        title: vehmake + " " + vehmodel ,
        nav,
        grid,
    })
}


/* ***************************
*   Assignment 4 :Task One 
*   Create a new management view
* ************************** */

invCont.buildInventoryManager = async function(req, res, next){
  let nav = await utilities.getNav()
  res.render("inventory/management",{
      title: "Vehicle Management",
      nav,
  })
}


/* ***************************
*  Assignment 4 :Task Two 
*  Add Classification View
* ************************** */

invCont.buildAddClassification = async function(req, res, next){
  let nav = await utilities.getNav()
  res.render("inventory/add-classification",{
      title: "Add A New Classification",
      nav,
      errors: null,
  })
}

/* ***************************
*  Assignment 4 :Task Two 
*  Check adding of classification , reload with new Classification in nav bar
* ************************** */

invCont.addClassification = async function(req, res){
  
  const { classification_name } = req.body
  const invClassificationResult = await invModel.addClassification(classification_name)
    
  let nav = await utilities.getNav()  

  if (invClassificationResult) {
    req.flash("notice",`Congratulations, you have added the classification: ${classification_name}.`)

    res.status(201).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, Your classification could not be added.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}


/* ***************************
*  Assignment 4 :Task Three 
*  Add Inventory View
* ************************** */

invCont.buildAddInventory = async function(req, res, next){
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.buildClassificationSelect()
  
    res.render("inventory/add-inventory",{
      title: "Add New Inventory",
      nav,
      classificationSelect,
      errors: null,
  })
}


  /* ***************************
  *  Assignment 4 :Task Three 
  *  Add new car details to the DB, check if successful , reload with new add invent
  * ************************** */

invCont.addInventory = async function(req, res){
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  const invResult = await invModel.addInventory(
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color,
    classification_id
  )

  let nav = await utilities.getNav()

  /*let classificationSelect = await utilities.buildClassificationSelect()*/
  if (invResult) {
    req.flash("notice",`Congratulations, You have added a new car to the inventory.`)

    
    let classificationSelect = await utilities.buildClassificationSelect()

    res.status(201).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      errors: null,
    })
  } else {
    let classificationSelect = await utilities.buildClassificationSelect(classification_id)
    req.flash("notice", "Sorry, Your inventory could not be added.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      errors: null,
    })
  }
}

module.exports = invCont