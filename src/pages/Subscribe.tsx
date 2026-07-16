import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X, Crown, Gem, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Duration = "wk" | "mo" | "3mo" | "yr";

interface Pkg {
  key: Duration;
  label: string;
  kicker: string;
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
    tagline: "The art of curated connection.",
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
      "Profile unlock",
      "2 profile generations/week",
    ],
    packages: [
      { key: "wk", label: "1 Week", kicker: "Trial", price: "₹199", perWeek: "₹199.00/wk" },
      { key: "mo", label: "1 Month", kicker: "Best Value", price: "₹699", perWeek: "₹174.75/wk", badge: "POPULAR", saveLabel: "Save 12%" },
      { key: "3mo", label: "3 Months", kicker: "Quarterly", price: "₹1,799", perWeek: "₹149.92/wk", saveLabel: "Save 25%" },
      { key: "yr", label: "1 Year", kicker: "Annual", price: "₹5,999", perWeek: "₹115.37/wk", saveLabel: "Save 42%" },
    ],
  },
  infinity: {
    title: "Elyxer Infinity",
    tagline: "The pinnacle of curated luxury.",
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
      "Unlimited profile generation",
    ],
    packages: [
      { key: "wk", label: "1 Week", kicker: "Trial", price: "₹299", perWeek: "₹299.00/wk" },
      { key: "mo", label: "1 Month", kicker: "Best Value", price: "₹999", perWeek: "₹249.75/wk", badge: "POPULAR", saveLabel: "Save 16%" },
      { key: "3mo", label: "3 Months", kicker: "Quarterly", price: "₹2,499", perWeek: "₹208.25/wk", saveLabel: "Save 30%" },
      { key: "yr", label: "1 Year", kicker: "Annual", price: "₹8,999", perWeek: "₹173.06/wk", saveLabel: "Save 42%" },
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
    <div className="min-h-dvh bg-background relative overflow-hidden">
      {/* Close */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-4 top-4 z-30 h-9 w-9 rounded-full bg-card/80 backdrop-blur border border-border/40 flex items-center justify-center hover:bg-card transition-colors"
        aria-label="Close"
      >
        <X className="h-4 w-4 text-foreground" />
      </button>

      {/* Header with soft gradient wash */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-12 pb-6 px-6 text-center relative"
        style={{
          background:
            "linear-gradient(to bottom, hsl(45 40% 94% / 0.9) 0%, hsl(56 100% 98% / 0) 100%)",
        }}
      >
        <h1
          className="font-display text-[36px] leading-none tracking-tight"
          style={{
            background: "var(--gradient-gold)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {plan.title.replace("Elyxer ", "")}
        </h1>
        <p className="text-[11px] mt-2.5 uppercase tracking-[0.2em] font-medium text-muted-foreground">
          {plan.tagline}
        </p>
      </motion.div>

      {/* Content */}
      <div className="px-5 pb-72">
        {/* 2x2 Package Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {plan.packages.map((pkg, i) => (
            <motion.div
              key={pkg.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
            >
              <PackageTile
                pkg={pkg}
                selected={selected === pkg.key}
                onSelect={() => setSelected(pkg.key)}
              />
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <div>
          <h3
            className="text-[11px] font-bold uppercase tracking-[0.18em] pb-2 mb-4 border-b"
            style={{
              color: "hsl(32 70% 36% / 0.8)",
              borderColor: "hsl(40 30% 88%)",
            }}
          >
            {plan.title.replace("Elyxer ", "")} Privileges
          </h3>
          <ul className="space-y-3">
            {plan.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "hsl(41 70% 64% / 0.2)" }}
                >
                  <Check className="h-2.5 w-2.5" style={{ color: "hsl(32 70% 36%)" }} strokeWidth={3} />
                </div>
                <span className="text-[13px] text-foreground/85 leading-snug">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sticky Footer */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 inset-x-0 z-20 px-5 pt-4 pb-6"
        style={{
          background: "hsl(56 100% 98% / 0.92)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid hsl(40 30% 88%)",
        }}
      >
        <Button
          onClick={handlePurchase}
          disabled={isPurchasing}
          aria-busy={isPurchasing}
          className="w-full h-12 rounded-full font-semibold tracking-wide text-[13px]"
          style={{
            background: "var(--gradient-gold)",
            boxShadow: "var(--shadow-elegant)",
          }}
        >
          {isPurchasing ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing…</>
          ) : (
            <>Continue — {active.price}</>
          )}
        </Button>

        <div className="flex items-center gap-2 mt-3 mb-2 px-4">
          <span className="h-px flex-1" style={{ background: "hsl(36 53% 51% / 0.2)" }} />
          <span className="h-1 w-1 rounded-full" style={{ background: "hsl(36 53% 51% / 0.45)" }} />
          <span className="h-px flex-1" style={{ background: "hsl(36 53% 51% / 0.2)" }} />
        </div>
        <p className="text-[10px] text-center text-foreground/60 leading-relaxed px-2">
          Elyxer is free to join and use. Plus and Infinity are subscriptions that unlock features designed to make dating on Elyxer better. Payment is charged to your Google Play account and renews automatically until cancelled in Google Play settings.{" "}
          <button
            type="button"
            onClick={() => navigate("/terms")}
            className="underline text-primary hover:text-primary/80 transition-colors"
          >
            Terms of Use
          </button>
        </p>
      </motion.div>
    </div>
  );
};

function PackageTile({
  pkg,
  selected,
  onSelect,
}: {
  pkg: Pkg;
  selected: boolean;
  onSelect: () => void;
}) {
  const isPopular = !!pkg.badge;
  return (
    <button
      onClick={onSelect}
      className="relative w-full text-left rounded-xl p-4 transition-all active:scale-[0.98] h-full"
      style={{
        background: "hsl(var(--card))",
        border: selected
          ? "2px solid hsl(36 53% 51%)"
          : isPopular
          ? "2px solid hsl(36 53% 51% / 0.5)"
          : "1px solid hsl(40 30% 88%)",
        boxShadow: selected ? "0 0 0 4px hsl(36 53% 51% / 0.08), var(--shadow-warm)" : undefined,
        margin: selected || isPopular ? 0 : "1px",
      }}
    >
      {isPopular && (
        <div
          className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full"
          style={{ background: "var(--gradient-warm)" }}
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-primary-foreground">
            {pkg.badge}
          </span>
        </div>
      )}
      <span
        className="block text-[10px] uppercase tracking-wider mb-1"
        style={{ color: isPopular ? "hsl(32 70% 36%)" : "hsl(var(--muted-foreground))" }}
      >
        {pkg.kicker}
      </span>
      <span className="block font-display text-[18px] leading-tight text-foreground">
        {pkg.label}
      </span>
      <div className="mt-3">
        <span className="block text-[15px] font-semibold text-foreground">{pkg.price}</span>
        <span className="block text-[10px] text-muted-foreground">{pkg.perWeek}</span>
      </div>
      {pkg.saveLabel && (
        <div className="absolute bottom-2 right-2">
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{
              color: "hsl(32 70% 36%)",
              background: "hsl(41 70% 64% / 0.18)",
            }}
          >
            {pkg.saveLabel}
          </span>
        </div>
      )}
    </button>
  );
}

export default Subscribe;
