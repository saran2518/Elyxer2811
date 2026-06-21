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
          className="relative w-full h-[48vh] min-h-[390px] overflow-hidden shrink-0"
        >
          <img
            src={communityImage.url}
            alt="Elyxer community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-3">
            <h1 className="font-display text-[24px] leading-[1.1]">
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
          className="flex-1 flex flex-col px-5 pt-4 pb-3 gap-2"
        >
          <p className="font-body text-[9px] tracking-[0.22em] text-primary uppercase">
            Our Community Values
          </p>

          {/* Compact 2-Column Values Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-2"
          >
            {values.map(({ title, body }) => (
              <motion.div
                key={title}
                variants={item}
                className="rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 px-2.5 py-2 flex flex-col items-center text-center"
              >
                <div className="h-1.5 w-1.5 rotate-45 border border-primary bg-primary/20 mb-1" />
                <p className="font-display text-[12px] font-bold text-foreground leading-tight">
                  {title}
                </p>
                <p className="font-body text-[10px] text-foreground/65 leading-snug mt-0.5">
                  {body}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <button
            onClick={() => {}}
            className="self-center font-body text-[11px] text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
          >
            Read More
          </button>

          <Divider />

          <Button
            onClick={() => navigate("/discover")}
            size="lg"
            className="w-full h-9 rounded-xl font-body font-semibold tracking-wider text-[12px]"
            style={{
              background: "var(--gradient-warm)",
              boxShadow: "var(--shadow-warm)",
            }}
          >
            I UNDERSTAND & AGREE
            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Button>

          <p className="text-center font-body text-[10px] text-foreground/60 leading-tight">
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
