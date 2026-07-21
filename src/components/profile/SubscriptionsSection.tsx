import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Check, X, Gem, Crown, HeartPulse, Send, Wand2, CreditCard, Compass, MessageCircleHeart, Eye, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Mirrors categorize() in Subscribe.tsx so both surfaces share one taxonomy.
function categorize(feature: string): "discover" | "connect" | "visibility" | "studio" {
  const f = feature.toLowerCase();
  if (/(discover|search|browsing|vibes|invites)/.test(f)) return "discover";
  if (/(virtual date|moments|post|vibed you|invited you|interact)/.test(f)) return "connect";
  if (/(visibility|unlock|control|private)/.test(f)) return "visibility";
  if (/(profile generation|studio)/.test(f)) return "studio";
  return "discover";
}

const GROUP_META: Record<string, { label: string; icon: React.ReactNode; hint: string }> = {
  discover: { label: "Discover & Reach", icon: <Compass className="h-3.5 w-3.5" />, hint: "Find people faster" },
  connect: { label: "Connect & Engage", icon: <MessageCircleHeart className="h-3.5 w-3.5" />, hint: "Deeper interactions" },
  visibility: { label: "Visibility & Privacy", icon: <Eye className="h-3.5 w-3.5" />, hint: "You're in control" },
  studio: { label: "Profile Studio", icon: <Sparkles className="h-3.5 w-3.5" />, hint: "AI-crafted profiles" },
};

type ExtraKey = "vibes" | "invites" | "search";

type Tier = { count: number; price: string; badge?: string };

const extrasConfig: Record<ExtraKey, { title: string; unit: string; icon: React.ReactNode; tiers: Tier[] }> = {
  vibes: {
    title: "Vibes",
    unit: "vibes",
    icon: <HeartPulse className="h-5 w-5" />,
    tiers: [
      { count: 5, price: "₹49" },
      { count: 10, price: "₹99", badge: "POPULAR" },
      { count: 20, price: "₹199", badge: "BEST VALUE" },
    ],
  },
  invites: {
    title: "Invites",
    unit: "invites",
    icon: <Send className="h-5 w-5" />,
    tiers: [
      { count: 2, price: "₹79" },
      { count: 5, price: "₹179", badge: "POPULAR" },
      { count: 10, price: "₹329", badge: "BEST VALUE" },
    ],
  },
  search: {
    title: "Magic Searches",
    unit: "searches",
    icon: <Wand2 className="h-5 w-5" />,
    tiers: [
      { count: 5, price: "₹79" },
      { count: 10, price: "₹149", badge: "POPULAR" },
      { count: 20, price: "₹279", badge: "BEST VALUE" },
    ],
  },
};

const plans: PlanData[] = [
  {
    planKey: "plus",
    icon: <Crown className="h-5 w-5" />,
    title: "Elyxer Plus",
    tagline: "More depth. More discovery.",
    startingPrice: "₹199",
    badge: "POPULAR",
    ctaLabel: "Upgrade",
    ctaStyle: { background: "var(--gradient-warm)" },
    borderClass: "border-primary/40",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    shadowStyle: { boxShadow: "var(--shadow-warm)" },
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
    icon: <Gem className="h-5 w-5" />,
    title: "Elyxer Infinity",
    tagline: "The complete Elyxer experience.",
    startingPrice: "₹299",
    badge: "BEST VALUE",
    ctaLabel: "Go Infinity",
    ctaClass: "bg-accent text-accent-foreground hover:bg-accent/90",
    borderClass: "border-accent/40",
    iconBg: "bg-accent/10",
    iconColor: "text-accent-foreground",
    badgeClass: "bg-accent text-accent-foreground",
    shadowStyle: { boxShadow: "0 4px 24px -4px hsl(var(--accent) / 0.15)" },
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

interface Feature {
  included: boolean;
  label: string;
}

interface PlanData {
  planKey: string;
  icon: React.ReactNode;
  title: string;
  tagline: string;
  startingPrice: string;
  badge?: string;
  ctaLabel: string;
  ctaDisabled?: boolean;
  ctaStyle?: React.CSSProperties;
  ctaClass?: string;
  borderClass?: string;
  iconBg: string;
  iconColor: string;
  shadowStyle?: React.CSSProperties;
  badgeClass?: string;
  topFeatures: Feature[];
  moreFeatures: Feature[];
}

const SubscriptionsSection = () => {
  const navigate = useNavigate();
  const [vibeCount] = useState(10);
  const [inviteCount] = useState(1);
  const [searchCount] = useState(1);


  const [activeSub] = useState<{
    plan: "plus" | "infinity";
    nextBilling: string;
    cardBrand: string;
    cardLast4: string;
  } | null>(null);


  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const plansScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = plansScrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!Number.isNaN(index)) setActivePlanIndex(index);
          }
        });
      },
      { root: container, threshold: 0.55 }
    );

    const cards = container.querySelectorAll("[data-plan-card]");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const scrollToPlan = (index: number) => {
    const container = plansScrollRef.current;
    const card = container?.querySelector(`[data-index="${index}"]`);
    card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      {/* Buy Extras */}
      <div className="space-y-1.5">
        <div className="px-1">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-transparent bg-clip-text" style={{ backgroundImage: "var(--gradient-warm)" }}>Buy Extras</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 pb-2">

          <PurchaseItem icon={<HeartPulse className="h-5 w-5" />} label="Vibes" count={vibeCount} onClick={() => navigate("/buy-extras?item=vibes")} />
          <PurchaseItem icon={<Send className="h-5 w-5" />} label="Invites" count={inviteCount} onClick={() => navigate("/buy-extras?item=invites")} />
          <PurchaseItem icon={<Wand2 className="h-5 w-5" />} label="Magic" count={searchCount} onClick={() => navigate("/buy-extras?item=search")} />
        </div>
      </div>



      <Separator className="bg-border/30" />

      {/* Plans - Horizontal scroll */}
      <div className="space-y-2">
        <h3 className="text-[11px] font-bold uppercase tracking-widest px-1 text-transparent bg-clip-text" style={{ backgroundImage: "var(--gradient-warm)" }}>Plans</h3>

        {/* Slider dots */}
        <div className="flex justify-center gap-1.5">
          {plans.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToPlan(i)}
              aria-label={`Go to ${plans[i].title}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activePlanIndex === i
                  ? "w-4"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              style={activePlanIndex === i ? { background: "var(--gradient-warm)" } : undefined}
            />
          ))}
        </div>

        <div className="-mx-4">
          <div
            ref={plansScrollRef}
            className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {plans.map((plan, i) => (
              <PlanCard
                key={i}
                index={i}
                plan={plan}
                isActive={activeSub?.plan === plan.planKey}
                activeSub={activeSub}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="px-1 text-center text-[10px] leading-relaxed text-muted-foreground">
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

function PlanCard({
  plan,
  isActive,
  activeSub,
  index,
}: {
  plan: PlanData;
  isActive?: boolean;
  activeSub?: { nextBilling: string } | null;
  index: number;
}) {
  const navigate = useNavigate();

  const borderClass = isActive ? "border-primary/60" : (plan.borderClass || "border-border/30");
  const shadowStyle = isActive
    ? { boxShadow: "var(--shadow-warm)", background: "linear-gradient(to bottom, hsl(var(--primary) / 0.12) 0%, hsl(var(--primary) / 0.05) 40%, transparent 100%)" }
    : (plan.shadowStyle || { boxShadow: "0 8px 32px -8px hsl(var(--foreground) / 0.08)" });

  return (
    <div
      data-plan-card
      data-index={index}
      className={`relative rounded-[20px] border ${borderClass} bg-card flex flex-col snap-center shrink-0 overflow-hidden`}
      style={{ width: "72vw", maxWidth: 280, ...shadowStyle }}
    >
      {/* Warm wash */}
      {!isActive && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, hsl(var(--primary) / 0.08) 0%, hsl(var(--primary) / 0.03) 60%, transparent 100%)" }} />
      )}

      {/* Badge row */}
      <div className="relative flex justify-end gap-1.5 px-3 pt-2">
        {isActive && (
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
            ACTIVE
          </span>
        )}
        {plan.badge && !isActive && (
          <span
            className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${plan.badgeClass || ""}`}
            style={!plan.badgeClass ? { background: "var(--gradient-warm)", color: "hsl(var(--primary-foreground))" } : undefined}
          >
            {plan.badge}
          </span>
        )}
      </div>

      <div className={`relative px-4 ${plan.badge || isActive ? "pt-1.5" : "pt-4"} pb-4 flex flex-col flex-1`}>
        {/* Icon + Title */}
        <div className="flex flex-col items-center text-center mb-3">
          <div className={`h-11 w-11 rounded-xl ${plan.iconBg} flex items-center justify-center mb-2`}>
            <span className={plan.iconColor}>{plan.icon}</span>
          </div>
          <h3 className="text-base font-bold text-foreground leading-tight">{plan.title}</h3>
          <p className="mt-1 text-[13px] leading-tight italic text-muted-foreground font-display">
            {plan.tagline}
          </p>
          {isActive && activeSub && (
            <p className="mt-1.5 text-[12px] text-muted-foreground">
              Renews <span className="font-medium text-foreground">{activeSub.nextBilling}</span>
            </p>
          )}
          {!isActive && (
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-[10px] text-muted-foreground">from</span>
              <span className="text-2xl font-bold text-foreground">{plan.startingPrice}</span>
              <span className="text-xs text-muted-foreground">/wk</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mb-3 space-y-2">
          {!isActive && (
            <Button
              onClick={() => navigate(`/subscribe?plan=${plan.planKey}`)}
              className={`w-full rounded-2xl gap-1.5 h-9 text-[13px] font-medium ${plan.ctaClass || ""}`}
              style={plan.ctaStyle}
            >
              <CreditCard className="h-3.5 w-3.5" />
              {plan.ctaLabel}
            </Button>
          )}
        </div>

        <Separator className="bg-border/20 mb-3" />

        {/* Category headings only — full benefits live on Subscribe page */}
        <PlanCategoryList features={[...plan.topFeatures, ...plan.moreFeatures].map(f => f.label)} />

        <button
          onClick={() => navigate(`/subscribe?plan=${plan.planKey}`)}
          className="mt-3 flex items-center justify-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all benefits
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function PlanCategoryList({ features }: { features: string[] }) {
  const groups = useMemo(() => {
    const buckets: Record<string, number> = { discover: 0, connect: 0, visibility: 0, studio: 0 };
    features.forEach((f) => { buckets[categorize(f)] += 1; });
    return Object.entries(buckets).filter(([, n]) => n > 0);
  }, [features]);

  return (
    <div className="space-y-1.5">
      {groups.map(([key, count]) => {
        const meta = GROUP_META[key];
        return (
          <div
            key={key}
            className="flex items-center gap-2.5 rounded-xl border border-border/30 px-2.5 py-2"
            style={{ background: "hsl(45 40% 96% / 0.5)" }}
          >
            <div
              className="h-6 w-6 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "hsl(41 70% 64% / 0.22)", color: "hsl(32 70% 36%)" }}
            >
              {meta.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-foreground leading-tight truncate">{meta.label}</div>
              <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                {count} {count === 1 ? "benefit" : "benefits"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PurchaseItem({ icon, label, count, onClick }: { icon: React.ReactNode; label: string; count: number; onClick?: () => void }) {
  return (
    <div
      className="group relative rounded-[24px] border border-border/40 bg-card p-4 pb-5 flex flex-col items-center transition-all duration-300 hover:-translate-y-0.5"
      style={{ boxShadow: "0 4px 20px -4px hsl(var(--primary) / 0.08)" }}
    >
      <div
        className="h-10 w-10 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{ background: "var(--gradient-warm)", boxShadow: "0 2px 8px -2px hsl(var(--primary) / 0.3)" }}
      >
        <span className="text-primary-foreground">{icon}</span>
      </div>
      <div className="text-center mt-3">
        <div className="text-[11px] font-medium text-muted-foreground tracking-wide">{label}</div>
        <div className="text-[10px] font-semibold text-primary uppercase tracking-tight mt-0.5">{count} left</div>
      </div>
      <button
        onClick={onClick}
        aria-label={`Buy more ${label}`}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-card border border-border/40 flex items-center justify-center text-primary shadow-sm transition-all hover:scale-110 active:scale-95"
        style={{ boxShadow: "0 2px 8px -2px hsl(var(--primary) / 0.2)" }}
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={3} />
      </button>
    </div>
  );
}

function ExtraTierCard({ tier, unit, onSelect }: { tier: Tier; unit: string; onSelect: () => void }) {
  const highlighted = !!tier.badge;
  return (
    <div
      className={`rounded-2xl border-2 ${highlighted ? "border-primary/40" : "border-border/30"} bg-card flex flex-col snap-center shrink-0 p-4`}
      style={{ width: "60vw", maxWidth: 220, boxShadow: highlighted ? "var(--shadow-warm)" : "var(--shadow-card)" }}
    >
      <div className="flex justify-end h-5">
        {tier.badge && (
          <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: "var(--gradient-warm)", color: "hsl(var(--primary-foreground))" }}>
            {tier.badge}
          </span>
        )}
      </div>
      <div className="flex flex-col items-center text-center mt-1 mb-3">
        <span className="text-3xl font-bold text-foreground leading-none">{tier.count}</span>
        <span className="text-xs text-muted-foreground mt-1 capitalize">{unit}</span>
      </div>
      <div className="text-center mb-3">
        <span className="text-xl font-bold text-foreground">{tier.price}</span>
      </div>
      <Button onClick={onSelect} className="w-full rounded-2xl gap-1.5 h-9 text-[13px] font-medium" style={{ background: "var(--gradient-warm)" }}>
        <CreditCard className="h-3.5 w-3.5" />
        Buy
      </Button>
    </div>
  );
}

function PlanFeature({ included, label }: { included?: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[12px]">
      {included ? (
        <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Check className="h-2.5 w-2.5 text-primary" />
        </div>
      ) : (
        <div className="h-4 w-4 rounded-full bg-muted/60 flex items-center justify-center shrink-0">
          <X className="h-2.5 w-2.5 text-muted-foreground/40" />
        </div>
      )}
      <span className={included ? "text-foreground" : "text-muted-foreground/60"}>{label}</span>
    </div>
  );
}

export default SubscriptionsSection;
