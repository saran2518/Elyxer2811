import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
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
  Sparkles,
  Heart,
  ShieldAlert,
  HandHeart,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import communityImage from "@/assets/community-guidelines.png.asset.json";

const rules = [
  { icon: UserCheck, title: "Be Real", body: "Real photos, name, info." },
  { icon: Heart, title: "Be Respectful", body: "Dignity is non‑negotiable." },
  { icon: ShieldAlert, title: "Be Safe", body: "Never share financials." },
  { icon: HandHeart, title: "Be Consensual", body: "Every interaction welcome." },
  { icon: Sparkles, title: "Be Responsible", body: "You own your actions." },
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
        {/* Compact hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[38vh] min-h-[260px] overflow-hidden"
        >
          <img
            src={communityImage.url}
            alt="Elyxer community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="font-body text-[10px] tracking-[0.22em] text-primary uppercase mb-1.5">
              Community Guidelines
            </p>
            <h1 className="font-display text-[26px] font-bold text-foreground leading-[1.1]">
              Our community,{" "}
              <span className="text-primary italic">your responsibility</span>
            </h1>
          </div>
        </motion.div>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex-1 flex flex-col px-5 pt-4 pb-6 gap-4"
        >
          <p className="font-body text-[12.5px] text-foreground/75 leading-relaxed">
            Elyxer exists for genuine connections. These rules protect everyone —
            without exception.
          </p>

          {/* Five rules — compact grid */}
          <div>
            <p className="font-body text-[10px] tracking-[0.2em] text-primary uppercase mb-2">
              The Five Golden Rules
            </p>
            <div className="grid grid-cols-2 gap-2">
              {rules.map(({ icon: Icon, title, body }, i) => (
                <div
                  key={title}
                  className={`rounded-2xl bg-card/70 backdrop-blur-sm border border-border/50 p-3 ${
                    i === 4 ? "col-span-2" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-3 w-3 text-primary" />
                    </div>
                    <p className="font-display text-[13px] font-semibold text-foreground leading-none">
                      {title}
                    </p>
                  </div>
                  <p className="font-body text-[11.5px] text-foreground/65 leading-snug">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Collapsible */}
          <div className="rounded-2xl border border-primary/40 overflow-hidden bg-card/40 backdrop-blur-sm">
            <button
              onClick={() => setOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-3 px-3.5 py-3"
              aria-expanded={open}
            >
              <div className="flex items-center gap-2">
                <List className="h-3.5 w-3.5 text-foreground/70" />
                <span className="font-display text-[13px] text-foreground">
                  What these guidelines cover
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body text-[10px] px-2 py-0.5 rounded-full border border-primary/50 text-primary">
                  8 topics
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-foreground/70 transition-transform duration-300 ${
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
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-primary/20">
                    <ul className="grid grid-cols-2">
                      {topics.map(({ icon: Icon, label, danger }, i) => (
                        <li
                          key={label}
                          className={`flex items-center gap-2 px-3 py-2.5 border-border/30 ${
                            i % 2 === 0 ? "border-r" : ""
                          } ${i < topics.length - 2 ? "border-b" : ""} ${
                            danger ? "bg-destructive/10" : ""
                          }`}
                        >
                          <Icon
                            className={`h-3.5 w-3.5 shrink-0 ${
                              danger ? "text-destructive" : "text-primary/80"
                            }`}
                          />
                          <span
                            className={`font-body text-[11.5px] truncate ${
                              danger
                                ? "text-destructive font-medium"
                                : "text-foreground/85"
                            }`}
                          >
                            {label}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-destructive/15 px-3.5 py-3 flex items-start gap-2.5 border-t border-destructive/30">
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p
                          className="text-[12.5px] font-semibold text-destructive leading-tight"
                          style={{ fontFamily: "'Marcellus', serif" }}
                        >
                          Zero tolerance, always
                        </p>
                        <p className="font-body text-[11px] text-destructive/90 mt-0.5 leading-snug">
                          Harassment, cyberflashing, or content involving minors —
                          immediate permanent ban.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1" />

          <Button
            onClick={() => navigate("/discover")}
            size="lg"
            className="w-full h-12 rounded-2xl font-body font-semibold tracking-wider text-[13px]"
            style={{
              background: "var(--gradient-warm)",
              boxShadow: "var(--shadow-warm)",
            }}
          >
            I UNDERSTAND & AGREE
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
