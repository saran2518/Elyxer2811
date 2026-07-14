import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X, Crown, Gem, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Duration = "wk" | "mo" | "3mo" | "yr";

interface Pkg {
  key: Duration;
  label: string;
  price: string;
  perWeek: string;
  badge?: string;
  saveLabel?: string;
}

const planConfig: Record<
  string,
  {
    title: string;
    short: string;
    tagline: string;
    icon: React.ReactNode;
    features: string[];
    packages: Pkg[];
  }
> = {
  plus: {
    title: "Elyxer Plus",
    short: "Plus",
    tagline: "More depth. More discovery.",
    icon: <Crown className="h-4 w-4" />,
    features: [
      "Unlimited discover",
      "30 vibes/day",
      "5 invites/week",
      "10 magic search/week",
      "Virtual date rooms — 3/week, 10 min",
      "See who vibed you",
      "See who invited you",
      "Moments interact",
      "2 posts/week",
      "Enhanced visibility",
      "Profile unlock",
      "2 profile generations/week",
    ],
    packages: [
      { key: "wk", label: "1 Week", price: "₹199", perWeek: "₹199.00/wk" },
      { key: "mo", label: "1 Month", price: "₹699", perWeek: "₹174.75/wk", badge: "POPULAR", saveLabel: "Save 12%" },
      { key: "3mo", label: "3 Months", price: "₹1,799", perWeek: "₹149.92/wk", saveLabel: "Save 25%" },
      { key: "yr", label: "1 Year", price: "₹5,999", perWeek: "₹115.37/wk", saveLabel: "Save 42%" },
    ],
  },
  infinity: {
    title: "Elyxer Infinity",
    short: "Infinity",
    tagline: "The complete Elyxer experience.",
    icon: <Gem className="h-4 w-4" />,
    features: [
      "Priority discover",
      "Unlimited vibes",
      "10 invites/week",
      "Unlimited search",
      "Private browsing",
      "Virtual date rooms — unlimited, 10 min",
      "See who vibed you",
      "See who invited you",
      "Full moments interact",
      "4 posts/week",
      "Profile unlock",
      "Profile control",
      "Priority visibility",
      "Unlimited profile generation",
    ],
    packages: [
      { key: "wk", label: "1 Week", price: "₹299", perWeek: "₹299.00/wk" },
      { key: "mo", label: "1 Month", price: "₹999", perWeek: "₹249.75/wk", badge: "POPULAR", saveLabel: "Save 16%" },
      { key: "3mo", label: "3 Months", price: "₹2,499", perWeek: "₹208.25/wk", saveLabel: "Save 30%" },
      { key: "yr", label: "1 Year", price: "₹8,999", perWeek: "₹173.06/wk", saveLabel: "Save 42%" },
    ],
  },
};

const Subscribe = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const planKey = (params.get("plan") || "plus") as keyof typeof planConfig;
  const plan = planConfig[planKey] || planConfig.plus;

  const defaultPick = useMemo(
    () => plan.packages.find((p) => p.badge)?.key || plan.packages[0].key,
    [plan]
  );
  const [selected, setSelected] = useState<Duration>(defaultPick);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const active = plan.packages.find((p) => p.key === selected)!;

  const handlePurchase = () => {
    if (isPurchasing) return;
    setIsPurchasing(true);
    setTimeout(() => {
      setIsPurchasing(false);
      toast.success(`${plan.title} ${active.label} activated for ${active.price}`);
      navigate(-1);
    }, 1200);
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="relative px-5 pt-5 pb-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="h-9 w-9 rounded-full bg-card border border-border/40 flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-foreground" />
        </button>
        <h1 className="flex-1 text-center pr-9 font-display text-lg text-foreground">Subscribe</h1>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 pb-32 space-y-6">
        {/* Editorial plan card */}
        <div
          className="relative rounded-3xl overflow-hidden p-6"
          style={{
            background: "linear-gradient(140deg, hsl(var(--accent)) 0%, hsl(32 55% 28%) 100%)",
            boxShadow: "var(--shadow-elegant)",
          }}
        >
          <div
            className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-40 blur-3xl pointer-events-none"
            style={{ background: "hsl(var(--primary-glow))" }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: "hsl(var(--primary-glow))" }}>{plan.icon}</span>
              <span
                className="text-[10px] font-bold uppercase tracking-[0.25em]"
                style={{ color: "hsl(var(--primary-glow))" }}
              >
                {plan.title}
              </span>
            </div>
            <p
              className="font-display italic text-[26px] leading-tight mb-5"
              style={{ color: "hsl(var(--primary-foreground))" }}
            >
              {plan.tagline}
            </p>
            <ul className="space-y-2">
              {plan.features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[13px]"
                  style={{ color: "hsl(var(--primary-foreground) / 0.9)" }}
                >
                  <span style={{ color: "hsl(var(--primary-glow))" }}>•</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Duration selector — bento grid */}
        <div className="space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-transparent bg-clip-text px-1"
            style={{ backgroundImage: "var(--gradient-warm)" }}>
            Choose your billing
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {plan.packages.map((pkg) => (
              <PkgTile
                key={pkg.key}
                pkg={pkg}
                selected={selected === pkg.key}
                onSelect={() => setSelected(pkg.key)}
              />
            ))}
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground text-center px-2 leading-relaxed">
          By tapping "Upgrade", you'll be charged {active.price}. Your subscription auto-renews for
          the same price and length until cancelled in account settings.
        </p>
      </div>

      {/* Sticky CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky bottom-0 px-5 pt-4 pb-5 bg-gradient-to-t from-background via-background to-transparent"
      >
        <Button
          onClick={handlePurchase}
          disabled={isPurchasing}
          aria-busy={isPurchasing}
          className="w-full rounded-full h-14 gap-2 text-[13px] font-bold uppercase tracking-[0.2em]"
          style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-warm)" }}
        >
          {isPurchasing ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
          ) : (
            <>Upgrade to {plan.short} — {active.price}</>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

function PkgTile({
  pkg,
  selected,
  onSelect,
}: {
  pkg: Pkg;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`relative text-left rounded-2xl p-4 transition-all border-2 ${
        selected ? "border-primary bg-card" : "border-border/40 bg-card/60"
      }`}
      style={selected ? { boxShadow: "var(--shadow-warm)" } : undefined}
    >
      {pkg.badge && (
        <span
          className="absolute -top-2 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "var(--gradient-warm)", color: "hsl(var(--primary-foreground))" }}
        >
          {pkg.badge}
        </span>
      )}
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {pkg.label}
      </p>
      <p className="font-display text-2xl text-foreground mt-1 leading-tight">{pkg.price}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{pkg.perWeek}</p>
      {pkg.saveLabel && (
        <p
          className="text-[10px] font-bold mt-1 text-transparent bg-clip-text"
          style={{ backgroundImage: "var(--gradient-warm)" }}
        >
          {pkg.saveLabel}
        </p>
      )}
    </button>
  );
}

export default Subscribe;
