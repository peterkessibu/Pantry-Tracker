// components/InventoryList.js
'use client';

import React, { useState } from 'react';
import AddEditItemModal from './AddEditItemModal';

const InventoryList = ({ userId, items, updateItemQuantity, removeItem, addPantryItem }) => {
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
            if (editMode) {
                await updateItemQuantity(selectedItem.id, parseInt(itemQuantity));
            } else {
                const newItem = await addPantryItem(itemName, parseInt(itemQuantity));
                console.log('New item added:', newItem);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error saving item:', error);
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setItemName(item.name);
        setItemQuantity(item.quantity);
        setEditMode(true);
        setIsModalOpen(true);
    };

    if (!items.length) {
        return <p className="text-gray-500">No items found. Add new items to your inventory.</p>;
    }

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
                                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                >
                                    +
                                </button>
                                <span className="text-slate-800 mx-2 sm:mx-3 text-xs sm:text-sm md:text-base">{item.quantity}</span>
                                <button
                                    className="bg-white text-black border-black border-[1px] py-1 px-2 sm:py-2 sm:px-3 md:py-2 md:px-4 rounded-full hover:bg-[#ff4646] transition duration-300 text-xs sm:text-sm md:text-base"
                                    onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity === 0}
                                >
                                    -
                                </button>
                            </div>
                            <div className="flex flex-col text-[12px] justify-between">
                                <button
                                    className="bg-[#cf2f2f] text-white py-2 px-3 rounded-lg hover:bg-[#c02828]"
                                    onClick={() => removeItem(item.id)}
                                >
                                    Remove
                                </button>
                                <button
                                    className="bg-[#408d86] text-white py-2 px-3 rounded-lg hover:bg-[#298b83] mt-2"
                                    onClick={() => handleEdit(item)}
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
                    itemName={itemName}
                    itemQuantity={itemQuantity}
                    setItemName={setItemName}
                    setItemQuantity={setItemQuantity}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                    editMode={editMode}
                />
            )}
        </div>
    );
};

export default InventoryList;
