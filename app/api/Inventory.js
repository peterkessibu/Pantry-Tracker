// pages/api/inventory.js

import { fetchInventoryFromDB, updateInventoryInDB } from '../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const inventory = await fetchInventoryFromDB();
        res.status(200).json(inventory);
    } else if (req.method === 'POST') {
        const { itemName, newQuantity } = req.body;
        await updateInventoryInDB(itemName, newQuantity);
        res.status(200).json({ message: 'Inventory updated' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
