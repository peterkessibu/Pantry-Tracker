'use client';

import React, { useState } from 'react';

const InventoryList = ({ items, updateItemQuantity, removeItem, addPantryItem }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [editMode, setEditMode] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setItemName('');
        setItemQuantity('');
        setEditMode(false);
    };

    const handleSave = async () => {
        try {
            if (editMode && selectedItem) {
                // Edit existing item
                await updateItemQuantity(selectedItem.id, parseInt(itemQuantity));
            } else {
                // Add new item
                await addPantryItem(itemName, parseInt(itemQuantity));
            }
            handleCloseModal(); // Close the modal after saving item
        } catch (error) {
            console.error('Error saving item:', error);
        }
    };

    // Function to handle editing an item
    const handleEditItem = (item) => {
        setSelectedItem(item); // Set the selected item for editing
        setItemName(item.name); // Set the name in the modal input
        setItemQuantity(item.quantity.toString()); // Set the quantity in the modal input
        setEditMode(true); // Set the modal in edit mode
        setIsModalOpen(true); // Open the modal
    };

    // Function to handle removing an item
    const handleRemoveItem = (itemId) => {
        if (confirm('Are you sure you want to remove this item?')) {
            removeItem(itemId); // Remove the item by calling the provided removeItem function
        }
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity >= 0) {
            await updateItemQuantity(itemId, newQuantity);
        }
    };

    // Function to calculate the total number of items
    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    if (!items.length) {
        return <p className="text-gray-500">No items found. Add new items to your inventory.</p>;
    }

    return (
        <div className="w-full p-3 sm:p-5 lg:p-8 rounded-xl border-[#10423e] shadow-lg bg-white mt-6 mx-2">
            <div className="bg-[#408d86] py-4 flex justify-center rounded-t-xl">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-100">Inventory Items</h2>
            </div>

            {/* Display total number of items */}
            <div className="text-right text-gray-600 font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-4">
                Total Items: {getTotalItems()}
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
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                >
                                    +
                                </button>
                                <span className="text-slate-800 p-3 mx-2 sm:mx-3 text-xs sm:text-sm md:text-base">{item.quantity}</span>
                                <button
                                    className="bg-white text-black border-black border-[1px] py-1 px-2 sm:py-2 sm:px-3 md:py-2 md:px-4 rounded-full hover:bg-[#ff4646] transition duration-300 text-xs sm:text-sm md:text-base"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    disabled={item.quantity === 0}
                                >
                                    -
                                </button>
                            </div>
                            <div className="flex flex-col text-[12px] justify-between">
                                <button
                                    className="bg-[#cf2f2f] text-white py-2 px-3 rounded-lg hover:bg-[#c02828]"
                                    onClick={() => handleRemoveItem(item.id)} // Call handleRemoveItem on click
                                >
                                    Remove
                                </button>
                                <button
                                    className="bg-[#408d86] text-white py-2 px-3 rounded-lg hover:bg-[#298b83] mt-2"
                                    onClick={() => handleEditItem(item)} // Call handleEditItem on click
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <AddEditItemModal
                    open={isModalOpen}
                    itemName={itemName}
                    itemQuantity={itemQuantity}
                    setItemName={setItemName}
                    setItemQuantity={setItemQuantity}
                    editMode={editMode}
                    addItem={handleSave}
                    handleClose={handleCloseModal}
                    updateItemQuantity={updateItemQuantity}
                />
            )}
        </div>
    );
};

export default InventoryList;
