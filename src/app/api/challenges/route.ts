import { NextResponse } from "next/server";

export async function GET() {
  // IMPORTANT: Move this key to a .env.local file
  const apiKey = process.env.FORTNITE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Fortnite API key not found" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      "https://fortniteapi.io/v3/challenges?season=current&lang=en",
      {
        headers: {
          Authorization: apiKey,
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: `Failed to fetch challenges: ${errorData.message || response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching challenges:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
