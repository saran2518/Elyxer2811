import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SettingsSection from "@/components/profile/SettingsSection";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Sticky header */}
      <header className="shrink-0 z-30 bg-background px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            className="h-10 w-10 rounded-full bg-muted/40 hover:bg-muted/60 transition-colors"
            aria-label="Back to profile"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <h1 className="text-[22px] font-display font-semibold text-foreground tracking-tight">
              Settings
            </h1>
          </div>
        </div>
      </header>

      {/* Scrollable settings */}
      <motion.main
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="flex-1 px-4 overflow-y-auto pb-8"
      >
        <SettingsSection />
      </motion.main>
    </div>
  );
};

export default Settings;
