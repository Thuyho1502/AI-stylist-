import { UserRound, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: UserRound,
    title: "Tell us about you",
    desc: "Share your occasion, style and preferences.",
  },
  {
    icon: Sparkles,
    title: "Get AI suggestions",
    desc: "Our AI generates the best outfit ideas for you.",
  },
  {
    icon: CheckCircle2,
    title: "Save & wear",
    desc: "Save your favorite outfits and wear with confidence.",
  },
];

export default function HowItWork() {
  return (
    <section id="how" className="bg-violet-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
            How it works
          </h2>
          <p className="mt-3 text-slate-500">Three simple steps, less than a minute each morning.</p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-10">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="relative text-center px-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-white border-2 border-violet-600 text-violet-600 flex items-center justify-center shadow-sm">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="mt-5 font-semibold text-slate-900">
                {i + 1}. {title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{desc}</p>

              {i < steps.length - 1 && (
                <ArrowRight className="hidden md:block w-6 h-6 text-violet-300 absolute top-5 -right-5" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}