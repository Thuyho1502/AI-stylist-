"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shirt, Heart, Trash2, ArrowLeft, Sparkles,
  Footprints, Backpack, Glasses, Watch,
} from "lucide-react";

interface OutfitItems {
  outfit: string[];
  reason: string;
}

interface Outfit {
  id: string;
  occasion: string | null;
  style: string | null;
  weather: string | null;
  items: OutfitItems;
  isFavorite: boolean;
  createdAt: string;
}

const itemIcons = [Shirt, Shirt, Footprints, Backpack, Glasses, Watch];

const OUTFIT_BG = [
  "from-violet-100 to-purple-50",
  "from-pink-100 to-rose-50",
  "from-blue-100 to-indigo-50",
  "from-emerald-100 to-teal-50",
];

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-block bg-slate-100 text-slate-500 text-xs font-medium px-2.5 py-1 rounded-full">
      {label}
    </span>
  );
}

function FilterPill({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition
        ${active ? "bg-violet-600 text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-violet-300"}`}
    >
      {label}
    </button>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center h-60">
      <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function OutfitCard({
  outfit, bg, onToggleFavorite, onDelete,
}: {
  outfit: Outfit;
  bg: string;
  onToggleFavorite: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(outfit.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden group">
      <div className={`h-32 bg-gradient-to-br ${bg} flex items-center justify-center relative`}>
        <Sparkles className="w-8 h-8 text-white/60" />

        <button
          onClick={() => onToggleFavorite(outfit.id, outfit.isFavorite)}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition"
        >
          <Heart
            className={`w-4 h-4 ${outfit.isFavorite ? "fill-pink-500 text-pink-500" : "text-slate-400"}`}
          />
        </button>

        <button
          onClick={() => onDelete(outfit.id)}
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-slate-400">{date}</p>
          {outfit.style && <Badge label={capitalize(outfit.style)} />}
        </div>

        <p className="text-sm font-semibold text-slate-700 mb-1">
          {outfit.occasion ? capitalize(outfit.occasion) : "Outfit"}
        </p>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-violet-600 hover:underline"
        >
          {expanded ? "Hide details" : "View details"}
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            {outfit.items.outfit.map((item, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5">
                {(() => {
                  const Icon = itemIcons[i % itemIcons.length];
                  return <Icon className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />;
                })()}
                <span className="text-xs text-slate-600">{item}</span>
              </div>
            ))}
            {outfit.items.reason && (
              <p className="text-xs text-slate-500 mt-2 leading-relaxed italic">
                {outfit.items.reason}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SavedOutfitsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  useEffect(() => {
    fetchOutfits();
  }, []);

  async function fetchOutfits() {
    setLoading(true);
    try {
      const res = await fetch("/api/outfits");
      const data = await res.json();
      setOutfits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load outfits:", err);
      setOutfits([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleFavorite(id: string, current: boolean) {
    setOutfits((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isFavorite: !current } : o))
    );
    try {
      await fetch(`/api/outfits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !current }),
      });
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      fetchOutfits(); // rollback nếu lỗi
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this saved outfit?")) return;
    const prevOutfits = outfits;
    setOutfits((prev) => prev.filter((o) => o.id !== id));
    try {
      await fetch(`/api/outfits/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete outfit:", err);
      setOutfits(prevOutfits); // rollback nếu lỗi
    }
  }

  const filteredOutfits = outfits.filter((o) =>
    filter === "favorites" ? o.isFavorite : true
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
            Saved Outfits
          </h1>
          <p className="text-sm text-slate-500 mt-1">All the looks you've saved so far.</p>
        </div>
        <Link
          href="/try"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition"
        >
          <Sparkles className="w-4 h-4" />
          New Outfit
        </Link>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2">
        <FilterPill label="All" active={filter === "all"} onClick={() => setFilter("all")} />
        <FilterPill label="Favorites" active={filter === "favorites"} onClick={() => setFilter("favorites")} />
      </div>

      {/* Content */}
      {loading ? (
        <Spinner />
      ) : filteredOutfits.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 gap-2 bg-white rounded-2xl border border-slate-100">
          <Sparkles className="w-8 h-8 text-slate-200" />
          <p className="text-sm text-slate-400">
            {filter === "favorites" ? "No favorites yet." : "No saved outfits yet."}
          </p>
          <Link href="/try" className="text-xs text-violet-600 hover:underline">
            Generate your first outfit →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredOutfits.map((outfit, i) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              bg={OUTFIT_BG[i % OUTFIT_BG.length]}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}