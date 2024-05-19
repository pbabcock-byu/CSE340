const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}


/* ***************************
 *  Assignment 3 
 *  a function to retrieve the data for a specific vehicle in inventory, based on the inventory id
 * 
 *  also used in Assignment 4 : Task 2
 *  Check if checkExistingClassificationName
 * ************************** */

async function getInventoryByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`, [inventory_id] 
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryByInventoryId error: " + error)
  }
}


/* ***************************
 *  Assignment 4 : Task 2
 *  a function to add the new Classification
 * ************************** */

async function addClassification(classification_name){
  try {
    const sql = 'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *'
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Assignment 4 : Task 2
 *  Check if checkExistingClassificationName
 * 
 * also used function in assignment 3 getInventoryByInventoryId
 * ************************** */

async function checkExistingClassificationName(classification_name){
  try{
    const data = "SELECT * FROM classification WHERE classification_name = $1"
    const classification = await pool.query(data, [classification_name])
    return classification.rowCount
  } catch (error){
    return error.message
  }
}

/* ***************************
 *  Assignment 4 : Task 3
 *  a function to add a new car + details to a Classification
 * **************************
 
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try{
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    console.error("addInventory error " + error)
  }
} */

async function addInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
  try {
    const sql = "INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)"
    return await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color])
  } catch (error) {
    return error.message
  }
}

module.exports = {
  getClassifications, 
  getInventoryByClassificationId,
  getInventoryByInventoryId,
  addClassification,
  checkExistingClassificationName,
  addInventory,
  };

