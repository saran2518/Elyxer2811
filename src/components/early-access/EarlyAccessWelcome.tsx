import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { getEarlyAccessMember, INSTAGRAM_URL } from "@/lib/earlyAccess";
import { EarlyAccessCollage, EarlyAccessDivider } from "./EarlyAccessCollage";
import appIcon from "@/assets/early-access/elyxer-app-icon.png";
import mountain from "@/assets/early-access/couple-mountain-sunrise.jpg";
import beach from "@/assets/early-access/couple-beach-sunset.jpg";
import pottery from "@/assets/early-access/couple-pottery.jpg";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
});

/** Early Access welcome screen shown on the Discover tab. */
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

  return (
    <div className="early-access-welcome flex-1 min-h-0 flex flex-col items-center justify-center px-6 overflow-hidden text-center">
      <EarlyAccessCollage
        photos={[mountain, beach, pottery]}
        side={{ w: 104, h: 134 }}
        centre={{ w: 124, h: 168 }}
        offset={18}
      />

      <motion.p {...fade(0.08)} className="ea-marcellus text-[12px] uppercase shrink-0" style={{ letterSpacing: "0.16em", color: "var(--ea-gold-text)" }}>
        Built to get you on real dates
      </motion.p>

      <motion.img {...fade(0.12)} src={appIcon} alt="Elyxer" className="shrink-0 object-contain" style={{ width: 58, height: 58 }} />

      <motion.h1 {...fade(0.18)} className="ea-marcellus text-[29px] leading-[1.15] shrink-0" style={{ color: "var(--ea-ink)" }}>
        In Elyxer, you are
        <br />
        <span style={{ color: "var(--ea-gold-accent)" }}>the chosen</span>
      </motion.h1>

      <motion.div {...fade(0.24)}>
        <EarlyAccessDivider />
      </motion.div>

      <motion.div {...fade(0.3)} className="flex shrink-0 flex-col items-center gap-1">
        <span className="ea-marcellus text-[12px] uppercase" style={{ letterSpacing: "0.14em", color: "var(--ea-gold-text)" }}>
          Early member
        </span>
        <span className="ea-marcellus text-[34px] leading-none" style={{ color: "var(--ea-ink)" }}>
          <span className="text-[20px]">No.</span> {memberNumber != null ? memberNumber.toLocaleString("en-US") : "—"}
        </span>
      </motion.div>

      <motion.p {...fade(0.36)} className="ea-garamond text-[16px] shrink-0" style={{ lineHeight: 1.4, color: "var(--ea-body)", maxWidth: 312 }}>
        We are growing a healthy community of wonderful people. Discovery opens soon, and you will be among the first to meet them.
      </motion.p>

      <motion.button
        {...fade(0.42)}
        whileTap={{ scale: 0.97 }}
        onClick={() => window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer")}
        className="ea-marcellus w-full shrink-0 rounded-full flex items-center justify-center gap-2.5 text-[14px] uppercase"
        style={{
          maxWidth: 330,
          height: 48,
          letterSpacing: "0.08em",
          color: "#24170A",
          background: "linear-gradient(100deg, #D9B964, #B4862C)",
          boxShadow: "0 6px 18px rgba(150,110,30,0.22)",
        }}
      >
        <Instagram className="h-[18px] w-[18px]" />
        Join us on Instagram
      </motion.button>

      <motion.p {...fade(0.48)} className="ea-garamond italic text-[14px] shrink-0" style={{ color: "var(--ea-muted)" }}>
        For sneak peeks, stories and first news of the big day.
      </motion.p>
    </div>
  );
};

export default EarlyAccessWelcome;
