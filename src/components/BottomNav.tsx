import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Sparkles, Heart, MessageCircle } from "lucide-react";

type NavItemKey = "profile" | "moments" | "discover" | "interests" | "chat";

const navItems: { key: NavItemKey; label: string; icon: React.ReactNode; path: string }[] = [
  { key: "profile", label: "Profile", icon: <Users className="h-[22px] w-[22px]" strokeWidth={2} />, path: "/profile" },
  { key: "moments", label: "Moments", icon: <Sparkles className="h-[22px] w-[22px]" strokeWidth={2} />, path: "/moments" },
  { key: "discover", label: "Discover", icon: <InfinityIcon />, path: "/discover" },
  { key: "interests", label: "Interests", icon: <Heart className="h-[22px] w-[22px]" strokeWidth={2} />, path: "/interests" },
  { key: "chat", label: "Chat", icon: <MessageCircle className="h-[22px] w-[22px]" strokeWidth={2} />, path: "/chat" },
];

function InfinityIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
    </svg>
  );
}

interface BottomNavProps {
  active?: NavItemKey;
}

export default function BottomNav({ active: activeProp }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const active = activeProp || getActiveKey(location.pathname);

  return (
    <nav className="fixed bottom-5 left-4 right-4 z-30 pointer-events-none">
      <div className="max-w-md mx-auto flex items-center justify-between px-5 py-3 rounded-[32px] bg-card/75 backdrop-blur-2xl border border-border/50 shadow-[0_8px_32px_-8px_hsl(var(--foreground)/0.14)] pointer-events-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            active={active === item.key}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
    </nav>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-1 p-1.5 min-w-[56px] transition-colors duration-300"
    >
      <motion.div
        animate={active ? { scale: 1.05, y: -1 } : { scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={
          active
            ? "text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.35)]"
            : "text-muted-foreground/50 hover:text-foreground/70"
        }
      >
        {icon}
      </motion.div>
      <span
        className={`text-[10px] leading-none tracking-tight ${
          active ? "font-semibold text-primary" : "font-medium text-muted-foreground/60"
        }`}
      >
        {label}
      </span>
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full"
          style={{ background: "var(--gradient-warm)" }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </button>
  );
}

function getActiveKey(pathname: string): NavItemKey {
  if (pathname.startsWith("/profile")) return "profile";
  if (pathname.startsWith("/moments")) return "moments";
  if (pathname.startsWith("/discover")) return "discover";
  if (pathname.startsWith("/interests")) return "interests";
  if (pathname.startsWith("/chat")) return "chat";
  return "profile";
}
