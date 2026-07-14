import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X, HeartPulse, Send, Wand2, Check, CreditCard, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ExtraKey = "vibes" | "invites" | "search";

interface Tier {
  id: string;
  count: number;
  price: string;
  perUnit: string;
  badge?: string;
  saveLabel?: string;
}

const extrasConfig: Record<
  ExtraKey,
  {
    title: string;
    unit: string;
    tagline: string;
    icon: React.ReactNode;
    perks: string[];
    tiers: Tier[];
  }
> = {
  vibes: {
    title: "Vibes",
    unit: "vibes",
    tagline: "Send a little spark to profiles you love.",
    icon: <HeartPulse className="h-5 w-5" />,
    perks: [
      "Stand out in their inbox",
      "Higher chance of a match",
      "Use anytime, no expiry",
    ],
    tiers: [
      { id: "v5", count: 5, price: "₹49", perUnit: "₹9.80 / vibe" },
      { id: "v10", count: 10, price: "₹99", perUnit: "₹9.90 / vibe", badge: "POPULAR", saveLabel: "Save 0%" },
      { id: "v20", count: 20, price: "₹199", perUnit: "₹9.95 / vibe", saveLabel: "Best Value" },
    ],
  },
  invites: {
    title: "Invites",
    unit: "invites",
    tagline: "Invite people for real-world experiences.",
    icon: <Send className="h-5 w-5" />,
    perks: [
      "Plan dates around shared interests",
      "Priority delivery to recipients",
      "Use anytime, no expiry",
    ],
    tiers: [
      { id: "i2", count: 2, price: "₹79", perUnit: "₹39.50 / invite" },
      { id: "i5", count: 5, price: "₹179", perUnit: "₹35.80 / invite", badge: "POPULAR", saveLabel: "Save 9%" },
      { id: "i10", count: 10, price: "₹329", perUnit: "₹32.90 / invite", saveLabel: "Best Value" },
    ],
  },
  search: {
    title: "Magic Searches",
    unit: "searches",
    tagline: "Find exactly the kind of person you're looking for.",
    icon: <Wand2 className="h-5 w-5" />,
    perks: [
      "Filter by vibe, intent and more",
      "Surface profiles outside your usual feed",
      "Use anytime, no expiry",
    ],
    tiers: [
      { id: "s5", count: 5, price: "₹79", perUnit: "₹15.80 / search" },
      { id: "s10", count: 10, price: "₹149", perUnit: "₹14.90 / search", badge: "POPULAR", saveLabel: "Save 6%" },
      { id: "s20", count: 20, price: "₹279", perUnit: "₹13.95 / search", saveLabel: "Best Value" },
    ],
  },
};

const BuyExtras = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const key = (params.get("item") || "vibes") as ExtraKey;
  const cfg = extrasConfig[key] || extrasConfig.vibes;

  const defaultPick = useMemo(
    () => cfg.tiers.find((t) => t.badge)?.id || cfg.tiers[0].id,
    [cfg]
  );
  const [selected, setSelected] = useState<string>(defaultPick);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const active = cfg.tiers.find((t) => t.id === selected)!;

  const handlePurchase = () => {
    if (isPurchasing) return;
    setIsPurchasing(true);
    setTimeout(() => {
      setIsPurchasing(false);
      toast.success(`Purchased ${active.count} ${cfg.unit} for ${active.price}`);
      navigate(-1);
    }, 1200);
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <div className="relative px-5 pt-4 pb-6" style={{ background: "var(--gradient-soft)" }}>
        <button
          onClick={() => navigate("/profile", { state: { openTab: "subscriptions" } })}
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
            <span className="text-primary-foreground">{cfg.icon}</span>
          </div>
          <h1 className="text-[22px] font-bold text-foreground leading-tight">Buy {cfg.title}</h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">{cfg.tagline}</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-5 space-y-5">
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Select a pack
          </h2>
          <div className="space-y-2.5">
            {cfg.tiers.map((tier) => (
              <TierRow
                key={tier.id}
                tier={tier}
                unit={cfg.unit}
                selected={selected === tier.id}
                onSelect={() => setSelected(tier.id)}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/30 bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">What you get</h3>
          </div>
          <div className="space-y-2">
            {cfg.perks.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px]">
                <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-2.5 w-2.5 text-primary" />
                </div>
                <span className="text-foreground">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground text-center px-2 leading-relaxed">
          One-time purchase. {cfg.title} are added to your account immediately and never expire.
        </p>
      </div>

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
            <><CreditCard className="h-4 w-4" /> Buy {active.count} {cfg.unit} for {active.price}</>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

function TierRow({
  tier,
  unit,
  selected,
  onSelect,
}: {
  tier: Tier;
  unit: string;
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
        {tier.badge && (
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full self-start mb-1.5"
            style={{ background: "var(--gradient-warm)", color: "hsl(var(--primary-foreground))" }}
          >
            {tier.badge}
          </span>
        )}
        <span className="text-base font-bold text-foreground leading-tight capitalize">
          {tier.count} {unit}
        </span>
        <span className="text-[11px] text-muted-foreground mt-0.5">{tier.perUnit}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-base font-bold text-foreground">{tier.price}</div>
          {tier.saveLabel && (
            <div className="text-[10px] font-semibold text-primary">{tier.saveLabel}</div>
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

export default BuyExtras;
