import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Infinity as InfinityIcon,
  ChevronDown,
  List,
  AlertTriangle,
  ShieldCheck,
  MessageSquareWarning,
  Lock,
  AlertOctagon,
  EyeOff,
  Camera,
  Baby,
  Gavel,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import communityImage from "@/assets/community-guidelines.png.asset.json";

const Divider = () => (
  <div className="flex items-center justify-center gap-2 w-full">
    <div className="h-px flex-1 bg-primary/40" />
    <div className="h-1.5 w-1.5 rotate-45 bg-primary/60" />
    <div className="h-px flex-1 bg-primary/40" />
  </div>
);

const rules = [
  { title: "Be Real", body: "Real photos. Real name. Honest information." },
  { title: "Be Respectful", body: "Dignity is non-negotiable, always." },
  { title: "Be Safe", body: "Never share financial info. Meet in public." },
  { title: "Be Consensual", body: "Every interaction must be welcome." },
  { title: "Be Responsible", body: "You own everything you do on Elyxer." },
];

const topics = [
  { icon: ShieldCheck, label: "Authenticity" },
  { icon: MessageSquareWarning, label: "Harassment" },
  { icon: Lock, label: "Privacy & consent" },
  { icon: AlertOctagon, label: "Fraud & scams" },
  { icon: EyeOff, label: "Explicit content" },
  { icon: Camera, label: "Moments & VDR" },
  { icon: Baby, label: "Minor safety", danger: true },
  { icon: Gavel, label: "Enforcement" },
];

const CommunityGuidelines = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-md flex flex-col min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative w-full aspect-square overflow-hidden"
        >
          <img
            src={communityImage.url}
            alt="Illustrated grid of diverse Elyxer community members on their phones"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h1 className="font-display text-3xl font-bold text-foreground leading-tight">
              Our community,
              <br />
              <span className="text-primary italic">your responsibility</span>
            </h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex flex-col px-6 pt-6 pb-8 gap-5"
        >
          <Divider />

          <p className="font-body text-sm text-foreground/80 text-center leading-relaxed">
            Elyxer exists for genuine connections. These guidelines protect every person — without exception.
          </p>

          <p className="font-body text-[11px] tracking-[0.18em] text-primary uppercase">
            The Five Golden Rules
          </p>

          <div className="space-y-2.5">
            {rules.map((r) => (
              <div
                key={r.title}
                className="flex items-start gap-3 rounded-[20px] bg-card/60 backdrop-blur-sm border border-border/40 p-3.5"
              >
                <div className="h-8 w-8 rounded-full border border-primary/40 flex items-center justify-center shrink-0">
                  <div className="h-2 w-2 rotate-45 bg-primary/70" />
                </div>
                <div className="pt-0.5">
                  <p className="font-display text-[15px] font-semibold text-foreground leading-tight">
                    {r.title}
                  </p>
                  <p className="font-body text-[13px] text-foreground/70 mt-0.5">{r.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Collapsible */}
          <div className="rounded-[20px] border border-primary/40 overflow-hidden bg-card/40 backdrop-blur-sm">
            <button
              onClick={() => setOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5"
              aria-expanded={open}
            >
              <div className="flex items-center gap-2.5">
                <List className="h-4 w-4 text-foreground/70" />
                <span className="font-display text-[14px] text-foreground">
                  What these guidelines cover
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body text-[11px] px-2.5 py-0.5 rounded-full border border-primary/50 text-primary">
                  8 topics
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-foreground/70 transition-transform duration-300 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-primary/20">
                    <ul>
                      {topics.map(({ icon: Icon, label, danger }) => (
                        <li
                          key={label}
                          className={`flex items-center gap-3 px-4 py-3 border-b border-border/30 last:border-b-0 ${
                            danger ? "bg-destructive/10" : ""
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 ${
                              danger ? "text-destructive" : "text-primary/80"
                            }`}
                          />
                          <span
                            className={`font-body text-[13px] ${
                              danger ? "text-destructive font-medium" : "text-foreground/85"
                            }`}
                          >
                            {label}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-destructive/15 px-4 py-4 flex items-start gap-3 border-t border-destructive/30">
                      <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p
                          className="text-[14px] font-semibold text-destructive leading-tight"
                          style={{ fontFamily: "'Marcellus', serif" }}
                        >
                          Zero tolerance, always
                        </p>
                        <p className="font-body text-[12px] text-destructive/90 mt-1 leading-relaxed">
                          Sexual harassment, cyberflashing, or any content involving minors —
                          immediate permanent ban. No warnings.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Divider />

          <Button
            onClick={() => navigate("/discover")}
            size="lg"
            className="w-full h-14 rounded-2xl font-body font-semibold tracking-wider text-[15px]"
            style={{
              background: "var(--gradient-warm)",
              boxShadow: "var(--shadow-warm)",
            }}
          >
            I UNDERSTAND & AGREE
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          <div className="flex justify-center">
            <InfinityIcon className="h-4 w-4 text-primary/60" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
