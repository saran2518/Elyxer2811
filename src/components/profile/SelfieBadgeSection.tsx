import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ShieldCheck, Sparkles, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Stage = "intro" | "capture" | "fail" | "confirm" | "success";

interface Props {
  selfie: string | null;
  onEarned: (dataUrl: string) => void;
}

export default function SelfieBadgeSection({ selfie, onEarned }: Props) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("intro");
  const [preview, setPreview] = useState<string | null>(null);

  const start = () => {
    setStage(selfie ? "capture" : "intro");
    setPreview(null);
    setOpen(true);
  };

  const capture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 320;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 240, 320);
    g.addColorStop(0, "#c9a84c");
    g.addColorStop(1, "#8b6f3a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 240, 320);
    setPreview(canvas.toDataURL("image/png"));
    setStage("confirm");
  };

  const submit = () => {
    if (!preview) return;
    onEarned(preview);
    setStage("success");
    toast.success("Selfie badge unlocked", { description: "Your profile is now verified." });
  };

  const earned = !!selfie;

  return (
    <>
      <motion.button
        onClick={start}
        whileTap={{ scale: 0.98 }}
        className="w-full relative overflow-hidden rounded-[20px] border border-primary/25 text-left"
        style={{ boxShadow: "var(--shadow-card)", background: "var(--gradient-warm)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="relative flex items-center gap-3.5 px-4 py-3.5">
          <div className="h-11 w-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0 text-primary-foreground">
            {earned ? <ShieldCheck className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-[14px] font-display font-semibold text-primary-foreground leading-tight">
                {earned ? "Selfie badge earned" : "Earn your Selfie Badge"}
              </p>
              {!earned && <Sparkles className="h-3 w-3 text-primary-foreground/90" />}
            </div>
            <p className="text-[11px] text-primary-foreground/85 mt-1 leading-relaxed">
              {earned
                ? "Tap to retake your verification selfie"
                : "Verify you're real and stand out to matches"}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-primary-foreground/80 shrink-0" />
        </div>
      </motion.button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {stage === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-background flex flex-col items-center px-6 pt-8 pb-6"
              >
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center text-primary-foreground mb-4"
                  style={{ background: "var(--gradient-warm)" }}
                >
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="font-display text-[18px] font-bold text-center">
                  Unlock the Selfie Badge
                </h3>
                <p className="font-body text-[12px] text-muted-foreground text-center mt-2 leading-relaxed">
                  A quick selfie confirms you're the person in your photos. Verified profiles get more meaningful matches.
                </p>
                <ul className="w-full mt-5 space-y-2">
                  {["Face clearly visible", "Natural lighting", "No filters or sunglasses"].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-[12px] text-foreground/80">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3 w-full mt-6">
                  <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 h-11 rounded-xl">
                    Not now
                  </Button>
                  <Button
                    onClick={() => setStage("capture")}
                    className="flex-1 h-11 rounded-xl text-primary-foreground"
                    style={{ background: "var(--gradient-warm)" }}
                  >
                    Start
                  </Button>
                </div>
              </motion.div>
            )}
            {stage === "capture" && (
              <motion.div key="capture" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-background flex flex-col items-center px-6 pt-8 pb-6">
                <h3 className="font-display text-[18px] font-bold text-center">Take a clear selfie</h3>
                <p className="font-body text-[12px] text-muted-foreground text-center mt-1">
                  Center your face in the frame
                </p>
                <div
                  className="relative my-6 h-64 w-48 rounded-[50%] border-2 flex items-center justify-center overflow-hidden"
                  style={{ borderColor: "hsl(var(--primary))" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-primary/5" />
                  <Camera className="h-10 w-10 text-primary/60 z-10" />
                </div>
                <div className="flex gap-3 w-full">
                  <Button variant="outline" onClick={() => setStage("fail")} className="flex-1 h-11 rounded-xl">
                    Simulate fail
                  </Button>
                  <Button onClick={capture} className="flex-1 h-11 rounded-xl text-primary-foreground" style={{ background: "var(--gradient-warm)" }}>
                    Capture
                  </Button>
                </div>
              </motion.div>
            )}
            {stage === "fail" && (
              <motion.div key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-background flex flex-col items-center px-6 pt-8 pb-6">
                <h3 className="font-display text-[18px] font-bold text-center">We can't use this selfie</h3>
                <p className="font-body text-[12px] text-muted-foreground text-center mt-2">
                  Make sure your face is clearly visible, in natural lighting.
                </p>
                <div className="flex gap-3 w-full mt-6">
                  <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 h-11 rounded-xl">
                    Add later
                  </Button>
                  <Button onClick={() => setStage("capture")} className="flex-1 h-11 rounded-xl text-primary-foreground" style={{ background: "var(--gradient-warm)" }}>
                    Retake
                  </Button>
                </div>
              </motion.div>
            )}
            {stage === "confirm" && (
              <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-background flex flex-col items-center px-6 pt-8 pb-6">
                <h3 className="font-display text-[18px] font-bold text-center">Confirm your selfie</h3>
                <p className="font-body text-[12px] text-muted-foreground text-center mt-1">
                  Review your photo and submit to proceed.
                </p>
                {preview && (
                  <img src={preview} alt="selfie" className="my-5 h-56 w-44 rounded-3xl object-cover border border-primary/30" />
                )}
                <div className="flex gap-3 w-full">
                  <Button variant="outline" onClick={() => setStage("capture")} className="flex-1 h-11 rounded-xl">
                    Retake
                  </Button>
                  <Button onClick={submit} className="flex-1 h-11 rounded-xl text-primary-foreground" style={{ background: "var(--gradient-warm)" }}>
                    Submit
                  </Button>
                </div>
              </motion.div>
            )}
            {stage === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-background flex flex-col items-center px-6 pt-8 pb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="h-16 w-16 rounded-full flex items-center justify-center text-primary-foreground"
                  style={{ background: "var(--gradient-warm)" }}
                >
                  <ShieldCheck className="h-8 w-8" />
                </motion.div>
                <h3 className="font-display text-[18px] font-bold text-center mt-4">Badge unlocked!</h3>
                <p className="font-body text-[12px] text-muted-foreground text-center mt-1">
                  Your profile now shows the verified selfie badge.
                </p>
                <Button
                  onClick={() => setOpen(false)}
                  className="w-full h-11 rounded-xl text-primary-foreground mt-6"
                  style={{ background: "var(--gradient-warm)" }}
                >
                  Done
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
