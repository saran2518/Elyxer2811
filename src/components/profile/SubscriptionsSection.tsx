import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar, Receipt, Settings2, XCircle, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Crown, CreditCard, Check, X, Gem, HeartPulse, Send, Wand2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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
      { included: true, label: "15 vibes/day" },
      { included: true, label: "5 invites/week" },
    ],
    moreFeatures: [
      { included: true, label: "5 magic search/wk" },
      { included: true, label: "Extended filters" },
      { included: true, label: "See who vibed you" },
      { included: true, label: "See who invited you" },
      { included: true, label: "Moments interact" },
      { included: true, label: "2 posts/week" },
      { included: true, label: "Enhanced visibility" },
    ],
  },
  {
    planKey: "infinity",
    icon: <Gem className="h-5 w-5" />,
    title: "Elyxer Infinity",
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
      { included: true, label: "30 vibes/day" },
      { included: true, label: "10 invites/week" },
    ],
    moreFeatures: [
      { included: true, label: "Unlimited search" },
      { included: true, label: "Advanced filters" },
      { included: true, label: "See who vibed you" },
      { included: true, label: "See who invited you" },
      { included: true, label: "Full moments access" },
      { included: true, label: "4 posts/week" },
      { included: true, label: "Profile unlock" },
      { included: true, label: "Profile control" },
      { included: true, label: "Priority visibility" },
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
  const [vibeCount] = useState(3);
  const [inviteCount] = useState(1);
  const [searchCount] = useState(2);

  // Mocked active subscription (until billing backend exists)
  const [activeSub, setActiveSub] = useState<{
    plan: "plus" | "infinity";
    title: string;
    price: string;
    cycle: string;
    nextBilling: string;
    startedOn: string;
    cardBrand: string;
    cardLast4: string;
    autoRenew: boolean;
    history: { date: string; amount: string; status: string }[];
  } | null>({
    plan: "plus",
    title: "Elyxer Plus",
    price: "₹199",
    cycle: "Weekly",
    nextBilling: "20 Jul 2026",
    startedOn: "22 Jun 2026",
    cardBrand: "Visa",
    cardLast4: "4242",
    autoRenew: true,
    history: [
      { date: "13 Jul 2026", amount: "₹199", status: "Paid" },
      { date: "06 Jul 2026", amount: "₹199", status: "Paid" },
      { date: "29 Jun 2026", amount: "₹199", status: "Paid" },
      { date: "22 Jun 2026", amount: "₹199", status: "Paid" },
    ],
  });

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const filteredPlans = activeSub ? plans.filter((p) => p.planKey !== activeSub.plan) : plans;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Current Subscription */}
      {activeSub && (
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold uppercase tracking-widest px-1 text-transparent bg-clip-text" style={{ backgroundImage: "var(--gradient-warm)" }}>Current Subscription</h3>
          <div
            className="relative rounded-[20px] border border-primary/30 bg-card overflow-hidden"
            style={{ boxShadow: "var(--shadow-warm)" }}
          >
            <div className="h-[3px] w-full" style={{ background: "var(--gradient-warm)" }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, hsl(var(--primary) / 0.10) 0%, hsl(var(--primary) / 0.03) 60%, transparent 100%)" }} />

            <div className="relative p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Crown className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-[15px] font-bold text-foreground leading-tight">{activeSub.title}</h4>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {activeSub.price} · {activeSub.cycle}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground">You pay</div>
                  <div className="text-[16px] font-bold text-foreground leading-tight">{activeSub.price}<span className="text-[10px] font-medium text-muted-foreground">/wk</span></div>
                </div>
              </div>

              {/* Info rows */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <InfoTile icon={<Calendar className="h-3.5 w-3.5" />} label="Next billing" value={activeSub.nextBilling} />
                <InfoTile icon={<CreditCard className="h-3.5 w-3.5" />} label="Payment" value={`${activeSub.cardBrand} ····${activeSub.cardLast4}`} />
              </div>

              {/* Actions */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDetailsOpen(true)}
                  className="h-9 rounded-xl text-[12px] font-semibold border-primary/30 text-primary hover:bg-primary/5 gap-1.5"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  Manage
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCancelOpen(true)}
                  className="h-9 rounded-xl text-[12px] font-semibold border-destructive/30 text-destructive hover:bg-destructive/5 gap-1.5"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buy Extras */}
      <div className="space-y-2">
        <h3 className="text-[11px] font-bold uppercase tracking-widest px-1 text-transparent bg-clip-text" style={{ backgroundImage: "var(--gradient-warm)" }}>Buy Extras</h3>
        <div className="grid grid-cols-3 gap-3 pb-3">
          <PurchaseItem icon={<HeartPulse className="h-5 w-5" />} label="Vibes" count={vibeCount} onClick={() => navigate("/buy-extras?item=vibes")} />
          <PurchaseItem icon={<Send className="h-5 w-5" />} label="Invites" count={inviteCount} onClick={() => navigate("/buy-extras?item=invites")} />
          <PurchaseItem icon={<Wand2 className="h-5 w-5" />} label="Magic" count={searchCount} onClick={() => navigate("/buy-extras?item=search")} />
        </div>
      </div>

      <Separator className="bg-border/30" />

      {/* Plans - Horizontal scroll */}
      <div className="space-y-2">
        <h3 className="text-[11px] font-bold uppercase tracking-widest px-1 text-transparent bg-clip-text" style={{ backgroundImage: "var(--gradient-warm)" }}>{activeSub ? "Upgrade / Switch" : "Plans"}</h3>
        <div className="-mx-4">
          <div className="flex gap-3 overflow-x-auto px-4 pb-3 snap-x snap-mandatory scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
            {filteredPlans.map((plan, i) => (
              <PlanCard key={i} plan={plan} />
            ))}
          </div>
        </div>
      </div>

      {/* Manage Subscription Sheet */}
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
          <SheetHeader className="text-left">
            <SheetTitle className="text-lg">Manage subscription</SheetTitle>
            <SheetDescription>Review your plan, payment and billing history.</SheetDescription>
          </SheetHeader>

          {activeSub && (
            <div className="mt-4 space-y-4">
              {/* Summary */}
              <div className="rounded-2xl border border-border/40 p-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-semibold text-foreground">{activeSub.title}</div>
                    <div className="text-[11px] text-muted-foreground">Started {activeSub.startedOn}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[15px] font-bold text-foreground">{activeSub.price}<span className="text-[10px] text-muted-foreground">/wk</span></div>
                    <div className="text-[10px] text-muted-foreground">Renews {activeSub.nextBilling}</div>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="rounded-2xl border border-border/40 p-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-foreground">{activeSub.cardBrand} ····{activeSub.cardLast4}</div>
                  <div className="text-[11px] text-muted-foreground">Default payment method</div>
                </div>
                <Button variant="ghost" size="sm" className="text-primary text-[12px]" onClick={() => toast.info("Payment method update coming soon")}>
                  Update
                </Button>
              </div>

              {/* Auto-renew */}
              <div className="rounded-2xl border border-border/40 p-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-foreground">Auto-renew</div>
                  <div className="text-[11px] text-muted-foreground">
                    {activeSub.autoRenew ? "On — renews weekly" : "Off — access ends on next billing date"}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary text-[12px]"
                  onClick={() => {
                    setActiveSub({ ...activeSub, autoRenew: !activeSub.autoRenew });
                    toast.success(activeSub.autoRenew ? "Auto-renew turned off" : "Auto-renew turned on");
                  }}
                >
                  {activeSub.autoRenew ? "Turn off" : "Turn on"}
                </Button>
              </div>

              {/* Billing history */}
              <div className="rounded-2xl border border-border/40 overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/30 border-b border-border/30">
                  <Receipt className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Billing history</span>
                </div>
                <div className="divide-y divide-border/30">
                  {activeSub.history.map((h, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2.5">
                      <div>
                        <div className="text-[12px] font-medium text-foreground">{h.date}</div>
                        <div className="text-[10px] text-muted-foreground">{activeSub.title}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[12px] font-semibold text-foreground">{h.amount}</div>
                        <div className="text-[10px] text-primary">{h.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setDetailsOpen(false);
                  setCancelOpen(true);
                }}
                className="w-full h-10 rounded-2xl text-[13px] font-semibold border-destructive/30 text-destructive hover:bg-destructive/5 gap-1.5"
              >
                <XCircle className="h-4 w-4" />
                Cancel subscription
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Cancel confirmation */}
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel {activeSub?.title}?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll keep your benefits until {activeSub?.nextBilling}. After that, your plan reverts to Free and you won't be charged again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Keep plan</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setActiveSub(null);
                toast.success("Subscription cancelled");
              }}
            >
              Cancel subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/30 bg-background/40 px-2.5 py-2">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-[12px] font-semibold text-foreground mt-0.5 truncate">{value}</div>
    </div>
  );
}

function PlanCard({ plan }: { plan: PlanData }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`relative rounded-[20px] border ${plan.borderClass || "border-border/30"} bg-card flex flex-col snap-center shrink-0 overflow-hidden`}
      style={{ width: "72vw", maxWidth: 280, ...(plan.shadowStyle || { boxShadow: "0 8px 32px -8px hsl(var(--foreground) / 0.08)" }) }}
    >
      {/* Accent strip */}
      <div className="h-[3px] w-full" style={{ background: "var(--gradient-warm)" }} />
      {/* Warm wash */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, hsl(var(--primary) / 0.08) 0%, hsl(var(--primary) / 0.03) 60%, transparent 100%)" }} />

      {/* Badge */}
      {plan.badge && (
        <div className="relative flex justify-end px-3 pt-2">
          <span
            className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${plan.badgeClass || ""}`}
            style={!plan.badgeClass ? { background: "var(--gradient-warm)", color: "hsl(var(--primary-foreground))" } : undefined}
          >
            {plan.badge}
          </span>
        </div>
      )}

      <div className={`relative px-4 ${plan.badge ? "pt-1.5" : "pt-4"} pb-4 flex flex-col flex-1`}>
        {/* Icon + Title */}
        <div className="flex flex-col items-center text-center mb-3">
          <div className={`h-11 w-11 rounded-xl ${plan.iconBg} flex items-center justify-center mb-2`}>
            <span className={plan.iconColor}>{plan.icon}</span>
          </div>
          <h3 className="text-base font-bold text-foreground leading-tight">{plan.title}</h3>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-[10px] text-muted-foreground">from</span>
            <span className="text-2xl font-bold text-foreground">{plan.startingPrice}</span>
            <span className="text-xs text-muted-foreground">/wk</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mb-3">
          {plan.ctaDisabled ? (
            <div className="w-full rounded-2xl h-9 flex items-center justify-center text-[13px] font-medium text-muted-foreground bg-muted/50 border border-border/30">
              {plan.ctaLabel}
            </div>
          ) : (
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

        {/* Top features - always visible */}
        <div className="space-y-1.5">
          {plan.topFeatures.map((f, i) => (
            <PlanFeature key={i} included={f.included} label={f.label} />
          ))}
        </div>

        {/* View all toggle */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-1.5 mt-1.5">
                {plan.moreFeatures.map((f, i) => (
                  <PlanFeature key={i} included={f.included} label={f.label} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? "Show less" : `View all (${plan.topFeatures.length + plan.moreFeatures.length})`}
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-3 w-3" />
          </motion.span>
        </button>
      </div>
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
        className="h-10 w-10 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
        style={{ background: "var(--gradient-warm)", boxShadow: "0 2px 8px -2px hsl(var(--primary) / 0.3)" }}
      >
        <span className="text-primary-foreground">{icon}</span>
      </div>
      <div className="text-center">
        <div className="text-2xl font-semibold text-foreground leading-none">{count}</div>
        <div className="text-[11px] font-medium text-muted-foreground mt-1 tracking-wide">{label}</div>
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
