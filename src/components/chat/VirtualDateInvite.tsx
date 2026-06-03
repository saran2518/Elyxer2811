import { motion, AnimatePresence } from "framer-motion";
import { Video, X } from "lucide-react";

interface VirtualDateInviteProps {
  open: boolean;
  partnerName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function VirtualDateInvite({
  open,
  partnerName,
  onConfirm,
  onCancel,
}: VirtualDateInviteProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end justify-center"
          onClick={onCancel}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl bg-card p-6 pb-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg font-bold text-foreground">
                Virtual Date Invite
              </h3>
              <button
                onClick={onCancel}
                className="p-2 rounded-xl hover:bg-muted/40 transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--gradient-warm)" }}
              >
                <Video className="h-7 w-7 text-primary-foreground" />
              </div>

              <div>
                <p className="font-body text-sm text-foreground leading-relaxed">
                  Go beyond the chat and truly get to know each other.
                </p>
                <p className="font-body text-xs text-muted-foreground mt-2">
                  The date begins once they accept.
                </p>
              </div>

              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-2xl bg-muted text-foreground font-body text-sm font-semibold"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onConfirm}
                  className="flex-1 py-3 rounded-2xl text-primary-foreground font-body text-sm font-semibold"
                  style={{
                    background: "var(--gradient-warm)",
                    boxShadow: "var(--shadow-warm)",
                  }}
                >
                  Send Invite
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
