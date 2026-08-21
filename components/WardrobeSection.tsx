"use client";

const T = { cream: "#F7F3EC", dark: "#17140F", mid: "#5B5650", muted: "#8C877E", light: "#EFEAE1", border: "rgba(23,20,15,0.08)", gold: "#C9A84C" };
const serif = { fontFamily: "'Bodoni Moda', serif" };
const sans = { fontFamily: "'Hanken Grotesk', sans-serif" };
const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const lbl = { ...mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const };

export default function WardrobeSection() {
  return (
    <section id="how" style={{ background: T.cream, padding: "112px 56px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "center" }}>
        <div>
          <span style={{ ...lbl, color: T.muted, display: "block", marginBottom: 14 }}>Step 01 — Closet scan</span>
          <h2 style={{ ...serif, fontSize: "clamp(32px,3.5vw,44px)", fontWeight: 700, lineHeight: 1.15, color: T.dark, margin: "0 0 24px" }}>
            Photograph it once.<br />We take it from there.
          </h2>
          <p style={{ ...sans, fontSize: 16, lineHeight: 1.8, color: T.mid, margin: "0 0 36px", maxWidth: 420 }}>
            Snap or upload photos of what's already in your closet. The AI
            reads the type, colour, pattern, and formality of every piece —
            turning a pile of clothes into a wardrobe you can actually plan
            outfits from.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["Clothing type recognition", "Colour & pattern analysis", "Formality scoring per item"].map(c => (
              <div key={c} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: T.light, borderRadius: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: T.dark, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <span style={{ ...sans, fontSize: 14, color: T.dark }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.1)" }}>
            <img src="https://images.unsplash.com/photo-1603906650843-b58e94d9df4d?auto=format&fit=crop&w=900&q=85" alt="Wardrobe flatlay" style={{ width: "100%", display: "block", objectFit: "cover" }} />
          </div>
          <div style={{ position: "absolute", top: 24, right: -16, background: "rgba(247,243,236,0.95)", backdropFilter: "blur(12px)", border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.gold }} />
            <span style={{ ...lbl, fontSize: 9, color: T.dark }}>Trench coat · outerwear</span>
          </div>
          <div style={{ position: "absolute", bottom: 48, left: -16, background: "rgba(247,243,236,0.95)", backdropFilter: "blur(12px)", border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.muted }} />
            <span style={{ ...lbl, fontSize: 9, color: T.dark }}>Denim · casual</span>
          </div>
        </div>
      </div>
    </section>
  );
}