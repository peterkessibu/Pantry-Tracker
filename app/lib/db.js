'use client'
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export async function updateInventoryInDB(itemName, newQuantity) {
    const inventoryCollection = collection(db, "inventory");
    const inventorySnapshot = await getDocs(inventoryCollection);
    const itemDoc = inventorySnapshot.docs.find(doc => doc.data().name === itemName);

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