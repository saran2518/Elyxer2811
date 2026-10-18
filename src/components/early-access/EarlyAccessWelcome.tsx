import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import elyxerLogo from "@/assets/elyxer-logo.png.asset.json";
import { PROFILES } from "@/lib/profilesData";
import { getEarlyAccessMember, INSTAGRAM_URL } from "@/lib/earlyAccess";

/**
 * Early Access welcome screen shown on the Discover tab.
 * 3-image collage, wordmark, "In Elyxer, you are / the chosen",
 * founding member number from the database, Instagram CTA.
 */
const EarlyAccessWelcome = () => {
  const [memberNumber, setMemberNumber] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    getEarlyAccessMember().then((m) => {
      if (active) setMemberNumber(m.memberNumber);
    });
    return () => {
      active = false;
    };
  }, []);

  const collage = [PROFILES[1]?.photos[0], PROFILES[3]?.photos[0], PROFILES[4]?.photos[0]].filter(Boolean) as string[];

  return (
    <div className="early-access-welcome flex-1 min-h-0 flex flex-col items-center justify-center px-6 pt-2 overflow-hidden text-center text-foreground">
      {/* 3-image collage */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex shrink-0 items-end justify-center gap-3"
      >
        {collage.map((src, i) => (
          <div
            key={i}
            className="early-access-photo rounded-2xl overflow-hidden border border-border/30"
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>

      {/* Logo */}
      <motion.img
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        src={elyxerLogo.url}
        alt="Elyxer"
        className="early-access-logo h-14 w-14 shrink-0 rounded-xl object-cover"
      />

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18 }}
        className="font-display text-[26px] leading-tight tracking-normal shrink-0"
      >
        In Elyxer, you are
        <br />
        <span
          className="early-access-gold text-transparent bg-clip-text"
        >
          the chosen
        </span>
      </motion.h1>

      {/* Divider with diamond */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.28 }}
        className="flex shrink-0 items-center gap-3 w-full max-w-[200px]"
      >
        <div className="flex-1 h-px bg-primary/30" />
        <div
          className="early-access-gold h-1.5 w-1.5 rotate-45 shrink-0"
        />
        <div className="flex-1 h-px bg-primary/30" />
      </motion.div>

      {/* Founding member */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.36 }}
        className="flex shrink-0 flex-col items-center gap-1"
      >
        <span className="text-[10px] font-bold uppercase tracking-normal text-accent">
          Founding Member
        </span>
        <span className="font-display text-[32px] leading-none">
          No. {memberNumber ?? "—"}
        </span>
        <span className="font-body text-xs text-muted-foreground">
          among the first to be here.
        </span>
      </motion.div>

      {/* Body */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.44 }}
        className="font-body text-[13px] leading-relaxed max-w-[300px] shrink-0 text-muted-foreground"
      >
        We're opening Elyxer slowly, one careful circle at a time. Your profile is ready, and the moment discovery opens, you'll be the first through the door.
      </motion.p>

      {/* Instagram CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.52 }}
        whileTap={{ scale: 0.97 }}
        className="w-full max-w-[300px] shrink-0"
      >
        <Button
          onClick={() => window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer")}
          className="early-access-instagram w-full h-11 rounded-full gap-2 text-xs font-bold uppercase tracking-normal"
        >
          <Instagram />
          Join us on Instagram
        </Button>
      </motion.div>

      {/* Footnote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.6 }}
        className="font-body italic text-[11px] text-muted-foreground shrink-0"
      >
        Follow along as we open the doors.
      </motion.p>
    </div>
  );
};

export default EarlyAccessWelcome;
