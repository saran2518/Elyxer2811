import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Sparkles, Heart, MessageCircle } from "lucide-react";
import { useEarlyAccess } from "./EarlyAccessProvider";

export type NavTab = "Profile" | "Moments" | "Discover" | "Interests" | "Chat";

const TAB_ROUTES: Record<NavTab, string> = {
  Profile: "/profile",
  Moments: "/moments",
  Discover: "/discover",
  Interests: "/interests",
  Chat: "/chat",
};

/** Tabs locked in Early Access mode — they stay visible but open the sheet. */
const LOCKED_TABS: NavTab[] = [];

const InfinityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z" />
  </svg>
);

const TAB_ICONS: Record<NavTab, React.ReactNode> = {
  Profile: <Users className="h-5 w-5" />,
  Moments: <Sparkles className="h-5 w-5" />,
  Discover: <InfinityIcon />,
  Interests: <Heart className="h-5 w-5" />,
  Chat: <MessageCircle className="h-5 w-5" />,
};

/**
 * Shared global bottom navigation. In Early Access mode, locked tabs
 * (Moments, Interests, Chat) open the "Your spot is saved" sheet
 * instead of navigating.
 */
const BottomNav = ({ active }: { active: NavTab }) => {
  const navigate = useNavigate();
  const { enabled, openLocked } = useEarlyAccess();

  const handleTap = (tab: NavTab) => {
    if (tab === active) return;
    if (enabled && LOCKED_TABS.includes(tab)) {
      openLocked();
      return;
    }
    navigate(TAB_ROUTES[tab]);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/85 backdrop-blur-2xl border-t border-border/20 z-30">
      <div className="flex items-center justify-around py-2.5 px-4 max-w-md mx-auto">
        {(Object.keys(TAB_ROUTES) as NavTab[]).map((tab) => (
          <NavItem
            key={tab}
            icon={TAB_ICONS[tab]}
            label={tab}
            active={tab === active}
            onClick={() => handleTap(tab)}
          />
        ))}
      </div>
    </nav>
  );
};

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all duration-300 ${
        active ? "text-primary" : "text-muted-foreground/60 hover:text-foreground active:scale-90"
      }`}
    >
      <motion.div
        animate={active ? { scale: 1.1 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {icon}
      </motion.div>
      <span className={`text-[10px] font-medium leading-none ${active ? "font-semibold" : ""}`}>{label}</span>
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-5 rounded-full"
          style={{ background: "var(--gradient-warm)" }}
        />
      )}
    </button>
  );
}

export default BottomNav;
