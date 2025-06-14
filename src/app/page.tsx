"use client";

import { useState, FormEvent } from "react";
import Shop from "@/components/Shop";
import News from "@/components/News";
import Challenges from "@/components/Challenges";
import BattlePass from "@/components/BattlePass";

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
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async (e: FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError("Please enter a username.");
      return;
    }
    
    setIsLoading(true);
    setStats([]);
    setError(null);
    setPlayerName("");

    try {
      const response = await fetch(`/api/stats?username=${username}`);
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

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/fortnite-background.jpg')" }} // Placeholder background
    >
      <div className="glassmorphism p-6 md:p-10 rounded-xl shadow-lg w-full max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          Fortnite Stats Finder
        </h1>
        
        <form onSubmit={fetchStats} className="flex justify-center items-center gap-2 mb-6">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Epic Games username"
            className="p-2 rounded-md bg-white/20 text-white placeholder-gray-300 border-none focus:ring-2 focus:ring-white/50 w-full max-w-xs"
          />
          <button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500">
            {isLoading ? "..." : "Search"}
          </button>
        </form>

        {playerName && (
          <h2 className="text-3xl font-bold text-white text-center mb-4">{playerName}&apos;s Stats</h2>
        )}

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
          <p className="text-white text-center">Enter a username to search for their stats.</p>
        )}

        <div className="mt-8 w-full">
            <Shop />
            <News />
            <Challenges />
            <BattlePass />
        </div>
      </div>
    </main>
  );
}
