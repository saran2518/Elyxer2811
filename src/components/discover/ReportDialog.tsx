import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, X, ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";


const REPORT_REASONS = [
  { label: "Inappropriate or harmful content", emoji: "🚨" },
  { label: "Harassment or hate speech", emoji: "⚠️" },
  { label: "Fake profile or scam", emoji: "🎭" },
  { label: "Underage user", emoji: "👶" },
  { label: "Other", emoji: "💬" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  profileName: string;
}

export default function ReportDialog({ open, onClose, profileName }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    toast.success(`${profileName} has been reported. We'll review this shortly.`);
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
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCancel}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative z-10 w-full max-w-sm max-h-[85vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            <div className="p-5 overflow-y-auto flex-1">
              {/* Header */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Flag className="h-4 w-4 text-destructive" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Report</h3>
                </div>
                <button
                  onClick={handleCancel}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4 ml-[42px]">
                Select a reason below
              </p>

              {/* Reasons */}
              <div className="flex flex-col gap-1.5 mb-4">
                {REPORT_REASONS.map(({ label, emoji }) => (
                  <button
                    key={label}
                    onClick={() => setSelected(label)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      selected === label
                        ? "border-destructive bg-destructive/8 text-destructive shadow-sm"
                        : "border-border/60 bg-background text-foreground hover:border-destructive/30 hover:bg-destructive/3"
                    }`}
                  >
                    <span className="text-base">{emoji}</span>
                    <span className="flex-1 text-left">{label}</span>
                    {selected === label && (
                      <ChevronRight className="h-4 w-4 text-destructive/60" />
                    )}
                  </button>
                ))}
              </div>

              {/* Description */}
              <div className="mb-5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  Additional details
                </label>
                <Textarea
                  placeholder="Tell us more about what happened…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl border-border/60 bg-background text-sm resize-none focus:border-destructive/40"
                  rows={3}
                />
              </div>

              {/* Actions */}
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
                  className="flex-1 py-3 rounded-full bg-destructive text-destructive-foreground text-sm font-semibold disabled:opacity-30 hover:bg-destructive/90 transition-all duration-200"
                >
                  Report
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  ));
}
