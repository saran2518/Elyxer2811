import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Target, Sparkles, Infinity as InfinityIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import welcomeImage from "@/assets/welcome-couple.png";

const Divider = () => (
  <div className="flex items-center justify-center gap-2 w-full">
    <div className="h-px flex-1 bg-primary/40" />
    <div className="h-1.5 w-1.5 rotate-45 bg-primary/60" />
    <div className="h-px flex-1 bg-primary/40" />
  </div>
);

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-md flex flex-col min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full aspect-[4/5] overflow-hidden"
        >
          <img
            src={welcomeImage}
            alt="Couple enjoying coffee together — welcome to Elyxer"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex flex-col px-6 pt-8 pb-8 gap-6"
        >
          <Divider />

          <h1 className="font-display text-3xl font-bold text-foreground leading-tight">
            Welcome to the
            <br />
            world of <span className="italic text-transparent bg-clip-text" style={{ backgroundImage: "var(--gradient-gold)" }}>Elyxer</span>
          </h1>

          <Divider />

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full border border-primary/40 flex items-center justify-center shrink-0">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <p className="font-body text-sm text-foreground/80 pt-1">
                A curated space for people who value real connection.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full border border-primary/40 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <p className="font-body text-sm text-foreground/80 pt-1">
                Your next great conversation is closer than you think.
              </p>
            </div>
          </div>

          <div className="flex-1" />

          <Button
            onClick={() => navigate("/community-guidelines")}
            size="lg"
            className="w-full h-14 rounded-2xl font-body font-semibold tracking-wider text-[15px]"
            style={{
              background: "var(--gradient-warm)",
              boxShadow: "var(--shadow-warm)",
            }}
          >
            START EXPLORING
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

export default Welcome;
