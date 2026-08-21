"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User } from "lucide-react";

const navLinks = [
  { label: "How it works", href: "#how" },
  { label: "The match", href: "#features" },
  { label: "Your looks", href: "#discover" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Hanken+Grotesk:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
      `}</style>

      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(247,243,236,0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          padding: "0 72px", height: 94,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 15, textDecoration: "none", flexShrink: 0 }}>
            <img src="/logo.png" alt="Atelier AI" style={{ width: 52, height: 52, objectFit: "contain" }} />
            <span style={{
              fontFamily: "'Bodoni Moda', serif",
              fontSize: 33, fontWeight: 700,
              letterSpacing: "-0.03em", color: "#1a1a1a", lineHeight: 1,
            }}>
              Atelier AI
            </span>
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: 57 }}>
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: 19, fontWeight: 400,
                color: "#666", textDecoration: "none",
                letterSpacing: "0.01em", transition: "color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "#1a1a1a")}
                onMouseLeave={e => (e.currentTarget.style.color = "#666")}
              >{label}</a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            {session ? (
              <>
                <Link href="/dashboard" style={{
                  fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 18, fontWeight: 600,
                  background: "#1a1a1a", color: "#fff",
                  padding: "13px 29px", borderRadius: 999, textDecoration: "none",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#333")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#1a1a1a")}
                >Dashboard</Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} style={{
                  width: 49, height: 49, borderRadius: "50%",
                  background: "#1a1a1a", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}><User size={20} color="#fff" strokeWidth={1.8} /></button>
              </>
            ) : (
              <>
                <Link href="/register" style={{
                  fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 18, fontWeight: 600,
                  background: "#1a1a1a", color: "#fff",
                  padding: "13px 29px", borderRadius: 999, textDecoration: "none",
                  transition: "background 0.25s", whiteSpace: "nowrap",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#333")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#1a1a1a")}
                >Try free</Link>
                <Link href="/login" style={{
                  width: 49, height: 49, borderRadius: "50%",
                  background: "#1a1a1a", display: "flex",
                  alignItems: "center", justifyContent: "center", textDecoration: "none",
                  transition: "background 0.25s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#333")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#1a1a1a")}
                ><User size={20} color="#fff" strokeWidth={1.8} /></Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#1a1a1a", marginLeft: 21 }}>
            {open ? <X size={29} /> : <Menu size={29} />}
          </button>
        </div>

        {open && (
          <div style={{ background: "rgba(247,243,236,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(0,0,0,0.06)", padding: "31px 72px 42px" }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: 21, marginBottom: 31 }}>
              {navLinks.map(({ label, href }) => (
                <a key={label} href={href} onClick={() => setOpen(false)}
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 20, color: "#666", textDecoration: "none" }}>
                  {label}
                </a>
              ))}
            </nav>
            <div style={{ display: "flex", gap: 15 }}>
              <Link href="/register" onClick={() => setOpen(false)} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 17, fontWeight: 600, background: "#1a1a1a", color: "#fff", padding: "13px 29px", borderRadius: 999, textDecoration: "none" }}>Try free</Link>
              <Link href="/login" onClick={() => setOpen(false)} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 17, color: "#666", padding: "13px 0", textDecoration: "none" }}>Log in</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}