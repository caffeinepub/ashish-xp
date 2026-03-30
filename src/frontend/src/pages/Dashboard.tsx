import { useNavigate } from "@tanstack/react-router";
import { Archive, Film, Layers, Loader2, Sliders, Star } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { FileCard } from "../components/FileCard";
import { Navbar } from "../components/Navbar";
import { NoticeBanner } from "../components/NoticeBanner";
import {
  useGetFeatured,
  useGetFiles,
  useGetNotice,
  useSeedData,
} from "../hooks/useQueries";
import type { FileItem } from "../hooks/useQueries";
import { isUnlocked } from "../utils/auth";

const CATEGORIES = [
  { name: "Editing Videos", icon: Film, color: "#16E0E6" },
  { name: "ZIP Files", icon: Archive, color: "#B34BFF" },
  { name: "Presets", icon: Sliders, color: "#4BFFA0" },
  { name: "Overlays", icon: Layers, color: "#FF4B9A" },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [seeded, setSeeded] = useState(false);

  const { data: files = [], isLoading: filesLoading } = useGetFiles();
  const { data: featured = [], isLoading: featuredLoading } = useGetFeatured();
  const { data: notice = "" } = useGetNotice();
  const seedMutation = useSeedData();

  useEffect(() => {
    if (!isUnlocked()) {
      navigate({ to: "/", replace: true });
    }
  }, [navigate]);

  // Seed on first load if empty
  useEffect(() => {
    if (!filesLoading && !seeded && files.length === 0) {
      setSeeded(true);
      seedMutation.mutate();
    }
  }, [filesLoading, files.length, seeded, seedMutation]);

  const filteredFiles = useMemo(() => {
    let result = files;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q),
      );
    }
    if (activeCategory !== "All") {
      result = result.filter((f) => f.category === activeCategory);
    }
    return result;
  }, [files, searchQuery, activeCategory]);

  const filesByCategory = useMemo(() => {
    const map: Record<string, FileItem[]> = {};
    for (const cat of CATEGORIES) {
      map[cat.name] = filteredFiles.filter((f) => f.category === cat.name);
    }
    return map;
  }, [filteredFiles]);

  const isLoading = filesLoading || featuredLoading || seedMutation.isPending;

  const showSearchResults =
    searchQuery.trim() !== "" || activeCategory !== "All";

  return (
    <div className="min-h-screen" style={{ background: "#000000" }}>
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch
      />

      {notice && <NoticeBanner message={notice} />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2
              size={40}
              className="animate-spin"
              style={{ color: "#16E0E6" }}
            />
            <p className="text-sm" style={{ color: "#8B95A7" }}>
              {seedMutation.isPending
                ? "Loading assets..."
                : "Fetching content..."}
            </p>
          </div>
        ) : (
          <>
            {/* Category filter pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {["All", ...CATEGORIES.map((c) => c.name)].map((cat) => {
                const catDef = CATEGORIES.find((c) => c.name === cat);
                const isActive = activeCategory === cat;
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
                    style={{
                      background: isActive
                        ? catDef
                          ? `${catDef.color}25`
                          : "#16E0E625"
                        : "#0B0F18",
                      color: isActive
                        ? catDef
                          ? catDef.color
                          : "#16E0E6"
                        : "#8B95A7",
                      border: `1px solid ${
                        isActive
                          ? catDef
                            ? `${catDef.color}60`
                            : "#16E0E660"
                          : "#1A2436"
                      }`,
                      boxShadow: isActive
                        ? `0 0 12px ${catDef?.color || "#16E0E6"}30`
                        : undefined,
                    }}
                    data-ocid="dashboard.tab"
                  >
                    {cat}
                  </button>
                );
              })}
            </motion.div>

            {showSearchResults ? (
              // Search / filtered results
              <section>
                <SectionHeader
                  title={
                    searchQuery ? `Search: "${searchQuery}"` : activeCategory
                  }
                  count={filteredFiles.length}
                />
                {filteredFiles.length === 0 ? (
                  <EmptyState message="No files match your search." />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredFiles.map((file, i) => (
                      <FileCard
                        key={file.id.toString()}
                        file={file}
                        size="small"
                        index={i}
                      />
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <>
                {/* Featured section */}
                {featured.length > 0 && (
                  <section className="mb-10">
                    <SectionHeader
                      title="NEW ASSETS"
                      subtitle="Featured picks"
                      icon={<Star size={18} style={{ color: "#16E0E6" }} />}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {featured.map((file, i) => (
                        <FileCard
                          key={file.id.toString()}
                          file={file}
                          size="large"
                          index={i}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Divider */}
                {featured.length > 0 && (
                  <div
                    className="mb-10 h-px w-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, #1A2436, transparent)",
                    }}
                  />
                )}

                {/* Category sections */}
                <section>
                  <SectionHeader
                    title="Latest Uploads"
                    subtitle="Browse all categories"
                  />
                  <div className="space-y-10">
                    {CATEGORIES.map((cat) => {
                      const catFiles = filesByCategory[cat.name] || [];
                      if (catFiles.length === 0) return null;
                      const CatIcon = cat.icon;
                      return (
                        <div key={cat.name}>
                          <div className="flex items-center gap-2 mb-4">
                            <CatIcon size={16} style={{ color: cat.color }} />
                            <h3
                              className="text-sm font-bold uppercase tracking-widest"
                              style={{ color: cat.color }}
                            >
                              {cat.name}
                            </h3>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full ml-1"
                              style={{
                                background: `${cat.color}15`,
                                color: cat.color,
                              }}
                            >
                              {catFiles.length}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {catFiles.map((file, i) => (
                              <FileCard
                                key={file.id.toString()}
                                file={file}
                                size="small"
                                index={i}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {files.length === 0 && !isLoading && (
                  <EmptyState
                    message="No assets yet. The vault is empty."
                    data-ocid="dashboard.empty_state"
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer
        className="mt-16 border-t py-6 text-center text-xs"
        style={{ borderColor: "#1A2436", color: "#3A4456" }}
      >
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
          style={{ color: "#4A5568" }}
        >
          caffeine.ai
        </a>
        {" · "}
        <a
          href="/admin"
          className="opacity-0 hover:opacity-20 transition-opacity text-[0px] hover:text-xs"
          style={{ color: "#4A5568" }}
          title="Admin"
        >
          ⚙
        </a>
      </footer>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  count,
  icon,
}: {
  title: string;
  subtitle?: string;
  count?: number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <h2 className="text-lg font-bold uppercase tracking-widest text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs" style={{ color: "#8B95A7" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {count !== undefined && (
        <span
          className="text-xs px-3 py-1 rounded-full"
          style={{
            background: "#16E0E615",
            color: "#16E0E6",
            border: "1px solid #16E0E630",
          }}
        >
          {count} result{count !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-4 rounded-xl"
      style={{ background: "#0B0F1880", border: "1px dashed #1A2436" }}
      data-ocid="dashboard.empty_state"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
        style={{ background: "#16E0E610", border: "1px solid #16E0E620" }}
      >
        📁
      </div>
      <p className="text-sm" style={{ color: "#8B95A7" }}>
        {message}
      </p>
    </div>
  );
}
