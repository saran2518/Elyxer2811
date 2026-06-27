import { motion, AnimatePresence } from "framer-motion";
import { Video, Check, X } from "lucide-react";

interface VirtualDateIncomingInviteProps {
  open: boolean;
  partnerName: string;
  partnerPhoto?: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function VirtualDateIncomingInvite({
  open,
  partnerName,
  partnerPhoto,
  onAccept,
  onDecline,
}: VirtualDateIncomingInviteProps) {
  const firstName = partnerName.split(" ")[0];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-end justify-center"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md rounded-t-3xl bg-card p-6 pb-8 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                {partnerPhoto ? (
                  <img
                    src={partnerPhoto}
                    alt={partnerName}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                ) : (
                  <div
                    className="h-20 w-20 rounded-2xl flex items-center justify-center"
                    style={{ background: "var(--gradient-warm)" }}
                  >
                    <Video className="h-9 w-9 text-primary-foreground" />
                  </div>
                )}
                <div
                  className="absolute -bottom-2 -right-2 h-9 w-9 rounded-xl flex items-center justify-center ring-4 ring-card"
                  style={{ background: "var(--gradient-warm)" }}
                >
                  <Video className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  {firstName} is inviting you on a virtual date
                </h3>
                <p className="font-body text-xs text-muted-foreground mt-2">
                  Accept to start the date now.
                </p>
              </div>

              <div className="flex gap-3 w-full mt-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onDecline}
                  className="flex-1 py-3 rounded-2xl bg-muted text-foreground font-body text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Decline
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onAccept}
                  className="flex-1 py-3 rounded-2xl text-primary-foreground font-body text-sm font-semibold flex items-center justify-center gap-2"
                  style={{
                    background: "var(--gradient-warm)",
                    boxShadow: "var(--shadow-warm)",
                  }}
                >
                  <Check className="h-4 w-4" />
                  Accept
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
