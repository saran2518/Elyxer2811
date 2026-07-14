import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Gem, Crown, HeartPulse, Send, Wand2, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Feature {
  included: boolean;
  label: string;
}

interface PlanData {
  planKey: "plus" | "infinity";
  icon: React.ReactNode;
  title: string;
  tagline: string;
  startingPrice: string;
  badge?: string;
  topFeatures: Feature[];
  moreFeatures: Feature[];
}

const plans: PlanData[] = [
  {
    planKey: "plus",
    icon: <Crown className="h-4 w-4" />,
    title: "Elyxer Plus",
    tagline: "More depth. More discovery.",
    startingPrice: "₹199",
    badge: "POPULAR",
    topFeatures: [
      { included: true, label: "Unlimited discover" },
      { included: true, label: "30 vibes/day" },
      { included: true, label: "5 invites/week" },
    ],
    moreFeatures: [
      { included: true, label: "10 magic search/week" },
      { included: true, label: "Virtual date rooms — 3/week, 10 min" },
      { included: true, label: "See who vibed you" },
      { included: true, label: "See who invited you" },
      { included: true, label: "Moments interact" },
      { included: true, label: "2 posts/week" },
      { included: true, label: "Enhanced visibility" },
      { included: true, label: "Profile unlock" },
      { included: true, label: "2 profile generations/week" },
    ],
  },
  {
    planKey: "infinity",
    icon: <Gem className="h-4 w-4" />,
    title: "Elyxer Infinity",
    tagline: "The complete Elyxer experience.",
    startingPrice: "₹299",
    badge: "BEST VALUE",
    topFeatures: [
      { included: true, label: "Priority discover" },
      { included: true, label: "Unlimited vibes" },
      { included: true, label: "10 invites/week" },
    ],
    moreFeatures: [
      { included: true, label: "Unlimited search" },
      { included: true, label: "Private browsing" },
      { included: true, label: "Virtual date rooms — unlimited, 10 min" },
      { included: true, label: "See who vibed you" },
      { included: true, label: "See who invited you" },
      { included: true, label: "Full moments interact" },
      { included: true, label: "4 posts/week" },
      { included: true, label: "Profile unlock" },
      { included: true, label: "Profile control" },
      { included: true, label: "Priority visibility" },
      { included: true, label: "Unlimited profile generation" },
    ],
  },
];

const SubscriptionsSection = () => {
  const navigate = useNavigate();
  const [vibeCount] = useState(10);
  const [inviteCount] = useState(1);
  const [searchCount] = useState(1);

  const [activeSub] = useState<{
    plan: "plus" | "infinity";
    nextBilling: string;
  } | null>({
    plan: "plus",
    nextBilling: "20 Jul 2026",
  });

  const activePlan = plans.find((p) => p.planKey === activeSub?.plan);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Current Status Ribbon */}
      <div className="rounded-2xl p-[1px]" style={{ background: "var(--gradient-warm)" }}>
        <div className="bg-card rounded-[15px] px-4 py-3 flex items-center justify-between">
          <div>
            <p
              className="text-[10px] uppercase tracking-widest font-bold text-transparent bg-clip-text mb-0.5"
              style={{ backgroundImage: "var(--gradient-warm)" }}
            >
              Current Status
            </p>
            <h2 className="font-display text-xl italic text-foreground leading-tight">
              {activeSub ? activePlan?.title : "Elyxer Basic"}
            </h2>
            {activeSub && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Renews {activeSub.nextBilling}
              </p>
            )}
          </div>
          <div className="h-11 w-11 rounded-full border border-primary/40 flex items-center justify-center bg-primary/5">
            <span className="text-[10px] font-bold uppercase tracking-wide text-primary">
              {activeSub ? "Plus" : "Free"}
            </span>
          </div>
        </div>
      </div>

      {/* Extras — bento grid */}
      <div className="space-y-3">
        <div className="flex items-end justify-between px-1">
          <h3 className="font-display text-base text-foreground">Your Extras</h3>
          <button
            onClick={() => navigate("/buy-extras?item=vibes")}
            className="text-[10px] font-bold uppercase tracking-widest text-foreground border-b border-accent pb-0.5"
          >
            Buy More
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <ExtraTile icon={<HeartPulse className="h-4 w-4" />} label="Vibes" count={vibeCount} onClick={() => navigate("/buy-extras?item=vibes")} />
          <ExtraTile icon={<Send className="h-4 w-4" />} label="Invites" count={inviteCount} onClick={() => navigate("/buy-extras?item=invites")} />
          <ExtraTile icon={<Wand2 className="h-4 w-4" />} label="Magic" count={searchCount} onClick={() => navigate("/buy-extras?item=search")} />
        </div>
      </div>

      {/* Curated Plans */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display text-base text-foreground">Curated Plans</h3>
          <div className="flex gap-1">
            {plans.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-accent" : "bg-accent/25"}`} />
            ))}
          </div>
        </div>
        <div className="-mx-4">
          <div
            className="flex gap-3 overflow-x-auto px-4 pb-3 snap-x snap-mandatory scrollbar-hide"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {plans.map((plan) => (
              <PlanCard
                key={plan.planKey}
                plan={plan}
                isActive={activeSub?.plan === plan.planKey}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="px-1 pt-1 text-center text-[10px] leading-relaxed text-muted-foreground">
        Elyxer is free to join and use, with Plus and Infinity designed for a richer experience.{" "}
        <button
          onClick={() => navigate("/terms")}
          className="inline text-primary underline underline-offset-2 hover:text-primary/80"
        >
          Terms & Conditions
        </button>
      </p>
    </motion.div>
  );
};

function ExtraTile({
  icon,
  label,
  count,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative aspect-square rounded-2xl border border-primary-glow/30 bg-primary-glow/5 flex flex-col items-center justify-center p-2 transition-all hover:border-primary/50 hover:bg-primary-glow/10 active:scale-[0.97]"
    >
      <div
        className="h-8 w-8 rounded-xl flex items-center justify-center mb-1.5 text-primary-foreground"
        style={{ background: "var(--gradient-warm)" }}
      >
        {icon}
      </div>
      <span
        className="text-lg font-bold leading-none text-transparent bg-clip-text"
        style={{ backgroundImage: "var(--gradient-warm)" }}
      >
        {count}
      </span>
      <p className="text-[9px] uppercase tracking-widest mt-1 text-muted-foreground">{label}</p>
      <span className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-card border border-primary/30 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        <Plus className="h-3 w-3" strokeWidth={3} />
      </span>
    </button>
  );
}

function PlanCard({ plan, isActive }: { plan: PlanData; isActive?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="relative rounded-3xl overflow-hidden snap-center shrink-0 flex flex-col"
      style={{
        width: "76vw",
        maxWidth: 300,
        background: "linear-gradient(140deg, hsl(var(--accent)) 0%, hsl(32 55% 28%) 100%)",
        boxShadow: "var(--shadow-elegant)",
      }}
    >
      {/* Aurora glow */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{ background: "hsl(var(--primary-glow))" }}
      />

      <div className="relative z-10 p-5 flex flex-col flex-1">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span style={{ color: "hsl(var(--primary-glow))" }}>{plan.icon}</span>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "hsl(var(--primary-glow))" }}
            >
              {plan.title.replace("Elyxer ", "Elyxer · ")}
            </span>
          </div>
          {isActive ? (
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary-glow text-accent"
            >
              ACTIVE
            </span>
          ) : (
            plan.badge && (
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
                style={{ borderColor: "hsl(var(--primary-glow) / 0.5)", color: "hsl(var(--primary-glow))" }}
              >
                {plan.badge}
              </span>
            )
          )}
        </div>

        {/* Tagline */}
        <p
          className="font-display italic text-[22px] leading-tight mb-4"
          style={{ color: "hsl(var(--primary-foreground))" }}
        >
          {plan.tagline}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-5">
          {plan.topFeatures.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: "hsl(var(--primary-foreground) / 0.92)" }}>
              <span style={{ color: "hsl(var(--primary-glow))" }}>•</span>
              {f.label}
            </li>
          ))}
        </ul>

        <AnimatePresence>
          {expanded && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-2 mb-5 overflow-hidden"
            >
              {plan.moreFeatures.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[13px]"
                  style={{ color: "hsl(var(--primary-foreground) / 0.85)" }}
                >
                  <span style={{ color: "hsl(var(--primary-glow))" }}>•</span>
                  {f.label}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] flex items-center gap-1 mb-4 self-start"
          style={{ color: "hsl(var(--primary-glow))" }}
        >
          {expanded ? "Show less" : `View all (${plan.topFeatures.length + plan.moreFeatures.length})`}
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-3 w-3" />
          </motion.span>
        </button>

        {/* CTA */}
        <div className="mt-auto">
          {isActive ? (
            <div
              className="rounded-2xl py-3 px-3 text-center border"
              style={{
                borderColor: "hsl(var(--primary-glow) / 0.4)",
                background: "hsl(var(--primary-glow) / 0.08)",
              }}
            >
              <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: "hsl(var(--primary-glow))" }}>
                Your Plan
              </p>
              <p className="text-[13px] font-medium mt-0.5" style={{ color: "hsl(var(--primary-foreground))" }}>
                Manage in settings
              </p>
            </div>
          ) : (
            <Button
              onClick={() => navigate(`/subscribe?plan=${plan.planKey}`)}
              className="w-full rounded-2xl h-11 text-[13px] font-bold uppercase tracking-widest"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary-glow)) 0%, hsl(var(--primary)) 100%)",
                color: "hsl(var(--accent))",
              }}
            >
              Upgrade to {plan.title.replace("Elyxer ", "")} — from {plan.startingPrice}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubscriptionsSection;
