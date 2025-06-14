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
      const errorData = await response.text();
      console.error("Fortnite API Error:", errorData);
      return NextResponse.json(
        { error: `Failed to fetch stats from Fortnite Tracker API: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Fortnite stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 