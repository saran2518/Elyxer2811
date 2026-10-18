import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookmarkCheck } from "lucide-react";
import { EARLY_ACCESS_MODE } from "@/lib/earlyAccess";
import MailUsDialog from "@/components/help/MailUsDialog";

type EarlyAccessContextValue = {
  enabled: boolean;
  /** Opens the "Your spot is saved" sheet. No-op when early access is off. */
  openLocked: () => void;
  /** Opens the "Mail us on support@elyxer.co" pop-up shown for Help & FAQ. */
  openSupportMail: () => void;
};

const EarlyAccessContext = createContext<EarlyAccessContextValue>({
  enabled: EARLY_ACCESS_MODE,
  openLocked: () => {},
  openSupportMail: () => {},
});

export const useEarlyAccess = () => useContext(EarlyAccessContext);

/**
 * Wraps the app. In Early Access mode, any locked item calls openLocked()
 * and gets the shared "Your spot is saved" bottom sheet instead of navigating.
 */
export const EarlyAccessProvider = ({ children }: { children: React.ReactNode }) => {
  const [lockedOpen, setLockedOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
  const openLocked = useCallback(() => {
    if (EARLY_ACCESS_MODE) setLockedOpen(true);
  }, []);
  const openSupportMail = useCallback(() => setMailOpen(true), []);

  return (
    <EarlyAccessContext.Provider value={{ enabled: EARLY_ACCESS_MODE, openLocked, openSupportMail }}>
      {children}
      {EARLY_ACCESS_MODE && (
        <EarlyAccessSheet
          open={lockedOpen}
          onClose={() => setLockedOpen(false)}
          icon={<BookmarkCheck style={{ width: 26, height: 26, color: "#3D2E0A" }} />}
          badge={null}
          title="Your spot is saved."
          bodies={[
            "You're among the first to join Elyxer. Discovery opens soon, along with the rest of the experience. Until then, we're carefully growing a community built on genuine, healthy connections. You'll be the first to know when it's live.",
          ]}
        />
      )}
      <MailUsDialog open={mailOpen} onClose={() => setMailOpen(false)} />
    </EarlyAccessContext.Provider>
  );
};

type SheetProps = {
  open: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  badge: React.ReactNode;
  title: string;
  bodies: string[];
  buttonLabel?: string;
};

/**
 * Shared Early Access bottom sheet: cream background, rounded top corners,
 * drag handle, gold gradient circular icon, serif title, centred grey body,
 * full-width gold gradient button. Dismisses on button, swipe down, or backdrop tap.
 */
export const EarlyAccessSheet = ({
  open,
  onClose,
  icon,
  badge,
  title,
  bodies,
  buttonLabel = "Got it",
}: SheetProps) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120]">
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
          {/* Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
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
            className="absolute bottom-0 left-0 right-0 mx-auto max-w-md"
            style={{
              background: "#FBF7EE",
              borderRadius: "28px 28px 0 0",
              boxShadow: "0 -18px 60px -20px rgba(10,7,5,0.35)",
              border: "0.5px solid #E4DFD2",
              borderBottom: "none",
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
              <div className="h-1.5 w-12 rounded-full" style={{ background: "#D8D2C2" }} />
            </div>

            <div className="px-7 pt-5 pb-9 flex flex-col items-center text-center">
              {/* Gold gradient circular icon */}
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: "linear-gradient(135deg, #E7C874, #B8892E)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 6px 18px -6px rgba(120,85,20,0.45)",
                }}
              >
                {icon}
              </div>

              {badge}

              <h2
                className="font-display text-[24px] leading-tight tracking-tight"
                style={{ color: "#0A0705" }}
              >
                {title}
              </h2>

              {bodies.map((body, i) => (
                <p
                  key={i}
                  className="font-body text-[14px]"
                  style={{ color: "#6B6459", lineHeight: 1.6, marginTop: i === 0 ? 12 : 10 }}
                >
                  {body}
                </p>
              ))}

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="mt-7 w-full h-12 rounded-full text-[15px] font-semibold font-body tracking-wide shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #E7C874, #B8892E)",
                  color: "#3D2E0A",
                }}
              >
                {buttonLabel}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
