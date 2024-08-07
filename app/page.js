'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { db } from './firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';

const HomePage = () => {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSorted, setIsSorted] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const inventoryRef = collection(db, 'inventory');
    const inventoryQuery = query(inventoryRef);
    const unsubscribeInventory = onSnapshot(inventoryQuery, (snapshot) => {
      const inventoryList = snapshot.docs.map((doc) => ({
        name: doc.id,
        ...doc.data()
      }));
      setInventory(inventoryList);
    });

    return () => unsubscribeInventory();
  }, []);

  const addItem = useCallback(async () => {
    if (!itemName || !itemQuantity || !itemPrice) return;
    try {
      const docRef = doc(db, 'inventory', itemName);
      await setDoc(docRef, {
        quantity: parseInt(itemQuantity),
        price: parseFloat(itemPrice)
      }, { merge: true });
      setItemName('');
      setItemQuantity('');
      setItemPrice('');
      handleClose();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  }, [itemName, itemQuantity, itemPrice]);

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

  const getTotalPrices = (inventoryList) => {
    let overallTotal = 0;
    const inventoryWithTotals = inventoryList.map(({ name, quantity, price }) => {
      const total = quantity * price;
      overallTotal += total;
      return { name, quantity, price, total };
    });
    return { inventoryWithTotals, overallTotal };
  };

  const { inventoryWithTotals, overallTotal } = getTotalPrices(inventory);

  const filteredInventory = inventoryWithTotals.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortItems = () => {
    const sortedInventory = [...filteredInventory].sort((a, b) => a.name.localeCompare(b.name));
    setInventory(sortedInventory);
    setIsSorted(true);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4 mt-5 mx-4">
      {/* Title Section */}
      <div className="p-4 m-4 bg-gray-100 rounded-lg flex justify-center brightness-200">
        <p className='font-extrabold text-2xl'>
          Box-It.
        </p>
      </div>

      {/* Search Input */}
      <div className="w-full mb-4 flex items-center justify-center">
        <input
          type="text"
          placeholder="Search items..."
          className="border border-[#10423e] bg-white text-[#10423e] placeholder:text-gray-500 p-2 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#408d86] focus:border-transparent w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Add Item Modal */}
      <div
        className={`fixed z-0 inset-0 flex items-center justify-center bg-black bg-opacity-50 ${open ? 'block' : 'hidden'}`}
      >
        <div className="bg-white rounded-xl border-green-900 shadow-xl flex flex-col gap-4 w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 relative p-6">
          <button
            className="absolute top-2 right-2 bg-red-700 text-white p-2 rounded-full hover:bg-red-600"
            onClick={handleClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" x="0px" y="0px" width="15" height="15" viewBox="0 0 50 50">
              <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
            </svg>
          </button>
          <h2 className="text-base md:text-xl lg:text-2xl font-bold text-black text-center">Add Item</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              className="border-gray-600 p-2 text-black"
              placeholder="Item"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <input
              type="number"
              className="border p-2 text-black rounded-lg"
              placeholder="Quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
            />
            <input
              type="number"
              className="border p-2 text-black rounded-lg"
              placeholder="Price"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
              onClick={addItem}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Add New Item Button */}
      <div className='flex flex-row justify-between items-center mx-6'>
        <button
          className="bg-[#408d86] text-white p-2 rounded-lg hover:bg-[#306d6b] mx-6"
          onClick={handleOpen}
        >
          Add New Item
        </button>

        {/* Sort Items Button */}
        <button
          className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 mx-6"
          onClick={sortItems}
        >
          Sort Items
        </button>
      </div>

      {/* Inventory Items Section */}
      <div className="w-screen m-4 p-10 rounded-xl border-[#10423e] shadow-xl bg-white">
        <div className="bg-[#408d86] py-4 flex justify-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 p-6">Inventory Items</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
          {filteredInventory.map((item) => (
            <div key={item.name} className="bg-white border-2 border-green-700 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price.toFixed(2)}</p>
              <p>Total: ${item.total.toFixed(2)}</p>
              <div className="flex gap-2">
                <button
                  className="bg-green-500 text-white p-2 rounded-md shadow-md hover:bg-green-600 transition-colors duration-300"
                  onClick={() => updateItemQuantity(item.name, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded-md shadow-md hover:bg-red-600 transition-colors duration-300"
                  onClick={() => updateItemQuantity(item.name, item.quantity - 1)}
                  disabled={item.quantity <= 0}
                >
                  -
                </button>
              </div>
              <button
                className="bg-red-600 text-white p-2 rounded-md shadow-md hover:bg-red-700 transition-colors duration-300 mt-2"
                onClick={() => removeItem(item.name)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <div className="font-bold text-lg">Total: ${overallTotal.toFixed(2)}</div>
        </div>
      </div>
    </div>  
  );
};

export default HomePage;
