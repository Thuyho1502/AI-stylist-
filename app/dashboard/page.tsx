"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles, Heart, ShoppingBag, Calendar,
  Plus, Bell, ArrowRight,
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";


interface Stats {
  wardrobeItems: number;
  savedOutfits: number;
  outfitsThisWeek: number;
  favorites: number;
}

interface RecentOutfit {
  id: string;
  occasion: string | null;
  createdAt: string;
}

interface WardrobeSummaryItem {
  name: string;
  value: number;
  color: string;
}


const CHART_COLORS: Record<string, string> = {
  Tops:        "#7c3aed",
  Bottoms:     "#ec4899",
  Shoes:       "#f59e0b",
  Accessories: "#10b981",
  Other:       "#64748b",
};

const OUTFIT_BG = [
  "from-violet-100 to-purple-50",
  "from-pink-100 to-rose-50",
  "from-blue-100 to-indigo-50",
  "from-emerald-100 to-teal-50",
];

function StatCard({
  label, value, icon: Icon, color, bg,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function OutfitCard({ occasion, createdAt, bg }: { occasion: string | null; createdAt: string; bg: string }) {
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className={`h-32 bg-gradient-to-br ${bg} flex items-center justify-center`}>
        <Sparkles className="w-8 h-8 text-white/60" />
      </div>
      <div className="p-3">
        <p className="text-xs text-slate-400">{date}</p>
        <p className="text-sm font-semibold text-slate-700 mt-0.5">{occasion ?? "Outfit"}</p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}


export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats,           setStats          ] = useState<Stats | null>(null);
  const [recentOutfits,   setRecentOutfits  ] = useState<RecentOutfit[]>([]);
  const [wardrobeSummary, setWardrobeSummary] = useState<WardrobeSummaryItem[]>([]);
  const [loadingData,     setLoadingData    ] = useState(true);

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Fetch real data
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchAll = async () => {
      try {
        const [statsRes, outfitsRes, wardrobeRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/recent-outfits"),
        fetch("/api/dashboard/wardrobe-summary"),
      ]);

      // Thêm log này
      console.log("stats:", statsRes.status);
      console.log("outfits:", outfitsRes.status);
      console.log("wardrobe:", wardrobeRes.status);

        const [statsData, outfitsData, wardrobeData] = await Promise.all([
          statsRes.json(),
          outfitsRes.json(),
          wardrobeRes.json(),
        ]);

       setStats(statsData);
      setRecentOutfits(Array.isArray(outfitsData) ? outfitsData : []);
      setWardrobeSummary(Array.isArray(wardrobeData) ? wardrobeData : []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchAll();
  }, [status]);

  if (status === "loading" || loadingData) return <Spinner />;

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const emoji     = hour < 12 ? "☀️" : hour < 18 ? "👋" : "🌙";

  const statCards = [
    { label: "Wardrobe Items",    value: stats?.wardrobeItems    ?? 0, icon: ShoppingBag, color: "text-violet-600",  bg: "bg-violet-50"  },
    { label: "Saved Outfits",     value: stats?.savedOutfits     ?? 0, icon: Heart,       color: "text-pink-600",    bg: "bg-pink-50"    },
    { label: "Outfits This Week", value: stats?.outfitsThisWeek  ?? 0, icon: Calendar,    color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Favorites",         value: stats?.favorites        ?? 0, icon: Sparkles,    color: "text-amber-600",   bg: "bg-amber-50"   },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>
            {greeting}, {firstName}! {emoji}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Let&apos;s create something amazing today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-violet-300 transition">
            <Bell className="w-4 h-4 text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-600 rounded-full" />
          </button>
          <Link
            href="/try"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition"
          >
            <Plus className="w-4 h-4" />
            New Outfit
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Recent Outfits + Wardrobe Summary */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Recent Outfits */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Recent Outfits</h2>
            <Link href="/dashboard/saved" className="text-xs text-violet-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentOutfits.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <Sparkles className="w-8 h-8 text-slate-200" />
              <p className="text-xs text-slate-400">No outfits yet — try generating one!</p>
              <Link href="/try" className="text-xs text-violet-600 hover:underline">Generate now →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {recentOutfits.map((o, i) => (
                <OutfitCard key={o.id} {...o} bg={OUTFIT_BG[i % OUTFIT_BG.length]} />
              ))}
            </div>
          )}
        </div>

        {/* Wardrobe Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Wardrobe Summary</h2>
            <Link href="/dashboard/wardrobe" className="text-xs text-violet-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {wardrobeSummary.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <ShoppingBag className="w-8 h-8 text-slate-200" />
              <p className="text-xs text-slate-400">Your wardrobe is empty</p>
              <Link href="/dashboard/wardrobe" className="text-xs text-violet-600 hover:underline">Add items →</Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={wardrobeSummary}
                    cx="50%" cy="50%"
                    innerRadius={45} outerRadius={70}
                    paddingAngle={3} dataKey="value"
                  >
                    {wardrobeSummary.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} items`, ""]} />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex-1 space-y-2">
                {wardrobeSummary.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-900">{item.value}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Total</span>
                  <span className="text-xs font-bold text-slate-900">
                    {wardrobeSummary.reduce((a, b) => a + b.value, 0)} items
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Link href="/try" className="bg-violet-600 hover:bg-violet-700 text-white rounded-2xl p-5 flex items-center gap-3 transition">
          <Sparkles className="w-5 h-5" />
          <div>
            <p className="text-sm font-semibold">Try AI Stylist</p>
            <p className="text-xs text-violet-200">Generate new outfit</p>
          </div>
        </Link>
        <Link href="/dashboard/wardrobe" className="bg-white hover:border-violet-200 border border-slate-100 rounded-2xl p-5 flex items-center gap-3 transition">
          <ShoppingBag className="w-5 h-5 text-violet-600" />
          <div>
            <p className="text-sm font-semibold text-slate-800">My Wardrobe</p>
            <p className="text-xs text-slate-400">Manage your clothes</p>
          </div>
        </Link>
        <Link href="/dashboard/saved" className="bg-white hover:border-violet-200 border border-slate-100 rounded-2xl p-5 flex items-center gap-3 transition">
          <Heart className="w-5 h-5 text-pink-500" />
          <div>
            <p className="text-sm font-semibold text-slate-800">Saved Outfits</p>
            <p className="text-xs text-slate-400">View your favorites</p>
          </div>
        </Link>
      </div>
    </div>
  );
}