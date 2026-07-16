"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shirt, Sparkles, GraduationCap, Briefcase, Heart, PartyPopper,
  MoreHorizontal, Wind, Waves, CloudRain, Snowflake, Sun,
  Cloud, Flame, Zap, Minimize2, Crown, ArrowLeft, Loader2,
} from "lucide-react";

const occasions = [
  { value: "school", label: "School", icon: GraduationCap },
  { value: "work",   label: "Work",   icon: Briefcase      },
  { value: "date",   label: "Date",   icon: Heart          },
  { value: "party",  label: "Party",  icon: PartyPopper    },
  { value: "other",  label: "Other",  icon: MoreHorizontal },
];

const styles = [
  { value: "casual",     label: "Casual",     icon: Wind      },
  { value: "formal",     label: "Formal",     icon: Waves     },
  { value: "streetwear", label: "Streetwear", icon: Zap       },
  { value: "minimal",    label: "Minimal",    icon: Minimize2 },
  { value: "elegant",    label: "Elegant",    icon: Crown     },
];

const weathers = [
  { value: "sunny",  label: "Sunny",  icon: Sun       },
  { value: "cloudy", label: "Cloudy", icon: Cloud     },
  { value: "rainy",  label: "Rainy",  icon: CloudRain },
  { value: "cold",   label: "Cold",   icon: Snowflake },
  { value: "hot",    label: "Hot",    icon: Flame     },
];

function Chip({
  icon: Icon, label, selected, onClick,
}: {
  icon: React.ElementType;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border-2 text-xs font-semibold transition-all select-none
        ${selected
          ? "border-violet-600 bg-violet-50 text-violet-700"
          : "border-slate-200 bg-white text-slate-500 hover:border-violet-300 hover:text-violet-600"
        }`}
    >
      <Icon className={`w-5 h-5 ${selected ? "text-violet-600" : "text-slate-400"}`} />
      {label}
    </button>
  );
}

export default function TryPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const backHref  = session ? "/dashboard" : "/";
  const backLabel = session ? "Back to Dashboard" : "Back to home";

  const [occasion, setOccasion] = useState("school");
  const [style,    setStyle   ] = useState("casual");
  const [weather,  setWeather ] = useState<string | null>(null);
  const [loading,  setLoading ] = useState(false);
  const [error,    setError   ] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate-outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occasion, style, weather }),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();

      sessionStorage.setItem(
        "outfit_result",
        JSON.stringify({ variations: data.variations, occasion, style, weather })
      );

      router.push("/result");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

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

        <Link
          href={backHref}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>
      </header>

      <main className="max-w-xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
            Let&apos;s find your perfect outfit
          </h1>
          <p className="mt-2 text-slate-500">Tell us a few things about your day</p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Occasion</h2>
            <div className="flex flex-wrap gap-3">
              {occasions.map((o) => (
                <Chip key={o.value} icon={o.icon} label={o.label}
                  selected={occasion === o.value} onClick={() => setOccasion(o.value)} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Style</h2>
            <div className="flex flex-wrap gap-3">
              {styles.map((s) => (
                <Chip key={s.value} icon={s.icon} label={s.label}
                  selected={style === s.value} onClick={() => setStyle(s.value)} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">
              Weather <span className="text-slate-400 font-normal">(optional)</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {weathers.map((w) => (
                <Chip key={w.value} icon={w.icon} label={w.label}
                  selected={weather === w.value}
                  onClick={() => setWeather((prev) => (prev === w.value ? null : w.value))} />
              ))}
            </div>
          </div>
        </div>

        <div className="my-8 border-t border-slate-100" />

        {error && <p className="mb-4 text-sm text-red-500 text-center">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition text-base"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" />Generating your outfits...</>
          ) : (
            <><Sparkles className="w-5 h-5" />Generate Outfit ✨</>
          )}
        </button>

        <div className="mt-5 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <span className="text-base">💡</span>
          <p className="text-xs text-amber-700 leading-relaxed">
            Tip: The more details you provide, the better the suggestions!
          </p>
        </div>
      </main>
    </div>
  );
}