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
  section: {
    name: string;
  };
}

interface ShopData {
  daily: ShopItem[];
  featured: ShopItem[];
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
        console.log("Shop data received in component:", data);
        if (data && data.shop) {
          const dailyItems = data.shop.filter(
            (item: ShopItem) => item.section && item.section.name === 'Daily'
          );
          const featuredItems = data.shop.filter(
            (item: ShopItem) => item.section && item.section.name === 'Featured'
          );
          setShopData({ daily: dailyItems, featured: featuredItems });
        } else {
          setShopData({ daily: [], featured: [] });
        }
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
          {shopData.daily && shopData.daily.length > 0 ? (
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Daily</h3>
              {shopData.daily.map((item) => (
                <div key={item.mainId} className="text-white">
                  <img src={item.displayAssets[0].url} alt={item.displayName} className="w-24 h-24" />
                  <p>{item.displayName}</p>
                  <p>{item.price.finalPrice} V-Bucks</p>
                </div>
              ))}
            </div>
          ) : <p className="text-white">No daily items available.</p>}
          {shopData.featured && shopData.featured.length > 0 ? (
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Featured</h3>
              {shopData.featured.map((item) => (
                <div key={item.mainId} className="text-white">
                  <img src={item.displayAssets[0].url} alt={item.displayName} className="w-24 h-24" />
                  <p>{item.displayName}</p>
                  <p>{item.price.finalPrice} V-Bucks</p>
                </div>
              ))}
            </div>
          ) : <p className="text-white">No featured items available.</p>}
        </div>
      )}
    </Accordion>
  );
} 