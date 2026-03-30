import { Download } from "lucide-react";
import { motion } from "motion/react";
import type { FileItem } from "../hooks/useQueries";
import { addToDownloadHistory } from "../utils/downloadHistory";

interface FileCardProps {
  file: FileItem;
  size?: "large" | "small";
  index?: number;
}

const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "Editing Videos": { bg: "#16E0E615", text: "#16E0E6", border: "#16E0E640" },
  "ZIP Files": { bg: "#B34BFF15", text: "#B34BFF", border: "#B34BFF40" },
  Presets: { bg: "#4BFFA015", text: "#4BFFA0", border: "#4BFFA040" },
  Overlays: { bg: "#FF4B9A15", text: "#FF4B9A", border: "#FF4B9A40" },
};

function getCategoryStyle(category: string) {
  return (
    CATEGORY_COLORS[category] || {
      bg: "#16E0E615",
      text: "#16E0E6",
      border: "#16E0E640",
    }
  );
}

function ThumbnailFallback({ category }: { category: string }) {
  const style = getCategoryStyle(category);
  const icons: Record<string, string> = {
    "Editing Videos": "🎬",
    "ZIP Files": "📦",
    Presets: "🎨",
    Overlays: "✨",
  };
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-2"
      style={{
        background: `linear-gradient(135deg, ${style.bg}, transparent)`,
      }}
    >
      <span className="text-4xl">{icons[category] || "📁"}</span>
      <span className="text-xs font-medium" style={{ color: style.text }}>
        {category}
      </span>
    </div>
  );
}

export function FileCard({ file, size = "small", index = 0 }: FileCardProps) {
  const catStyle = getCategoryStyle(file.category);

  function handleDownload() {
    window.open(file.downloadUrl, "_blank");
    addToDownloadHistory({
      id: file.id.toString(),
      title: file.title,
      category: file.category,
      thumbnailUrl: file.thumbnailUrl,
      downloadUrl: file.downloadUrl,
    });
  }

  const isLarge = size === "large";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="card-hover group cursor-pointer"
      data-ocid={`file.item.${index + 1}`}
    >
      {/* Gradient border wrapper */}
      <div
        style={{
          background: `linear-gradient(135deg, ${catStyle.border}, #B34BFF40)`,
          padding: "1px",
          borderRadius: "12px",
        }}
      >
        <div
          className="rounded-xl overflow-hidden flex flex-col"
          style={{ background: "#0B0F18" }}
        >
          {/* Thumbnail */}
          <div
            className="relative overflow-hidden bg-surface-02"
            style={{ height: isLarge ? "200px" : "150px" }}
          >
            {file.thumbnailUrl ? (
              <img
                src={file.thumbnailUrl}
                alt={file.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    const fallback = document.createElement("div");
                    fallback.className = "w-full h-full";
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <ThumbnailFallback category={file.category} />
            )}
            {/* Featured badge */}
            {file.featured && (
              <div
                className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: "linear-gradient(90deg, #16E0E6, #B34BFF)",
                  color: "#000",
                  boxShadow: "0 0 12px #16E0E660",
                }}
              >
                FEATURED
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3 flex flex-col gap-2">
            {/* Category badge */}
            <span
              className="self-start text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{
                background: catStyle.bg,
                color: catStyle.text,
                border: `1px solid ${catStyle.border}`,
              }}
            >
              {file.category}
            </span>

            {/* Title */}
            <h3
              className="font-semibold text-white leading-tight"
              style={{ fontSize: isLarge ? "16px" : "14px" }}
            >
              {file.title}
            </h3>

            {/* Download button */}
            <button
              type="button"
              onClick={handleDownload}
              className="w-full mt-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200"
              style={{
                background: "linear-gradient(90deg, #16E0E6, #B34BFF)",
                color: "#000",
                boxShadow: "0 0 16px #16E0E640",
              }}
              data-ocid={`file.download_button.${index + 1}`}
            >
              <Download size={12} />
              Download
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
