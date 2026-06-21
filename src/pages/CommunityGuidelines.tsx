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
  <div className="flex items-center gap-3 py-1">
    <div className="flex-1 h-px bg-border/60" />
    <span className="text-primary text-xs">✦</span>
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
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
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
          className="relative w-full h-[44vh] min-h-[280px] overflow-hidden shrink-0"
        >
          <img
            src={communityImage.url}
            alt="Elyxer community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
            <h1 className="font-display text-[28px] leading-[1.1]">
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
          className="flex-1 flex flex-col px-5 pt-4 pb-6 gap-4"
        >
          <Divider />

          <p className="font-body text-[10px] tracking-[0.22em] text-primary uppercase">
            Our Community Values
          </p>

          {/* Jewel Box Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-2.5"
          >
            {/* Featured card — spans full width */}
            <motion.div
              variants={item}
              className="col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/40 px-5 py-4"
            >
              <span className="absolute top-2 right-3 font-display text-[56px] leading-none text-foreground/[0.06] select-none">
                {featured.initial}
              </span>
              <div className="relative z-10 flex items-start gap-3">
                <div className="mt-1.5 h-2.5 w-2.5 rotate-45 border border-primary bg-primary/20 shrink-0" />
                <div>
                  <p className="font-display text-[16px] font-bold text-foreground leading-tight">
                    {featured.title}
                  </p>
                  <p className="font-body text-[12px] text-foreground/70 leading-snug mt-0.5">
                    {featured.body}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 4 smaller grid cards */}
            {gridValues.map(({ title, body, initial }) => (
              <motion.div
                key={title}
                variants={item}
                className="relative overflow-hidden rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 px-3.5 py-3"
              >
                <span className="absolute top-1 right-2 font-display text-[32px] leading-none text-foreground/[0.05] select-none">
                  {initial}
                </span>
                <div className="relative z-10">
                  <div className="h-2 w-2 rotate-45 border border-primary bg-primary/15 mb-2" />
                  <p className="font-display text-[13px] font-bold text-foreground leading-tight">
                    {title}
                  </p>
                  <p className="font-body text-[11px] text-foreground/65 leading-snug mt-0.5">
                    {body}
                  </p>
                </div>
              </motion.div>
            ))}
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
