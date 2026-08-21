"use client";

import { Shirt, Sparkles, CloudSun, CalendarDays, Wand2 } from "lucide-react";

const T = { light: "#EFEAE1", dark: "#17140F", mid: "#5B5650", muted: "#8C877E", border: "rgba(23,20,15,0.08)" };
const serif = { fontFamily: "'Bodoni Moda', serif" };
const sans = { fontFamily: "'Hanken Grotesk', sans-serif" };
const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const lbl = { ...mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const };

const steps = [
  { Icon: Shirt, label: "Your wardrobe" },
  { Icon: Sparkles, label: "Your style" },
  { Icon: CloudSun, label: "Today's weather" },
  { Icon: CalendarDays, label: "The occasion" },
];

export default function AILogic() {
  return (
    <section id="features" style={{ background: T.light, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "112px 56px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <span style={{ ...lbl, color: T.muted, display: "block", marginBottom: 14 }}>Step 02 — The algorithm</span>
        <h2 style={{ ...serif, fontSize: "clamp(32px,3.5vw,44px)", fontWeight: 700, lineHeight: 1.15, color: T.dark, margin: "0 auto 72px", maxWidth: 500 }}>
          The formula for a perfect look
        </h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap", position: "relative" }}>
          <div style={{ position: "absolute", top: "38%", left: "8%", right: "20%", height: 1, background: T.border, zIndex: 0 }} />
          {steps.map((s, i) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, zIndex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, background: T.light, padding: "0 10px" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#fff", border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                  <s.Icon size={28} color={T.dark} strokeWidth={1.5} />
                </div>
                <span style={{ ...sans, fontSize: 13, fontWeight: 500, color: T.mid }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <span style={{ ...serif, fontSize: 22, color: "#ccc", marginBottom: 20, zIndex: 1 }}>+</span>}
            </div>
          ))}
          <span style={{ ...sans, fontSize: 20, color: T.mid, margin: "0 12px 20px", zIndex: 1 }}>→</span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, zIndex: 1 }}>
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: T.dark, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
              <Wand2 size={32} color="#fff" strokeWidth={1.5} />
            </div>
            <span style={{ ...serif, fontSize: 18, fontStyle: "italic", color: T.dark }}>Today's outfit</span>
          </div>
        </div>
      </div>
    </section>
  );
}