import { motion, AnimatePresence } from "framer-motion";
import {
  Pause,
  EyeOff,
  SlidersHorizontal,
  Wand2,
  Undo2,
  Users,
  Sparkles,
  Heart,
  MessageCircle,
  Search,
  MapPin,
  ChevronRight,
  ShieldCheck,
  HeartHandshake,
  Phone,
  Mail,
  Bell,
  MailOpen,
  Globe,
  FileText,
  Scale,
  LogOut,
  Trash2,
  HelpCircle,
  Info,
} from "lucide-react";

const FRAME_WIDTH = 375;
const FRAME_HEIGHT = 812;

const tokens = {
  text: "#0A0705",
  gold: "#C9A84C",
  cream: "#F2EFE8",
  surface: "#F7F5EF",
  surfaceSolid: "#FBFAF6",
  border: "#E4DFD2",
  muted: "#6B6459",
  bodyMuted: "#5A544A",
  bg: "#FFFFF6",
};

function InfinityIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
    </svg>
  );
}

function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`relative flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all duration-300 ${
        active ? "text-primary" : "text-muted-foreground/60"
      }`}
    >
      <motion.div animate={active ? { scale: 1.1 } : { scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
        {icon}
      </motion.div>
      <span className={`text-[10px] font-medium leading-none ${active ? "font-semibold" : ""}`}>{label}</span>
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-5 rounded-full"
          style={{ background: "var(--gradient-warm)" }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </button>
  );
}

function BottomNav({ active = "Discover" }: { active?: string }) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-card/85 backdrop-blur-2xl border-t border-border/20 z-30">
      <div className="flex items-center justify-around py-2.5 px-4">
        <NavItem icon={<Users className="h-5 w-5" />} label="Profile" active={active === "Profile"} />
        <NavItem icon={<Sparkles className="h-5 w-5" />} label="Moments" active={active === "Moments"} />
        <NavItem icon={<InfinityIcon />} label="Discover" active={active === "Discover"} />
        <NavItem icon={<Heart className="h-5 w-5" />} label="Interests" active={active === "Interests"} />
        <NavItem icon={<MessageCircle className="h-5 w-5" />} label="Chat" active={active === "Chat"} />
      </div>
    </nav>
  );
}

function DiscoverHeader({ paused = false, privateBrowsing = false }: { paused?: boolean; privateBrowsing?: boolean }) {
  return (
    <header className="px-4 pt-3 pb-2 absolute top-0 left-0 right-0 z-30">
      <div
        className="flex items-center justify-between rounded-2xl border border-border/30 bg-card/80 backdrop-blur-2xl px-4 py-2.5"
        style={{ boxShadow: "0 4px 32px -8px hsl(var(--foreground) / 0.06)" }}
      >
        <span className={paused ? "opacity-[0.45] pointer-events-none transition-opacity" : "transition-opacity"}>
          <button className="p-1.5 rounded-xl hover:bg-muted/40 transition-all duration-200 relative">
            <SlidersHorizontal className="h-5 w-5 text-foreground" />
          </button>
        </span>

        <span className={paused ? "opacity-[0.45] pointer-events-none transition-opacity" : "transition-opacity"}>
          <button className="font-body text-sm font-medium text-muted-foreground flex items-center gap-1.5 transition-colors group">
            <Wand2 className="h-3.5 w-3.5 text-primary group-hover:rotate-12 transition-transform duration-300" />
            Magic Search
          </button>
        </span>

        <div className="flex items-center gap-1.5">
          {privateBrowsing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="h-8 w-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(242,239,232,0.75)" }}
              aria-label="Private browsing on"
            >
              <EyeOff className="h-4 w-4" style={{ color: tokens.gold }} />
            </motion.div>
          )}
          <button
            className="p-1.5 rounded-xl hover:bg-muted/40 hover:scale-105 transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Undo last action"
          >
            <Undo2 className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}

function PausedState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex-1 flex flex-col items-center justify-center px-6 text-center"
    >
      <div
        className="rounded-full flex items-center justify-center mb-6"
        style={{ width: 76, height: 76, background: tokens.cream, border: "0.5px solid #E4DFD2" }}
      >
        <Pause style={{ width: 34, height: 34, color: tokens.gold }} />
      </div>
      <h2 className="font-display text-[22px] leading-tight" style={{ color: tokens.text }}>
        Profile paused
      </h2>
      <p className="mt-3 font-body text-[14px]" style={{ color: tokens.muted, lineHeight: 1.5 }}>
        Discovery is paused.
      </p>
      <p className="font-body text-[14px]" style={{ color: tokens.muted, lineHeight: 1.5 }}>
        Existing connections and chats stay active.
      </p>
      <button
        className="mt-8 flex items-center justify-center text-[15px] font-semibold font-body transition-all active:scale-[0.98]"
        style={{
          width: "calc(100% - 40px)",
          maxWidth: 320,
          background: tokens.gold,
          color: tokens.text,
          borderRadius: 26,
          padding: 13,
        }}
      >
        Resume
      </button>
    </motion.div>
  );
}

function PrivateBrowsingPopup() {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto cursor-pointer"
        style={{
          width: "calc(100% - 52px)",
          maxWidth: 320,
          background: "rgba(247,245,239,0.55)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "0.5px solid rgba(255,255,255,0.6)",
          borderRadius: 20,
          padding: "22px 20px",
          boxSizing: "border-box",
          textAlign: "center",
          boxShadow: "0 18px 48px -16px rgba(10,7,5,0.15)",
        }}
      >
        <div
          className="mx-auto rounded-full flex items-center justify-center mb-4"
          style={{ width: 56, height: 56, background: "rgba(242,239,232,0.75)" }}
        >
          <EyeOff style={{ width: 26, height: 26, color: tokens.gold }} />
        </div>
        <h3 className="font-display" style={{ fontSize: 20, color: tokens.text, lineHeight: 1.25 }}>
          Private browsing on
        </h3>
        <p className="font-body mt-1.5" style={{ fontSize: 13, color: tokens.bodyMuted, lineHeight: 1.5 }}>
          Explore freely.
        </p>
      </motion.div>
    </div>
  );
}

function LiveFeedBackground() {
  return (
    <div className="flex-1 flex flex-col pt-24 px-4 pb-24">
      <div
        className="relative w-full rounded-3xl overflow-hidden bg-muted/30"
        style={{ aspectRatio: "3/4" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h2 className="font-display text-3xl leading-none">Ananya, 27</h2>
          <p className="font-body text-sm mt-1 opacity-90">UX Designer · Mumbai</p>
        </div>
      </div>
      <div className="mt-4 px-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
          <MapPin className="h-3.5 w-3.5" />
          <span>Home town</span>
        </div>
        <p className="font-display text-lg mt-1" style={{ color: tokens.text }}>
          Mumbai
        </p>
      </div>
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  subtitle,
  value,
  badge,
  action,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  value?: string;
  badge?: string;
  action?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-3.5 ${last ? "" : "border-b border-border/20"}`}
    >
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <div>
          <p className="font-body text-[14px] font-medium" style={{ color: tokens.text }}>
            {label}
          </p>
          {subtitle && <p className="font-body text-[12px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted/60 text-muted-foreground">
            {badge}
          </span>
        )}
        {value && <span className="font-body text-[13px] text-muted-foreground">{value}</span>}
        {action}
        {!action && !value && !badge && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </div>
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/30 bg-card/80 overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="px-4 pt-3 pb-2">
        <h3 className="font-body text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SettingsBackground() {
  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 space-y-3">
      <SettingsGroup title="Profile & Presence">
        <SettingsRow
          icon={<Pause className="h-4 w-4" />}
          label="Pause Profile"
          subtitle="Temporarily hide from discovery"
          value="Paused"
        />
        <SettingsRow icon={<MapPin className="h-4 w-4" />} label="Travel Mode" subtitle="Connect with people in other cities" badge="Coming Soon" />
        <SettingsRow
          icon={<EyeOff className="h-4 w-4" />}
          label="Private Browsing"
          subtitle="Browse without being seen"
          badge="Premium"
          value="On"
          last
        />
      </SettingsGroup>

      <SettingsGroup title="Safety">
        <SettingsRow icon={<HeartHandshake className="h-4 w-4" />} label="Dating Guide" subtitle="Date smarter, connect deeper" last />
      </SettingsGroup>

      <SettingsGroup title="Login & Security">
        <SettingsRow icon={<Phone className="h-4 w-4" />} label="Phone Number" subtitle="+91 •••• ••• 890" value="Verified" />
        <SettingsRow icon={<Mail className="h-4 w-4" />} label="Email Address" subtitle="Add or update your email" last />
      </SettingsGroup>

      <SettingsGroup title="Notifications">
        <SettingsRow icon={<Bell className="h-4 w-4" />} label="Push Notifications" subtitle="Matches, messages & more" />
        <SettingsRow icon={<MailOpen className="h-4 w-4" />} label="Email Notifications" subtitle="Weekly recaps & updates" last />
      </SettingsGroup>
    </div>
  );
}

function SettingsModal({
  icon,
  title,
  body,
}: {
  icon: "pause" | "eye-off";
  title: string;
  body?: string;
}) {
  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center" style={{ background: "rgba(10,7,5,0.28)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="w-full mx-[18px] box-border cursor-pointer"
        style={{
          maxWidth: 320,
          background: tokens.surfaceSolid,
          border: "0.5px solid #E4DFD2",
          borderRadius: 16,
          padding: 16,
          boxShadow: "0 18px 48px -16px rgba(10,7,5,0.25)",
        }}
      >
        <div className="flex gap-3" style={{ alignItems: body ? "flex-start" : "center" }}>
          <div
            className="shrink-0 rounded-full flex items-center justify-center"
            style={{ width: 34, height: 34, background: tokens.cream }}
          >
            {icon === "pause" ? (
              <Pause style={{ width: 18, height: 18, color: tokens.gold }} />
            ) : (
              <EyeOff style={{ width: 18, height: 18, color: tokens.gold }} />
            )}
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 500, color: tokens.text, lineHeight: 1.3 }}>{title}</p>
            {body && (
              <p style={{ fontSize: 13, color: tokens.muted, lineHeight: 1.5, marginTop: 3 }}>{body}</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Frame({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center">
      <p className="font-body text-sm mb-3" style={{ color: tokens.muted }}>
        {caption}
      </p>
      <div
        className="relative overflow-hidden bg-background shadow-2xl"
        style={{
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
          borderRadius: 28,
          border: "1px solid #E4DFD2",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function Mockups() {
  return (
    <div
      className="min-h-screen py-16 px-6 flex flex-col items-center gap-16"
      style={{ background: "#F5F3EE" }}
    >
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl" style={{ color: tokens.text }}>
          Presence State Mockups
        </h1>
        <p className="font-body text-sm" style={{ color: tokens.muted }}>
          Hidden internal route for exporting screenshot-ready frames
        </p>
      </div>

      {/* 1. Discover — Pause Profile on (blocked state) */}
      <Frame caption="1. Discover — Pause Profile on (blocked state)">
        <div className="min-h-full flex flex-col relative">
          <DiscoverHeader paused />
          <PausedState />
          <BottomNav active="Discover" />
        </div>
      </Frame>

      {/* 2. Discover — Private Browsing on (live feed + glass popup) */}
      <Frame caption="2. Discover — Private Browsing on (live feed + glass popup)">
        <div className="min-h-full flex flex-col relative">
          <DiscoverHeader privateBrowsing />
          <LiveFeedBackground />
          <PrivateBrowsingPopup />
          <BottomNav active="Discover" />
        </div>
      </Frame>

      {/* 3. Settings — Pause Profile modal (on) */}
      <Frame caption="3. Settings — Pause Profile modal (on)">
        <div className="min-h-full flex flex-col relative">
          <div className="px-4 pt-12 pb-4 text-center border-b border-border/20 bg-card/80">
            <h1 className="font-display text-2xl" style={{ color: tokens.text }}>
              Settings
            </h1>
          </div>
          <SettingsBackground />
          <SettingsModal icon="pause" title="Profile paused" body="Existing connections and chats stay active." />
        </div>
      </Frame>

      {/* 4. Settings — Pause Profile modal (off) */}
      <Frame caption="4. Settings — Pause Profile modal (off)">
        <div className="min-h-full flex flex-col relative">
          <div className="px-4 pt-12 pb-4 text-center border-b border-border/20 bg-card/80">
            <h1 className="font-display text-2xl" style={{ color: tokens.text }}>
              Settings
            </h1>
          </div>
          <SettingsBackground />
          <SettingsModal icon="pause" title="Profile active" body="You're back in discovery." />
        </div>
      </Frame>

      {/* 5. Settings — Private Browsing modal (on) */}
      <Frame caption="5. Settings — Private Browsing modal (on)">
        <div className="min-h-full flex flex-col relative">
          <div className="px-4 pt-12 pb-4 text-center border-b border-border/20 bg-card/80">
            <h1 className="font-display text-2xl" style={{ color: tokens.text }}>
              Settings
            </h1>
          </div>
          <SettingsBackground />
        <SettingsModal icon="eye-off" title="Private browsing on" body="Discover privately." />
        </div>
      </Frame>

      {/* 6. Settings — Private Browsing modal (off) */}
      <Frame caption="6. Settings — Private Browsing modal (off)">
        <div className="min-h-full flex flex-col relative">
          <div className="px-4 pt-12 pb-4 text-center border-b border-border/20 bg-card/80">
            <h1 className="font-display text-2xl" style={{ color: tokens.text }}>
              Settings
            </h1>
          </div>
          <SettingsBackground />
          <SettingsModal icon="eye-off" title="Private browsing off" />
        </div>
      </Frame>
    </div>
  );
}
