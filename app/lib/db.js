'use server'
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export async function fetchInventoryFromDB() {
    const inventoryCollection = collection(db, "inventory");
    const inventorySnapshot = await getDocs(inventoryCollection);
    const inventory = inventorySnapshot.docs.map((doc) => doc.data());
    return inventory;
}

export async function updateInventoryInDB(itemName, newQuantity) {
    const inventoryCollection = collection(db, "inventory");
    const inventorySnapshot = await getDocs(inventoryCollection);
    const itemDoc = inventorySnapshot.docs.find(doc => doc.data().name === itemName);

    if (itemDoc) {
        const itemRef = doc(db, "inventory", itemDoc.id);
        await updateDoc(itemRef, { quantity: newQuantity });
    }
}
