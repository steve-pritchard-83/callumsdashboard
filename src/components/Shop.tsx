"use client";

import { useEffect, useState } from "react";
import Accordion from "./Accordion";

interface ShopItem {
  id: string;
  name: string;
  price: number;
  images: {
    icon: string;
  };
}

interface ShopData {
  daily: {
    entries: ShopItem[];
  };
  featured: {
    entries: ShopItem[];
  };
}

export default function Shop() {
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch("/api/shop");
        if (!res.ok) throw new Error("Failed to fetch shop data");
        const data = await res.json();
        setShopData(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchShop();
  }, []);

  return (
    <Accordion title="Item Shop">
      {error && <p className="text-red-500">{error}</p>}
      {shopData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Daily</h3>
            {shopData.daily.entries.map((item) => (
              <div key={item.id} className="text-white">
                <img src={item.images.icon} alt={item.name} className="w-24 h-24" />
                <p>{item.name}</p>
                <p>{item.price} V-Bucks</p>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Featured</h3>
            {shopData.featured.entries.map((item) => (
              <div key={item.id} className="text-white">
                <img src={item.images.icon} alt={item.name} className="w-24 h-24" />
                <p>{item.name}</p>
                <p>{item.price} V-Bucks</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Accordion>
  );
} 