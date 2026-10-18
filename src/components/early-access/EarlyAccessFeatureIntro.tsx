import { motion } from "framer-motion";
import type { ReactNode } from "react";
import BottomNav, { type NavTab } from "./BottomNav";

interface Props {
  /** Tab this intro belongs to (keeps the bottom nav active state correct). */
  tab: NavTab;
  /** Three profile photos for the collage. */
  photos: string[];
  icon: ReactNode;
  title: string;
  /** Gold-gradient accented line under the title. */
  accent: string;
  body: string;
  footnote: string;
}

/**
 * Early Access intro screen for the Moments, Interests and Chat tabs.
 * Same visual language as the Discover welcome: 3-photo collage, gold
 * gradient icon, serif headline, centred grey body, italic footnote.
 */
const EarlyAccessFeatureIntro = ({ tab, photos, icon, title, accent, body, footnote }: Props) => {
  const collage = photos.filter(Boolean).slice(0, 3);

  return (
    <div className="h-screen flex flex-col" style={{ background: "var(--gradient-ivory)" }}>
      <div className="flex-1 flex flex-col items-center px-6 pt-14 pb-28 overflow-y-auto text-center">
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

        {/* Gold gradient icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="h-14 w-14 rounded-full flex items-center justify-center mt-8"
          style={{
            background: "linear-gradient(135deg, #E7C874, #B8892E)",
            boxShadow: "0 8px 24px -8px rgba(120,85,20,0.35)",
          }}
        >
          {icon}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
          className="font-display text-[30px] leading-tight tracking-tight mt-5"
          style={{ color: "#0A0705" }}
        >
          {title}
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #E7C874, #B8892E)" }}
          >
            {accent}
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

        {/* Body */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.38 }}
          className="font-body text-[14px] mt-6 max-w-[300px]"
          style={{ color: "#6B6459", lineHeight: 1.65 }}
        >
          {body}
        </motion.p>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.48 }}
          className="font-body italic text-[12px] mt-5"
          style={{ color: "#9A917F" }}
        >
          {footnote}
        </motion.p>
      </div>

      <BottomNav active={tab} />
    </div>
  );
};

export default EarlyAccessFeatureIntro;
