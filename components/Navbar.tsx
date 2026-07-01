"use client";
import { useState } from "react";
import Link from "next/link";
import { Shirt, Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-violet-600 flex items-center justify-center shadow-sm">
            <Shirt className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
            <span className="font-extrabold text-violet-600">AI</span>
            <span className="font-extrabold text-slate-900">Stylist</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-violet-600">Home</Link>
          <a href="#how" className="hover:text-violet-600">How it works</a>
          <a href="#features" className="hover:text-violet-600">Features</a>
          <Link href="/about" className="hover:text-violet-600">About</Link>
        </nav>

        <div className="hidden md:flex items-center gap-5">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-violet-600">
            Log in
          </Link>
          <Link
            href="/register"
            className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition"
          >
            Get Started
          </Link>
        </div>

        <button className="md:hidden text-slate-700" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 px-6 py-4 flex flex-col gap-4 text-sm font-medium text-slate-600">
          <Link href="/">Home</Link>
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <Link href="/about">About</Link>
          <Link href="/login">Log in</Link>
          <Link
            href="/register"
            className="bg-violet-600 text-white font-semibold px-5 py-2.5 rounded-full w-fit"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}