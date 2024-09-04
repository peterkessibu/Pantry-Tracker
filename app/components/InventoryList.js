'use  server'
import React from 'react';

const InventoryList = ({ inventory, updateItemQuantity, removeItem, handleEdit, getTotalItems }) => {
    return (
        <div className="w-full p-3 sm:p-5 lg:p-8 rounded-xl border-[#10423e] shadow-lg bg-white mt-6 mx-2">
            <div className="bg-[#408d86] py-4 flex justify-center rounded-t-xl">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-100">Inventory Items</h2>
            </div>
            <div className="total-items m-4 items-end">
                <p className="text-lg font-bold items-end">Total Items: {getTotalItems()}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
                {inventory.map((item) => (
                    <div key={item.name} className="bg-white border-2 border-[#408d86] rounded-lg shadow-lg p-4">
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 capitalize">{item.name}</h3>
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
    );
};

export default InventoryList;
