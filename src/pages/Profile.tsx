import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Sparkles,
  Heart,
  MessageCircle,
  Crown,
  Settings,
  ChevronRight,
  Edit3,
  Eye,
  BookOpen,
  HelpCircle,
  MapPin,
  GraduationCap,
  Globe,
  Briefcase,
} from "lucide-react";
import { PROFILES } from "@/lib/profilesData";
import SubscriptionsSection from "@/components/profile/SubscriptionsSection";
import SettingsSection from "@/components/profile/SettingsSection";
import { Button } from "@/components/ui/button";

const userProfile = PROFILES[0];

type SectionKey = "profile" | "subscriptions" | "settings";

const sections: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
  { key: "profile", label: "Profile", icon: <Users className="h-4 w-4" /> },
  { key: "subscriptions", label: "Subscriptions", icon: <Crown className="h-4 w-4" /> },
  { key: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
];

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } },
};

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialTab = (location.state as { openTab?: SectionKey } | null)?.openTab ?? "profile";
  const [activeSection, setActiveSection] = useState<SectionKey>(initialTab);

  useEffect(() => {
    const next = (location.state as { openTab?: SectionKey } | null)?.openTab;
    if (next) setActiveSection(next);
  }, [location.state]);

  return (
    <div className="h-screen bg-background flex flex-col pb-24 overflow-hidden">
      {/* Static Header + Tabs */}
      <div className="shrink-0 z-30 bg-background">
        <header className="px-4 pt-3 pb-2">
          <div
            className="flex items-center gap-3 rounded-full border border-border/30 bg-card/80 backdrop-blur-xl px-5 py-3"
            style={{ boxShadow: "0 4px 24px -4px hsl(var(--foreground) / 0.04)" }}
          >
            <span className="font-display text-base font-semibold text-foreground tracking-tight">Elyxer</span>
          </div>
        </header>

        {/* Section Tabs */}
        <div className="px-4 mt-2 mb-3">
          <div className="flex gap-1.5 p-1 rounded-2xl bg-muted/40">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  activeSection === s.key
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeSection === s.key && (
                  <motion.div
                    layoutId="profile-tab"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "var(--gradient-warm)" }}
                    transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {s.icon}
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <main className="flex-1 px-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeSection === "profile" && (
            <motion.div
              key="profile"
              variants={stagger.container}
              initial="initial"
              animate="animate"
              className="flex flex-col gap-4"
            >
              {/* Visiting Card */}
              <motion.div
                variants={stagger.item}
                className="relative rounded-[20px] overflow-hidden border border-border/30 bg-card"
                style={{ boxShadow: "0 8px 32px -8px hsl(var(--foreground) / 0.08), 0 2px 8px -2px hsl(var(--foreground) / 0.04)" }}
              >
                {/* Accent strip */}
                <div className="h-[3px] w-full" style={{ background: "var(--gradient-warm)" }} />

                {/* Light tinted section – skips avatar area via clip-path */}
                <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "calc(3px + 20px + 58px + 16px + 24px + 4px + 18px + 16px)", background: "linear-gradient(to bottom, hsl(var(--primary) / 0.12), hsl(var(--primary) / 0.05))", clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 calc(3px + 20px + 58px + 16px), calc(20px + 58px + 16px) calc(3px + 20px + 58px + 16px), calc(20px + 58px + 16px) calc(3px + 12px), calc(12px) calc(3px + 12px), calc(12px) calc(3px + 20px + 58px + 16px), 0 calc(3px + 20px + 58px + 16px))" }} />

                {/* Decorative corner motif */}
                <div className="absolute top-3 right-0 w-24 h-24 opacity-[0.035] pointer-events-none">
                  <div className="w-full h-full rounded-full" style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }} />
                </div>

                <div className="px-5 pt-5 pb-4">
                  {/* Top row: avatar + actions */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-[58px] h-[58px] rounded-2xl overflow-hidden ring-2 ring-primary/10 ring-offset-2 ring-offset-card shadow-lg">
                      <img src={userProfile.photos[0]} alt={userProfile.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => navigate("/preview", { state: { selfView: true } })}
                        size="sm"
                        variant="outline"
                        className="rounded-xl gap-1.5 h-8 text-[12px] font-medium border-border/40 hover:bg-primary/5 hover:border-primary/30 shrink-0 shadow-sm"
                      >
                        <Eye className="h-3.5 w-3.5 text-primary" />
                        View
                      </Button>
                      <Button
                        onClick={() => navigate("/edit-profile")}
                        size="sm"
                        variant="outline"
                        className="rounded-xl gap-1.5 h-8 text-[12px] font-medium border-border/40 hover:bg-primary/5 hover:border-primary/30 shrink-0 shadow-sm"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-primary" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => navigate("/manage-photos")}
                        size="sm"
                        variant="outline"
                        className="rounded-xl gap-1.5 h-8 text-[12px] font-medium border-border/40 hover:bg-primary/5 hover:border-primary/30 shrink-0 shadow-sm"
                      >
                        <Eye className="h-3.5 w-3.5 text-primary" />
                        Photos
                      </Button>
                    </div>
                  </div>

                  {/* Name & age */}
                  <h2 className="text-[19px] font-display font-bold text-foreground tracking-tight leading-tight">
                    {userProfile.name}, {userProfile.age}
                  </h2>

                  {/* Profession & Specialization */}
                  <p className="text-[13px] text-foreground/70 mt-1 font-medium tracking-tight">
                    {userProfile.profession} · {userProfile.specialization}
                  </p>
                </div>

                {/* Divider with dot accent */}
                <div className="mx-5 flex items-center gap-2">
                  <div className="flex-1 h-px bg-border/25" />
                  <div className="h-1 w-1 rounded-full bg-primary/30" />
                  <div className="flex-1 h-px bg-border/25" />
                </div>

                {/* Detail chips */}
                <div className="px-5 pt-3 pb-4 flex flex-wrap gap-1.5">
                  <DetailChip icon={<MapPin className="h-3 w-3 text-primary/60" />} label={userProfile.location} />
                  <DetailChip icon={<GraduationCap className="h-3 w-3 text-primary/60" />} label={userProfile.about.education} />
                  <DetailChip icon={<Globe className="h-3 w-3 text-primary/60" />} label={userProfile.languages.slice(0, 3).join(", ")} />
                </div>
              </motion.div>

              {/* Quick Actions Grid */}
              <motion.div variants={stagger.item}>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 px-1">Quick Actions</p>
                <div className="grid grid-cols-2 gap-3">
                  {/* Reserved for future features */}
                </div>
              </motion.div>

              {/* Resources */}
              <motion.div variants={stagger.item}>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 px-1">Resources</p>
                <div className="rounded-[20px] border border-border/30 bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
                  <ResourceRow
                    icon={<BookOpen className="h-5 w-5" />}
                    title="Dating Tips"
                    subtitle="Boost your profile and get more matches"
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
          )}
        </AnimatePresence>
        {activeSection === "subscriptions" && <SubscriptionsSection />}
        {activeSection === "settings" && <SettingsSection />}
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

function ResourceRow({ icon, title, subtitle, gradient, onClick }: { icon: React.ReactNode; title: string; subtitle: string; gradient: string; onClick: () => void }) {
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
        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>
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

export default Profile;
