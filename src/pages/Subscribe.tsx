import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X, Crown, Gem, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
      { key: "wk", label: "1 Week", price: "₹199", perWeek: "₹199.00/wk" },
      { key: "mo", label: "1 Month", price: "₹699", perWeek: "₹174.75/wk", badge: "POPULAR", saveLabel: "Save 12%" },
      { key: "3mo", label: "3 Months", price: "₹1,799", perWeek: "₹149.92/wk", saveLabel: "Save 25%" },
      { key: "yr", label: "1 Year", price: "₹5,999", perWeek: "₹115.37/wk", saveLabel: "Save 42%" },
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
  const [legalDoc, setLegalDoc] = useState<{ title: string; url: string } | null>(null);
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
      {/* Decorative auras */}
      <div
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: "hsl(41 70% 64% / 0.18)", filter: "blur(80px)" }}
      />
      <div
        className="absolute top-1/2 -left-24 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: "hsl(36 53% 51% / 0.10)", filter: "blur(80px)" }}
      />

      {/* Close */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-4 top-4 z-20 h-9 w-9 rounded-full bg-card/80 backdrop-blur border border-border/40 flex items-center justify-center hover:bg-card transition-colors"
        aria-label="Close"
      >
        <X className="h-4 w-4 text-foreground" />
      </button>

      <div className="relative z-10 flex flex-col pb-80">
        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pt-14 pb-8 text-center"
        >
          <div
            className="inline-flex items-center px-4 py-1.5 rounded-full mb-5"
            style={{
              background: "hsl(41 70% 64% / 0.12)",
              border: "1px solid hsl(36 53% 51% / 0.25)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full mr-2 animate-pulse"
              style={{ background: "hsl(36 53% 51%)" }}
            />
            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{
                background: "var(--gradient-warm)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Premium Access
            </span>
          </div>
          <h1
            className="font-display text-[34px] leading-[1.05] mb-2"
            style={{
              background: "var(--gradient-gold)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {plan.title}
          </h1>
          <p className="text-[13px] italic text-muted-foreground font-display">
            {plan.tagline}
          </p>
          {/* Hairline ornament */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <span className="h-px w-10" style={{ background: "hsl(36 53% 51% / 0.4)" }} />
            <span className="h-1 w-1 rounded-full" style={{ background: "hsl(36 53% 51%)" }} />
            <span className="h-px w-10" style={{ background: "hsl(36 53% 51% / 0.4)" }} />
          </div>
        </motion.div>

        {/* Package Options */}
        <div className="px-6 space-y-3">
          {plan.packages.map((pkg, i) => (
            <motion.div
              key={pkg.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <PackageRow
                pkg={pkg}
                selected={selected === pkg.key}
                onSelect={() => setSelected(pkg.key)}
              />
            </motion.div>
          ))}
        </div>

        {/* Included Features — editorial band */}
        <div
          className="mt-8 px-8 py-7 border-t border-b"
          style={{
            background: "hsl(45 40% 94% / 0.5)",
            borderColor: "hsl(40 30% 88%)",
          }}
        >
          <h3
            className="text-[10px] font-bold uppercase tracking-[0.22em] mb-5 text-center"
            style={{ color: "hsl(32 70% 36% / 0.75)" }}
          >
            Included with {plan.title.replace("Elyxer ", "")}
          </h3>
          <ul className="space-y-3">
            {plan.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-[13px]">
                <div
                  className="mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "hsl(41 70% 64% / 0.2)" }}
                >
                  <Check className="h-2.5 w-2.5" style={{ color: "hsl(32 70% 36%)" }} strokeWidth={3} />
                </div>
                <span className="text-foreground/85 leading-snug">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sticky Footer CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 inset-x-0 px-5 pt-5 pb-6 z-20"
        style={{
          background:
            "linear-gradient(to top, hsl(56 100% 98%) 55%, hsl(56 100% 98% / 0.92) 85%, transparent)",
          backdropFilter: "blur(10px)",
        }}
      >
        <p className="text-[10px] text-center text-muted-foreground/80 mb-2.5 leading-tight px-2">
          Auto-renews at {active.price}/{active.label.toLowerCase()} until cancelled.
        </p>
        <Button
          onClick={handlePurchase}
          disabled={isPurchasing}
          aria-busy={isPurchasing}
          className="w-full h-12 rounded-2xl font-bold uppercase tracking-[0.12em] text-[12px]"
          style={{
            background: "var(--gradient-gold)",
            boxShadow: "var(--shadow-elegant)",
          }}
        >
          {isPurchasing ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing…</>
          ) : (
            <>Continue · {active.price}</>
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
            onClick={() =>
              setLegalDoc({ title: "Terms of Use", url: "https://elyxwebsite01.lovable.app/terms" })
            }
            className="underline text-primary hover:text-primary/80 transition-colors"
          >
            Terms of Use
          </button>
        </p>
      </motion.div>

      <Dialog open={!!legalDoc} onOpenChange={(o) => !o && setLegalDoc(null)}>
        <DialogContent className="p-0 gap-0 overflow-hidden border-0 rounded-none sm:rounded-none w-screen h-[100dvh] max-w-none translate-x-[-50%] translate-y-[-50%] flex flex-col [&>button]:hidden">
          <div className="flex items-center justify-between px-4 h-12 border-b shrink-0 bg-background">
            <DialogTitle className="font-body text-[15px] font-semibold">
              {legalDoc?.title}
            </DialogTitle>
            <button
              onClick={() => setLegalDoc(null)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-muted"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {legalDoc && (
            <iframe
              src={legalDoc.url}
              title={legalDoc.title}
              className="w-full flex-1 border-0 bg-background"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              referrerPolicy="no-referrer"
            />
          )}
        </DialogContent>
      </Dialog>
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
  const isPopular = !!pkg.badge;
  return (
    <button
      onClick={onSelect}
      className="relative w-full text-left rounded-2xl p-4 transition-all active:scale-[0.98]"
      style={{
        background: selected ? "hsl(41 70% 64% / 0.08)" : "hsl(var(--card) / 0.6)",
        border: selected
          ? "2px solid hsl(36 53% 51%)"
          : "1px solid hsl(41 70% 64% / 0.35)",
        boxShadow: selected ? "var(--shadow-warm)" : undefined,
        margin: selected ? 0 : "1px",
      }}
    >
      {isPopular && (
        <div
          className="absolute -top-3 left-5 px-3 py-0.5 rounded-full"
          style={{ background: "var(--gradient-warm)" }}
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-primary-foreground">
            {pkg.badge}
          </span>
        </div>
      )}
      <div className="flex-1 pt-0.5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-display text-[19px] leading-none text-foreground">
            {pkg.label}
          </span>
          {pkg.saveLabel && (
            <span
              className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded"
              style={
                selected
                  ? { background: "hsl(32 70% 36%)", color: "hsl(var(--primary-foreground))" }
                  : { color: "hsl(32 70% 36%)" }
              }
            >
              {pkg.saveLabel}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[20px] font-bold text-foreground">{pkg.price}</span>
          <span className="text-[11px] text-muted-foreground">({pkg.perWeek})</span>
        </div>
      </div>
    </button>
  );
}

export default Subscribe;
