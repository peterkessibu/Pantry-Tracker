'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../firebase';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import dynamic from 'next/dynamic';
import debounce from 'lodash/debounce';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import InventoryList from '../components/InventoryList';
import MessagePopup from '../components/MessagePopup';
import useAuth from '../hooks/useAuth'; // Correct import of useAuth

const AddEditItemModal = dynamic(() => import('../components/AddEditItemModal'));

const Page = () => {
    const [inventory, setInventory] = useState([]);
    const [open, setOpen] = useState(false);
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSorted, setIsSorted] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [lastAddedItem, setLastAddedItem] = useState(null);
    const [sortedMessageShown, setSortedMessageShown] = useState(false);
    const [message, setMessage] = useState('');
    const [messageOpen, setMessageOpen] = useState(false);
    const { user } = useAuth(); // Now calling the hook inside the component

    const router = useRouter();

    useEffect(() => {
        if (user) {
            const fetchInventory = async () => {
                // Function to fetch user's inventory from Firestore
                const items = await getPantryItems(user.uid);
                setInventory(items);
                setIsSorted(false);
                setSortedMessageShown(false);
            };

            fetchInventory();
        }
    }, [user]);

    const handleOpen = () => {
        setEditMode(false);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setItemName('');
        setItemQuantity('');
    };

    const addItem = useCallback(async () => {
        if (!itemName || !itemQuantity || !user) return;
        try {
            await addPantryItem(user.uid, itemName, parseInt(itemQuantity)); // Add item to the user's pantry
            setLastAddedItem(itemName); // Track last added item
            setItemName('');
            setItemQuantity('');
            setEditMode(false);
            setEditingItem(null);
            handleClose();
        } catch (error) {
            console.error("Error adding/editing item: ", error);
        }
    }, [itemName, itemQuantity, user]);

    const removeItem = useCallback(async (itemId) => {
        try {
            const docRef = doc(db, 'users', user?.uid || '', 'inventory', itemId);
            await deleteDoc(docRef);
            if (itemId === lastAddedItem) {
                setLastAddedItem(null); // Reset last added item if removed
            }
        } catch (error) {
            console.error("Error removing item: ", error);
        }
    }, [lastAddedItem, user]);

    const updateItemQuantity = useCallback(async (itemName, newQuantity) => {
        try {
            const docRef = doc(db, 'users', user?.uid || '', 'inventory', itemName);
            await setDoc(docRef, { quantity: newQuantity }, { merge: true });
        } catch (error) {
            console.error("Error updating item quantity: ", error);
        }
    }, [user]);

    const sortItems = () => {
        const sortedInventory = [...inventory].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
        setInventory(sortedInventory);
        setIsSorted(true);
        setSortedMessageShown(true);
        setMessage('Inventory sorted alphabetically.');
        setMessageOpen(true);
    };

    const handleMessageClose = () => {
        setMessageOpen(false);
        setSortedMessageShown(false);
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

    const getTotalItems = () => inventory.length;

    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-4 mt-5">
            <Header title="ShelfSense" />
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
                    inventory={filteredInventory}
                    updateItemQuantity={updateItemQuantity}
                    removeItem={removeItem}
                    handleEdit={handleEdit}
                    getTotalItems={getTotalItems}
                />
            ) : (
                <p className="text-gray-500">No items found. Add new items to your inventory.</p>
            )}
        </div>
    );
};

export default Page;
