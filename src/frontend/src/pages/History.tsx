import { useNavigate } from "@tanstack/react-router";
import { Clock, Download, ExternalLink, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { isUnlocked } from "../utils/auth";
import {
  clearDownloadHistory,
  formatTimestamp,
  getDownloadHistory,
} from "../utils/downloadHistory";
import type { DownloadRecord } from "../utils/downloadHistory";

const CATEGORY_COLORS: Record<string, string> = {
  "Editing Videos": "#16E0E6",
  "ZIP Files": "#B34BFF",
  Presets: "#4BFFA0",
  Overlays: "#FF4B9A",
};

export function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<DownloadRecord[]>([]);

  useEffect(() => {
    if (!isUnlocked()) {
      navigate({ to: "/", replace: true });
      return;
    }
    setHistory(getDownloadHistory());
  }, [navigate]);

  function handleClear() {
    clearDownloadHistory();
    setHistory([]);
  }

  function handleRedownload(url: string) {
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen" style={{ background: "#000000" }}>
      <Navbar showSearch={false} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "#16E0E615", border: "1px solid #16E0E630" }}
            >
              <Clock size={18} style={{ color: "#16E0E6" }} />
            </div>
            <div>
              <h1 className="text-xl font-bold uppercase tracking-widest text-white">
                Download History
              </h1>
              <p className="text-xs" style={{ color: "#8B95A7" }}>
                {history.length} item{history.length !== 1 ? "s" : ""}{" "}
                downloaded
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all hover:bg-red-500/10"
              style={{ color: "#FF4B4B", border: "1px solid #FF4B4B30" }}
              data-ocid="history.delete_button"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          )}
        </motion.div>

        {/* List */}
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4 rounded-xl"
            style={{ background: "#0B0F1880", border: "1px dashed #1A2436" }}
            data-ocid="history.empty_state"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "#16E0E610", border: "1px solid #16E0E620" }}
            >
              <Download size={24} style={{ color: "#16E0E680" }} />
            </div>
            <p className="font-semibold text-white">No downloads yet</p>
            <p className="text-sm" style={{ color: "#8B95A7" }}>
              Files you download will appear here.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {history.map((record, i) => {
              const color = CATEGORY_COLORS[record.category] || "#16E0E6";
              return (
                <motion.div
                  key={`${record.id}-${record.timestamp}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 p-4 rounded-xl group"
                  style={{
                    background: "#0B0F18",
                    border: "1px solid #1A2436",
                    transition: "border-color 0.2s",
                  }}
                  data-ocid={`history.item.${i + 1}`}
                >
                  {/* Thumbnail */}
                  <div
                    className="w-14 h-14 rounded-lg flex-shrink-0 overflow-hidden"
                    style={{
                      background: `${color}15`,
                      border: `1px solid ${color}30`,
                    }}
                  >
                    {record.thumbnailUrl ? (
                      <img
                        src={record.thumbnailUrl}
                        alt={record.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">
                        📁
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">
                      {record.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ background: `${color}15`, color }}
                      >
                        {record.category}
                      </span>
                      <span className="text-xs" style={{ color: "#8B95A7" }}>
                        {formatTimestamp(record.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Re-download */}
                  <button
                    type="button"
                    onClick={() => handleRedownload(record.downloadUrl)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
                    style={{
                      background: "#16E0E610",
                      color: "#16E0E6",
                      border: "1px solid #16E0E630",
                    }}
                    data-ocid={`history.download_button.${i + 1}`}
                  >
                    <ExternalLink size={12} />
                    Get
                  </button>
                </motion.div>
              );
            })}
          </div>
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
      </footer>
    </div>
  );
}
