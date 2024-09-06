import { useState, useEffect } from 'react';
import { getPantryItems, addPantryItem, updateItemQuantity, removeItem } from '../components/InventoryList';

const usePantry = (userId) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const fetchedItems = await getPantry(userId);
                setItems(fetchedItems);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [userId]);

    const handleAddItem = async (itemName, quantity) => {
        try {
            await addPantryItem(userId, itemName, quantity);
            setItems(prevItems => [...prevItems, { name: itemName, quantity }]);
        } catch (err) {
            setError(err);
        }
    };

    const handleUpdateItem = async (itemName, quantity) => {
        try {
            await updateItemQuantity(userId, itemName, quantity);
            setItems(prevItems =>
                prevItems.map(item =>
                    item.name === itemName ? { ...item, quantity } : item
                )
            );
        } catch (err) {
            setError(err);
        }
    };

    const handleRemoveItem = async (itemName) => {
        try {
            await removeItem(userId, itemName);
            setItems(prevItems => prevItems.filter(item => item.name !== itemName));
        } catch (err) {
            setError(err);
        }
    };

    return {
        items,
        loading,
        error,
        addPantryItem: handleAddItem,
        updateItemQuantity: handleUpdateItem,
        removeItem: handleRemoveItem
    };
};

export default usePantry;
