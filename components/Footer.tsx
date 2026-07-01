import Link from "next/link";
import { Shirt } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-12 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
              <Shirt className="w-4 h-4 text-white" />
            </div>
            <span className="text-base" style={{ fontFamily: "'Sora', sans-serif" }}>
              <span className="font-extrabold text-violet-600">AI</span>
              <span className="font-extrabold text-slate-900">Stylist</span>
            </span>
          </Link>
          <p className="mt-3 text-sm text-slate-500 max-w-xs">
            Your everyday AI-powered fashion assistant — pick the perfect outfit in seconds.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Product</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-500">
            <li><a href="#features" className="hover:text-violet-600">Features</a></li>
            <li><a href="#how" className="hover:text-violet-600">How it works</a></li>
            <li><Link href="/try" className="hover:text-violet-600">Try AI Stylist</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-500">
            <li><Link href="/about" className="hover:text-violet-600">About</Link></li>
            <li><Link href="/login" className="hover:text-violet-600">Log in</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-5 text-sm text-slate-400 text-center">
          © 2026 AI Stylist. All rights reserved.
        </div>
      </div>
    </footer>
  );
}