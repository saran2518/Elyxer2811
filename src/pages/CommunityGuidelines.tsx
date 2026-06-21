import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import communityImage from "@/assets/community-guidelines.png.asset.json";

const values = [
  {
    title: "Integrity",
    body: "Show up as yourself. Authentic profiles, honest intentions.",
    featured: true,
    initial: "I",
  },
  {
    title: "Respect",
    body: "Every person here deserves to feel valued and heard.",
    initial: "R",
  },
  {
    title: "Safety",
    body: "Look out for yourself and the people you meet here.",
    initial: "S",
  },
  {
    title: "Boundaries",
    body: "Respect where people draw the line, without question.",
    initial: "B",
  },
  {
    title: "Accountability",
    body: "Your actions shape what this community becomes.",
    initial: "A",
  },
];

const Divider = () => (
  <div className="flex items-center gap-3 py-0.5">
    <div className="flex-1 h-px bg-border/60" />
    <span className="text-primary text-[10px]">✦</span>
    <div className="flex-1 h-px bg-border/60" />
  </div>
);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

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
          className="relative w-full overflow-hidden shrink-0"
        >
          <img
            src={communityImage.url}
            alt="Elyxer community"
            className="block w-full h-auto object-contain"
          />
        </motion.div>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 flex flex-col px-5 pt-8 pb-5 gap-3"
        >
          <h1 className="font-display text-[24px] leading-[1.1]">
            <span className="text-foreground">Our community,</span>
            <br />
            <span className="text-primary italic">Our responsibility</span>
          </h1>
          <p className="font-body text-[10px] tracking-[0.22em] text-primary uppercase">
            Our Community Values
          </p>

          {/* Values List */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-1"
          >
            {values.map(({ title, body }) => (
              <motion.div
                key={title}
                variants={item}
                className="rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 px-3 py-1.5 flex items-start gap-2.5"
              >
                <div className="h-1.5 w-1.5 rotate-45 border border-primary bg-primary/20 shrink-0 mt-1" />
                <div>
                  <p className="font-display text-[12px] font-bold text-foreground leading-tight">
                    {title}
                  </p>
                  <p className="font-body text-[10px] text-foreground/65 leading-snug">
                    {body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-auto flex flex-col gap-2">
            <Divider />

            <Button
              onClick={() => navigate("/discover")}
              size="lg"
              className="w-full h-8 rounded-xl font-body font-semibold tracking-wider text-[11px]"
              style={{
                background: "var(--gradient-warm)",
                boxShadow: "var(--shadow-warm)",
              }}
            >
              I UNDERSTAND & AGREE
              <ArrowRight className="h-3 w-3 ml-1.5" />
            </Button>

            <p className="text-center font-body text-[9px] text-foreground/60 leading-tight">
              By continuing you agree to our{" "}
              <span className="text-primary">Community Guidelines</span> and{" "}
              <span className="text-primary">Terms of Service</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
