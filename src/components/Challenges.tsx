"use client";

import { useEffect, useState } from "react";
import Accordion from "./Accordion";

interface Challenge {
  id: string;
  name: string;
  progress_total: number;
  reward: {
    name: string;
    value: number;
  }
}

interface ChallengeBundle {
    id: string;
    name: string;
    image: string;
    quests: Challenge[];
}

interface ChallengesData {
  bundles: ChallengeBundle[];
}

export default function Challenges() {
  const [challengesData, setChallengesData] = useState<ChallengesData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await fetch("/api/challenges");
        if (!res.ok) throw new Error("Failed to fetch challenges");
        const data = await res.json();
        setChallengesData(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchChallenges();
  }, []);

  return (
    <Accordion title="Weekly Challenges">
      {error && <p className="text-red-500">{error}</p>}
      {challengesData && challengesData.bundles ? (
        <div>
          {challengesData.bundles.length > 0 ? (
            challengesData.bundles.map((bundle) => (
              <div key={bundle.id} className="mb-4 text-white">
                <h3 className="text-xl font-bold">{bundle.name}</h3>
                <img src={bundle.image} alt={bundle.name} className="w-full my-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {bundle.quests.map((quest) => (
                    <div key={quest.id} className="p-2 bg-gray-800 rounded">
                      <p className="font-semibold">{quest.name}</p>
                      <p>Reward: {quest.reward.value} {quest.reward.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">No weekly challenges available at the moment.</p>
          )}
        </div>
      ) : (
        <p className="text-white">Loading challenges...</p>
      )}
    </Accordion>
  );
} 