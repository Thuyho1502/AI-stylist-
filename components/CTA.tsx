"use client";

import Link from "next/link";

const serif = { fontFamily: "'Bodoni Moda', serif" };
const sans = { fontFamily: "'Hanken Grotesk', sans-serif" };

const mono = { fontFamily: "'IBM Plex Mono', monospace" };

export function CTA() {
  return (
    <section style={{ background: "#F7F3EC", padding: "96px 56px" }}>
      <div style={{
        maxWidth: 900, margin: "0 auto",
        background: "#17140F", borderRadius: 32,
        padding: "88px 56px", textAlign: "center",
        boxShadow: "0 24px 64px rgba(23,20,15,0.18)",
      }}>
        <span style={{
          ...mono, fontSize: 11, fontWeight: 500,
          letterSpacing: "0.16em", textTransform: "uppercase" as const,
          color: "rgba(255,255,255,0.55)",
          display: "inline-flex", alignItems: "center", gap: 8,
          marginBottom: 28,
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 999, padding: "6px 14px",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A84C" }} />
          Ready when you are
        </span>
        <h2 style={{ ...serif, fontSize: "clamp(40px,5.5vw,68px)", fontWeight: 700, lineHeight: 1.08, color: "#F7F3EC", letterSpacing: "-0.02em", margin: "0 0 20px" }}>
          A full closet,{" "}
          <em style={{ color: "#C9A84C", fontStyle: "italic" }}>nothing to wear?</em>
        </h2>
        <p style={{ ...sans, fontSize: 17, lineHeight: 1.75, color: "rgba(247,243,236,0.65)", margin: "0 0 48px" }}>
          Try the demo free with a sample wardrobe — no account needed.
          Sign up when you're ready to style your own closet.
        </p>
        <Link href="/try" style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          background: "#F7F3EC", color: "#17140F",
          ...sans, fontSize: 13, fontWeight: 600, letterSpacing: "0.02em",
          padding: "18px 48px", borderRadius: 999, textDecoration: "none",
          boxShadow: "0 8px 40px rgba(0,0,0,0.3)", transition: "all 0.3s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#C9A84C"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#F7F3EC"; }}
        >
          Try the demo →
        </Link>
      </div>
    </section>
  );
}