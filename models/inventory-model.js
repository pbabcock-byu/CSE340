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
 * ************************** */

 async function getInventoryByInventoryId(inv_id) {
  try {
    const data = await pool.query(`SELECT * FROM public.inventory WHERE inv_id = $1`, [inv_id] )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryByInventoryId error " + error)
  }
} 

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
 *  
 * ************************** 
 * 
 * W.I.P
 * 
 * */


module.exports = {
  getClassifications, 
  getInventoryByClassificationId,
  getInventoryByInventoryId,
  addClassification,
  checkExistingClassificationName,
  };

