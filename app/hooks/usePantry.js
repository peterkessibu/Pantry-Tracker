'use client'
import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, updateDoc, doc, deleteDoc, addDoc, orderBy  } from 'firebase/firestore';

const usePantry = (userId) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const collectionRef = collection(db, 'users', userId, 'inventory');
        const q = query(collectionRef, orderBy('name'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setItems(fetchedItems);
            setLoading(false);
        }, (err) => {
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const handleAddItem = useCallback(async (itemName, quantity) => {
        try {
            const docRef = await addDoc(collection(db, 'users', userId, 'inventory'), {
                name: itemName,
                quantity: quantity
            });
            return { id: docRef.id, name: itemName, quantity: quantity };
        } catch (error) {
            setError(error);
            throw error;
        }
    }, [userId]);
    const addPantryItem = async (name, quantity) => {
        const docRef = await addDoc(collection(db, 'users', userId, 'inventory'), {
            name,
            quantity,
        });
        return docRef.id;
    };
    const handleUpdateItem = useCallback(async (itemId, newQuantity) => {
        try {
            const itemRef = doc(db, 'users', userId, 'inventory', itemId);
            await updateDoc(itemRef, { quantity: newQuantity });

            // Update local state
            setItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            setError(error);
            throw error;
        }
    }, [userId]);
    

    const handleRemoveItem = useCallback(async (itemId) => {
        try {
            const itemRef = doc(db, 'users', userId, 'inventory', itemId);
            await deleteDoc(itemRef);
            setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (error) {
            setError(error);
            throw error;
        }
    }, [userId]);
    return {
        items,
        loading,
        error,
        addPantryItem: handleAddItem,
        updateItemQuantity: handleUpdateItem,
        removeItem: handleRemoveItem,
        getPantryItems: () => items
    };
};


export default usePantry;
