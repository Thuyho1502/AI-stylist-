"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Plus, X, Loader2, Trash2 } from "lucide-react";

type Category = "TOP" | "BOTTOM" | "OUTERWEAR" | "DRESS" | "SHOES" | "BAG" | "ACCESSORY";
type Season = "SPRING" | "SUMMER" | "FALL" | "WINTER" | "ALL_SEASON";

interface WardrobeItem {
  id: string;
  imageUrl: string;
  category: Category;
  subcategory: string | null;
  color: string;
  material: string | null;
  pattern: string | null;
  seasons: Season[];
}

const CATEGORY_TABS: { label: string; value: Category | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Tops", value: "TOP" },
  { label: "Bottoms", value: "BOTTOM" },
  { label: "Shoes", value: "SHOES" },
  { label: "Accessories", value: "ACCESSORY" },
  { label: "Outerwear", value: "OUTERWEAR" },
];

export default function WardrobePage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Category | "ALL">("ALL");
  const [modalOpen, setModalOpen] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wardrobe");
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error("Failed to load wardrobe:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function handleDelete(id: string) {
    if (!confirm("Remove this item from your wardrobe?")) return;
    try {
      await fetch(`/api/wardrobe/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesTab = activeTab === "ALL" || item.category === activeTab;
    const matchesSearch =
      search.trim() === "" ||
      item.subcategory?.toLowerCase().includes(search.toLowerCase()) ||
      item.color.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Wardrobe</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {/* Search + filter dropdown */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as Category | "ALL")}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          {CATEGORY_TABS.map((tab) => (
            <option key={tab.value} value={tab.value}>
              {tab.value === "ALL" ? "All Categories" : tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              activeTab === tab.value
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-purple-600" size={28} />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="mb-1">No items yet.</p>
          <p className="text-sm">Add your first item to build your wardrobe.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition"
            >
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition hover:bg-red-50"
              >
                <Trash2 size={14} className="text-red-500" />
              </button>
              <div className="aspect-square bg-gray-50">
                <img
                  src={item.imageUrl}
                  alt={item.subcategory || item.category}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {item.subcategory || item.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <AddItemModal
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            fetchItems();
          }}
        />
      )}
    </div>
  );
}

// ---------- Add Item Modal ----------

function AddItemModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [step, setStep] = useState<"upload" | "analyzing" | "review">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    category: "TOP" as Category,
    subcategory: "",
    color: "",
    material: "",
    pattern: "",
    seasons: [] as Season[],
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError(null);
  }

  async function handleUploadAndAnalyze() {
    if (!file) return;
    setStep("analyzing");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/wardrobe/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Upload failed");
      }

      setImageUrl(uploadData.imageUrl);

      const analyzeRes = await fetch("/api/wardrobe/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: uploadData.imageUrl }),
      });
      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok) {
        throw new Error(analyzeData.error || "Analysis failed");
      }

      setForm({
        category: analyzeData.category || "TOP",
        subcategory: analyzeData.subcategory || "",
        color: analyzeData.color || "",
        material: analyzeData.material || "",
        pattern: analyzeData.pattern || "",
        seasons: analyzeData.seasons || [],
      });

      setStep("review");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setStep("upload");
    }
  }

  async function handleSave() {
    if (!imageUrl) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/wardrobe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, ...form }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }

      onSaved();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-bold mb-4">Add Item</h2>

        {step === "upload" && (
          <div>
            <label className="block border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-purple-300 transition">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
              ) : (
                <p className="text-sm text-gray-500">Click to choose a photo</p>
              )}
            </label>

            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

            <button
              onClick={handleUploadAndAnalyze}
              disabled={!file}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition"
            >
              Analyze with AI
            </button>
          </div>
        )}

        {step === "analyzing" && (
          <div className="flex flex-col items-center py-10">
            <Loader2 className="animate-spin text-purple-600 mb-3" size={28} />
            <p className="text-sm text-gray-500">Analyzing your item...</p>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-3">
            {preview && (
              <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-lg mb-2" />
            )}

            <div>
              <label className="text-xs font-medium text-gray-500">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
              >
                {CATEGORY_TABS.filter((t) => t.value !== "ALL").map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">Name</label>
              <input
                type="text"
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">Color</label>
              <input
                type="text"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">Material</label>
              <input
                type="text"
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition"
            >
              {saving ? "Saving..." : "Save to Wardrobe"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}