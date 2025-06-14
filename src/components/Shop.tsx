"use client";

import { useEffect, useState } from "react";
import Accordion from "./Accordion";

interface ShopItem {
  mainId: string;
  displayName: string;
  price: {
    finalPrice: number;
  };
  displayAssets: {
    url: string;
  }[];
}

interface ShopData {
  shop: ShopItem[];
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
      {shopData && shopData.shop && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {shopData.shop.length > 0 ? (
            shopData.shop.map((item) => (
              <div key={item.mainId} className="text-white">
                {item.displayAssets && item.displayAssets.length > 0 && (
                  <img src={item.displayAssets[0].url} alt={item.displayName} className="w-full" />
                )}
                <p className="font-bold">{item.displayName}</p>
                <p>{item.price.finalPrice} V-Bucks</p>
              </div>
            ))
          ) : (
            <p className="text-white col-span-full">The item shop is currently empty.</p>
          )}
        </div>
      )}
    </Accordion>
  );
} 