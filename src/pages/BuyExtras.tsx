import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X, HeartPulse, Send, Wand2, Video, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ExtraKey = "vibes" | "invites" | "search" | "virtual-dates";

interface Tier {
  id: string;
  count: number;
  price: string;
  perUnit: string;
  kicker: string;
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
    tagline: "Little sparks. Big first impressions.",
    icon: <HeartPulse className="h-5 w-5" />,
    perks: [
      "Stand out in their inbox",
      "Higher chance of a match",
      "Use anytime, no expiry",
    ],
    tiers: [
      { id: "v5", count: 5, price: "₹49", perUnit: "₹9.80 / vibe", kicker: "Starter" },
      { id: "v10", count: 10, price: "₹99", perUnit: "₹9.90 / vibe", kicker: "Best Value", badge: "POPULAR" },
      { id: "v20", count: 20, price: "₹199", perUnit: "₹9.95 / vibe", kicker: "Bundle", saveLabel: "Best Value" },
    ],
  },
  invites: {
    title: "Invites",
    unit: "invites",
    tagline: "Curated invitations. Real-world moments.",
    icon: <Send className="h-5 w-5" />,
    perks: [
      "Plan dates around shared interests",
      "Priority delivery to recipients",
      "Use anytime, no expiry",
    ],
    tiers: [
      { id: "i2", count: 2, price: "₹79", perUnit: "₹39.50 / invite", kicker: "Starter" },
      { id: "i5", count: 5, price: "₹179", perUnit: "₹35.80 / invite", kicker: "Best Value", badge: "POPULAR", saveLabel: "Save 9%" },
      { id: "i10", count: 10, price: "₹329", perUnit: "₹32.90 / invite", kicker: "Bundle", saveLabel: "Save 17%" },
    ],
  },
  search: {
    title: "Magic Searches",
    unit: "searches",
    tagline: "Find exactly the person you're looking for.",
    icon: <Wand2 className="h-5 w-5" />,
    perks: [
      "Filter by vibe, intent and more",
      "Surface profiles outside your usual feed",
      "Use anytime, no expiry",
    ],
    tiers: [
      { id: "s5", count: 5, price: "₹79", perUnit: "₹15.80 / search", kicker: "Starter" },
      { id: "s10", count: 10, price: "₹149", perUnit: "₹14.90 / search", kicker: "Best Value", badge: "POPULAR", saveLabel: "Save 6%" },
      { id: "s20", count: 20, price: "₹279", perUnit: "₹13.95 / search", kicker: "Bundle", saveLabel: "Save 12%" },
    ],
  },
  "virtual-dates": {
    title: "Virtual Dates",
    unit: "dates",
    tagline: "Face-to-face moments, before you meet.",
    icon: <Video className="h-5 w-5" />,
    perks: [
      "5-minute video calls inside chat",
      "No external links or numbers needed",
      "Use anytime, no expiry",
    ],
    tiers: [
      { id: "vd1", count: 1, price: "₹49", perUnit: "₹49 / date", kicker: "Starter" },
      { id: "vd3", count: 3, price: "₹129", perUnit: "₹43 / date", kicker: "Best Value", badge: "POPULAR", saveLabel: "Save 12%" },
      { id: "vd5", count: 5, price: "₹199", perUnit: "₹39.80 / date", kicker: "Bundle", saveLabel: "Save 19%" },
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

  const successMessages: Record<ExtraKey, (count: number) => string> = {
    vibes: (count) =>
      `${count} ${count === 1 ? "Vibe" : "Vibes"} added to your balance — ready to spark a connection.`,
    invites: (count) =>
      `${count} ${count === 1 ? "Invite" : "Invites"} added to your balance — time to plan something memorable.`,
    search: (count) =>
      `${count} Magic ${count === 1 ? "Search" : "Searches"} added to your balance — discover profiles that truly match your intent.`,
    "virtual-dates": (count) =>
      `${count} Virtual ${count === 1 ? "Date" : "Dates"} added to your balance — take the conversation face-to-face.`,
  };

  const handlePurchase = () => {
    if (isPurchasing) return;
    setIsPurchasing(true);
    setTimeout(() => {
      setIsPurchasing(false);
      toast.success("Added to your balance", {
        description: successMessages[key](active.count),
        icon: (
          <div
            className="h-6 w-6 rounded-full flex items-center justify-center"
            style={{ background: "var(--gradient-warm)" }}
          >
            <span className="text-primary-foreground scale-75">{cfg.icon}</span>
          </div>
        ),
      });
      navigate(-1);
    }, 1200);
  };

  return (
    <div className="min-h-dvh bg-background relative overflow-hidden">
      {/* Close */}
      <button
        onClick={() => navigate("/profile")}
        className="absolute left-4 top-4 z-30 h-9 w-9 rounded-full bg-card/80 backdrop-blur border border-border/40 flex items-center justify-center hover:bg-card transition-colors"
        aria-label="Close"
      >
        <X className="h-4 w-4 text-foreground" />
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-12 pb-6 px-6 text-center relative"
        style={{
          background:
            "linear-gradient(to bottom, hsl(45 40% 94% / 0.9) 0%, hsl(56 100% 98% / 0) 100%)",
        }}
      >
        <div
          className="mx-auto mb-3 h-11 w-11 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
        >
          <span className="text-primary-foreground">{cfg.icon}</span>
        </div>
        <h1
          className="font-display text-[34px] leading-none tracking-tight"
          style={{
            background: "var(--gradient-gold)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {cfg.title}
        </h1>
        <p className="text-[11px] mt-2.5 uppercase tracking-[0.2em] font-medium text-muted-foreground">
          {cfg.tagline}
        </p>
      </motion.div>

      {/* Content */}
      <div className="px-5 pb-72">
        {/* Horizontal Tier Slider */}
        <div className="-mx-5 mb-6">
          <div
            className="flex gap-3 overflow-x-auto px-5 pb-3 pt-3 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {cfg.tiers.map((tier, i) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
                className="snap-center shrink-0 w-[44%]"
              >
                <TierTile
                  tier={tier}
                  unit={cfg.unit}
                  selected={selected === tier.id}
                  onSelect={() => setSelected(tier.id)}
                />
              </motion.div>
            ))}
          </div>
          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-1.5 mt-1">
            {cfg.tiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelected(tier.id)}
                aria-label={`Select ${tier.count} ${cfg.unit}`}
                className="transition-all rounded-full"
                style={{
                  width: selected === tier.id ? 18 : 6,
                  height: 6,
                  background:
                    selected === tier.id
                      ? "var(--gradient-gold)"
                      : "hsl(36 53% 51% / 0.25)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Perks */}
        <div>
          <div
            className="flex items-baseline justify-between pb-3 mb-3 border-b"
            style={{ borderColor: "hsl(40 30% 88%)" }}
          >
            <h3
              className="text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "hsl(32 70% 36% / 0.85)" }}
            >
              {cfg.title} Privileges
            </h3>
            <span className="text-[10px] text-muted-foreground">{cfg.perks.length} benefits</span>
          </div>

          <div
            className="rounded-2xl p-4"
            style={{
              background: "hsl(45 40% 96%)",
              border: "1px solid hsl(36 53% 51% / 0.25)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center"
                style={{ background: "var(--gradient-warm)", color: "hsl(var(--primary-foreground))" }}
              >
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="text-[13px] font-semibold text-foreground">What you get</div>
            </div>
            <ul className="space-y-2.5 pl-1">
              {cfg.perks.map((p, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-2.5"
                >
                  <div
                    className="mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "hsl(41 70% 64% / 0.28)" }}
                  >
                    <Check className="h-2.5 w-2.5" style={{ color: "hsl(32 70% 36%)" }} strokeWidth={3} />
                  </div>
                  <span className="text-[12.5px] text-foreground/85 leading-snug">{p}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <p className="text-[10.5px] text-muted-foreground text-center px-2 leading-relaxed mt-4">
            One-time purchase. {cfg.title} are added to your account instantly and never expire.
          </p>
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
          One-time purchase charged to your Google Play account. {cfg.title} are added instantly and never expire.{" "}
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
  const isPopular = !!tier.badge;
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
            {tier.badge}
          </span>
        </div>
      )}
      <span
        className="block text-[10px] uppercase tracking-wider mb-1"
        style={{ color: isPopular ? "hsl(32 70% 36%)" : "hsl(var(--muted-foreground))" }}
      >
        {tier.kicker}
      </span>
      <span className="block font-display text-[18px] leading-tight text-foreground capitalize">
        {tier.count} {unit}
      </span>
      <div className="mt-3">
        <span className="block text-[15px] font-semibold text-foreground">{tier.price}</span>
        <span className="block text-[10px] text-muted-foreground">{tier.perUnit}</span>
      </div>
      {tier.saveLabel && (
        <div className="absolute bottom-2 right-2">
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{
              color: "hsl(32 70% 36%)",
              background: "hsl(41 70% 64% / 0.18)",
            }}
          >
            {tier.saveLabel}
          </span>
        </div>
      )}
    </button>
  );
}

export default BuyExtras;
