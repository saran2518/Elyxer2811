import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Crown, Calendar, CreditCard, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [activeSub, setActiveSub] = useState({
    plan: "Elyxer Plus",
    price: "₹199",
    interval: "week",
    nextBilling: "20 Jul 2026",
    cardBrand: "Visa",
    cardLast4: "4242",
    cancelled: false,
  });

  const handleCancel = () => {
    setActiveSub((prev) => ({ ...prev, cancelled: true }));
    setCancelOpen(false);
    toast.success("Subscription cancelled");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/10 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate("/subscribe")}
          className="h-9 w-9 rounded-xl border border-border/30 bg-card flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-95 transition-all"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-base font-bold text-foreground">Subscription</h1>
      </header>

      <main className="flex-1 px-4 py-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[20px] border border-primary/30 bg-card overflow-hidden"
          style={{ boxShadow: "var(--shadow-warm)" }}
        >
          {/* Accent strip */}
          <div className="h-[3px] w-full" style={{ background: "var(--gradient-warm)" }} />

          {/* Plan header */}
          <div className="relative px-5 pt-5 pb-4 flex flex-col items-center text-center">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, hsl(var(--primary) / 0.10) 0%, hsl(var(--primary) / 0.04) 60%, transparent 100%)" }} />
            <div className="relative h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3" style={{ boxShadow: "0 2px 12px -2px hsl(var(--primary) / 0.25)" }}>
              <Crown className="h-6 w-6" />
            </div>
            <h2 className="relative text-lg font-bold text-foreground">{activeSub.plan}</h2>
            <p className="relative mt-1 text-[13px] italic text-muted-foreground font-display">More depth. More discovery.</p>
            <div className="relative mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{activeSub.price}</span>
              <span className="text-sm font-medium text-muted-foreground">/{activeSub.interval}</span>
            </div>
          </div>

          <Separator className="bg-border/20" />

          {/* Billing details */}
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Renews
              </span>
              <span className="font-semibold text-foreground">{activeSub.nextBilling}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-muted-foreground flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Payment
              </span>
              <span className="font-semibold text-foreground">{activeSub.cardBrand} ····{activeSub.cardLast4}</span>
            </div>
          </div>

          <Separator className="bg-border/20" />

          {/* Actions */}
          <div className="p-4">
            {activeSub.cancelled ? (
              <div className="w-full rounded-2xl h-10 flex items-center justify-center text-[13px] font-semibold text-muted-foreground bg-muted/40 border border-border/30">
                Ends on {activeSub.nextBilling}
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setCancelOpen(true)}
                className="w-full h-10 rounded-xl text-[13px] font-semibold border-destructive/30 text-destructive hover:bg-destructive/5 gap-2"
              >
                <XCircle className="h-4 w-4" />
                Cancel subscription
              </Button>
            )}
          </div>
        </motion.div>
      </main>

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel {activeSub.plan}?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ll keep your benefits until {activeSub.nextBilling}. After that, your plan reverts to Free and you won&apos;t be charged again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Keep plan</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleCancel}
            >
              Cancel subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubscriptionManagement;
