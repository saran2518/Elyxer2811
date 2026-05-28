import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const DELETE_REASONS = [
  { label: "Found someone", emoji: "💑", subtitle: "Love won!" },
  { label: "Taking a break", emoji: "☕", subtitle: "See you soon" },
  { label: "Just exploring", emoji: "🦋", subtitle: "Was fun though" },
  { label: "Starting fresh", emoji: "✨", subtitle: "New beginnings" },
  { label: "Other", emoji: "✏️", subtitle: "Tell us below" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const DeleteAccountDialog = ({ open, onClose }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const canDelete = !!selected && confirmText.trim().toUpperCase() === "DELETE";

  const handleSubmit = () => {
    if (!canDelete || isDeleting) return;
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      toast({
        title: "Account deletion requested",
        description: "We're sorry to see you go. Your request is being processed.",
      });
      setSelected(null);
      setDescription("");
      setConfirmText("");
      onClose();
    }, 1000);
  };

  const handleCancel = () => {
    if (isDeleting) return;
    setSelected(null);
    setDescription("");
    setConfirmText("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative z-10 w-full max-w-md mx-0 rounded-t-3xl bg-card shadow-2xl overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="px-6 pt-2 pb-4 text-center">
              <motion.div
                className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 400 }}
              >
                <Heart className="h-5 w-5 text-destructive" />
              </motion.div>
              <h3 className="text-lg font-semibold text-foreground tracking-tight">
                Leaving so soon?
              </h3>
              <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
                We'd love to know why — it helps us get better.
              </p>
            </div>

            {/* Reasons */}
            <div className="px-5 space-y-2">
              {DELETE_REASONS.map((reason, i) => {
                const isSelected = selected === reason.label;
                return (
                  <motion.button
                    key={reason.label}
                    onClick={() => setSelected(reason.label)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * i, duration: 0.3 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 group ${
                      isSelected
                        ? "bg-destructive/8 ring-1.5 ring-destructive/25 shadow-sm"
                        : "bg-muted/30 hover:bg-muted/50 ring-1 ring-transparent"
                    }`}
                  >
                    <span className={`text-xl transition-transform duration-200 ${isSelected ? "scale-110" : "group-hover:scale-105"}`}>
                      {reason.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[13.5px] font-semibold block ${
                        isSelected ? "text-destructive" : "text-foreground"
                      }`}>
                        {reason.label}
                      </span>
                      <span className="text-[11.5px] text-muted-foreground leading-tight">
                        {reason.subtitle}
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "border-destructive bg-destructive"
                        : "border-border group-hover:border-muted-foreground/40"
                    }`}>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <Check className="h-3 w-3 text-destructive-foreground" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Textarea */}
            <motion.div
              className="px-5 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Textarea
                placeholder="Anything else you'd like to share? (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-2xl border-border/40 bg-muted/20 text-[13px] min-h-[72px] resize-none focus:ring-destructive/20 placeholder:text-muted-foreground/60"
              />
            </motion.div>

            {/* Type DELETE to confirm */}
            <motion.div
              className="px-5 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <p className="text-[11.5px] text-muted-foreground mb-1.5">
                Type <span className="font-semibold text-destructive">DELETE</span> to confirm
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="rounded-2xl border-border/40 bg-muted/20 text-[13px] h-11 focus-visible:ring-destructive/30"
              />
            </motion.div>

            {/* Actions */}
            <div className="px-5 pt-4 pb-8 space-y-2">
              <Button
                variant="destructive"
                className="w-full rounded-2xl h-12 text-[14px] font-semibold shadow-lg shadow-destructive/20 gap-2"
                disabled={!canDelete || isDeleting}
                aria-busy={isDeleting}
                onClick={handleSubmit}
              >
                {isDeleting ? <><Loader2 className="h-4 w-4 animate-spin" /> Deleting…</> : "Delete My Account"}
              </Button>
              <Button
                variant="ghost"
                className="w-full rounded-2xl h-11 text-[13.5px] font-medium text-muted-foreground hover:text-foreground"
                disabled={isDeleting}
                onClick={handleCancel}
              >
                Never mind, I'll stay
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteAccountDialog;
