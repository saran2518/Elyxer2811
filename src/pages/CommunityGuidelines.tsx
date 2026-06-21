import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import communityImage from "@/assets/community-guidelines.png.asset.json";

const values = [
  { title: "Integrity", body: "Authentic profiles, honest intentions." },
  { title: "Respect", body: "Everyone deserves to feel valued." },
  { title: "Safety", body: "Look out for yourself and others." },
  { title: "Boundaries", body: "Respect limits, no questions asked." },
  { title: "Accountability", body: "Your actions shape the community." },
];

const Divider = () => (
  <div className="flex items-center gap-2 py-0.5">
    <div className="flex-1 h-px bg-border/50" />
    <span className="text-primary text-[10px]">✦</span>
    <div className="flex-1 h-px bg-border/50" />
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
          transition={{ duration: 0.5 }}
          className="relative w-full h-[28vh] min-h-[180px] overflow-hidden shrink-0"
        >
          <img
            src={communityImage.url}
            alt="Elyxer community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-4 pb-3">
            <h1 className="font-display text-[26px] leading-[1.05]">
              <span className="text-foreground">Our community,</span>
              <br />
              <span className="text-primary italic">your responsibility</span>
            </h1>
          </div>
        </motion.div>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 flex flex-col px-4 pt-2 pb-4 gap-2"
        >
          <Divider />

          <p className="font-body text-[9px] tracking-[0.2em] text-primary uppercase">
            Our Community Values
          </p>

          {/* Values grid — 2 columns on larger screens, 1 on very narrow */}
          <div className="grid grid-cols-2 gap-1.5">
            {values.map(({ title, body }) => (
              <div
                key={title}
                className="rounded-xl bg-card/60 backdrop-blur-sm border border-border/40 px-3 py-2.5 flex flex-col gap-1"
              >
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rotate-45 border border-primary bg-primary/20 shrink-0" />
                  <p className="font-display text-[13px] font-bold text-foreground leading-none">
                    {title}
                  </p>
                </div>
                <p className="font-body text-[11px] text-foreground/65 leading-snug pl-3">
                  {body}
                </p>
              </div>
            ))}
          </div>

          {/* Read full guidelines */}
          <button
            onClick={() => {}}
            className="w-full rounded-xl border border-primary/40 bg-card/30 py-2 font-body text-[12px] text-primary mt-0.5"
          >
            Read full Community Guidelines →
          </button>

          <Divider />

          <Button
            onClick={() => navigate("/discover")}
            size="lg"
            className="w-full h-11 rounded-xl font-body font-semibold tracking-wider text-[12px]"
            style={{
              background: "var(--gradient-warm)",
              boxShadow: "var(--shadow-warm)",
            }}
          >
            I UNDERSTAND & AGREE
            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Button>

          <p className="text-center font-body text-[10px] text-foreground/50 leading-snug px-2">
            By continuing you agree to our{" "}
            <span className="text-primary/80">Community Guidelines</span> and{" "}
            <span className="text-primary/80">Terms of Service</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
