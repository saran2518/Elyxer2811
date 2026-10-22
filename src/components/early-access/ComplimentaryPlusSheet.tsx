import { motion } from "framer-motion";
import { EarlyAccessSheet } from "./EarlyAccessProvider";
import crown from "@/assets/early-access/icon-crown.png";

/**
 * Plus sheet — shown automatically the first time a user opens the Profile
 * page in Early Access mode (tracked per user via has_seen_plus_popup).
 */
const ComplimentaryPlusSheet = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <EarlyAccessSheet open={open} onClose={onClose} label="Complimentary Plus">
    <div
      className="relative overflow-hidden flex flex-col justify-between text-left mt-2 shrink-0"
      style={{
        width: 290,
        height: 150,
        borderRadius: 18,
        padding: "16px 18px",
        background: "linear-gradient(135deg, #2A1E10 0%, #120C06 60%, #3A2912 100%)",
        border: "1px solid #8E6A22",
        boxShadow: "0 14px 30px rgba(42,30,14,0.35)",
      }}
    >
      <div
        className="absolute pointer-events-none"
        style={{ top: -60, right: -60, width: 180, height: 180, background: "radial-gradient(circle, rgba(230,201,120,0.22), transparent 70%)" }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <img src={crown} alt="" style={{ width: 22, height: 22, objectFit: "contain" }} />
            <span className="ea-marcellus text-[22px] leading-none uppercase" style={{ letterSpacing: "0.22em", color: "#E6C978" }}>
              Plus
            </span>
          </div>
          <div className="ea-marcellus text-[9px] uppercase mt-2" style={{ letterSpacing: "0.16em", color: "rgba(242,239,232,0.6)" }}>
            1 week
          </div>
        </div>
        <span
          className="ea-marcellus text-[9px] uppercase rounded-full px-2.5 py-1"
          style={{ letterSpacing: "0.16em", border: "1px solid rgba(230,201,120,0.55)", color: "#E6C978" }}
        >
          Complimentary
        </span>
      </div>
      <div className="relative flex items-end justify-between">
        <span className="ea-marcellus text-[13px]" style={{ color: "#E6C978" }}>Early member</span>
        <span className="ea-marcellus text-[13px] uppercase" style={{ letterSpacing: "0.3em", color: "rgba(230,201,120,0.85)" }}>
          Elyxer
        </span>
      </div>
    </div>
    <p className="ea-marcellus text-[12px] uppercase mt-2" style={{ letterSpacing: "0.18em", color: "var(--ea-gold-text)" }}>
      Your Plus experience
    </p>
    <p className="ea-garamond italic text-[18px] -mt-2" style={{ color: "var(--ea-body)" }}>
      begins the moment discovery opens.
    </p>
    <motion.button whileTap={{ scale: 0.97 }} onClick={onClose} className="ea-btn mt-4">
      Got it
    </motion.button>
  </EarlyAccessSheet>
);

export default ComplimentaryPlusSheet;
