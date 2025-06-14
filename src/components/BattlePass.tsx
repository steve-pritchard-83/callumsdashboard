"use client";

import { useEffect, useState } from "react";
import Accordion from "./Accordion";

interface Reward {
  item: {
    name: string;
    images: {
      icon: string;
    };
  };
}

interface BattlePassData {
  rewards: Reward[];
}

export default function BattlePass() {
  const [bpData, setBpData] = useState<BattlePassData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBP = async () => {
      try {
        const res = await fetch("/api/battlepass");
        if (!res.ok) throw new Error("Failed to fetch Battle Pass data");
        const data = await res.json();
        setBpData(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchBP();
  }, []);

  return (
    <Accordion title="Battle Pass Rewards">
      {error && <p className="text-red-500">{error}</p>}
      {bpData && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {bpData.rewards.map((reward, index) => (
            <div key={index} className="text-white text-center">
              <img
                src={reward.item.images.icon}
                alt={reward.item.name}
                className="w-24 h-24 mx-auto"
              />
              <p>{reward.item.name}</p>
            </div>
          ))}
        </div>
      )}
    </Accordion>
  );
} 