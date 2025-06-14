import { NextResponse } from "next/server";

export async function GET() {
  const username = "jamsyfv"; // Should be from process.env.NEXT_PUBLIC_FORTNITE_USERNAME
  const platform = "pc"; // Should be from process.env.NEXT_PUBLIC_FORTNITE_PLATFORM

  // IMPORTANT: Move this key to a .env.local file
  const apiKey = "c1b231b6-228f-444a-811b-29ed1d341286";

  if (!apiKey) {
    return NextResponse.json(
      { error: "Fortnite API key not found" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.fortnitetracker.com/v1/profile/${platform}/${username}`,
      {
        headers: {
          "TRN-Api-Key": apiKey,
        },
      }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(
            { error: `Failed to fetch matches from Fortnite Tracker API: ${errorData.message || response.statusText}` },
            { status: response.status }
        );
    }

    const data = await response.json();

    if (!data.recentMatches || data.recentMatches.length === 0) {
        return NextResponse.json({ matches: [] });
    }

    // Return the last 10 matches
    const recentMatches = data.recentMatches.slice(0, 10);

    return NextResponse.json({ matches: recentMatches });

  } catch (error: any) {
    console.error("Error fetching Fortnite matches:", error);
    if (error.cause && error.cause.code === 'ENOTFOUND') {
      return NextResponse.json(
        { error: `DNS lookup failed for ${error.cause.hostname}. Please check your network connection.` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error fetching matches" },
      { status: 500 }
    );
  }
} 