"use client";

import Link from "next/link";

const sans = { fontFamily: "'Hanken Grotesk', sans-serif" };
const serif = { fontFamily: "'Bodoni Moda', serif" };
const mono = { fontFamily: "'IBM Plex Mono', monospace" };

export default function Hero() {
  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      alignItems: "flex-end",
      overflow: "hidden",
      paddingTop: 160,
    }}>
      {/* ── Background image ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1920&q=85"
          alt="Wardrobe"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(105deg, rgba(10,8,6,0.66) 0%, rgba(10,8,6,0.38) 55%, rgba(10,8,6,0.08) 100%)",
        }} />
        {/* Modern accent: soft dual-tone mesh glow, bottom-right */}
        <div style={{
          position: "absolute", right: "-10%", bottom: "-15%", width: 620, height: 620,
          background: "radial-gradient(circle, rgba(201,168,76,0.35) 0%, rgba(75,68,96,0.22) 45%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />
      </div>

      {/* ── Content ── */}
      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: 1320, margin: "0 auto",
        padding: "0 64px 110px",
        width: "100%",
      }}>
        <div style={{ maxWidth: 640 }}>

          

          {/* Headline */}
          <h1 style={{
            ...serif,
            fontSize: "clamp(48px, 6vw, 84px)",
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            margin: "0 0 26px",
          }}>
            Your wardrobe,<br />
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.88)" }}>
              styled by intelligence.
            </em>
          </h1>

          {/* Body */}
          <p style={{
            ...sans, fontSize: 17, fontWeight: 300, lineHeight: 1.75,
            color: "rgba(255,255,255,0.75)",
            maxWidth: 480, margin: "0 0 40px",
          }}>
            Atelier AI unlocks the full potential of what you already own.
            No shopping needed — just smarter, more intentional dressing
            every day.
          </p>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" as const }}>
            <Link href="/try" style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              ...sans, fontSize: 13, fontWeight: 600, letterSpacing: "0.02em",
              background: "#1a1a1a", color: "#fff",
              padding: "14px 32px", borderRadius: 999,
              textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)",
              transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#1a1a1a"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.color = "#fff"; }}
            >
              Begin your style journey
              <span style={{ fontSize: 16 }}>→</span>
            </Link>

            <a href="#how" style={{
              ...sans, fontSize: 13, fontWeight: 400,
              color: "rgba(255,255,255,0.65)", textDecoration: "none",
              letterSpacing: "0.02em",
              borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: 2,
              transition: "color 0.2s, border-color 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
            >
              How it works
            </a>
          </div>

          <p style={{ ...mono, fontSize: 11, letterSpacing: "0.06em", color: "rgba(255,255,255,0.4)", marginTop: 22 }}>
            Free demo uses sample pieces — upload your own closet after signing up
          </p>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 120, zIndex: 5,
        background: "linear-gradient(to top, rgba(253,248,248,0.15), transparent)",
        pointerEvents: "none",
      }} />
    </section>
  );
}