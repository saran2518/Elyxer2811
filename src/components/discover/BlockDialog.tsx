import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldBan, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";


const BLOCK_REASONS = [
  { label: "I'm not interested", emoji: "👋" },
  { label: "Inappropriate behavior", emoji: "⚠️" },
  { label: "Making me uncomfortable", emoji: "😟" },
  { label: "Spam or fake account", emoji: "🚫" },
  { label: "Other", emoji: "💬" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  profileName: string;
}

export default function BlockDialog({ open, onClose, profileName }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    toast.success(`${profileName} has been blocked. You won't see their profile anymore.`);
    setSelected(null);
    setDescription("");
    onClose();
  };

  const handleCancel = () => {
    setSelected(null);
    setDescription("");
    onClose();
  };

  return (
    createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCancel}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative z-10 w-full max-w-sm max-h-[85vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            <div className="p-5 overflow-y-auto flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldBan className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Block</h3>
                </div>
                <button
                  onClick={handleCancel}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4 ml-[42px]">
                They won't see your profile or contact you
              </p>

              <div className="flex flex-col gap-1.5 mb-4">
                {BLOCK_REASONS.map(({ label, emoji }) => (
                  <button
                    key={label}
                    onClick={() => setSelected(label)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      selected === label
                        ? "border-primary bg-primary/8 text-primary shadow-sm"
                        : "border-border/60 bg-background text-foreground hover:border-primary/30 hover:bg-primary/3"
                    }`}
                  >
                    <span className="text-base">{emoji}</span>
                    <span className="flex-1 text-left">{label}</span>
                  </button>
                ))}
              </div>

              <div className="mb-5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  Additional details
                </label>
                <Textarea
                  placeholder="Tell us more about why you're blocking…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl border-border/60 bg-background text-sm resize-none focus:border-primary/40"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 rounded-full border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selected}
                  className="flex-1 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-30 hover:bg-primary/90 transition-all duration-200"
                >
                  Block
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
