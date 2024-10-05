// pages/api/inventory.js

import { fetchInventoryFromDB, updateInventoryInDB } from "../lib/db";

/**
 * Handles inventory management requests.
 * @param {object} req - The request object containing method and body information.
 * @param {object} res - The response object used to send back the API response.
 * @returns {Promise<void>} Sends a JSON response with inventory data or update confirmation.
 */
export default async function handler(req, res) {
  if (req.method === "GET") {
    const inventory = await fetchInventoryFromDB();
    res.status(200).json(inventory);
  } else if (req.method === "POST") {
    const { itemName, newQuantity } = req.body;
    await updateInventoryInDB(itemName, newQuantity);
    res.status(200).json({ message: "Inventory updated" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
