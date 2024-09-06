import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';

// Function to add a new pantry item with a custom document ID
export const addPantryItem = async (userId, itemName, quantity) => {
    const collectionRef = collection(db, 'users', userId, 'inventory');
    const newDocRef = doc(collectionRef);  // Create a new document reference with a generated ID
    await setDoc(newDocRef, {
        name: itemName,
        quantity: quantity
    });
    return newDocRef.id;  // Return the new document's ID
};

// Custom hook to manage pantry items
const usePantry = (userId) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            if (!userId) return;  // Ensure userId is provided
            setLoading(true);
            try {
                const fetchedItems = await getPantryItems(userId);
                setItems(fetchedItems);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [userId]);

    // Fetch pantry items from Firestore
    const getPantryItems = async (userId) => {
        const collectionRef = collection(db, 'users', userId, 'inventory');
        const querySnapshot = await getDocs(collectionRef);
        const items = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return items;
    };

    // Add a new item to the pantry using the custom `addPantryItem` function
    const handleAddItem = async (itemName, quantity) => {
        try {
            const itemId = await addPantryItem(userId, itemName, quantity);
            setItems(prevItems => [...prevItems, { id: itemId, name: itemName, quantity }]);
        } catch (err) {
            setError(err);
        }
    };

    // Update the quantity of an existing item
    const handleUpdateItem = async (itemId, quantity) => {
        try {
            const itemRef = doc(db, 'users', userId, 'inventory', itemId);
            await updateDoc(itemRef, { quantity });
            setItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId ? { ...item, quantity } : item
                )
            );
        } catch (err) {
            setError(err);
        }
    };

    // Remove an item from the pantry
    const handleRemoveItem = async (itemId) => {
        try {
            const itemRef = doc(db, 'users', userId, 'inventory', itemId);
            await deleteDoc(itemRef);
            setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (err) {
            setError(err);
        }
    };

    return {
        items,
        loading,
        error,
        addPantryItem: handleAddItem,
        updateItemQuantity: handleUpdateItem,
        removeItem: handleRemoveItem,
    };
};

export default usePantry;
