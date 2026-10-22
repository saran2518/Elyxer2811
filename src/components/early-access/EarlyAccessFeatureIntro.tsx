import { motion } from "framer-motion";
import type { ReactNode } from "react";
import BottomNav from "./BottomNav";
import { EarlyAccessCollage, EarlyAccessDivider } from "./EarlyAccessCollage";
import momentsIcon from "@/assets/early-access/icon-moments.png";
import interestsIcon from "@/assets/early-access/icon-interests.png";
import chatIcon from "@/assets/early-access/icon-chat.png";
import manPainting from "@/assets/early-access/man-painting.jpg";
import womanPickleball from "@/assets/early-access/woman-pickleball.jpg";
import womanBookshop from "@/assets/early-access/woman-bookshop.jpg";
import manPhone from "@/assets/early-access/man-phone-street.jpg";
import womanWindow from "@/assets/early-access/woman-phone-window.jpg";
import womanBalcony from "@/assets/early-access/woman-laughing-balcony.jpg";
import cafeBrick from "@/assets/early-access/couple-cafe-brick.jpg";
import cafeWindow from "@/assets/early-access/couple-cafe-window.jpg";
import streetFood from "@/assets/early-access/couple-street-food.jpg";

type Feature = "Moments" | "Interests" | "Chat";

const CONTENT: Record<Feature, {
  photos: [string, string, string];
  icon: string;
  headline: ReactNode;
  lines: [ReactNode, ReactNode, ReactNode];
}> = {
  Moments: {
    photos: [manPainting, womanPickleball, womanBookshop],
    icon: momentsIcon,
    headline: <>Connect with<br /><span style={{ color: "var(--ea-gold-accent)" }}>life’s moments</span></>,
    lines: [
      "Somewhere, someone loves the same small things you do.",
      <>“The slow mornings, the good books,<br />the songs on repeat.”</>,
      "This is where you find each other.",
    ],
  },
  Interests: {
    photos: [manPhone, womanWindow, womanBalcony],
    icon: interestsIcon,
    headline: <>See who <span style={{ color: "var(--ea-gold-accent)" }}>chose you</span></>,
    lines: [
      "There is no feeling quite like being noticed.",
      "A quiet vibe. A heartfelt invite.",
      "Every spark finds its way here.",
    ],
  },
  Chat: {
    photos: [cafeBrick, cafeWindow, streetFood],
    icon: chatIcon,
    headline: <>From hello<br /><span style={{ color: "var(--ea-gold-accent)" }}>to a real date</span></>,
    lines: [
      "Every great story begins with a conversation.",
      "Unhurried. Thoughtful. Always on your terms.",
      "This one could end at a table for two.",
    ],
  },
};

const Sparkle = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#C9A84C" className="shrink-0" aria-hidden>
    <path d="M12 0c.6 6.5 5.5 11.4 12 12-6.5.6-11.4 5.5-12 12-.6-6.5-5.5-11.4-12-12C6.5 11.4 11.4 6.5 12 0z" />
  </svg>
);

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
});

/** Early Access intro screen for the Moments, Interests and Chat tabs. */
const EarlyAccessFeatureIntro = ({ tab }: { tab: Feature }) => {
  const c = CONTENT[tab];
  const lineStyles = [
    { cls: "ea-garamond text-[18px]", color: "var(--ea-body)" },
    { cls: "ea-garamond italic text-[17px]", color: "var(--ea-gold-text)" },
    { cls: "ea-marcellus text-[17px]", color: "var(--ea-ink)" },
  ];

  return (
    <div className="ea-screen h-[100dvh] flex flex-col overflow-hidden">
      <div
        className="ea-feature flex-1 min-h-0 flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ gap: 16, padding: "24px 28px 16px", paddingBottom: 86 }}
      >
        <EarlyAccessCollage photos={c.photos} side={{ w: 112, h: 146 }} centre={{ w: 134, h: 182 }} offset={20} />

        <motion.img
          {...fade(0.1)}
          src={c.icon}
          alt=""
          className="shrink-0 rounded-full"
          style={{ width: 60, height: 60, boxShadow: "0 6px 16px rgba(150,110,30,0.25)" }}
        />

        <motion.h1 {...fade(0.16)} className="ea-marcellus text-[31px] shrink-0" style={{ lineHeight: 1.15, color: "var(--ea-ink)" }}>
          {c.headline}
        </motion.h1>

        <motion.div {...fade(0.22)}>
          <EarlyAccessDivider />
        </motion.div>

        <motion.div {...fade(0.3)} className="flex flex-col shrink-0" style={{ maxWidth: 300, gap: 10 }}>
          {c.lines.map((line, i) => (
            <p key={i} className={lineStyles[i].cls} style={{ color: lineStyles[i].color, lineHeight: 1.35 }}>
              {line}
            </p>
          ))}
        </motion.div>

        <motion.div {...fade(0.38)} className="flex items-center justify-center gap-2 w-full shrink-0">
          <span className="h-px shrink-0" style={{ width: 36, background: "linear-gradient(to right, transparent, #C9A84C)" }} />
          <Sparkle />
          <span className="ea-marcellus text-[12px] uppercase" style={{ letterSpacing: "0.16em", color: "var(--ea-deep-gold)" }}>
            Opening soon for early members
          </span>
          <Sparkle />
          <span className="h-px shrink-0" style={{ width: 36, background: "linear-gradient(to left, transparent, #C9A84C)" }} />
        </motion.div>
      </div>

      <BottomNav active={tab} />
    </div>
  );
};

export default EarlyAccessFeatureIntro;
