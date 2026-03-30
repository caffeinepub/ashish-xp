import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";
import { hashPassword, isUnlocked, setUnlocked } from "../utils/auth";

export function LockScreen() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    if (isUnlocked()) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !password) return;

    setIsLoading(true);
    setError("");

    try {
      const hash = await hashPassword(password);
      const valid = await actor.verifyAccessPassword(hash);
      if (valid) {
        setUnlocked();
        navigate({ to: "/dashboard", replace: true });
      } else {
        setError("Access Denied");
        setShakeKey((k) => k + 1);
        setPassword("");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #0B0F1880 0%, #000000 60%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Ambient glow orbs */}
      <div
        className="fixed top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #16E0E610 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #B34BFF10 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Lock card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative"
      >
        {/* Gradient border */}
        <div
          style={{
            background: "linear-gradient(135deg, #16E0E6, #B34BFF)",
            padding: "1px",
            borderRadius: "20px",
            boxShadow: "0 0 60px #16E0E620, 0 0 100px #B34BFF10",
          }}
        >
          <div
            className="rounded-[19px] p-8 sm:p-10"
            style={{
              background: "rgba(11, 15, 24, 0.95)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Brand */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                style={{
                  background: "linear-gradient(135deg, #16E0E620, #B34BFF20)",
                  border: "1px solid #16E0E640",
                  boxShadow: "0 0 24px #16E0E630",
                }}
              >
                <Shield size={28} style={{ color: "#16E0E6" }} />
              </motion.div>

              <h1
                className="text-4xl font-bold tracking-widest uppercase mb-1 font-jakarta"
                style={{
                  background: "linear-gradient(90deg, #16E0E6, #B34BFF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 12px #16E0E660)",
                }}
              >
                ASHISH XP
              </h1>
              <p
                className="text-xs tracking-[0.25em] uppercase"
                style={{ color: "#4BFFA0" }}
              >
                Video Editing Assets
              </p>

              <div className="mt-5 mb-6">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
                  style={{
                    background: "#16E0E610",
                    border: "1px solid #16E0E630",
                    color: "#16E0E6",
                  }}
                >
                  <Lock size={10} />
                  ACCESS PROTECTED
                </div>
              </div>

              <p className="text-sm" style={{ color: "#8B95A7" }}>
                Enter your access password to unlock the vault.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="lock-password"
                  className="block text-xs font-semibold tracking-[0.2em] uppercase mb-2"
                  style={{ color: "#A7B0C0" }}
                >
                  Password
                </label>
                <motion.div
                  key={shakeKey}
                  animate={shakeKey > 0 ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter password..."
                    className="w-full px-4 py-3 pr-12 rounded-xl text-white placeholder-gray-600 outline-none transition-all"
                    style={{
                      background: "#060A12",
                      border: error ? "1px solid #FF4B4B" : "1px solid #1A2436",
                      boxShadow: error
                        ? "0 0 0 1px #FF4B4B, inset 0 0 12px #FF4B4B10"
                        : undefined,
                    }}
                    onFocus={(e) => {
                      if (!error) {
                        e.target.style.border = "1px solid #16E0E6";
                        e.target.style.boxShadow =
                          "0 0 0 1px #16E0E640, 0 0 16px #16E0E620";
                      }
                    }}
                    onBlur={(e) => {
                      if (!error) {
                        e.target.style.border = "1px solid #1A2436";
                        e.target.style.boxShadow = "";
                      }
                    }}
                    id="lock-password"
                    data-ocid="lock.input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                    style={{ color: "#8B95A7" }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </motion.div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm font-semibold"
                    style={{ color: "#FF4B4B" }}
                    data-ocid="lock.error_state"
                  >
                    ⚠ {error}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full py-3.5 rounded-xl font-bold tracking-[0.15em] uppercase text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(90deg, #16E0E6, #B34BFF)",
                  color: "#000",
                  boxShadow: isLoading
                    ? undefined
                    : "0 0 24px #16E0E650, 0 0 48px #B34BFF20",
                }}
                data-ocid="lock.submit_button"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "UNLOCK"
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-xs"
        style={{ color: "#3A4456" }}
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
      </motion.footer>
    </div>
  );
}
