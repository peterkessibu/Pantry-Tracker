"use client";
import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const usePantry = (userId) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.log("No userId provided to usePantry");
      setIsLoading(false);
      return;
    }

    console.log("Setting up pantry listener for userId:", userId);
    setIsLoading(true);

    // Change the collection reference to include the userId
    const pantryRef = collection(db, `users/${userId}/pantry`);
    const q = query(pantryRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched items:", newItems);
        setItems(newItems);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error in pantry listener:", err);
        setError(err);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId]);

  const addPantryItem = useCallback(
    async (name, quantity) => {
      if (!userId) return;
      const newItem = {
        name,
        quantity: parseInt(quantity, 10),
      };
      try {
        const docRef = doc(collection(db, `users/${userId}/pantry`));
        await setDoc(docRef, newItem);
        console.log("Item added successfully");
      } catch (err) {
        console.error("Error adding item:", err);
        setError(err);
      }
    },
    [userId],
  );

  const updateItemQuantity = useCallback(
    async (itemId, newQuantity) => {
      if (!userId) return;
      try {
        const itemRef = doc(db, `users/${userId}/pantry`, itemId);
        await setDoc(itemRef, { quantity: newQuantity }, { merge: true });
        console.log("Item quantity updated successfully");
      } catch (err) {
        console.error("Error updating item quantity:", err);
        setError(err);
      }
    },
    [userId],
  );

  const editPantryItem = useCallback(
    async (itemId, newName, newQuantity) => {
      if (!userId) return;
      try {
        const itemRef = doc(db, `users/${userId}/pantry`, itemId);
        await setDoc(
          itemRef,
          { name: newName, quantity: parseInt(newQuantity, 10) },
          { merge: true },
        );
        console.log("Item edited successfully");
      } catch (err) {
        console.error("Error editing item:", err);
        setError(err);
      }
    },
    [userId],
  );

  const deletePantryItem = useCallback(
    async (itemId) => {
      if (!userId) return;
      try {
        const itemRef = doc(db, `users/${userId}/pantry`, itemId);
        await deleteDoc(itemRef);
        console.log("Item deleted successfully");
      } catch (err) {
        console.error("Error deleting item:", err);
        setError(err);
      }
    },
    [userId],
  );

  return {
    items,
    error,
    isLoading,
    addPantryItem,
    updateItemQuantity,
    editPantryItem,
    deletePantryItem,
  };
};

export default usePantry;