import { useState } from "react";
import elyxerLogo from "@/assets/elyxer-logo.png.asset.json";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Sparkles,
  Heart,
  MessageCircle,
  Crown,
  Settings,
  ChevronRight,
  Edit3,
  BookOpen,
  HelpCircle,
  MapPin,
  GraduationCap,
  Globe,
  Briefcase,
  EyeOff,
  Camera,
  Eye,
  Info,
  PauseCircle,
  HeartPulse,
  Send,
  Wand2,
  Plus,
} from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PROFILES } from "@/lib/profilesData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const userProfile = PROFILES[0];

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } },
};

const Profile = () => {
  const navigate = useNavigate();
  const [pauseProfile, setPauseProfile] = useState(false);
  const [privateBrowsing, setPrivateBrowsing] = useState(false);
  const [infoOpen, setInfoOpen] = useState<"pause" | "private" | "combined" | null>(null);

  return (
    <div className="h-screen bg-background flex flex-col pb-24 overflow-hidden">
      {/* Static Header */}
      <div className="shrink-0 z-30 bg-background">
        <header className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={elyxerLogo.url}
                alt="Elyxer"
                className="h-9 w-9 rounded-xl object-cover"
              />
              <span className="text-[28px] leading-none text-[#0A0705] font-display font-normal">
                Elyxer
              </span>
            </div>

            <button
              onClick={() => navigate("/settings")}
              className="relative group flex items-center justify-center h-10 w-10 rounded-full transition-all duration-500 active:scale-95"
              aria-label="Open settings"
            >
              {/* Layered rings */}
              <div className="absolute inset-0 rounded-full border border-[hsl(43,74%,52%)]/30 scale-100 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-1 rounded-full border border-[hsl(38,65%,33%)]/20 bg-background/60 backdrop-blur-sm" />
              {/* Gear icon */}
              <Settings className="relative h-[18px] w-[18px] text-[hsl(38,65%,33%)] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" />
            </button>
          </div>
        </header>
      </div>

      {/* Scrollable Content */}
      <main className="flex-1 px-4 pt-10 overflow-y-auto">
        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-7"
        >
          {/* Visiting Card */}
          <motion.div
            variants={stagger.item}
            className="relative rounded-[20px] overflow-hidden border border-border/30 bg-card"
            style={{ boxShadow: "0 8px 32px -8px hsl(var(--foreground) / 0.08), 0 2px 8px -2px hsl(var(--foreground) / 0.04)" }}
          >
            {/* Light tinted gradient — covers full card, fading to transparent */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, hsl(var(--primary) / 0.12) 0%, hsl(var(--primary) / 0.05) 60%, transparent 100%)" }} />

            {/* Decorative corner motif */}
            <div className="absolute top-3 right-0 w-24 h-24 opacity-[0.035] pointer-events-none">
              <div className="w-full h-full rounded-full" style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }} />
            </div>

            <button
              onClick={() => navigate("/subscribe")}
              className="group absolute top-3 right-3 z-20 flex items-center gap-1.5 h-8 rounded-full px-3.5 border-0 shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 overflow-hidden"
              style={{ background: "var(--gradient-warm)" }}
              aria-label="Upgrade subscription"
            >
              {/* Metallic shimmer sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <Crown className="relative h-3 w-3 text-[#3D2E0A]" />
              <span className="relative text-[11px] font-bold tracking-wide text-[#3D2E0A] uppercase">Upgrade</span>
            </button>

            <div className="px-4 pt-4 pb-3">
              {/* Top row: avatar with anchored photo CTA + name block */}
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <div className="relative w-[54px] h-[54px] rounded-2xl overflow-hidden ring-2 ring-primary/10 ring-offset-2 ring-offset-card shadow-lg">
                    <img src={userProfile.photos[0]} alt={userProfile.name} className="w-full h-full object-cover" />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => navigate("/manage-photos")}
                    className="absolute -bottom-1.5 -right-1.5 z-20 h-6 w-6 rounded-lg flex items-center justify-center border border-background text-primary-foreground shadow-md hover:scale-105 transition-transform"
                    style={{ background: "var(--gradient-warm)" }}
                    aria-label="Manage Photos"
                  >
                    <Camera className="h-3 w-3" />
                  </motion.button>
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <h2 className="text-[18px] font-display font-bold text-foreground tracking-tight leading-tight truncate">
                    {userProfile.name}, {userProfile.age}
                  </h2>
                  <p className="text-[12px] text-foreground/70 mt-0.5 font-medium tracking-tight truncate">
                    {userProfile.profession} · {userProfile.specialization}
                  </p>
                </div>
              </div>

              {/* Detail chips */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                <DetailChip icon={<MapPin className="h-3 w-3 text-primary/60" />} label={userProfile.location} />
                <DetailChip icon={<GraduationCap className="h-3 w-3 text-primary/60" />} label={userProfile.about.education} />
                <DetailChip icon={<Globe className="h-3 w-3 text-primary/60" />} label={userProfile.languages.slice(0, 3).join(", ")} />
              </div>
            </div>

            {/* Paired action bar — opaque frosted capsule with gold text/icons */}
            <div className="px-3 pb-3 pt-0 border-t border-border/20 mt-0 pt-3">
              <div className="flex items-center h-9 rounded-full border border-primary/30 bg-background/40 backdrop-blur-sm shadow-sm overflow-hidden">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/edit-profile")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-full text-primary text-[11px] font-semibold tracking-wide hover:bg-primary/5 transition-all"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Profile</span>
                </motion.button>
                <div className="w-px h-5 bg-primary/20" />
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/preview", { state: { selfView: true } })}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-full text-primary text-[11px] font-semibold tracking-wide hover:bg-primary/5 transition-all"
                >
                  <span>View Profile</span>
                  <Eye className="h-3.5 w-3.5 opacity-90" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Buy Extras */}
          <motion.div variants={stagger.item}>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2.5 px-1 text-transparent bg-clip-text" style={{ backgroundImage: "var(--gradient-warm)" }}>Buy Extras</p>
            <div className="grid grid-cols-3 gap-2 pb-2">
              <PurchaseItem icon={<HeartPulse className="h-5 w-5" />} label="Vibes" count={10} onClick={() => navigate("/buy-extras?item=vibes")} />
              <PurchaseItem icon={<Send className="h-5 w-5" />} label="Invites" count={1} onClick={() => navigate("/buy-extras?item=invites")} />
              <PurchaseItem icon={<Wand2 className="h-5 w-5" />} label="Magic" count={1} onClick={() => navigate("/buy-extras?item=search")} />
            </div>
          </motion.div>


          {/* Resources */}
          <motion.div variants={stagger.item}>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 px-1">Resources</p>
            <div className="rounded-[20px] border border-border/30 bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
              <ResourceRow
                icon={<BookOpen className="h-5 w-5" />}
                title="Dating Guide"
                subtitle="Date smarter, connect deeper"
                gradient="from-primary/12 to-accent/8"
                onClick={() => navigate("/dating-tips")}
              />
              <div className="h-px bg-border/15 mx-4" />
              <ResourceRow
                icon={<HelpCircle className="h-5 w-5" />}
                title="Help & FAQ"
                subtitle="Find answers to common questions"
                gradient="from-accent/12 to-primary/8"
                onClick={() => navigate("/help-faq")}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Info dialog for Pause / Private toggles */}
        <Dialog open={infoOpen !== null} onOpenChange={(o) => !o && setInfoOpen(null)}>
          <DialogContent className="p-0 overflow-hidden rounded-[28px] max-w-[92vw] sm:max-w-md border border-primary/20 bg-card/85 backdrop-blur-2xl shadow-2xl">
            {/* Top accent bar */}
            <div className="h-[2px] w-full" style={{ background: "var(--gradient-warm)" }} />

            <DialogHeader className="pt-7 pb-5 px-6 text-center">
              <div className="mx-auto mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full p-[1px]" style={{ background: "var(--gradient-warm)" }}>
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                  <Info className="h-5 w-5 text-primary" />
                </div>
              </div>
              <DialogTitle className="sr-only">Profile &amp; Presence</DialogTitle>
              <h2 className="text-[22px] font-display font-semibold text-foreground tracking-wide">
                Profile &amp; Presence
              </h2>
              <div className="mt-2 h-px w-12 mx-auto" style={{ background: "linear-gradient(to right, transparent, hsl(var(--primary)), transparent)" }} />
            </DialogHeader>

            <DialogDescription asChild>
              <div className="px-5 pb-6 space-y-3">
                {/* Pause Profile */}
                <div className="p-4 rounded-2xl border border-border/20 bg-background/40">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <PauseCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-semibold text-foreground">Pause Profile</h3>
                      <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                        Temporarily hide from discovery. You won't appear in recommendations, but your existing vibes, invites and chats stay untouched.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Private Browsing */}
                <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <EyeOff className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-[13px] font-semibold text-foreground">Private Browsing</h3>
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-bold text-primary-foreground border-0 rounded-full" style={{ background: "var(--gradient-warm)" }}>
                          Infinity
                        </Badge>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                        Browse profiles without being seen. Your activity won't notify others while this is on, so you can explore freely.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Travel */}
                <div className="p-4 rounded-2xl border border-border/20 bg-background/40 opacity-70">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0 w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-[13px] font-semibold text-foreground">Travel</h3>
                        <span className="text-[10px] italic text-muted-foreground uppercase tracking-tighter">Coming soon</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                        Discover and connect in other cities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogDescription>

            <div className="px-6 pb-7">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setInfoOpen(null)}
                className="w-full h-12 rounded-full text-sm font-semibold tracking-wide text-primary-foreground shadow-lg"
                style={{ background: "var(--gradient-warm)" }}
              >
                Got it
              </motion.button>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border/20 z-30">
        <div className="flex items-center justify-around py-2.5 px-2">
          <NavItem icon={<Users className="h-5 w-5" />} label="Profile" active />
          <NavItem icon={<Sparkles className="h-5 w-5" />} label="Moments" onClick={() => navigate("/moments")} />
          <NavItem icon={<InfinityIcon />} label="Discover" onClick={() => navigate("/discover")} />
          <NavItem icon={<Heart className="h-5 w-5" />} label="Interests" onClick={() => navigate("/interests")} />
          <NavItem icon={<MessageCircle className="h-5 w-5" />} label="Chat" onClick={() => navigate("/chat")} />
        </div>
      </nav>
    </div>
  );
};

/* ── Sub-components ── */

function QuickActionCard({ icon, title, subtitle, onClick }: { icon: React.ReactNode; title: string; subtitle: string; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="rounded-[16px] border border-border/30 bg-card px-3.5 py-3 text-left group hover:border-primary/20 transition-all flex flex-col gap-2.5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center shrink-0 group-hover:from-primary/15 group-hover:to-accent/10 transition-all">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-foreground leading-tight">{title}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{subtitle}</p>
      </div>
    </motion.button>
  );
}

function ToggleCard({
  icon,
  label,
  subtitle,
  badge,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  badge?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      className="rounded-[18px] border border-border/30 bg-card px-2 py-3.5 flex flex-col items-center text-center gap-2"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[12px] font-semibold text-foreground leading-tight">{label}</span>
        <span className="text-[10px] text-muted-foreground/70 leading-tight">{subtitle}</span>
        {badge && (
          <Badge variant="secondary" className="text-[8px] px-1 py-0 font-bold bg-primary/10 text-primary border-0 rounded-md mt-0.5">
            {badge}
          </Badge>
        )}
      </div>
      {action && <div className="mt-0.5">{action}</div>}
    </motion.div>
  );
}

function ResourceRow({ icon, title, subtitle, gradient, onClick }: { icon: React.ReactNode; title: string; subtitle?: string; gradient: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left group hover:bg-muted/20 transition-colors"
    >
      <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 text-primary`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">{title}</p>
        {subtitle && <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary/50 transition-colors shrink-0" />
    </button>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all duration-200 ${
        active ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium leading-none">{label}</span>
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary"
        />
      )}
    </button>
  );
}

function DetailChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/40 text-[11px] text-muted-foreground font-medium">
      {icon}
      {label}
    </span>
  );
}

function InfinityIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
    </svg>
  );
}

function PurchaseItem({ icon, label, count, onClick }: { icon: React.ReactNode; label: string; count: number; onClick?: () => void }) {
  return (
    <div
      className="group relative rounded-[20px] border border-border/40 bg-card p-3 pb-4 flex flex-col items-center transition-all duration-300 hover:-translate-y-0.5"
      style={{ boxShadow: "0 4px 20px -4px hsl(var(--primary) / 0.08)" }}
    >
      <div
        className="h-8 w-8 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{ background: "var(--gradient-warm)", boxShadow: "0 2px 8px -2px hsl(var(--primary) / 0.3)" }}
      >
        <span className="text-primary-foreground">{icon}</span>
      </div>
      <div className="text-center mt-2">
        <div className="text-[10px] font-medium text-muted-foreground tracking-wide">{label}</div>
        <div className="text-[9px] font-semibold text-primary uppercase tracking-tight mt-0.5">{count} left</div>
      </div>
      <button
        onClick={onClick}
        aria-label={`Buy more ${label}`}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-card border border-border/40 flex items-center justify-center text-primary shadow-sm transition-all hover:scale-110 active:scale-95"
        style={{ boxShadow: "0 2px 8px -2px hsl(var(--primary) / 0.2)" }}
      >
        <Plus className="h-3 w-3" strokeWidth={3} />
      </button>
    </div>
  );
}

export default Profile;
