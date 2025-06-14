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

interface Match {
  id: number;
  kills: number;
  matches: number;
  playlist: string;
  score: number;
  top1: number;
  top3: number;
  top5: number;
  top6: number;
  top10: number;
  top12: number;
  top25: number;
  dateCollected: string;
  minutesPlayed: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [matches, setMatches] = useState<Match[]>([]);
  const [matchesError, setMatchesError] = useState<string | null>(null);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);

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

        setPlayerName(data.epicUserHandle);
        const relevantStats = data.lifeTimeStats.filter((stat: LifeTimeStat) =>
          ["Wins", "Win%", "Kills", "K/d"].includes(stat.key)
        );
        setStats(relevantStats.map((stat: LifeTimeStat) => ({ label: stat.key, value: stat.value })));
      } catch (err: any) {
        if (err.message.includes('fetch failed')) {
          setError("Network error. Please check your connection or try again later.");
        } else {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("/api/matches");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Failed to fetch matches" }));
          throw new Error(errorData.error || `Failed to fetch matches: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setMatches(data.matches);
      } catch (err: any) {
        setMatchesError(err.message);
      } finally {
        setIsLoadingMatches(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-cover bg-center bg-fixed"
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

      <div className="w-full max-w-4xl mt-8">
            <h2 className="text-3xl font-bold text-white text-center mb-4">Recent Games</h2>
            <div className="glassmorphism p-6 rounded-xl shadow-lg">
                {isLoadingMatches ? (
                  <p className="text-white text-center">Loading recent games...</p>
                ) : matchesError ? (
                  <p className="text-red-400 text-center">{matchesError}</p>
                ) : matches.length > 0 ? (
                  <ul className="space-y-4">
                    {matches.map((match) => (
                      <li key={match.id} className="p-4 bg-white/10 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-bold text-lg text-white">{match.playlist}</p>
                          <p className="text-sm text-gray-300">{new Date(match.dateCollected).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-white">Kills: {match.kills}</p>
                            <p className="text-white">Placement: {
                                match.top1 ? 'Victory Royale!' :
                                match.top3 ? 'Top 3' :
                                match.top5 ? 'Top 5' :
                                match.top6 ? 'Top 6' :
                                match.top10 ? 'Top 10' :
                                match.top12 ? 'Top 12' :
                                match.top25 ? 'Top 25' : 'N/A'
                            }</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white text-center">No recent games found.</p>
                )}
            </div>
        </div>
    </main>
  );
}
