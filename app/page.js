'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { db } from './firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';
import { Analytics } from "@vercel/analytics/react";
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import InventoryList from './components/InventoryList';
import AddEditItemModal from './components/AddEditItemModal';
import MessagePopup from './components/MessagePopup';


const HomePage = () => {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSorted, setIsSorted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [sortedMessageShown, setSortedMessageShown] = useState(false);
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const inventoryRef = collection(db, 'inventory');
    const inventoryQuery = query(inventoryRef);
    const unsubscribeInventory = onSnapshot(inventoryQuery, (snapshot) => {
      const inventoryList = snapshot.docs.map((doc) => ({
        name: doc.id,
        ...doc.data(),
      }));
      setInventory(inventoryList);
      setIsSorted(false);
      setSortedMessageShown(false);
    });

    return () => unsubscribeInventory();
  }, []);

  const addItem = useCallback(async () => {
    if (!itemName || !itemQuantity) return;
    try {
      const docRef = doc(db, 'inventory', itemName);
      await setDoc(docRef, {
        quantity: parseInt(itemQuantity),
      }, { merge: true });
      setLastAddedItem(itemName);  // Track last added item
      setItemName('');
      setItemQuantity('');
      setEditMode(false);
      setEditingItem(null);
      handleClose();
    } catch (error) {
      console.error("Error adding/editing item: ", error);
    }
  }, [itemName, itemQuantity]);

  const removeItem = useCallback(async (item) => {
    try {
      const docRef = doc(db, 'inventory', item);
      await deleteDoc(docRef);
      if (item === lastAddedItem) {
        setLastAddedItem(null);  // Reset last added item if removed
      }
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  }, [lastAddedItem]);

  const updateItemQuantity = useCallback(async (itemName, newQuantity) => {
    try {
      const docRef = doc(db, 'inventory', itemName);
      await setDoc(docRef, { quantity: newQuantity }, { merge: true });
    } catch (error) {
      console.error("Error updating item quantity: ", error);
    }
  }, []);

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortItems = () => {
    const sortedInventory = [...filteredInventory].sort((a, b) => a.name.localeCompare(b.name));
    setInventory(sortedInventory);
    setIsSorted(true);
    checkIfSorted(sortedInventory);
  };

  const checkIfSorted = (inventoryList) => {
    const isSorted = inventoryList.every((item, index, arr) => {
      return index === 0 || arr[index - 1].name.localeCompare(item.name) <= 0;
    });
    if (isSorted && !sortedMessageShown) {
      setMessage("All items are sorted!");
      setMessageOpen(true);
      setSortedMessageShown(true);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setEditingItem(item);
    setItemName(item.name);
    setItemQuantity(item.quantity.toString());
    handleOpen();
  };

  const getTotalItems = () => {
    return inventory.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    if (lastAddedItem && !isSorted) {
      const index = inventory.findIndex(item => item.name === lastAddedItem);
      if (index !== -1) {
        const newInventory = [...inventory];
        const [movedItem] = newInventory.splice(index, 1);
        newInventory.push(movedItem);
        setInventory(newInventory);
      }
    }
  }, [lastAddedItem, isSorted, inventory]);

  const handleMessageClose = () => {
    setMessageOpen(false);
    setMessage('');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4 mt-5">
      {/* Title Section */}
      <Header title="Shelfsense" />

      <Analytics />

      {/* Search Input */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddClick={handleOpen}
        onSortClick={sortItems}
      />

      {/* Add/Edit Item Modal */}
      {open && (
        <AddEditItemModal
          open={open}
          itemName={itemName}
          setItemName={setItemName}
          itemQuantity={itemQuantity}
          setItemQuantity={setItemQuantity}
          editMode={editMode}
          addItem={addItem}
          handleClose={handleClose}
        />
      )}

      {/* Message Popup */}
      {messageOpen && <MessagePopup message={message} onClose={handleMessageClose} />}

      {/* Inventory Items Section */}
      <InventoryList
        inventory={filteredInventory}
        updateItemQuantity={updateItemQuantity}
        removeItem={removeItem}
        handleEdit={handleEdit}
        getTotalItems={getTotalItems}
      />
    </div>
  );
};

export default HomePage;
