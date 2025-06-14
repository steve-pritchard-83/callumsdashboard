import { NextResponse } from "next/server";

export async function GET() {
  const username = "jamsyfv"; // Should be from process.env.NEXT_PUBLIC_FORTNITE_USERNAME

  // IMPORTANT: Move this key to a .env.local file
  const apiKey = process.env.FORTNITE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Fortnite API key not found" },
      { status: 500 }
    );
  }

  try {
    // Step 1: Look up the account ID
    const lookupResponse = await fetch(
      `https://fortniteapi.io/v1/lookup?username=${username}`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!lookupResponse.ok) {
      const errorData = await lookupResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: `Failed to look up user: ${errorData.message || lookupResponse.statusText}` },
        { status: lookupResponse.status }
      );
    }
    
    const lookupData = await lookupResponse.json();
    if (!lookupData.result) {
        return NextResponse.json(
            { error: `User not found: ${username}` },
            { status: 404 }
        );
    }
    const accountId = lookupData.account_id;

    // Step 2: Fetch the stats using the account ID
    const statsResponse = await fetch(
      `https://fortniteapi.io/v1/stats?account=${accountId}`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!statsResponse.ok) {
       const errorData = await statsResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: `Failed to fetch stats: ${errorData.message || statsResponse.statusText}` },
        { status: statsResponse.status }
      );
    }

    const statsData = await statsResponse.json();
    
    // Remap the new API response to the format the frontend expects
    const solo = statsData.global_stats.solo;
    const duo = statsData.global_stats.duo;
    const squad = statsData.global_stats.squad;

    const totalWins = (solo?.placetop1 ?? 0) + (duo?.placetop1 ?? 0) + (squad?.placetop1 ?? 0);
    const totalKills = (solo?.kills ?? 0) + (duo?.kills ?? 0) + (squad?.kills ?? 0);
    const totalMatches = (solo?.matchesplayed ?? 0) + (duo?.matchesplayed ?? 0) + (squad?.matchesplayed ?? 0);

    // Assuming deaths = matches played - wins for Battle Royale
    const totalDeaths = totalMatches - totalWins;

    const winPercentage = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(2) : "0.00";
    const kdRatio = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : "0.00";

    const lifeTimeStats = [
        { key: "Wins", value: totalWins },
        { key: "Win%", value: `${winPercentage}%` },
        { key: "Kills", value: totalKills },
        { key: "K/d", value: kdRatio },
    ];

    const finalResponse = {
        epicUserHandle: statsData.name,
        lifeTimeStats: lifeTimeStats,
    };

    return NextResponse.json(finalResponse);

  } catch (error: any) {
    console.error("Error fetching Fortnite stats:", error);
    if (error.cause && error.cause.code === 'ENOTFOUND') {
      return NextResponse.json(
        { error: `DNS lookup failed. Please check your network connection.` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 