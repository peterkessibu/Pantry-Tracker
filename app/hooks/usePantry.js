'use client';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc } from 'firebase/firestore';

const usePantry = (userId) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Fetch pantry items from Firestore
    const getPantryItems = async () => {
        const collectionRef = collection(db, 'users', userId, 'inventory');
        const querySnapshot = await getDocs(collectionRef);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    };

    useEffect(() => {
        const fetchItems = async () => {
            if (!userId) return; // Ensure userId is provided
            setLoading(true);
            try {
                const fetchedItems = await getPantryItems();
                setItems(fetchedItems); // Update state with fetched items
            } catch (err) {
                setError(err);
                console.error('Error fetching pantry items:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [userId]);

    // Add a new item to Firestore
    const handleAddItem = async (itemName, quantity) => {
        try {
            const docRef = await addDoc(collection(db, 'users', userId, 'inventory'), {
                name: itemName,
                quantity: quantity
            });
            const newItem = { id: docRef.id, name: itemName, quantity: quantity };
            setItems(prevItems => [...prevItems, newItem]);
            return newItem;
        } catch (error) {
            console.error('Error adding pantry item:', error);
            setError(error);
            throw error;
        }
    };

    // Update item quantity
    const handleUpdateItem = async (itemId, quantity) => {
        try {
            const itemRef = doc(db, 'users', userId, 'inventory', itemId);
            await updateDoc(itemRef, { quantity });
            setItems(prevItems => prevItems.map(item => (item.id === itemId ? { ...item, quantity } : item)));
        } catch (err) {
            console.error('Error updating item:', err);
            setError(err);
            throw err;
        }
    };

    // Remove an item from Firestore
    const handleRemoveItem = async (itemId) => {
        try {
            const itemRef = doc(db, 'users', userId, 'inventory', itemId);
            await deleteDoc(itemRef);
            setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (err) {
            console.error('Error removing item:', err);
            setError(err);
            throw err;
        }
    };

    return {
        items,
        setItems,
        loading,
        error,
        addPantryItem: handleAddItem,
        updateItemQuantity: handleUpdateItem,
        removeItem: handleRemoveItem,
    };
};

export default usePantry;