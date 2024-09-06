'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, collection, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// EditItemModal Component
const EditItemModal = ({ item, onClose, onSave }) => {
    const [itemName, setItemName] = useState(item.name);
    const [itemQuantity, setItemQuantity] = useState(item.quantity);

    const handleSave = () => {
        if (itemName && itemQuantity >= 0) {
            onSave({ name: itemName, quantity: parseInt(itemQuantity) });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Item</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Item Name</label>
                    <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Quantity</label>
                    <input
                        type="number"
                        value={itemQuantity}
                        onChange={(e) => setItemQuantity(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// InventoryList Component
const InventoryList = ({ userId }) => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Fetch inventory items when component mounts or userId changes
        const fetchItems = async () => {
            const fetchedItems = await getPantryItems(userId);
            setItems(fetchedItems);
        };

        fetchItems();
    }, [userId]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleSave = async (updatedItem) => {
        await updateItemQuantity(userId, updatedItem.name, updatedItem.quantity);
        const updatedItems = items.map(item =>
            item.name === updatedItem.name ? { ...item, quantity: updatedItem.quantity } : item
        );
        setItems(updatedItems);
        handleCloseModal();
    };

    const handleAddItem = async (itemName, quantity) => {
        await addPantryItem(userId, itemName, quantity);
        setItems([...items, { name: itemName, quantity }]);
    };

    const updateItemQuantity = async (userId, itemName, quantity) => {
        const itemRef = doc(db, 'users', userId, 'pantry', itemName);
        await updateDoc(itemRef, { quantity });
    };

    const removeItem = async (userId, itemName) => {
        const itemRef = doc(db, 'users', userId, 'pantry', itemName);
        await deleteDoc(itemRef);
        setItems(items.filter(item => item.name !== itemName));
    };

    const getPantryItems = async (userId) => {
        try {
            const userDocRef = doc(db, 'users', userId);
            const pantryRef = collection(userDocRef, 'pantry'); // Reference to pantry sub-collection

            // Get all pantry items for the user
            const pantrySnapshot = await getDocs(pantryRef);

            const pantryItems = [];
            pantrySnapshot.forEach(doc => {
                pantryItems.push({ id: doc.id, ...doc.data() });
            });

            return pantryItems; // Return array of pantry items
        } catch (error) {
            console.error('Error fetching pantry items:', error);
            return [];
        }
    };

    const addPantryItem = async (userId, itemName, quantity) => {
        try {
            const itemRef = doc(db, 'users', userId, 'pantry', itemName);
            await setDoc(itemRef, { name: itemName, quantity });
        } catch (error) {
            console.error('Error adding pantry item:', error);
        }
    };

    if (!items) return <p>Loading...</p>;

    return (
        <div className="w-full p-3 sm:p-5 lg:p-8 rounded-xl border-[#10423e] shadow-lg bg-white mt-6 mx-2">
            <div className="bg-[#408d86] py-4 flex justify-center rounded-t-xl">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-100">Inventory Items</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
                {items.map((item) => (
                    <div key={item.id} className="bg-white border-2 border-[#408d86] rounded-lg shadow-lg p-4">
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 capitalize">{item.name}</h3>
                        <p className="text-gray-600 text-sm sm:text-base">Quantity: {item.quantity}</p>
                        <div className="flex justify-between items-center mt-4">
                            <div className="flex gap-1 items-center">
                                <button
                                    className="bg-white text-black border-black border-[1px] py-1 px-2 sm:py-2 sm:px-3 md:py-2 md:px-4 rounded-full hover:bg-[#1e968c] transition duration-300 text-xs sm:text-sm md:text-base"
                                    onClick={() => updateItemQuantity(userId, item.name, item.quantity + 1)}
                                >
                                    +
                                </button>
                                <span className="text-slate-800 mx-2 sm:mx-3 text-xs sm:text-sm md:text-base">{item.quantity}</span>
                                <button
                                    className="bg-white text-black border-black border-[1px] py-1 px-2 sm:py-2 sm:px-3 md:py-2 md:px-4 rounded-full hover:bg-[#ff4646] transition duration-300 text-xs sm:text-sm md:text-base"
                                    onClick={() => updateItemQuantity(userId, item.name, item.quantity - 1)}
                                    disabled={item.quantity === 0}
                                >
                                    -
                                </button>
                            </div>
                            <div className="flex flex-col text-[12px] justify-between">
                                <button
                                    className="bg-red-700 text-white py-2 px-3 rounded-lg hover:bg-red-600"
                                    onClick={() => removeItem(userId, item.name)}
                                >
                                    Remove
                                </button>
                                <button
                                    className="bg-blue-500 text-white p-2 mt-1 rounded-lg hover:bg-blue-600"
                                    onClick={() => {
                                        setSelectedItem(item);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Item Modal */}
            {isModalOpen && selectedItem && (
                <EditItemModal
                    item={selectedItem}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default InventoryList;
