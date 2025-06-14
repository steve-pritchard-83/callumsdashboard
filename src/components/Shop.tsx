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
  shop: ShopItem[];
}

export default function Shop() {
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch("/api/shop");
        if (!res.ok) throw new Error("Failed to fetch shop data");
        const data: ShopData = await res.json();
        setShopData(data);

        if (data && data.shop) {
          const categories = [...new Set(data.shop.map(item => item.section.name).filter(Boolean))];
          setAvailableCategories(categories);
          setSelectedCategories([]); // Select none by default
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchShop();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredShop = shopData?.shop?.filter(item =>
    selectedCategories.includes(item.section.name)
  ) || [];

  return (
    <Accordion title="Item Shop">
      {error && <p className="text-red-500">{error}</p>}

      <div className="p-4 flex flex-wrap gap-x-4 gap-y-2">
        {availableCategories.map(category => (
          <div key={category} className="flex items-center">
            <input
              type="checkbox"
              id={category}
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor={category} className="ml-2 block text-sm text-white">{category}</label>
          </div>
        ))}
      </div>

      {shopData && shopData.shop && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {filteredShop.length > 0 ? (
            filteredShop.map((item) => (
              <div key={item.mainId} className="text-white">
                {item.displayAssets && item.displayAssets.length > 0 && (
                  <img src={item.displayAssets[0].url} alt={item.displayName} className="w-full" />
                )}
                <p className="font-bold">{item.displayName}</p>
                <p>{item.price.finalPrice} V-Bucks</p>
              </div>
            ))
          ) : (
            <p className="text-white col-span-full">No items found for the selected categories.</p>
          )}
        </div>
      )}
    </Accordion>
  );
} 