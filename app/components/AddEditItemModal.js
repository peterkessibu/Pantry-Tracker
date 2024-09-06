'use client';
import React from 'react';

const AddEditItemModal = ({
    open,
    itemName,
    setItemName,
    itemQuantity,
    setItemQuantity,
    editMode,
    addItem,
    handleClose
}) => {
    if (!open) return null;
    return (
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
    );
};

export default AddEditItemModal;
