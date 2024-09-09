'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebase';
import InventoryList from '../components/InventoryList';
import usePantry from '../hooks/usePantry';
import { db } from '../firebase';

export default function InventoryPage() {
    const [userId, setUserId] = useState(null);
    const router = useRouter();
    const { items, loading, error, addPantryItem, updateItemQuantity, removeItem } = usePantry(userId);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                router.push('/page');
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (!userId || loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <InventoryList
            items={items}
            updateItemQuantity={updateItemQuantity}
            removeItem={removeItem}
            addPantryItem={addPantryItem}
        />
    );
}