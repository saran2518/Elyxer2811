import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Camera, Info, Plus, ShieldCheck, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface PhotosStepProps {
  onNext: (data: { photos: string[]; selfie: string | null }) => void;
}

const MIN_PHOTOS = 4;
const SLOTS = 6;
const SELFIE_SLOT = 5;

type SelfieStage = "capture" | "fail" | "confirm";

const PhotosStep = ({ onNext }: PhotosStepProps) => {
  const [photos, setPhotos] = useState<(string | null)[]>(Array(SLOTS).fill(null));
  const [errorSlots, setErrorSlots] = useState<number[]>([]);
  const [globalError, setGlobalError] = useState(false);
  const [guidelineOpen, setGuidelineOpen] = useState(false);
  const [sheetSlot, setSheetSlot] = useState<number | null>(null);
  const [selfieOpen, setSelfieOpen] = useState(false);
  const [selfieStage, setSelfieStage] = useState<SelfieStage>("capture");
  const [selfie, setSelfie] = useState<string | null>(null);
  const [badgeEarned, setBadgeEarned] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filledCount = photos.filter(Boolean).length;
  const canContinue = filledCount >= MIN_PHOTOS;

  const openSlotSheet = (i: number) => {
    if (i === SELFIE_SLOT) {
      setSelfieOpen(true);
      setSelfieStage("capture");
      return;
    }
    setSheetSlot(i);
  };

  const handleFile = (file: File) => {
    if (sheetSlot === null) return;
    if (!file.type.startsWith("image/")) {
      setErrorSlots((s) => [...new Set([...s, sheetSlot])]);
      setGlobalError(true);
      setSheetSlot(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setPhotos((p) => {
        const next = [...p];
        next[sheetSlot] = url;
        return next;
      });
      setErrorSlots((s) => s.filter((x) => x !== sheetSlot));
      setGlobalError(false);
      setSheetSlot(null);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (i: number) => {
    setPhotos((p) => {
      const next = [...p];
      next[i] = null;
      return next;
    });
    setErrorSlots((s) => s.filter((x) => x !== i));
  };

  const captureSelfie = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 320;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 240, 320);
    g.addColorStop(0, "#c9a84c");
    g.addColorStop(1, "#8b6f3a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 240, 320);
    setSelfie(canvas.toDataURL("image/png"));
    setSelfieStage("confirm");
  };

  const submitSelfie = () => {
    setSelfieOpen(false);
    setBadgeEarned(true);
    setPhotos((p) => {
      const next = [...p];
      next[SELFIE_SLOT] = selfie;
      return next;
    });
  };

  return (
    <>
      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-2"
        >
          <h1 className="font-display text-[24px] sm:text-[28px] font-bold text-foreground leading-[1.2]">
            Add your <span className="text-primary italic">best photos</span>
          </h1>
          <p className="font-body text-[13px] text-muted-foreground/80 mt-3">
            Candid and natural photos make the best impression.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-4 grid grid-cols-2 gap-2"
        >
          {photos.map((src, i) => {
            const isSelfieSlot = i === SELFIE_SLOT;
            const hasError = errorSlots.includes(i);
            return (
              <button
                key={i}
                onClick={() => openSlotSheet(i)}
                className={`relative aspect-[4/5] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${
                  hasError
                    ? "border-destructive/60 bg-destructive/5"
                    : src
                      ? "border-primary/30 bg-card"
                      : isSelfieSlot
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/60 bg-card/40 hover:border-primary/40"
                }`}
              >
                {src ? (
                  <>
                    <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(i);
                      }}
                      className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-md z-10 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5 text-foreground" />
                    </span>
                  </>
                ) : isSelfieSlot ? (
                  <div className="flex flex-col items-center gap-2 px-3 text-center">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center text-primary-foreground"
                      style={{ background: "var(--gradient-warm)" }}
                    >
                      <Camera className="h-5 w-5" />
                    </div>
                    <p className="font-body text-[11px] font-semibold text-foreground leading-tight">
                      Add a selfie
                    </p>
                    <p className="font-body text-[10px] text-muted-foreground leading-tight">
                      Unlock your badge
                    </p>
                  </div>
                ) : (
                  <Plus className="h-6 w-6 text-muted-foreground" />
                )}
                {hasError && (
                  <span className="absolute bottom-1.5 left-1.5 right-1.5 font-body text-[10px] text-destructive font-medium text-center bg-background/90 rounded-md py-0.5">
                    File format not supported
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        <p className="font-body text-[11px] text-muted-foreground/70 mt-3 px-1">
          Minimum {MIN_PHOTOS} photos required • {filledCount}/{SLOTS} added
        </p>

        {globalError && (
          <p className="font-body text-[12px] text-destructive font-medium mt-1 px-1">
            Upload cannot be completed please try again
          </p>
        )}

        <AnimatePresence>
          {badgeEarned && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2"
            >
              <ShieldCheck className="h-4 w-4 text-primary" />
              <p className="font-body text-[12px] font-semibold text-foreground">
                You have earned a badge
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="w-full max-w-sm mx-auto space-y-4 mt-4"
      >
        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10">
            <Info className="h-4 w-4 text-primary" />
          </div>
          <p className="font-body text-[12px] text-foreground/80 leading-relaxed">
            Adding a selfie builds trust and signals authenticity. You can always add it later.
          </p>
        </div>

        <div className="flex items-center justify-end">
          <motion.button
            whileHover={{ scale: canContinue ? 1.05 : 1 }}
            whileTap={{ scale: canContinue ? 0.95 : 1 }}
            onClick={() => canContinue && onNext({ photos: photos.filter(Boolean) as string[], selfie })}
            disabled={!canContinue}
            className="h-12 w-12 rounded-xl flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity"
            style={{
              background: canContinue ? "var(--gradient-warm)" : "hsl(var(--secondary))",
              boxShadow: canContinue ? "0 6px 20px -4px hsl(32 70% 36% / 0.35)" : undefined,
            }}
          >
            <ArrowRight className={`h-5 w-5 ${!canContinue ? "text-muted-foreground" : ""}`} />
          </motion.button>
        </div>
      </motion.div>

      <Sheet open={sheetSlot !== null} onOpenChange={(o) => !o && setSheetSlot(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="font-display text-[18px] text-center">Add a photo</SheetTitle>
          </SheetHeader>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <div className="space-y-3 mt-4 max-w-sm mx-auto w-full">
            <Button
              onClick={() => {
                fileInputRef.current?.click();
              }}
              className="w-full h-12 rounded-xl text-primary-foreground gap-2"
              style={{ background: "var(--gradient-warm)" }}
            >
              <Camera className="h-4 w-4" /> Take a photo
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full h-12 rounded-xl gap-2 border-border/60"
            >
              <Upload className="h-4 w-4" /> Upload a photo
            </Button>
            <button
              onClick={() => {
                setSheetSlot(null);
                setGuidelineOpen(true);
              }}
              className="block w-full text-center font-body text-[11px] text-muted-foreground/60 underline mt-2"
            >
              Preview guideline rejection
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={guidelineOpen} onOpenChange={setGuidelineOpen}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-[18px]">Photo guidelines</DialogTitle>
            <DialogDescription className="font-body text-[13px]">
              Some photos did not meet our guidelines and were removed. Please upload a different
              photo to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setGuidelineOpen(false)}
              className="w-full h-11 rounded-xl text-primary-foreground"
              style={{ background: "var(--gradient-warm)" }}
            >
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={selfieOpen} onOpenChange={setSelfieOpen}>
        <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden">
          {selfieStage === "capture" && (
            <div className="bg-background flex flex-col items-center px-6 pt-8 pb-6">
              <h3 className="font-display text-[18px] font-bold text-center">
                Take a clear selfie
              </h3>
              <p className="font-body text-[12px] text-muted-foreground text-center mt-1">
                This unlocks your badge
              </p>
              <div
                className="relative my-6 h-64 w-48 rounded-[50%] border-2 flex items-center justify-center overflow-hidden"
                style={{ borderColor: "hsl(var(--primary))" }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-primary/5" />
                <Camera className="h-10 w-10 text-primary/60 z-10" />
              </div>
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={() => setSelfieStage("fail")}
                  className="flex-1 h-11 rounded-xl"
                >
                  Simulate fail
                </Button>
                <Button
                  onClick={captureSelfie}
                  className="flex-1 h-11 rounded-xl text-primary-foreground"
                  style={{ background: "var(--gradient-warm)" }}
                >
                  Capture
                </Button>
              </div>
            </div>
          )}
          {selfieStage === "fail" && (
            <div className="bg-background flex flex-col items-center px-6 pt-8 pb-6">
              <h3 className="font-display text-[18px] font-bold text-center">
                We are unable to use this selfie
              </h3>
              <p className="font-body text-[12px] text-muted-foreground text-center mt-2">
                Make sure your face is clearly visible, in natural lighting.
              </p>
              <div className="flex gap-3 w-full mt-6">
                <Button
                  variant="outline"
                  onClick={() => setSelfieOpen(false)}
                  className="flex-1 h-11 rounded-xl"
                >
                  Add later
                </Button>
                <Button
                  onClick={() => setSelfieStage("capture")}
                  className="flex-1 h-11 rounded-xl text-primary-foreground"
                  style={{ background: "var(--gradient-warm)" }}
                >
                  Retake
                </Button>
              </div>
            </div>
          )}
          {selfieStage === "confirm" && (
            <div className="bg-background flex flex-col items-center px-6 pt-8 pb-6">
              <h3 className="font-display text-[18px] font-bold text-center">
                Confirm your selfie
              </h3>
              <p className="font-body text-[12px] text-muted-foreground text-center mt-1">
                Please review your photo and submit to proceed.
              </p>
              {selfie && (
                <img
                  src={selfie}
                  alt="selfie"
                  className="my-5 h-56 w-44 rounded-3xl object-cover border border-primary/30"
                />
              )}
              <p className="font-body text-[11px] text-muted-foreground/80 text-center mb-4">
                This Photo will be visible on your profile
              </p>
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={() => setSelfieStage("capture")}
                  className="flex-1 h-11 rounded-xl"
                >
                  Retake
                </Button>
                <Button
                  onClick={submitSelfie}
                  className="flex-1 h-11 rounded-xl text-primary-foreground"
                  style={{ background: "var(--gradient-warm)" }}
                >
                  Submit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotosStep;
