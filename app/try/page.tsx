"use client";

import { useState } from "react";

export default function TryPage() {
  const [loading, setLoading] = useState(false);
  const [outfit, setOutfit] = useState<string[]>([]);
  const [weather, setWeather] = useState("cold");
const [occasion, setOccasion] = useState("casual");
const [style, setStyle] = useState("minimal");

  const handleTry = async () => {
    setLoading(true);

    const res = await fetch("/api/generate-outfit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        weather,
        occasion,
        style,
        }),
    });

    const data = await res.json();
    setOutfit(data.outfit);

    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>AI Outfit Generator</h2>
      <div style={{ marginBottom: 20 }}>
  <label>Weather</label>
  <br />
  <select
    value={weather}
    onChange={(e) => setWeather(e.target.value)}
  >
    <option value="cold">Cold</option>
    <option value="warm">Warm</option>
    <option value="hot">Hot</option>
  </select>
</div>

<div style={{ marginBottom: 20 }}>
  <label>Occasion</label>
  <br />
  <select
    value={occasion}
    onChange={(e) => setOccasion(e.target.value)}
  >
    <option value="casual">Casual</option>
    <option value="work">Work</option>
    <option value="party">Party</option>
  </select>
</div>

<div style={{ marginBottom: 20 }}>
  <label>Style</label>
  <br />
  <select
    value={style}
    onChange={(e) => setStyle(e.target.value)}
  >
    <option value="minimal">Minimal</option>
    <option value="streetwear">Streetwear</option>
    <option value="smart">Smart Casual</option>
  </select>
</div>

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