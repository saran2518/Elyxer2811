import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
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
    <div className="flex-1 flex flex-col items-center px-6 pt-6 pb-28 overflow-y-auto text-center">
      {/* 3-image collage */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-end justify-center gap-3 mt-2"
      >
        {collage.map((src, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden border border-border/30"
            style={{
              width: i === 1 ? 118 : 92,
              height: i === 1 ? 156 : 122,
              transform: i === 0 ? "rotate(-4deg)" : i === 2 ? "rotate(4deg)" : "none",
              boxShadow: "0 10px 28px -10px rgba(10,7,5,0.25)",
            }}
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
        className="h-14 w-14 rounded-2xl object-cover mt-8"
        style={{ boxShadow: "0 8px 24px -8px rgba(120,85,20,0.35)" }}
      />

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18 }}
        className="font-display text-[30px] leading-tight tracking-tight mt-5"
        style={{ color: "#0A0705" }}
      >
        In Elyxer, you are
        <br />
        <span
          className="text-transparent bg-clip-text"
          style={{ backgroundImage: "linear-gradient(135deg, #E7C874, #B8892E)" }}
        >
          the chosen
        </span>
      </motion.h1>

      {/* Divider with diamond */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.28 }}
        className="flex items-center gap-3 mt-6 w-full max-w-[240px]"
      >
        <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(184,137,46,0.5))" }} />
        <div
          className="h-2 w-2 rotate-45 shrink-0"
          style={{ background: "linear-gradient(135deg, #E7C874, #B8892E)" }}
        />
        <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(184,137,46,0.5))" }} />
      </motion.div>

      {/* Founding member */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.36 }}
        className="mt-6 flex flex-col items-center gap-1"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "#8A6A1F" }}>
          Founding Member
        </span>
        <span className="font-display text-[40px] leading-none" style={{ color: "#0A0705" }}>
          No. {memberNumber ?? "—"}
        </span>
        <span className="font-body text-[13px]" style={{ color: "#6B6459" }}>
          among the first to be here.
        </span>
      </motion.div>

      {/* Body */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.44 }}
        className="font-body text-[14px] mt-6 max-w-[300px]"
        style={{ color: "#6B6459", lineHeight: 1.65 }}
      >
        We're opening Elyxer slowly, one careful circle at a time. Your profile is ready, and the moment discovery opens, you'll be the first through the door.
      </motion.p>

      {/* Instagram CTA */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.52 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer")}
        className="mt-8 w-full max-w-[320px] h-[52px] rounded-full flex items-center justify-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.14em] shadow-lg"
        style={{
          background: "linear-gradient(135deg, #E7C874, #B8892E)",
          color: "#3D2E0A",
        }}
      >
        <Instagram className="h-4.5 w-4.5" />
        Join us on Instagram
      </motion.button>

      {/* Footnote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.6 }}
        className="font-body italic text-[12px] mt-5"
        style={{ color: "#9A917F" }}
      >
        Follow along as we open the doors.
      </motion.p>
    </div>
  );
};

export default EarlyAccessWelcome;
