"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import useAuth from "../hooks/useAuth";
import usePantry from "../hooks/usePantry";

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSorted, setIsSorted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [sortedMessageShown, setSortedMessageShown] = useState(false);
  const [message, setMessage] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);
  const router = useRouter();

  const { user } = useAuth();
  const {
    items: inventory,
    isLoading,
    error,
    addPantryItem,
    updateItemQuantity,
    editPantryItem,
    deletePantryItem,
  } = usePantry(user?.uid);

  useEffect(() => {
    if (!user) {
      router.push('/generate');
    }
  }, [user, router]);

  const addItem = useCallback(async () => {
    if (!itemName || !itemQuantity) return;
    await addPantryItem(itemName, itemQuantity);
    setLastAddedItem(itemName);
    setItemName("");
    setItemQuantity("");
    setEditMode(false);
    setEditingItem(null);
    handleClose();
    showMessage("Item added successfully");
  }, [itemName, itemQuantity, addPantryItem]);

  const removeItem = useCallback(
    async (itemId) => {
      await deletePantryItem(itemId);
      if (itemId === lastAddedItem) {
        setLastAddedItem(null);
      }
      showMessage("Item removed successfully");
    },
    [lastAddedItem, deletePantryItem]
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemName("");
    setItemQuantity("");
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

  const handleSave = async () => {
    if (editMode && editingItem) {
      await editPantryItem(editingItem.id, itemName, itemQuantity);
      showMessage("Item updated successfully");
    } else {
      await addItem();
    }
    handleClose();
  };

  const sortInventory = () => {
    setIsSorted(!isSorted);
    setSortedMessageShown(true);
    setTimeout(() => setSortedMessageShown(false), 2000);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setMessageOpen(true);
    setTimeout(() => setMessageOpen(false), 3000);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedInventory = isSorted
    ? [...filteredInventory].sort((a, b) => a.name.localeCompare(b.name))
    : filteredInventory;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4 mt-5">
      {/* Title Section */}
      <div className="p-4 m-4 bg-gray-100 rounded-lg flex justify-center brightness-200">
        <p className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Shelfsense - {user ? user.email : 'Loading...'}
        </p>
      </div>

      <Analytics />

      {/* Add Item Button */}
      <button
        onClick={handleOpen}
        className="bg-[#10423e] text-white py-2 px-4 rounded-lg hover:bg-[#1e968c] transition duration-300"
      >
        Add Item
      </button>

      {/* Search and Sort Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full px-4 gap-4">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none w-full sm:w-64"
        />
        <button
          onClick={sortInventory}
          className="bg-[#10423e] text-white py-2 px-4 rounded-lg hover:bg-[#1e968c] transition duration-300"
        >
          {isSorted ? "Unsort" : "Sort A-Z"}
        </button>
      </div>

      {/* Inventory Items Section */}
      <div className="w-full p-3 sm:p-5 lg:p-8 rounded-xl border-[#10423e] shadow-lg bg-white mt-6 mx-2">
        <h2 className="text-2xl font-bold mb-4">Inventory</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
          {sortedInventory.map((item) => (
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
                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <span className="text-slate-800 mx-2 sm:mx-3 text-xs sm:text-sm md:text-base">
                    {item.quantity}
                  </span>
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
                    className="bg-red-700 text-white py-2 px-3 rounded-lg hover:bg-red-600"
                    onClick={() => removeItem(item.id)}
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

      {/* Add/Edit Item Modal */}
      {open && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">{editMode ? "Edit Item" : "Add New Item"}</h2>
            <input
              type="text"
              placeholder="Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="border-2 border-gray-300 p-2 mb-4 w-full rounded"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              className="border-2 border-gray-300 p-2 mb-4 w-full rounded"
            />
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="bg-gray-300 text-black py-2 px-4 rounded-lg mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-[#10423e] text-white py-2 px-4 rounded-lg hover:bg-[#1e968c]"
              >
                {editMode ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Toast */}
      {messageOpen && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded">
          {message}
        </div>
      )}

      {/* Sorted Message */}
      {sortedMessageShown && (
        <div className="fixed bottom-5 left-5 bg-blue-500 text-white py-2 px-4 rounded">
          Inventory {isSorted ? "sorted" : "unsorted"}
        </div>
      )}
    </div>
  );
};

export default HomePage;