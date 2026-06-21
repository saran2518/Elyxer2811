import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import communityImage from "@/assets/community-guidelines.png.asset.json";

const values = [
  {
    title: "Integrity",
    body: "Show up as yourself. Authentic profiles, honest intentions.",
  },
  {
    title: "Respect",
    body: "Every person here deserves to feel valued and heard.",
  },
  {
    title: "Safety",
    body: "Look out for yourself and the people you meet here.",
  },
  {
    title: "Boundaries",
    body: "Respect where people draw the line, without question.",
  },
  {
    title: "Accountability",
    body: "Your actions shape what this community becomes.",
  },
];

const Divider = () => (
  <div className="flex items-center gap-3 py-1">
    <div className="flex-1 h-px bg-border/60" />
    <span className="text-primary text-xs">✦</span>
    <div className="flex-1 h-px bg-border/60" />
  </div>
);

const CommunityGuidelines = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-md flex flex-col min-h-screen">
        {/* Hero */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
            <h1 className="font-display text-[30px] leading-[1.1]">
              <span className="text-foreground">Our community,</span>
              <br />
              <span className="text-primary italic">your responsibility</span>
            </h1>
          </div>
        </motion.div>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex-1 flex flex-col px-5 pt-3 pb-5 gap-3"
        >
          <Divider />

          <p className="font-body text-[10px] tracking-[0.22em] text-primary uppercase">
            Our Community Values
          </p>

          {/* Values list */}
          <div className="flex flex-col gap-2">
            {values.map(({ title, body }) => (
              <div
                key={title}
                className="rounded-2xl bg-card/70 backdrop-blur-sm border border-border/50 px-4 py-3 flex items-start gap-3"
              >
                <div className="mt-1.5 h-2.5 w-2.5 rotate-45 border border-primary bg-primary/20 shrink-0" />
                <div>
                  <p className="font-display text-[15px] font-bold text-foreground leading-tight">
                    {title}
                  </p>
                  <p className="font-body text-[12px] text-foreground/70 leading-snug mt-0.5">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Read full guidelines */}
          <button
            onClick={() => {}}
            className="w-full rounded-2xl border border-primary/50 bg-card/40 py-3 font-body text-[13px] text-primary"
          >
            Read the full Community Guidelines →
          </button>

          <Divider />

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

          <p className="text-center font-body text-[11px] text-foreground/60 leading-relaxed">
            By continuing you agree to our{" "}
            <span className="text-primary">Community Guidelines</span> and{" "}
            <span className="text-primary">Terms of Service</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
