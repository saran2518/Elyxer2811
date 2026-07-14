import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X, HeartPulse, Send, Wand2, Loader2 } from "lucide-react";
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
    icon: <HeartPulse className="h-4 w-4" />,
    perks: [
      "Stand out in their inbox",
      "Higher chance of a match",
      "Use anytime, no expiry",
    ],
    tiers: [
      { id: "v5", count: 5, price: "₹49", perUnit: "₹9.80 / vibe" },
      { id: "v10", count: 10, price: "₹99", perUnit: "₹9.90 / vibe", badge: "POPULAR" },
      { id: "v20", count: 20, price: "₹199", perUnit: "₹9.95 / vibe", saveLabel: "Best Value" },
    ],
  },
  invites: {
    title: "Invites",
    unit: "invites",
    tagline: "Invite people for real-world experiences.",
    icon: <Send className="h-4 w-4" />,
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
    icon: <Wand2 className="h-4 w-4" />,
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
      <div className="relative px-5 pt-5 pb-3 flex items-center">
        <button
          onClick={() => navigate("/profile", { state: { openTab: "subscriptions" } })}
          className="h-9 w-9 rounded-full bg-card border border-border/40 flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-foreground" />
        </button>
        <h1 className="flex-1 text-center pr-9 font-display text-lg text-foreground">Buy Extras</h1>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 pb-32 space-y-6">
        {/* Editorial hero card */}
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
              <span style={{ color: "hsl(var(--primary-glow))" }}>{cfg.icon}</span>
              <span
                className="text-[10px] font-bold uppercase tracking-[0.25em]"
                style={{ color: "hsl(var(--primary-glow))" }}
              >
                Buy {cfg.title}
              </span>
            </div>
            <p
              className="font-display italic text-[24px] leading-tight mb-5"
              style={{ color: "hsl(var(--primary-foreground))" }}
            >
              {cfg.tagline}
            </p>
            <ul className="space-y-2">
              {cfg.perks.map((p, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[13px]"
                  style={{ color: "hsl(var(--primary-foreground) / 0.9)" }}
                >
                  <span style={{ color: "hsl(var(--primary-glow))" }}>•</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tier bento */}
        <div className="space-y-3">
          <h2
            className="text-[10px] font-bold uppercase tracking-widest text-transparent bg-clip-text px-1"
            style={{ backgroundImage: "var(--gradient-warm)" }}
          >
            Select a pack
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {cfg.tiers.map((tier) => (
              <TierTile
                key={tier.id}
                tier={tier}
                unit={cfg.unit}
                selected={selected === tier.id}
                onSelect={() => setSelected(tier.id)}
              />
            ))}
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground text-center px-2 leading-relaxed">
          One-time purchase. {cfg.title} are added to your account immediately and never expire.
        </p>
      </div>

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
            <>Buy {active.count} {cfg.unit} — {active.price}</>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

function TierTile({
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
      className={`relative rounded-2xl p-3 border-2 transition-all flex flex-col items-center ${
        selected ? "border-primary bg-card" : "border-border/40 bg-card/60"
      }`}
      style={selected ? { boxShadow: "var(--shadow-warm)" } : undefined}
    >
      {tier.badge && (
        <span
          className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ background: "var(--gradient-warm)", color: "hsl(var(--primary-foreground))" }}
        >
          {tier.badge}
        </span>
      )}
      <p className="font-display text-2xl text-foreground leading-none mt-1">{tier.count}</p>
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">{unit}</p>
      <div className="w-full h-px bg-border/40 my-2" />
      <p className="text-sm font-bold text-foreground">{tier.price}</p>
      {tier.saveLabel && (
        <p
          className="text-[9px] font-bold mt-0.5 text-transparent bg-clip-text"
          style={{ backgroundImage: "var(--gradient-warm)" }}
        >
          {tier.saveLabel}
        </p>
      )}
    </button>
  );
}

export default BuyExtras;
