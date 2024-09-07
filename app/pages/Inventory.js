// pages/inventory.js

import InventoryList from '../components/InventoryList';

export async function getServerSideProps() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_FIREBASE_API_URL}/api/inventory`);
    const inventory = await res.json();

    return { props: { inventory } };
}

export default function InventoryPage({ inventory }) {
    return <InventoryList inventory={inventory} />;
}
