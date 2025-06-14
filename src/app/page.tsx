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
           const errorData = await response.json().catch(() => ({ error: "Failed to fetch stats" }));
           throw new Error(errorData.error || `Failed to fetch stats: ${response.statusText}`);
        }
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        const lifetimeStats: LifeTimeStat[] = data.lifeTimeStats;
        const mappedStats: Stat[] = lifetimeStats.map((stat) => ({
          label: stat.key,
          value: stat.value,
        }));

        setPlayerName(data.epicUserHandle);
        setStats(mappedStats);
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
      className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/fortnite-background.jpg')" }} // Placeholder background
    >
      <div className="glassmorphism p-6 md:p-10 rounded-xl shadow-lg w-full max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          {playerName ? `${playerName}'s Stats` : "Fortnite Stats"}
        </h1>
        {isLoading ? (
          <p className="text-white text-center">Loading stats...</p>
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : stats.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="p-4 bg-white/10 rounded-lg">
                <p className="text-lg font-semibold text-gray-300">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white text-center">No stats found.</p>
        )}
      </div>
    </main>
  );
}
