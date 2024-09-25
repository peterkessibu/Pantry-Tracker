"use client";

import React, { useState } from "react";

const InventoryList = ({
  items,
  updateItemQuantity,
  addPantryItem,
  removeItem,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [editMode, setEditMode] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setItemName("");
    setItemQuantity("");
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      if (editMode && selectedItem) {
        await updateItemQuantity(selectedItem.id, parseInt(itemQuantity));
      } else {
        await addPantryItem(itemName, parseInt(itemQuantity));
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setItemName(item.name);
    setItemQuantity(item.quantity.toString());
    setEditMode(true);
    setIsModalOpen(true);
  };

  const handleRemoveItem = async (itemId) => {
    if (confirm("Are you sure you want to remove this item?")) {
      try {
        await removeItem(itemId); // Use removeItem from props
      } catch (error) {
        console.error("Error removing item:", error);
      }
    }
  };

  const handleQuantityChange = async (itemId, increment) => {
    const item = items.find(item => item.id === itemId); // Get the current item
    const newQuantity = item.quantity + increment; // Calculate new quantity

    if (newQuantity >= 0) {
      await updateItemQuantity(itemId, newQuantity); // Update the quantity
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  if (!items.length) {
    return (
      <p className="text-gray-500">
        No items found. Add new items to your inventory.
      </p>
    );
  }

  return (
    <div className="w-full p-3 sm:p-5 lg:p-8 rounded-xl border-[#10423e] shadow-lg bg-white mt-6 mx-2">
      <div className="bg-[#408d86] py-4 flex justify-center rounded-t-xl">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-100">
          Inventory Items
        </h2>
      </div>

      <div className="text-right text-gray-600 font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-4">
        Total Items: {getTotalItems()}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border-2 border-[#408d86] rounded-lg shadow-lg p-4"
          >
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 capitalize">
              {item.name}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Quantity: {item.quantity}
            </p>
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-1 items-center">
                <button
                  className="bg-white text-black border-black border-[1px] py-1 px-2 sm:py-2 sm:px-3 md:py-2 md:px-4 rounded-full hover:bg-[#1e968c] transition duration-300 text-xs sm:text-sm md:text-base"
                  onClick={() => handleQuantityChange(item.id, 1)} // Increment by 1
                >
                  +
                </button>
                <span className="text-slate-800 p-3 mx-2 sm:mx-3 text-xs sm:text-sm md:text-base">
                  {item.quantity}
                </span>
                <button
                  className="bg-white text-black border-black border-[1px] py-1 px-2 sm:py-2 sm:px-3 md:py-2 md:px-4 rounded-full hover:bg-[#ff4646] transition duration-300 text-xs sm:text-sm md:text-base"
                  onClick={() => handleQuantityChange(item.id, -1)} // Decrement by 1
                  disabled={item.quantity === 0}
                >
                  -
                </button>
              </div>
              <div className="flex flex-col text-[12px] justify-between">
                <button
                  className="bg-[#cf2f2f] text-white py-2 px-3 rounded-lg hover:bg-[#c02828]"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
                <button
                  className="bg-[#408d86] text-white py-2 px-3 rounded-lg hover:bg-[#298b83] mt-2"
                  onClick={() => handleEditItem(item)}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div
          className={`fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isModalOpen ? "block" : "hidden"}`}
        >
          <div className="bg-white rounded-xl shadow-lg flex flex-col gap-4 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 relative p-6">
            <button
              className="absolute top-2 right-2 bg-red-700 text-white p-2 rounded-full hover:bg-red-600"
              onClick={handleCloseModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#ffffff"
                x="0px"
                y="0px"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  fill="#ffffff"
                ></path>
              </svg>
            </button>

            <h3 className="text-lg font-bold text-gray-700">
              {editMode ? "Edit Item" : "Add New Item"}
            </h3>

            <input
              type="text"
              className="border-gray-300 border-2 rounded-lg p-2 w-full"
              placeholder="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
            <input
              type="number"
              className="border-gray-300 border-2 rounded-lg p-2 w-full"
              placeholder="Quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              required
            />

            <button
              className="bg-[#408d86] text-white py-2 rounded-lg hover:bg-[#2f6e69] transition duration-300"
              onClick={handleSave}
            >
              {editMode ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
