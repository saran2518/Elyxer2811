import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, X } from "lucide-react";

export const SUPPORT_EMAIL = "support@elyxer.co";

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Centred "Mail us" pop-up used across Help & FAQ. Cream panel, gold gradient
 * mail icon, serif title, the support address, and a full-width gold gradient
 * button that opens the mail app. Dismisses on backdrop tap, close icon or Esc.
 */
const MailUsDialog = ({ open, onClose }: Props) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-6">
          {/* Dimmed backdrop */}
          <motion.button
            aria-label="Dismiss"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ background: "rgba(10,7,5,0.45)" }}
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Mail us"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative w-full max-w-sm rounded-[28px] px-7 pt-8 pb-7 flex flex-col items-center text-center"
            style={{
              background: "#FBF7EE",
              border: "0.5px solid #E4DFD2",
              boxShadow: "0 24px 70px -20px rgba(10,7,5,0.4)",
            }}
          >
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center text-[#8A8274] hover:bg-[#0A0705]/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div
              className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
              style={{
                background: "linear-gradient(135deg, #E7C874, #B8892E)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 6px 18px -6px rgba(120,85,20,0.45)",
              }}
            >
              <Mail style={{ width: 26, height: 26, color: "#3D2E0A" }} />
            </div>

            <h2 className="font-display text-[24px] leading-tight tracking-tight" style={{ color: "#0A0705" }}>
              Mail us
            </h2>

            <p className="font-body text-[14px] mt-3" style={{ color: "#6B6459", lineHeight: 1.6 }}>
              If any queries and support, mail us on
            </p>

            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Elyxer support")}`}
              onClick={onClose}
              className="mt-3 inline-flex items-center rounded-full px-4 py-2 font-body text-[14px] font-semibold tracking-wide select-text"
              style={{
                background: "rgba(184,137,46,0.10)",
                border: "0.5px solid rgba(184,137,46,0.35)",
                color: "#7A5A18",
              }}
            >
              {SUPPORT_EMAIL}
            </a>

            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Elyxer support")}`}
              onClick={onClose}
              className="mt-6 w-full h-12 rounded-full text-[15px] font-semibold font-body tracking-wide shadow-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #E7C874, #B8892E)",
                color: "#3D2E0A",
              }}
            >
              Send an email
            </a>

            <button
              onClick={onClose}
              className="mt-3 font-body text-[13px] font-medium"
              style={{ color: "#8A8274" }}
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MailUsDialog;
