"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shirt, ArrowLeft, Heart, RefreshCw, Share2,
  Sparkles, Footprints, Backpack, Glasses, Watch,
  PencilLine, Loader2, X,
} from "lucide-react";

interface OutfitVariation {
  hero_piece?: string;
  outfit: string[];
  reason: string;
}

interface OutfitResult {
  variations: OutfitVariation[];
  occasion: string;
  style: string;
  weather: string | null;
}

const itemIcons = [Shirt, Shirt, Footprints, Backpack, Glasses, Watch];

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

function OutfitTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border
        ${active
          ? "bg-violet-600 text-white border-violet-600"
          : "bg-white text-slate-500 border-slate-200 hover:border-violet-300 hover:text-violet-600"
        }`}
    >
      {label}
    </button>
  );
}

function OutfitItem({ icon: Icon, name }: { icon: React.ElementType; name: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-violet-500" />
      </div>
      <span className="text-sm font-medium text-slate-700">{name}</span>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<OutfitResult | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [savedTabs, setSavedTabs] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [showRefineBox, setShowRefineBox] = useState(false);
  const [refineFeedback, setRefineFeedback] = useState("");
  const [refining, setRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);

  const [outfitImages, setOutfitImages] = useState<Record<number, string>>({});
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const saved = savedTabs.has(activeTab);

  useEffect(() => {
    const raw = sessionStorage.getItem("outfit_result");
    if (!raw) {
      router.push("/try");
      return;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.variations?.length) {
      router.push("/try");
      return;
    }
    setResult(parsed);
  }, [router]);

  // Đóng ô refine + reset feedback khi đổi tab
  useEffect(() => {
    setShowRefineBox(false);
    setRefineFeedback("");
    setRefineError(null);
    setImageError(null);
  }, [activeTab]);

  if (!result) return null;

  const current = result.variations[activeTab];

  const handleSave = async () => {
    if (saving || saved) return;
    setSaving(true);
    setSaveError(null);

    try {
      const res = await fetch("/api/outfits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion: result?.occasion,
          style: result?.style,
          weather: result?.weather,
          outfit: current.outfit,
          reason: current.reason,
        }),
      });

      if (res.status === 401) {
        router.push("/login?callbackUrl=/result");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }

      setSavedTabs((prev) => new Set(prev).add(activeTab));
    } catch (err: any) {
      setSaveError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleRefine = async () => {
    if (refining || refineFeedback.trim().length === 0) return;
    setRefining(true);
    setRefineError(null);

    try {
      const res = await fetch("/api/refine-outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion: result.occasion,
          style: result.style,
          weather: result.weather,
          originalOutfit: current,
          feedback: refineFeedback.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Refine failed");
      }

      const refined = await res.json();

      setResult((prev) => {
        if (!prev) return prev;
        const updatedVariations = [...prev.variations];
        updatedVariations[activeTab] = {
          hero_piece: refined.hero_piece,
          outfit: refined.outfit,
          reason: refined.reason,
        };
        return { ...prev, variations: updatedVariations };
      });

      // Outfit đã đổi nội dung — nếu trước đó đã Saved thì bỏ trạng thái Saved
      setSavedTabs((prev) => {
        const next = new Set(prev);
        next.delete(activeTab);
        return next;
      });

      // Ảnh cũ không còn khớp nội dung outfit mới — xóa để user generate lại nếu muốn
      setOutfitImages((prev) => {
        const next = { ...prev };
        delete next[activeTab];
        return next;
      });

      setShowRefineBox(false);
      setRefineFeedback("");
    } catch (err: any) {
      setRefineError(err.message || "Something went wrong");
    } finally {
      setRefining(false);
    }
  };

  const handleGenerateImage = async () => {
    if (generatingImage) return;
    setGeneratingImage(true);
    setImageError(null);

    try {
      const res = await fetch("/api/generate-outfit-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outfit: current.outfit,
          heroPiece: current.hero_piece,
          occasion: result.occasion,
          style: result.style,
        }),
      });

      if (res.status === 401) {
        router.push("/login?callbackUrl=/result");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Image generation failed");
      }

      const data = await res.json();
      setOutfitImages((prev) => ({ ...prev, [activeTab]: data.imageUrl }));
    } catch (err: any) {
      setImageError(err.message || "Something went wrong");
    } finally {
      setGeneratingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* Mini Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
            <Shirt className="w-4 h-4 text-white" />
          </div>
          <span className="text-base" style={{ fontFamily: "'Sora', sans-serif" }}>
            <span className="font-extrabold text-violet-600">AI</span>
            <span className="font-extrabold text-slate-900">Stylist</span>
          </span>
        </Link>

        <Link href="/try" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <button className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-full transition">
          <Share2 className="w-4 h-4" />
          Save
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">

        {/* Title + Badges */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
            Your AI Outfit Suggestions
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {result.occasion && <Badge label={`Occasion: ${capitalize(result.occasion)}`} />}
            {result.style    && <Badge label={`Style: ${capitalize(result.style)}`} />}
            {result.weather  && <Badge label={`Weather: ${capitalize(result.weather)}`} />}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {result.variations.map((_, i) => (
            <OutfitTab
              key={i}
              label={`Outfit ${i + 1}`}
              active={activeTab === i}
              onClick={() => setActiveTab(i)}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2">

            {/* Left — image preview */}
            <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-white flex flex-col items-center justify-center py-16 px-8 gap-4">
              {outfitImages[activeTab] ? (
                <img
                  src={outfitImages[activeTab]}
                  alt="Generated outfit preview"
                  className="w-full h-full max-h-72 object-contain rounded-2xl"
                />
              ) : (
                <>
                  <div className="w-36 h-36 rounded-full bg-white shadow-md flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-violet-300" />
                  </div>
                  <button
                    onClick={handleGenerateImage}
                    disabled={generatingImage}
                    className="flex items-center gap-2 bg-white border-2 border-violet-200 hover:border-violet-400 disabled:opacity-60 text-violet-600 text-sm font-semibold px-4 py-2.5 rounded-xl transition"
                  >
                    {generatingImage ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />Generating image...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" />Generate Preview Image</>
                    )}
                  </button>
                  {imageError && (
                    <p className="text-xs text-red-500 text-center max-w-xs">{imageError}</p>
                  )}
                </>
              )}
            </div>

            {/* Right — item list */}
            <div className="p-6 flex flex-col justify-center">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Items in this outfit
              </h2>
              <div>
                {current.outfit.map((item, i) => (
                  <OutfitItem key={i} icon={itemIcons[i % itemIcons.length]} name={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Why this outfit — từ OpenAI */}
          <div className="border-t border-slate-100 px-6 py-5 bg-slate-50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Why this outfit?
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">{current.reason}</p>
          </div>

          {/* Refine section */}
          <div className="border-t border-slate-100 px-6 py-4">
            {!showRefineBox ? (
              <button
                onClick={() => setShowRefineBox(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 transition"
              >
                <PencilLine className="w-4 h-4" />
                Not quite right? Refine this outfit
              </button>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-700">
                    What would you like to change?
                  </p>
                  <button
                    onClick={() => {
                      setShowRefineBox(false);
                      setRefineFeedback("");
                      setRefineError(null);
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={refineFeedback}
                  onChange={(e) => setRefineFeedback(e.target.value)}
                  placeholder="e.g. Remove the hat, swap the sweater for something lighter, I'd prefer flats instead of sandals..."
                  rows={3}
                  className="w-full border-2 border-violet-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 resize-none"
                />
                {refineError && (
                  <p className="text-xs text-red-500 mt-2">{refineError}</p>
                )}
                <button
                  onClick={handleRefine}
                  disabled={refining || refineFeedback.trim().length === 0}
                  className="mt-3 flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
                >
                  {refining ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Updating outfit...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" />Update this look</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => router.push("/try")}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-violet-300 text-slate-700 hover:text-violet-600 font-semibold py-3.5 rounded-2xl transition"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3.5 rounded-2xl transition disabled:opacity-60
              ${saved ? "bg-green-500 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}`}
          >
            <Heart className={`w-4 h-4 ${saved ? "fill-white" : ""}`} />
            {saving ? "Saving..." : saved ? "Saved" : "Save Outfit"}
          </button>
        </div>

        {saveError && (
          <p className="text-xs text-red-500 mt-2 text-center">{saveError}</p>
        )}
      </main>
    </div>
  );
}