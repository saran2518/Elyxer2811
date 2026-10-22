import { useEffect } from "react";
import { Mail } from "lucide-react";
import { EarlyAccessSheet } from "@/components/early-access/EarlyAccessProvider";

export const SUPPORT_EMAIL = "support@elyxer.co";

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * "Write to us" bottom sheet for Help & FAQ in Early Access. The address is
 * display-only selectable text (no mail link). Dismisses on Close, swipe,
 * backdrop tap or Esc.
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
    <EarlyAccessSheet open={open} onClose={onClose} label="Write to us" paddingBottom={30}>
      <p className="ea-marcellus text-[12px] uppercase mt-2" style={{ letterSpacing: "0.18em", color: "var(--ea-gold-text)" }}>
        Help &amp; Support
      </p>
      <h2 className="ea-marcellus text-[27px] leading-tight -mt-2" style={{ color: "var(--ea-ink)" }}>
        Write to us
      </h2>
      <div
        className="w-full flex items-center gap-3.5 text-left bg-white"
        style={{ maxWidth: 320, borderRadius: 18, border: "1px solid #EADBB5", padding: "14px 16px" }}
        onPointerDownCapture={(e) => e.stopPropagation()}
      >
        <div className="rounded-full shrink-0 flex items-center justify-center" style={{ width: 44, height: 44, background: "var(--ea-circle)" }}>
          <Mail className="h-5 w-5" style={{ color: "#fff" }} />
        </div>
        <div className="min-w-0 select-text">
          <div className="ea-marcellus text-[10px] uppercase" style={{ letterSpacing: "0.16em", color: "var(--ea-gold-text)" }}>
            Email us at
          </div>
          <div className="ea-marcellus text-[18px] select-text" style={{ color: "var(--ea-ink)", userSelect: "text" }}>
            {SUPPORT_EMAIL}
          </div>
        </div>
      </div>
      <button onClick={onClose} className="ea-garamond text-[16px] mt-4 px-6" style={{ color: "var(--ea-muted)", minHeight: 44 }}>
        Close
      </button>
    </EarlyAccessSheet>
  );
};

export default MailUsDialog;
