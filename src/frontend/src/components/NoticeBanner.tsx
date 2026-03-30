import { Megaphone, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface NoticeBannerProps {
  message: string;
}

export function NoticeBanner({ message }: NoticeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!message || !message.trim()) return null;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative px-4 py-3 flex items-center justify-center gap-3 text-sm font-medium"
          style={{
            background: "linear-gradient(90deg, #16E0E620, #B34BFF20)",
            borderBottom: "1px solid #16E0E630",
          }}
          data-ocid="notice.panel"
        >
          <Megaphone size={16} style={{ color: "#16E0E6", flexShrink: 0 }} />
          <span style={{ color: "#E0E8F0" }}>{message}</span>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all hover:bg-white/10"
            style={{ color: "#8B95A7" }}
            data-ocid="notice.close_button"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
