"use client";

import { useState } from "react";

export default function TryPage() {
  const [loading, setLoading] = useState(false);
  const [outfit, setOutfit] = useState<string[]>([]);

  const handleTry = async () => {
    setLoading(true);

    const res = await fetch("/api/generate-outfit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        weather: "cold",
        occasion: "casual",
      }),
    });

    const data = await res.json();
    setOutfit(data.outfit);

    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>AI Outfit Generator</h2>

      <button onClick={handleTry}>
        Generate Outfit
      </button>

      {loading && <p>Generating...</p>}

      {outfit.length > 0 && (
        <ul>
          {outfit.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}