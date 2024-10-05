"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import InventoryList from "../components/InventoryList";
import usePantry from "../hooks/usePantry";

```
/**
 * Renders the Inventory page component
 * @returns {JSX.Element|null} The rendered Inventory page or null if user is not authenticated
 */

```export default function InventoryPage() {
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const {
    items,
    error,
    addPantryItem,
    updateItemQuantity,
    editPantryItem,
    deletePantryItem,
  } = usePantry(userId);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        router.push("/page");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!userId) {
    return null;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <InventoryList
      items={items}
      updateItemQuantity={updateItemQuantity}
      editItem={editPantryItem}
      deleteItem={deletePantryItem}
      addPantryItem={addPantryItem}
    />
  );
}
