import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-violet-600 py-16 md:py-20">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
          Ready to upgrade your style?
        </h2>
        <p className="mt-3 text-violet-100">
          Start free, no credit card needed — try the demo without signing up.
        </p>
        <Link
          href="/try"
          className="mt-7 inline-flex items-center gap-2 bg-white text-violet-700 font-semibold px-7 py-3.5 rounded-full hover:bg-violet-50 transition"
        >
          Start Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}