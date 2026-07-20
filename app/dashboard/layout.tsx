"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Shirt,
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Heart,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Overview",      href: "/dashboard",          icon: LayoutDashboard },
  { label: "Wardrobe",      href: "/dashboard/wardrobe",           icon: ShoppingBag     },
  { label: "AI Stylist",    href: "/try",                icon: Sparkles        },
  { label: "Saved Outfits", href: "/dashboard/saved",    icon: Heart           },
  { label: "Profile",       href: "/dashboard/profile",  icon: User            },
  { label: "Settings",      href: "/dashboard/settings", icon: Settings        },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Logo */}
      <div className="flex items-center justify-between mb-8 px-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
            <Shirt className="w-4 h-4 text-white" />
          </div>
          <span className="text-base" style={{ fontFamily: "'Sora', sans-serif" }}>
            <span className="font-extrabold text-violet-600">AI</span>
            <span className="font-extrabold text-slate-900">Stylist</span>
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-slate-400">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${active
                  ? "bg-violet-50 text-violet-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-violet-600" : "text-slate-400"}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Log out */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
      >
        <LogOut className="w-4 h-4" />
        Log out
      </button>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-slate-100 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-50 w-56 bg-white h-full shadow-xl">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-600">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>
            <span className="text-violet-600">AI</span>
            <span className="text-slate-900">Stylist</span>
          </span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}