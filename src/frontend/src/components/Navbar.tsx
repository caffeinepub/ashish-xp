import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { History, LogOut, Menu, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { clearSessions } from "../utils/auth";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  showSearch?: boolean;
}

export function Navbar({
  searchQuery = "",
  onSearchChange,
  showSearch = true,
}: NavbarProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    clearSessions();
    navigate({ to: "/" });
  }

  const isActive = (path: string) => routerState.location.pathname === path;

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(20px)",
        borderColor: "#1A243680",
        boxShadow: "0 1px 0 #16E0E610",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex-shrink-0" data-ocid="nav.link">
          <span
            className="text-xl font-bold tracking-widest uppercase font-jakarta"
            style={{
              background: "linear-gradient(90deg, #16E0E6, #B34BFF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 8px #16E0E660)",
            }}
          >
            ASHISH XP
          </span>
        </Link>

        {/* Search — desktop */}
        {showSearch && (
          <div className="hidden sm:flex flex-1 max-w-md relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#16E0E6" }}
            />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full text-sm text-white placeholder-gray-500 outline-none transition-all"
              style={{
                background: "#0B0F18",
                border: "1px solid #1A2436",
                boxShadow: searchQuery
                  ? "0 0 0 1px #16E0E6, 0 0 12px #16E0E630"
                  : undefined,
              }}
              onFocus={(e) => {
                e.target.style.border = "1px solid #16E0E6";
                e.target.style.boxShadow =
                  "0 0 0 1px #16E0E6, 0 0 12px #16E0E630";
              }}
              onBlur={(e) => {
                if (!searchQuery) {
                  e.target.style.border = "1px solid #1A2436";
                  e.target.style.boxShadow = "";
                }
              }}
              data-ocid="nav.search_input"
            />
          </div>
        )}

        {/* Nav links — desktop */}
        <nav className="hidden sm:flex items-center gap-1">
          <NavLink
            to="/dashboard"
            active={isActive("/dashboard")}
            label="Dashboard"
          />
          <NavLink
            to="/history"
            active={isActive("/history")}
            label="History"
            icon={<History size={14} />}
          />
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{ color: "#8B95A7" }}
            data-ocid="nav.logout_button"
          >
            <LogOut size={14} />
            <span>Lock</span>
          </button>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="sm:hidden p-2 rounded-lg"
          style={{ color: "#16E0E6" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          data-ocid="nav.mobile_toggle"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile search */}
      {showSearch && (
        <div className="sm:hidden px-4 pb-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#16E0E6" }}
            />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full text-sm text-white placeholder-gray-500 outline-none"
              style={{ background: "#0B0F18", border: "1px solid #1A2436" }}
              data-ocid="nav.search_input_mobile"
            />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-t"
            style={{ background: "#050708", borderColor: "#1A2436" }}
          >
            <div className="flex flex-col px-4 py-3 gap-1">
              <MobileNavLink
                to="/dashboard"
                label="Dashboard"
                onClick={() => setMobileOpen(false)}
              />
              <MobileNavLink
                to="/history"
                label="Download History"
                onClick={() => setMobileOpen(false)}
              />
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg text-sm"
                style={{ color: "#8B95A7" }}
              >
                Lock App
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({
  to,
  active,
  label,
  icon,
}: { to: string; active: boolean; label: string; icon?: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all relative"
      style={{
        color: active ? "#16E0E6" : "#8B95A7",
        background: active ? "#16E0E610" : "transparent",
      }}
      data-ocid="nav.link"
    >
      {icon}
      {label}
      {active && (
        <span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
          style={{ background: "linear-gradient(90deg, #16E0E6, #B34BFF)" }}
        />
      )}
    </Link>
  );
}

function MobileNavLink({
  to,
  label,
  onClick,
}: { to: string; label: string; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="px-3 py-2 rounded-lg text-sm font-medium"
      style={{ color: "#A7B0C0" }}
      data-ocid="nav.link"
    >
      {label}
    </Link>
  );
}
