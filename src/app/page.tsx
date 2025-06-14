"use client";

import { useEffect, useState } from "react";

interface Stat {
  label: string;
  value: string | number;
  rank?: number;
}

interface LifeTimeStat {
  key: string;
  value: string;
}

export default function Home() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setPlayerName(data.epicUserHandle);
        const relevantStats = data.lifeTimeStats.filter((stat: LifeTimeStat) =>
          ["Wins", "Win%", "Kills", "K/d"].includes(stat.key)
        );
        setStats(relevantStats.map((stat: LifeTimeStat) => ({ label: stat.key, value: stat.value })));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-8 bg-cover bg-center"
      style={{ backgroundImage: "url('/fortnite-background.jpg')" }} // Placeholder background
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          {playerName ? `${playerName}'s Stats` : "Fortnite Stats"}
        </h1>

        {isLoading && <p className="text-white text-center">Loading stats...</p>}
        {error && <p className="text-red-400 text-center">Error: {error}</p>}
        
        {!isLoading && !error && (
          <div className="grid grid-cols-2 gap-4 text-white">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-black/20 p-4 rounded-lg text-center">
                <p className="text-lg font-semibold">{stat.label}</p>
                <p className="text-2xl">{stat.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
