'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import dynamic from 'next/dynamic';
import debounce from 'lodash/debounce';
import SearchBar from '../components/SearchBar';
import InventoryList from '../components/InventoryList';
import MessagePopup from '../components/MessagePopup';
import Navbar from '../components/NavBar';
import useAuth from '../hooks/useAuth';
import usePantry from '../hooks/usePantry';


const AddEditItemModal = dynamic(() => import('../components/AddEditItemModal'));

const Page = () => {
    const [inventory, setInventory] = useState([]);
    const [open, setOpen] = useState(false);
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [message, setMessage] = useState('');
    const [messageOpen, setMessageOpen] = useState(false);
    const { user } = useAuth();
    const { addPantryItem, getPantryItems, updateItemQuantity, removeItem } = usePantry(user?.uid);

    const router = useRouter();

    // Fetch inventory items on component load
        useEffect(() => {
            if (user) {
                const fetchInventory = async () => {
                    try {
                        const items = getPantryItems();  // No need to await, it's now a local state function
                        setInventory(items);
                        setIsSorted(false);
                        setSortedMessageShown(false);
                    } catch (error) {
                        console.error("Error fetching pantry items: ", error);
                    }
                };

                fetchInventory();
            }
        }, [user, getPantryItems]);

    // Open modal for adding new item
    const handleOpen = () => {
        setEditMode(false);
        setOpen(true);
    };

    // Close the modal and reset fields
    const handleClose = () => {
        setOpen(false);
        setItemName('');
        setItemQuantity('');
    };

    const addItem = async () => {
        if (!itemName || !itemQuantity) return;
        try {
            await addPantryItem(itemName, parseInt(itemQuantity));
            handleClose();
        } catch (error) {
            console.error("Error adding item: ", error);
        }
    };

    // Handle item removal
    const removeInventoryItem = async (item) => {
        try {
            await removeItem(item.id);
        } catch (error) {
            console.error("Error removing item: ", error);
        }
    };

    // Sort items alphabetically
    const sortItems = () => {
        const sortedInventory = [...inventory].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
        setInventory(sortedInventory);
        setMessage('Inventory sorted alphabetically.');
        setMessageOpen(true);
    };

    // Handle message popup close
    const handleMessageClose = () => {
        setMessageOpen(false);
    };

    const debouncedSetSearchQuery = useMemo(
        () => debounce((query) => setSearchQuery(query), 300),
        []
    );

    const filteredInventory = inventory.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (item) => {
        setEditMode(true);
        setEditingItem(item);
        setItemName(item.name);
        setItemQuantity(item.quantity.toString());
        setOpen(true);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-4 mt-5">
            <Navbar />
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={debouncedSetSearchQuery}
                onAddClick={handleOpen}
                onSortClick={sortItems}
            />
            {open && (
                <AddEditItemModal
                    open={open}
                    itemName={itemName}
                    setItemName={setItemName}
                    itemQuantity={itemQuantity}
                    setItemQuantity={setItemQuantity}
                    editMode={editMode}
                    addItem={addItem}
                    handleClose={handleClose}
                />
            )}
            {messageOpen && <MessagePopup message={message} onClose={handleMessageClose} />}
            {filteredInventory.length > 0 ? (
                <InventoryList
                    items={filteredInventory}
                    updateItemQuantity={updateItemQuantity}
                    removeItem={removeInventoryItem}
                    handleEdit={handleEdit}
                />
            ) : (
                <p className="text-gray-500">No items found. Add new items to your inventory.</p>
            )}
        </div>
    );
};

export default Page;
