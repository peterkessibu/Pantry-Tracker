'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { deleteDoc, doc } from 'firebase/firestore';
import dynamic from 'next/dynamic';
import debounce from 'lodash/debounce';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import InventoryList from '../components/InventoryList';
import MessagePopup from '../components/MessagePopup';
import useAuth from '../hooks/useAuth';
import usePantry from '../hooks/usePantry';

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
    const { user } = useAuth();
    const { addPantryItem, getPantryItems } = usePantry(user?.uid);

    const router = useRouter();

    // Fetch inventory items on component load
    useEffect(() => {
        if (user) {
            const fetchInventory = async () => {
                try {
                    const items = await getPantryItems(user.uid);
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

    // Add new item to Firestore and update UI
    const addItem = useCallback(async () => {
        if (!itemName || !itemQuantity || !user) return; // Ensure all required fields are present
        try {
            const docRef = await addPantryItem(user.uid, itemName, parseInt(itemQuantity));
            setInventory(prev => [
                ...prev,
                { id: docRef.id, name: itemName, quantity: parseInt(itemQuantity) }  // Use docRef.id here
            ]);
            setLastAddedItem(itemName); // Track last added item
            setItemName('');  // Reset form
            setItemQuantity('');
            setOpen(false);   // Close modal
        } catch (error) {
            console.error('Error adding item:', error);
        }
    }, [itemName, itemQuantity, user]);


    // Remove item from Firestore
    const removeItem = useCallback(async (itemId) => {
        try {
            const docRef = doc(db, 'users', user?.uid || '', 'inventory', itemId);
            await deleteDoc(docRef);
            setInventory(prev => prev.filter(item => item.id !== itemId)); // Remove from UI
            if (itemId === lastAddedItem) {
                setLastAddedItem(null); // Reset last added item if removed
            }
        } catch (error) {
            console.error("Error removing item: ", error);
        }
    }, [lastAddedItem, user]);

    // Sort items alphabetically
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

    // Handle message popup close
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
