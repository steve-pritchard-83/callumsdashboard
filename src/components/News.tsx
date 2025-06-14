"use client";

import { useEffect, useState } from "react";
import Accordion from "./Accordion";

interface NewsItem {
  title: string;
  body: string;
  image: string;
}

interface NewsData {
  br: {
    motds: NewsItem[];
  };
}

export default function News() {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();
        console.log("News data received in component:", data);
        setNewsData(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchNews();
  }, []);

  return (
    <Accordion title="Game News">
      {error && <p className="text-red-500">{error}</p>}
      {newsData && newsData.br && (
        <div>
          {newsData.br.motds.map((item, index) => (
            <div key={index} className="mb-4 text-white">
              <img src={item.image} alt={item.title} className="w-full" />
              <h3 className="text-xl font-bold mt-2">{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      )}
    </Accordion>
  );
} 