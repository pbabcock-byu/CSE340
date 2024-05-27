const pool = require("../database/")
const { check } = require("express-validator")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }


/* *****************************
* Week 5 Code Given : Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No such email found, please reenter or register")
  }
}  

/* *****************************
* Week 5 Assignment: step 5
* Update the user info
* ***************************** */
async function updateUserInfo(account_id, account_firstname, account_lastname, account_email){
  try {    
    console.error("Update User tried: " )
    const sql = 
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const data =  await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    console.error("Update User: " + (sql, [account_firstname, account_lastname, account_email, account_id]))
    return data.rows[0]
  } catch (error) {
    console.error("Update User: " )
    console.error("model error: " + error)
    return error.message
  }
}

/* *****************************
* Week 5 Assignment: step 5
* Update the user PASSWORD 
* ***************************** */

async function updateUserPassword(account_id, account_password){
try {
  console.error("Update Password tried: " )
  const sql = 
    "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
  const data =  await pool.query(sql, [
    account_password, 
    account_id
  ])
  return data.rows[0]
} catch (error) {
  console.error("model error: " + error)
  return error.message
}
}


/* *****************************
* Week 5 Assignment: step 5
* need to repull info to change vaules after update
* ***************************** */

async function getUserInfobyId (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email FROM public.account WHERE account_id = $1',[account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("Error with Account ID")
  }
}


module.exports =  {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  updateUserInfo,
  updateUserPassword,
  getUserInfobyId
};