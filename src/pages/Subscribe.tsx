import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X, Crown, Gem, Check, CreditCard, Sparkles, Loader2 } from "lucide-react";
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
    tagline: string;
    icon: React.ReactNode;
    features: string[];
    packages: Pkg[];
  }
> = {
  plus: {
    title: "Elyxer Plus",
    tagline: "Stand out, see who vibed you, and unlock smart filters.",
    icon: <Crown className="h-5 w-5" />,
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
    tagline: "Priority everything. Unlimited reach with full control.",
    icon: <Gem className="h-5 w-5" />,
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
      <div
        className="relative px-5 pt-4 pb-6"
        style={{ background: "var(--gradient-soft)" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 h-9 w-9 rounded-full bg-card/80 backdrop-blur border border-border/30 flex items-center justify-center hover:bg-card transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-foreground" />
        </button>

        <div className="flex flex-col items-center text-center mt-8">
          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
          >
            <span className="text-primary-foreground">{plan.icon}</span>
          </div>
          <h1 className="text-[22px] font-bold text-foreground leading-tight">
            Upgrade to {plan.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
            {plan.tagline}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-5 space-y-5">
        {/* Select a plan */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Select a plan
          </h2>
          <div className="space-y-2.5">
            {plan.packages.map((pkg) => (
              <PackageRow
                key={pkg.key}
                pkg={pkg}
                selected={selected === pkg.key}
                onSelect={() => setSelected(pkg.key)}
              />
            ))}
          </div>
        </div>

        {/* Included */}
        <div className="rounded-2xl border border-border/30 bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Included with {plan.title}
            </h3>
          </div>
          <div className="space-y-2">
            {plan.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px]">
                <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-2.5 w-2.5 text-primary" />
                </div>
                <span className="text-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground text-center px-2 leading-relaxed">
          By tapping "Continue", you'll be charged. Your subscription auto-renews
          for the same price and length until cancelled in account settings.
        </p>
      </div>

      {/* Sticky CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky bottom-0 px-5 pt-3 pb-5 bg-background/90 backdrop-blur border-t border-border/30"
      >
        <Button
          onClick={handlePurchase}
          disabled={isPurchasing}
          aria-busy={isPurchasing}
          className="w-full rounded-2xl h-12 gap-2 text-[14px] font-semibold"
          style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
        >
          {isPurchasing ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
          ) : (
            <><CreditCard className="h-4 w-4" /> Continue for {active.price} total</>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

function PackageRow({
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
      className={`w-full text-left rounded-2xl border-2 transition-all p-4 flex items-center justify-between ${
        selected ? "border-primary bg-card" : "border-border/40 bg-card/60"
      }`}
      style={selected ? { boxShadow: "var(--shadow-warm)" } : undefined}
    >
      <div className="flex flex-col">
        {pkg.badge && (
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full self-start mb-1.5"
            style={{ background: "var(--gradient-warm)", color: "hsl(var(--primary-foreground))" }}
          >
            {pkg.badge}
          </span>
        )}
        <span className="text-base font-bold text-foreground leading-tight">{pkg.label}</span>
        <span className="text-[11px] text-muted-foreground mt-0.5">{pkg.perWeek}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-base font-bold text-foreground">{pkg.price}</div>
          {pkg.saveLabel && (
            <div className="text-[10px] font-semibold text-primary">{pkg.saveLabel}</div>
          )}
        </div>
        <div
          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
            selected ? "border-primary bg-primary" : "border-border"
          }`}
        >
          {selected && <Check className="h-3 w-3 text-primary-foreground" />}
        </div>
      </div>
    </button>
  );
}

export default Subscribe;
