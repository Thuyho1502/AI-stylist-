import { Cpu, Heart, Clock, LayoutGrid } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "AI Powered",
    desc: "Advanced AI understands your style and preferences.",
    tint: "bg-violet-100 text-violet-600",
  },
  {
    icon: Heart,
    title: "Personalized",
    desc: "Outfits tailored to your wardrobe and body type.",
    tint: "bg-pink-100 text-pink-600",
  },
  {
    icon: Clock,
    title: "Save Time",
    desc: "Stop thinking, start looking amazing.",
    tint: "bg-amber-100 text-amber-600",
  },
  {
    icon: LayoutGrid,
    title: "Smart Wardrobe",
    desc: "Manage your clothes in one place.",
    tint: "bg-emerald-100 text-emerald-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
          Why choose AI Stylist?
        </h2>
        <p className="mt-3 text-slate-500">
          Four reasons getting dressed never has to be a struggle again.
        </p>
      </div>

      <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {features.map(({ icon: Icon, title, desc, tint }) => (
          <div
            key={title}
            className="p-6 rounded-2xl border border-slate-100 hover:border-violet-200 hover:shadow-lg transition"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tint}`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}