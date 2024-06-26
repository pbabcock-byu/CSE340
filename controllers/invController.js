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
  // Added the below line week 5 Select Inventory Items
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management",{
      title: "Vehicle Management",
      nav,
      //errors: null,
      classificationSelect,
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
  let classificationSelect = await utilities.buildClassificationList()
  
    res.render("inventory/add-inventory",{
      title: "Add New Inventory",
      nav,
      errors: null,
      classificationSelect,
  })
}


  /* ***************************
  *  Assignment 4 :Task Three 
  *  Add new car details to the DB, check if successful , reload with new add invent
  * ************************** */

  invCont.addInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body
    const inventoryResult = await invModel.addInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
  
    if (inventoryResult) {
      let classificationSelect = await utilities.buildClassificationList();
        req.flash(
          "success",
          `You added the vehicle: ${inv_make} ${inv_model} to the inventory`
        )
        res.status(201).render("./inventory/add-inventory", {
          title: "Add to Inventory",
          nav,
          classificationSelect,
          errors: null,
        })
      } else {
        let classificationSelect = await utilities.buildClassificationList();
        req.flash("notice", "Sorry, the process failed.")
        res.status(501).render("./inventory/add-inventory", {
          title: "Add to Inventory",
          nav,
          classificationSelect,
          errors: null,
        })
      }
  }

/* ***************************
*  Week 5 :Code GIven 
*  Build the Controller Function
* ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
  *  Assignment 5 :Update Inventory Information (Step 1)
  *  load the invent details read for editing
  * Code provided except Name
  * ************************** */

invCont.buildEditInventory = async function (req, res, next) {
    const inventoryId = parseInt(req.params.inventoryId)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryByInventoryId(inventoryId)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  }

/* ***************************
  *  Assignment 5 : Data Provided
  * Update Vehicle Data Information in the DB (Step 2)
  * ************************** */

invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
    })
  }
}



/* ***************************
  *  Assignment 5 : Delete  Vehicle Data
  * Build the view for the Vehicle that is to be deleted (Step 1)
  * ************************** */

invCont.loadDeleteInventory = async function (req, res, next) {
 
  const inventoryId = parseInt(req.params.inventoryId);
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInventoryId(inventoryId)
  res.render('inventory/delete-confirm', {
    title: `Preparing to Delete: ${itemData.inv_make} ${itemData.inv_model}`,
    nav,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    errors: null,
  })
}


  
/* ***************************
  *  Assignment 5 : Delete  Vehicle Data
  * DELETE THE Vehicle DATA (Step 2)
  * ************************** */
invCont.deleteInventory = async function(req, res){
  
  let nav = await utilities.getNav()
  const {inv_id, inv_make, inv_model, inv_year } = req.body
  const deleteResult = await invModel.deleteInventory(
    inv_id,
    inv_make, 
    inv_model, 
    inv_year
  )

  if (deleteResult) {
    req.flash("notice",`${inv_make} ${inv_model} was successfully deleted from the system.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, your delete failed.")
    res.status(501).render("inventory/delete-inventory", {
      title: `Preparing to Delete: ${itemData.inv_make} ${itemData.inv_model}`,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year
    })
  }
}

/* this is for the Sort Invent page
invCont.getSortVehList = async function ( req, res, next ) {
  console.log("Made it to InvController")
  //const inventoryDisplayList = parseInt(req.params.inventoryId);
  let nav = await utilities.getNav()
  const sortList = await utilities.sortList()
  const itemData = await invModel.getSortVehList()
  console.log("Made it pass SQL")
  res.render('./inventory/sort-vehlist',{
    title: "List of our Inventory",
    nav,
    inv_id: itemData.inv_id,
    classification_name: itemData.classification_name,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_color: itemData.inv_color,    
    inv_year: itemData.inv_year,
    inv_miles: itemData.inv_miles,
    inv_price: itemData.inv_price,
    sortList,
    itemData,
    errors: null,
  })
}*/


/* ***************************
*  Test for week 6
*  Build inventory order by price
* ************************** */
//invCont.buildByClassificationId = async function (req, res, next) {
invCont.buildByPrice = async function (req, res, next) {  
  console.log("Got to buildByPrice")
  const data = await invModel.getSortVehList() 
  const grid = await utilities.buildSortGrid(data)
  let nav = await utilities.getNav()

  res.render("./inventory/sort-vehlist", {
    title: "Vehicles sorted by price",
    nav,
    grid,
  })
}



module.exports = invCont