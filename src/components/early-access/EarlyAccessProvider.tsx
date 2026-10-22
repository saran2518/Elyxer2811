import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EARLY_ACCESS_MODE, getEarlyAccessTotal } from "@/lib/earlyAccess";
import MailUsDialog from "@/components/help/MailUsDialog";
import plantHand from "@/assets/early-access/icon-plant-hand.png";
import face1 from "@/assets/early-access/face-1-woman.jpg";
import face2 from "@/assets/early-access/face-2-man.jpg";
import face3 from "@/assets/early-access/face-3-woman.jpg";
import face4 from "@/assets/early-access/face-4-man.jpg";
import face5 from "@/assets/early-access/face-5-woman.jpg";
import face6 from "@/assets/early-access/face-6-man.jpg";

type EarlyAccessContextValue = {
  enabled: boolean;
  /** Opens the "Growing community" sheet. No-op when early access is off. */
  openLocked: () => void;
  /** Opens the "Write to us" sheet shown for Help & FAQ. */
  openSupportMail: () => void;
};

const EarlyAccessContext = createContext<EarlyAccessContextValue>({
  enabled: EARLY_ACCESS_MODE,
  openLocked: () => {},
  openSupportMail: () => {},
});

export const useEarlyAccess = () => useContext(EarlyAccessContext);

const FACES = [face1, face2, face3, face4, face5, face6];

/** Wraps the app. Locked items call openLocked() and get the shared sheet. */
export const EarlyAccessProvider = ({ children }: { children: React.ReactNode }) => {
  const [lockedOpen, setLockedOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
  const [joinedTotal, setJoinedTotal] = useState<number | null>(null);
  const openLocked = useCallback(() => {
    if (EARLY_ACCESS_MODE) {
      setJoinedTotal(null);
      setLockedOpen(true);
    }
  }, []);
  useEffect(() => {
    if (!lockedOpen) return;
    let active = true;
    void getEarlyAccessTotal().then(total => {
      if (active) setJoinedTotal(total);
    });
    return () => { active = false; };
  }, [lockedOpen]);
  const openSupportMail = useCallback(() => setMailOpen(true), []);
  const close = () => setLockedOpen(false);

  return (
    <EarlyAccessContext.Provider value={{ enabled: EARLY_ACCESS_MODE, openLocked, openSupportMail }}>
      {children}
      {EARLY_ACCESS_MODE && (
        <EarlyAccessSheet open={lockedOpen} onClose={close} label="Growing community">
          <div className="h-16 w-16 rounded-full flex items-center justify-center" style={{ background: "var(--ea-circle)" }}>
            <img src={plantHand} alt="" style={{ width: 40, height: 40 }} />
          </div>
          <h2 className="ea-marcellus text-[27px] leading-tight" style={{ color: "var(--ea-ink)" }}>
            Growing community
          </h2>
          <p className="ea-garamond italic text-[17px]" style={{ color: "var(--ea-gold-text)" }}>
            Wonderful people are joining every day.
          </p>
          <div className="flex items-center" aria-hidden>
            {FACES.map((src, i) => (
              <div
                key={i}
                className="rounded-full overflow-hidden shrink-0"
                style={{ width: 38, height: 38, marginLeft: i === 0 ? 0 : -10, border: "2px solid var(--ea-sheet)" }}
              >
                <img src={src} alt="" className="w-full h-full object-cover" style={{ filter: "blur(2.5px)", transform: "scale(1.8)" }} />
              </div>
            ))}
            <div
              className="ea-marcellus rounded-full shrink-0 flex items-center justify-center text-[18px]"
              style={{ width: 38, height: 38, marginLeft: -10, border: "2px solid var(--ea-sheet)", background: "var(--ea-circle)", color: "#fff" }}
            >
              +
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            {joinedTotal !== null && (
              <div className="ea-joined-total ea-marcellus flex flex-col items-center gap-0.5" aria-live="polite">
                <span className="ea-joined-label text-[11px] uppercase tracking-[0.18em]">Joined so far</span>
                <span className="ea-joined-number text-[30px] leading-[1.1]">{joinedTotal.toLocaleString("en-US")}</span>
              </div>
            )}
          <p
            className="ea-garamond text-[16px]"
            style={{ color: "var(--ea-body)", textDecoration: "underline", textDecorationColor: "#C9A84C", textDecorationThickness: "0.75px", textUnderlineOffset: 6 }}
          >
            Discovery and core features open soon.
          </p>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={close} className="ea-btn mt-4">
            Got it
          </motion.button>
        </EarlyAccessSheet>
      )}
      <MailUsDialog open={mailOpen} onClose={() => setMailOpen(false)} />
    </EarlyAccessContext.Provider>
  );
};

type SheetProps = {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  paddingBottom?: number;
};

/**
 * Shared Early Access bottom sheet shell: cream background, 28px top corners,
 * drag handle, blurred backdrop. Dismisses on swipe down or backdrop tap.
 */
export const EarlyAccessSheet = ({ open, onClose, label, children, paddingBottom = 34 }: SheetProps) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-[120]">
        <motion.button
          aria-label="Dismiss"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0"
          style={{ background: "rgba(42,30,14,0.42)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}
        />
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.6 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 90 || info.velocity.y > 500) onClose();
          }}
          className="absolute bottom-0 left-0 right-0 mx-auto max-w-md flex flex-col items-center text-center"
          style={{ background: "var(--ea-sheet)", borderRadius: "28px 28px 0 0", padding: `14px 26px ${paddingBottom}px`, gap: 14 }}
        >
          <div className="cursor-grab active:cursor-grabbing rounded-full shrink-0 mb-2" style={{ width: 44, height: 5, background: "#E3D7BC" }} />
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
