import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Updates the quantity of an item in the inventory database.
 * @param {string} itemName - The name of the item to update.
 * @param {number} newQuantity - The new quantity to set for the item.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 * @throws {Error} If the item is not found in the inventory or if there's an error updating the document.
 */
export async function updateInventoryInDB(itemName, newQuantity) {
  const inventoryCollection = collection(db, "inventory");
  const inventorySnapshot = await getDocs(inventoryCollection);
  const itemDoc = inventorySnapshot.docs.find(
    (doc) => doc.data().name === itemName,
  );

  if (itemDoc) {
    const itemRef = doc(db, "inventory", itemDoc.id);
    try {
      await updateDoc(itemRef, { quantity: newQuantity });
    } catch (error) {
      console.error(`Error updating document: ${error}`);
      throw error; // Re-throw the error to be handled by the caller
    }
  } else {
    console.error(`No document found with name: ${itemName}`);
    throw new Error(`Item ${itemName} not found in inventory`);
  }
}
