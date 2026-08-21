"use client";

import Link from "next/link";

const serif = { fontFamily: "'Bodoni Moda', serif" };
const sans = { fontFamily: "'Hanken Grotesk', sans-serif" };
const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const heading = { ...mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#8C877E" };
const link = { ...sans, fontSize: 14, color: "#5B5650", textDecoration: "none", transition: "color 0.2s" };

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how" },
      { label: "The algorithm", href: "#features" },
      { label: "Your looks", href: "#discover" },
      { label: "Try the demo", href: "/try" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Log in", href: "/login" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: "#EFEAE1", borderTop: "1px solid rgba(23,20,15,0.07)", padding: "72px 56px 0" }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 48,
        paddingBottom: 56,
      }}>
        <div>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <img src="/logo.png" alt="Atelier AI" style={{ width: 34, height: 34, objectFit: "contain" }} />
            <span style={{ ...serif, fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", color: "#17140F" }}>
              Atelier AI
            </span>
          </Link>
          <p style={{ ...sans, fontSize: 14, lineHeight: 1.7, color: "#8C877E", maxWidth: 280, margin: "16px 0 0" }}>
            Your everyday AI wardrobe stylist — outfits picked from what you already own, matched to the occasion and the weather.
          </p>
        </div>

        {columns.map(col => (
          <div key={col.title}>
            <span style={{ ...heading, display: "block", marginBottom: 18 }}>{col.title}</span>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {col.links.map(l => (
                <li key={l.label}>
                  <Link href={l.href} style={link}
                    onMouseEnter={e => (e.currentTarget.style.color = "#17140F")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#5B5650")}
                  >{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid rgba(23,20,15,0.07)" }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          padding: "24px 0",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 12,
        }}>
          <p style={{ ...sans, fontSize: 13, color: "#8C877E", margin: 0 }}>
            Atelier AI © 2026 — outfits generated from your own wardrobe.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms"].map(l => (
              <a key={l} href="#" style={{ ...mono, fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8C877E", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}