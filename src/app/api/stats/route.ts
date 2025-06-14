import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');
  
  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://fortnitetracker.com/profile/all/${username}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const playerName = $('span.trn-profile-header__name').first().text().trim();

    if (!playerName) {
        return NextResponse.json(
            { error: `User not found: ${username}` },
            { status: 404 }
        );
    }
    
    const lifeTimeStats = [] as { key: string; value: string }[];
    
    // Find the stats container and extract each stat
    $('.main .numbers').each((i, el) => {
        const key = $(el).find('.name').text().trim();
        const value = $(el).find('.value').text().trim();
        
        if (key && value) {
            // We only care about these specific stats for the main display
            if (['Wins', 'Win %', 'Kills', 'K/D'].includes(key)) {
                 lifeTimeStats.push({ key, value });
            }
        }
    });

    if (lifeTimeStats.length === 0) {
        // This could happen if the layout changes or if the user has no stats
        return NextResponse.json(
            { error: `Could not find stats for ${username}. The profile might be private or the website layout may have changed.` },
            { status: 404 }
        );
    }
    
    // The old API returned K/d, the website uses K/D. Let's make it consistent.
    const finalLifeTimeStats = lifeTimeStats.map(stat => {
        if (stat.key === 'K/D') {
            return { ...stat, key: 'K/d' };
        }
        return stat;
    });

    const finalResponse = {
        epicUserHandle: playerName,
        lifeTimeStats: finalLifeTimeStats,
    };

    return NextResponse.json(finalResponse);

  } catch (error: any) {
    console.error("Error scraping Fortnite stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error during scraping" },
      { status: 500 }
    );
  }
} 