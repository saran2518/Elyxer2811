import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info, Check, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ORIENTATIONS = [
  "Straight (Heterosexual)",
  "Gay",
  "Lesbian",
  "Bisexual",
  "Pansexual",
  "Asexual",
  "Queer",
  "Demisexual",
  "Questioning",
  "Prefer not to say",
];

interface OrientationStepProps {
  onNext: (data: { orientation: string; showOnProfile: boolean }) => void;
}

const OrientationStep = ({ onNext }: OrientationStepProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [showOnProfile, setShowOnProfile] = useState(true);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [thanksOpen, setThanksOpen] = useState(false);

  const submitFeedback = () => {
    if (!feedback.trim()) return;
    setFeedbackOpen(false);
    setFeedback("");
    setThanksOpen(true);
  };

  return (
    <>
      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6"
        >
          <h1 className="font-display text-[24px] sm:text-[28px] font-bold text-foreground leading-[1.2]">
            How do you describe
            <br />
            <span className="text-primary italic">your sexual orientation?</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="space-y-2 mb-5 max-h-[280px] overflow-y-auto pr-1"
        >
          {ORIENTATIONS.map((o) => {
            const isOn = selected === o;
            return (
              <button
                key={o}
                onClick={() => setSelected(o)}
                className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3.5 font-body text-[14px] transition-all ${
                  isOn
                    ? "border-primary bg-primary/5 text-foreground shadow-sm"
                    : "border-border/60 bg-card/80 text-foreground hover:border-border"
                }`}
                style={
                  isOn ? { boxShadow: "0 4px 14px -4px hsl(32 70% 36% / 0.25)" } : undefined
                }
              >
                <span className="font-medium">{o}</span>
                <span
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    isOn ? "border-primary bg-primary" : "border-border"
                  }`}
                >
                  {isOn && (
                    <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                  )}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => setFeedbackOpen(true)}
            className="w-full text-center font-body text-[12px] text-muted-foreground/80 pt-2 hover:text-primary transition-colors"
          >
            Are we missing something?{" "}
            <span className="text-primary underline-offset-2 hover:underline">Let us know</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex items-center gap-3 mt-1"
        >
          <Checkbox
            id="show-orientation"
            checked={showOnProfile}
            onCheckedChange={(c) => setShowOnProfile(c === true)}
            className="h-5 w-5 rounded border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <label
            htmlFor="show-orientation"
            className="font-body text-[14px] font-semibold text-foreground cursor-pointer"
          >
            Show on your profile
          </label>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="w-full max-w-sm mx-auto space-y-4 mt-8"
      >
        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10">
            <Info className="h-4 w-4 text-primary" />
          </div>
          <p className="font-body text-[12px] text-foreground/80 leading-relaxed">
            Helps curate better recommendations. You can change this anytime.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="font-body text-[13px] font-medium text-primary hover:text-primary/80 transition-colors text-left"
          >
            Learn more
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => selected && onNext({ orientation: selected, showOnProfile })}
            disabled={!selected}
            className="h-12 w-12 rounded-xl flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity"
            style={{
              background: selected ? "var(--gradient-warm)" : "hsl(var(--secondary))",
              boxShadow: selected ? "0 6px 20px -4px hsl(32 70% 36% / 0.35)" : undefined,
            }}
          >
            <ArrowRight className={`h-5 w-5 ${!selected ? "text-muted-foreground" : ""}`} />
          </motion.button>
        </div>
      </motion.div>

      {/* Feedback dialog */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="rounded-3xl max-w-[360px]">
          <DialogHeader>
            <DialogTitle className="font-display text-[20px]">Share your feedback</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Add your Thoughts..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="rounded-xl border-border/60 bg-card/80 min-h-[120px] font-body text-[14px]"
          />
          <DialogFooter className="flex flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setFeedbackOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-xl border-0 text-primary-foreground"
              style={{ background: "var(--gradient-warm)" }}
              onClick={submitFeedback}
              disabled={!feedback.trim()}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Thank you dialog */}
      <Dialog open={thanksOpen} onOpenChange={setThanksOpen}>
        <DialogContent className="rounded-3xl max-w-[340px]">
          <DialogHeader>
            <div
              className="mx-auto h-14 w-14 rounded-full flex items-center justify-center mb-2"
              style={{ background: "var(--gradient-warm)" }}
            >
              <CheckCircle2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <DialogTitle className="font-display text-[20px] text-center">Thank you</DialogTitle>
          </DialogHeader>
          <p className="font-body text-[13px] text-muted-foreground text-center pb-2">
            Your feedback helps us improve Elyxer.
          </p>
          <Button
            className="w-full rounded-xl border-0 text-primary-foreground"
            style={{ background: "var(--gradient-warm)" }}
            onClick={() => setThanksOpen(false)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrientationStep;
