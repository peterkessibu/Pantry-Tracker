"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import usePantry from "../hooks/usePantry";
import { Edit, Trash } from "lucide-react";
import { UserHeader } from "../components/UserHeader";
import Loading from "./loading";

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
  const [loading, setLoading] = useState(true); // New loading state
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
      router.push("/generate");
    }
  }, [user, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  function ShelfIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="12" x="2" y="4" rx="2" />
        <rect width="20" height="12" x="2" y="14" rx="2" />
      </svg>
    );
  }

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
    [lastAddedItem, deletePantryItem],
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
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedInventory = isSorted
    ? [...filteredInventory].sort((a, b) => a.name.localeCompare(b.name))
    : filteredInventory;

  if (loading) {
    return <Loading />; // Show your loading component
  }

  if (isLoading) {
    return <Loading />; // Optionally handle the isLoading state
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-[#e2f5f3] w-full flex flex-col items-center justify-center p-5">
      {/* Title Section */}
      <UserHeader />

      {/* Content Section with Margin */}
      <div className="mt-2 w-full flex flex-col gap-4 max-w-xl px-4 mb-6">
        {" "}
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 bg-white h-10 px-4 rounded-lg text-sm focus:outline-none w-full"
        />
        <div className="flex flex-row justify-between w-full">
          <button
            onClick={handleOpen}
            className="bg-[#408d86] text-white py-2 px-4 rounded-lg hover:bg-[#2b5c58]"
          >
            Add Item
          </button>

          <button
            onClick={sortInventory}
            className="bg-[#408d86] text-white py-2 px-4 rounded-lg hover:bg-[#2b5c58]"
          >
            {isSorted ? "Unsort" : "Sort A-Z"}
          </button>
        </div>
      </div>

      {/* Inventory Items Section */}
      <div className="w-full max-w-5xl p-5 rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Inventory</h2>

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white table-auto border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left text-xs md:text-sm lg:text-base font-semibold text-gray-800">
                  Item Name
                </th>
                <th className="px-4 py-2 border-b text-left text-xs md:text-sm lg:text-base font-semibold text-gray-800">
                  Quantity
                </th>
                <th className="px-4 py-2 border-b text-center text-xs md:text-sm lg:text-base font-semibold text-gray-800">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedInventory.map((item) => (
                <tr key={item.id} className="bg-gray-50 hover:bg-gray-100">
                  {/* Item Name */}
                  <td className="px-4 py-3 border-b text-gray-800 capitalize text-xs md:text-sm lg:text-base">
                    {item.name}
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-3 border-b text-gray-600">
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-[#408d86] text-white py-1 px-2 rounded-lg hover:bg-[#2b5c58]"
                        onClick={() =>
                          updateItemQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                      <span className="text-gray-800">{item.quantity}</span>
                      <button
                        className="bg-gray-300 text-gray-600 py-1 px-2 rounded-lg hover:bg-red-500 hover:text-white"
                        onClick={() =>
                          updateItemQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity === 0}
                      >
                        -
                      </button>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 border-b text-center">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                      <button
                        className=" text-blue-500 p-2 rounded-lg flex items-center justify-center"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className=" text-red-500 p-2 rounded-lg flex items-center justify-center"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        {/* Messages */}
        {sortedMessageShown && (
          <div className="mt-4 text-center text-green-600">
            {isSorted ? "Sorted A-Z" : "Unsorted"}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
