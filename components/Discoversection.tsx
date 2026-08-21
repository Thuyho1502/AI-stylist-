"use client";

import Link from "next/link";

const T = { cream: "#F7F3EC", dark: "#17140F", light: "#EFEAE1", border: "rgba(23,20,15,0.08)", muted: "#8C877E", gold: "#C9A84C" };
const serif = { fontFamily: "'Bodoni Moda', serif" };
const sans = { fontFamily: "'Hanken Grotesk', sans-serif" };
const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const lbl = { ...mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const };

const cards = [
  { img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=85", cat: "Weekend casual", catColor: "#c9a84c", name: "Sunday Morning Knit" },
  { img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=85", cat: "Evening", catColor: "#6b8cba", name: "Midnight Silk Elegance" },
  { img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=85", cat: "Office", catColor: T.muted, name: "Modern Executive" },
];

export default function DiscoverSection() {
  return (
    <section id="discover" style={{ background: T.cream, padding: "0 56px 112px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `1px solid ${T.border}`, paddingBottom: 20, marginBottom: 48 }}>
          <div>
            <span style={{ ...lbl, color: T.muted, display: "block", marginBottom: 8 }}>Your looks</span>
            <h2 style={{ ...serif, fontSize: "clamp(28px,3vw,40px)", fontWeight: 700, color: T.dark, margin: 0 }}>Outfits you've already saved</h2>
          </div>
          <Link href="/try" style={{ ...lbl, fontSize: 10, color: T.dark, textDecoration: "none", borderBottom: `1px solid ${T.dark}`, paddingBottom: 2 }}>Try it yourself →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28 }}>
          {cards.map(c => (
            <div key={c.name} style={{ cursor: "pointer" }}>
              <div style={{ borderRadius: 18, overflow: "hidden", aspectRatio: "1", background: T.light, marginBottom: 16 }}>
                <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)" }}
                  onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = "scale(1.05)")}
                  onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = "scale(1)")}
                />
              </div>
              <span style={{ ...lbl, fontSize: 9, color: c.catColor, display: "block", marginBottom: 5 }}>{c.cat}</span>
              <span style={{ ...serif, fontSize: 20, fontWeight: 600, color: T.dark }}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}