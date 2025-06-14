"use client";

import { useEffect, useState } from "react";
import Accordion from "./Accordion";

interface Challenge {
  id: string;
  name: string;
  progress_total: number;
}

interface ChallengeBundle {
    id: string;
    name: string;
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
      {challengesData && (
        <div>
          {challengesData.bundles?.map((bundle) => (
            <div key={bundle.id} className="mb-4 text-white">
              <h3 className="text-xl font-bold">{bundle.name}</h3>
              <ul>
                {bundle.quests.map((quest) => (
                  <li key={quest.id}>- {quest.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Accordion>
  );
} 