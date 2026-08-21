"use client";

import { useState } from "react";
import { Wand2 } from "lucide-react";

const T = { cream: "#F7F3EC", dark: "#17140F", mid: "#5B5650", muted: "#8C877E", light: "#EFEAE1", border: "rgba(23,20,15,0.08)", violet: "#4B4460" };
const serif = { fontFamily: "'Bodoni Moda', serif" };
const sans = { fontFamily: "'Hanken Grotesk', sans-serif" };
const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const lbl = { ...mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const };

const quickEdits = ["Swap the shoes", "Make it more casual", "Try a jacket instead"];

export default function ChatSection() {
  const [active, setActive] = useState(quickEdits[0]);
  return (
    <section style={{ background: T.cream, padding: "112px 56px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <span style={{ ...lbl, color: T.violet, display: "block", marginBottom: 14 }}>Step 03 — Refine</span>
          <h2 style={{ ...serif, fontSize: "clamp(32px,3.5vw,44px)", fontWeight: 700, lineHeight: 1.15, color: T.dark, margin: "0 0 20px" }}>
            Not quite right?<br />Just say so.
          </h2>
          <p style={{ ...sans, fontSize: 16, lineHeight: 1.8, color: T.mid, margin: "0 0 36px", maxWidth: 400 }}>
            Swap a piece, shift the mood, or type your own request in plain
            language — the stylist updates the look on the spot, no
            re-uploading needed.
          </p>
          <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
            <span style={{ ...lbl, fontSize: 9, color: T.muted, display: "block", marginBottom: 8 }}>Quick edits</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 20 }}>
              {quickEdits.map(c => (
                <button key={c} onClick={() => setActive(c)} style={{
                  ...sans, fontSize: 12, fontWeight: 500, padding: "8px 16px", borderRadius: 999,
                  border: `1px solid ${T.border}`, cursor: "pointer",
                  background: active === c ? T.dark : "transparent",
                  color: active === c ? "#fff" : T.mid, transition: "all 0.2s",
                }}>{c}</button>
              ))}
            </div>
            <span style={{ ...lbl, fontSize: 9, color: T.muted, display: "block", marginBottom: 8 }}>Or describe your own</span>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 20,
            }}>
              <span style={{ ...sans, fontSize: 13, color: T.muted }}>"something warmer for tonight…"</span>
            </div>
            <button style={{ width: "100%", background: T.dark, color: "#fff", border: "none", borderRadius: 10, padding: "13px", ...sans, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              onMouseEnter={e => (e.currentTarget.style.background = "#333")}
              onMouseLeave={e => (e.currentTarget.style.background = T.dark)}
            ><Wand2 size={15} /> Update outfit</button>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.1)", aspectRatio: "4/5" }}>
            <img src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=900&q=85" alt="AI outfit suggestion" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 28, background: "linear-gradient(to top, rgba(23,20,15,0.85), transparent)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <span style={{ ...lbl, fontSize: 9, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 4 }}>Updated to: {active}</span>
                  <span style={{ ...serif, fontSize: 22, fontWeight: 600, color: "#fff" }}>City Chic Edit</span>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontSize: 18, cursor: "pointer" }}>♡</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}