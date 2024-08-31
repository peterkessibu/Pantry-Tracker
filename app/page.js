'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { db } from './firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';
import { Analytics } from "@vercel/analytics/react";

const HomePage = () => {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSorted, setIsSorted] = useState(false);
  const [editMode, setEditMode] = useState(false);  // New state for edit mode
  const [editingItem, setEditingItem] = useState(null);  // New state for the item being edited
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
      setItemName('');
      setItemQuantity('');
      setEditMode(false);  // Reset edit mode
      setEditingItem(null);  // Clear editing item state
      handleClose();
    } catch (error) {
      console.error("Error adding/editing item: ", error);
    }
  }, [itemName, itemQuantity]);

  const removeItem = useCallback(async (item) => {
    try {
      const docRef = doc(db, 'inventory', item);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  }, []);

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
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);  // Reset edit mode on close
    setEditingItem(null);  // Clear editing item state on close
  };

  const handleEdit = (item) => {
    setEditMode(true);  // Enable edit mode
    setEditingItem(item);  // Set the item to be edited
    setItemName(item.name);  // Pre-fill with item name
    setItemQuantity(item.quantity.toString());  // Pre-fill with item quantity
    handleOpen();  // Open the modal
  };
  const getTotalItems = () => {
    return inventory.reduce((total, item) => total + item.quantity, 0);
  };

  const capitalize = (str) => str.toUpperCase();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4 mt-5">
      {/* Title Section */}
      <div className="p-4 m-4 bg-gray-100 rounded-lg flex justify-center brightness-200">
        <p className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Shelfsense
        </p>
      </div>

      <Analytics />

      {/* Search Input */}
      <div className="w-full mb-4 flex flex-col items-center justify-center">
        <input
          type="text"
          placeholder="Search items..."
          className="border border-[#10423e] bg-white text-[#10423e] placeholder:text-gray-500 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#408d86] focus:border-transparent w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex justify-center gap-4">
          <button
            className="bg-[#408d86] text-white p-3 rounded-lg hover:bg-[#306d6b]"
            onClick={handleOpen}
          >
            Add New Item
          </button>
          <button
            className="bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-600"
            onClick={sortItems}
          >
            Sort Items
          </button>
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      <div
        className={`fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50 ${open ? 'block' : 'hidden'}`}
      >
        <div className="bg-white rounded-xl shadow-lg flex flex-col gap-4 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 relative p-6">
          <button
            className="absolute top-2 right-2 bg-red-700 text-white p-2 rounded-full hover:bg-red-600"
            onClick={handleClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" x="0px" y="0px" width="15" height="15" viewBox="0 0 50 50">
              <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
            </svg>
          </button>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-center text-gray-800">
            {editMode ? "Edit Item" : "Add Item"}
          </h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              className="border-[#10423e] border-[1px] text-[#10423e] focus:outline-none focus:ring-2 focus:ring-[#408d86] focus:border-transparent placeholder:text-gray-600 p-2 border-t-0 border-l-0 border-r-0"
              placeholder="Item"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              disabled={editMode} 
            />
            <input
              type="number"
              className="border-[#10423e] border-[1px] text-[#10423e] focus:outline-none focus:ring-2 focus:ring-[#408d86] focus:border-transparent placeholder:text-gray-600 p-2 border-t-0 border-l-0 border-r-0"
              placeholder="Quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
              onClick={addItem}
            >
              {editMode ? "Save Changes" : "Add"}
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Items Section */}
      <div className="w-full p-3 sm:p-5 lg:p-8 rounded-xl border-[#10423e] shadow-lg bg-white mt-6 mx-2">
        <div className="bg-[#408d86] py-4 flex justify-center rounded-t-xl">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-100">Inventory Items</h2>
        </div>
        <div className="total-items m-4 items-end">
          <p className="text-lg font-bold items-end">Total Items: {getTotalItems()}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
          {filteredInventory.map((item) => (
            <div key={item.name} className="bg-white border-2 border-[#408d86] rounded-lg shadow-lg p-4">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 capitalize">{(item.name)}</h3>
              <p className="text-gray-600 text-sm sm:text-base">Quantity: {item.quantity}</p>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-1 items-center">
                  <button
                    className="bg-white text-black border-black border-[1px] py-1 px-2 sm:py-2 sm:px-3 md:py-2 md:px-4 rounded-full hover:bg-[#1e968c] transition duration-300 text-xs sm:text-sm md:text-base"
                    onClick={() => updateItemQuantity(item.name, item.quantity + 1)}
                  >
                    +
                  </button>
                  <span className="text-slate-800 mx-2 sm:mx-3 text-xs sm:text-sm md:text-base">{item.quantity}</span>
                  <button
                    className="bg-white text-black border-black border-[1px] py-1 px-2 sm:py-2 sm:px-3 md:py-2 md:px-4 rounded-full hover:bg-[#ff4646] transition duration-300 text-xs sm:text-sm md:text-base"
                    onClick={() => updateItemQuantity(item.name, item.quantity - 1)}
                    disabled={item.quantity === 0}
                  >
                    -
                  </button>
                </div>
                <div className="flex flex-col text-[12px] justify-between">
                  <button
                    className="bg-red-700 text-white py-2 px-3 rounded-lg hover:bg-red-600"
                    onClick={() => removeItem(item.name)}
                  >
                    Remove
                  </button>
                  <button
                    className="bg-blue-500 text-white p-2 mt-1 rounded-lg hover:bg-blue-600"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                </div>  
              </div>
            </div>
          ))}
        </div>
        
      </div>
      
    </div>
  );
};

export default HomePage;
