// =============================================
// W06 Final Enhancement: Inquiry Model
// models/inquiry-model.js
// =============================================

const pool = require("../database/");

/* **************************************
 * Create a new inquiry record in the DB
 * Uses a prepared statement to prevent SQL injection
 * @param {number} inv_id - vehicle ID (FK)
 * @param {string} customer_name
 * @param {string} customer_email
 * @param {string} customer_phone
 * @param {string} message
 * @returns {object} newly created inquiry row
 * ************************************** */
async function createInquiry(inv_id, customer_name, customer_email, customer_phone, message) {
  try {
    const sql = `
      INSERT INTO public.inquiries
        (inv_id, customer_name, customer_email, customer_phone, message)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *`;
    const data = await pool.query(sql, [
      inv_id,
      customer_name,
      customer_email,
      customer_phone || null,
      message,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("createInquiry error: " + error);
    throw new Error("Unable to submit inquiry. Please try again.");
  }
}

/* **************************************
 * Get all inquiries for a specific vehicle
 * @param {number} inv_id - vehicle ID
 * @returns {Array} array of inquiry rows
 * ************************************** */
async function getInquiriesByVehicle(inv_id) {
  try {
    const sql = `
      SELECT
        i.inquiry_id,
        i.customer_name,
        i.customer_email,
        i.customer_phone,
        i.message,
        i.inquiry_date,
        inv.inv_make,
        inv.inv_model,
        inv.inv_year
      FROM public.inquiries i
      JOIN public.inventory inv ON i.inv_id = inv.inv_id
      WHERE i.inv_id = $1
      ORDER BY i.inquiry_date DESC`;
    const data = await pool.query(sql, [inv_id]);
    return data.rows;
  } catch (error) {
    console.error("getInquiriesByVehicle error: " + error);
    throw new Error("Unable to retrieve inquiries.");
  }
}

/* **************************************
 * Get all inquiries (for admin view)
 * @returns {Array} array of all inquiry rows
 * ************************************** */
async function getAllInquiries() {
  try {
    const sql = `
      SELECT
        i.inquiry_id,
        i.customer_name,
        i.customer_email,
        i.customer_phone,
        i.message,
        i.inquiry_date,
        inv.inv_make,
        inv.inv_model,
        inv.inv_year
      FROM public.inquiries i
      JOIN public.inventory inv ON i.inv_id = inv.inv_id
      ORDER BY i.inquiry_date DESC`;
    const data = await pool.query(sql);
    return data.rows;
  } catch (error) {
    console.error("getAllInquiries error: " + error);
    throw new Error("Unable to retrieve inquiries.");
  }
}

module.exports = { createInquiry, getInquiriesByVehicle, getAllInquiries };