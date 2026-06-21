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

  const featured = values.find((v) => v.featured)!;
  const gridValues = values.filter((v) => !v.featured);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-md flex flex-col min-h-screen">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-[30vh] min-h-[180px] overflow-hidden shrink-0"
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
          className="flex-1 flex flex-col px-5 pt-2 pb-4 gap-2"
        >
          <Divider />

          <p className="font-body text-[9px] tracking-[0.22em] text-primary uppercase">
            Our Community Values
          </p>

          {/* Elegant Grid Tiles */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-2"
          >
            {/* Top 4 — 2×2 centered cards */}
            {gridValues.map(({ title, body }) => (
              <motion.div
                key={title}
                variants={item}
                className="rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 px-2.5 py-2.5 flex flex-col items-center text-center"
              >
                <div className="h-1.5 w-1.5 rotate-45 border border-primary bg-primary/20 mb-1.5" />
                <p className="font-display text-[12px] font-bold text-foreground leading-tight">
                  {title}
                </p>
                <p className="font-body text-[10px] text-foreground/65 leading-snug mt-0.5">
                  {body}
                </p>
              </motion.div>
            ))}

            {/* Bottom — full-width card */}
            <motion.div
              variants={item}
              className="col-span-2 rounded-xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/40 px-4 py-2.5 flex items-center gap-2.5"
            >
              <div className="h-2 w-2 rotate-45 border border-primary bg-primary/20 shrink-0" />
              <div>
                <p className="font-display text-[13px] font-bold text-foreground leading-tight">
                  {featured.title}
                </p>
                <p className="font-body text-[11px] text-foreground/70 leading-snug mt-0.5">
                  {featured.body}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Read more link */}
          <button
            onClick={() => {}}
            className="self-center font-body text-[12px] text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
          >
            Read More
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
