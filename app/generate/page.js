'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
import SearchBar from '../components/SearchBar';
import InventoryList from '../components/InventoryList';
import MessagePopup from '../components/MessagePopup';
import Navbar from '../components/NavBar';
import useAuth from '../hooks/useAuth';
import usePantry from '../hooks/usePantry';

const Page = () => {
    const [inventory, setInventory] = useState([]);
    const [open, setOpen] = useState(false);
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    const [messageOpen, setMessageOpen] = useState(false);
    const { user } = useAuth();
    const { addPantryItem, getPantryItems, updateItemQuantity } = usePantry(user?.uid);

    // Fetch inventory items on component load
    useEffect(() => {
        if (user) {
            const fetchInventory = async () => {
                try {
                    const items = await getPantryItems();
                    setInventory(items);
                } catch (error) {
                    console.error("Error fetching pantry items: ", error);
                }
            };

            fetchInventory();
        }
    }, [user, getPantryItems]);

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

    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-4 mt-5">
            <Navbar />
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={debouncedSetSearchQuery}
                onSortClick={sortItems}
            />
            {messageOpen && <MessagePopup message={message} onClose={handleMessageClose} />}
            {filteredInventory.length > 0 ? (
                <InventoryList
                    items={filteredInventory}
                    addPantryItem={addPantryItem}
                    updateItemQuantity={updateItemQuantity}
                />
            ) : (
                <p className="text-gray-500">No items found. Add new items to your inventory.</p>
            )}
        </div>
    );
};

export default Page;
