import Link from "next/link";
import { Sparkles, ArrowRight, Shirt, Footprints, Backpack, Glasses } from "lucide-react";

const outfitItems = [
  { icon: Shirt, label: "Hoodie", rotate: "-rotate-3", delay: "0s" },
  { icon: Footprints, label: "Sneakers", rotate: "rotate-2", delay: "0.3s" },
  { icon: Backpack, label: "Backpack", rotate: "rotate-3", delay: "0.6s" },
  { icon: Glasses, label: "Glasses", rotate: "-rotate-2", delay: "0.9s" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-violet-50 to-white">
      <style>{`
        @keyframes floaty {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .float-card { animation: floaty 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .float-card { animation: none; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Fashion Assistant
          </span>

          <h1
            className="mt-6 text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Your AI Stylist,
            <br />
            <span className="text-violet-600">Everyday.</span>
          </h1>

          <p className="mt-5 text-slate-500 text-lg leading-relaxed max-w-md">
            Get personalized outfit ideas based on your style, wardrobe and body type — picked for you in seconds.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/try"
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3.5 rounded-full flex items-center gap-2 transition"
            >
              Try AI Stylist
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how"
              className="border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-6 py-3.5 rounded-full transition"
            >
              How it works
            </a>
          </div>

          <p className="mt-4 text-sm text-slate-400">No sign-up needed to try the demo</p>
        </div>

        {/* Visual collage */}
        <div className="relative h-80 md:h-96 flex items-center justify-center">
          <div className="absolute w-72 h-72 md:w-80 md:h-80 bg-gradient-to-br from-violet-200 via-purple-100 to-white rounded-full blur-2xl opacity-80" />

          <div className="relative grid grid-cols-2 gap-5">
            {outfitItems.map(({ icon: Icon, label, rotate, delay }) => (
              <div
                key={label}
                className={`float-card bg-white shadow-lg rounded-2xl p-4 w-32 flex flex-col items-center gap-2 ${rotate}`}
                style={{ animationDelay: delay }}
              >
                <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700">{label}</span>
              </div>
            ))}
          </div>

          <div className="absolute -top-4 -right-2 md:-right-6 bg-white shadow-md rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-violet-600 border border-violet-100">
            <Sparkles className="w-3.5 h-3.5" />
            AI Generated
          </div>
        </div>
      </div>
    </section>
  );
}