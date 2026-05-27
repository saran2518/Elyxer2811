import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AgeStepProps {
  onNext: (dob: { d: string; m: string; y: string; age: number }) => void;
}

const calcAge = (d: number, m: number, y: number) => {
  const today = new Date();
  let age = today.getFullYear() - y;
  const mDiff = today.getMonth() + 1 - m;
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < d)) age--;
  return age;
};

const AgeStep = ({ onNext }: AgeStepProps) => {
  const [d, setD] = useState("");
  const [m, setM] = useState("");
  const [y, setY] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [restrictOpen, setRestrictOpen] = useState(false);
  const dRef = useRef<HTMLInputElement>(null);
  const mRef = useRef<HTMLInputElement>(null);
  const yRef = useRef<HTMLInputElement>(null);

  const dn = parseInt(d, 10);
  const mn = parseInt(m, 10);
  const yn = parseInt(y, 10);
  const valid =
    d.length === 2 &&
    m.length === 2 &&
    y.length === 4 &&
    dn >= 1 &&
    dn <= 31 &&
    mn >= 1 &&
    mn <= 12 &&
    yn >= 1900 &&
    yn <= new Date().getFullYear();
  const age = valid ? calcAge(dn, mn, yn) : 0;

  const handleSubmit = () => {
    if (!valid) return;
    if (age < 18) setRestrictOpen(true);
    else setConfirmOpen(true);
  };

  return (
    <>
      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-8"
        >
          <h1 className="font-display text-[24px] sm:text-[28px] font-bold text-foreground leading-[1.2]">
            Let's confirm
            <br />
            <span className="text-primary italic">your age</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div>
            <label className="font-body text-[11px] uppercase tracking-wider text-muted-foreground/70 mb-1.5 block">
              Date
            </label>
            <Input
              ref={dRef}
              type="text"
              inputMode="numeric"
              placeholder="DD"
              maxLength={2}
              value={d}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                setD(v);
                if (v.length === 2) mRef.current?.focus();
              }}
              className="rounded-xl border-border/60 bg-card/80 font-body text-center text-[16px] h-14 placeholder:text-muted-foreground/40"
            />
          </div>
          <div>
            <label className="font-body text-[11px] uppercase tracking-wider text-muted-foreground/70 mb-1.5 block">
              Month
            </label>
            <Input
              ref={mRef}
              type="text"
              inputMode="numeric"
              placeholder="MM"
              maxLength={2}
              value={m}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                setM(v);
                if (v.length === 2) yRef.current?.focus();
              }}
              className="rounded-xl border-border/60 bg-card/80 font-body text-center text-[16px] h-14 placeholder:text-muted-foreground/40"
            />
          </div>
          <div>
            <label className="font-body text-[11px] uppercase tracking-wider text-muted-foreground/70 mb-1.5 block">
              Year
            </label>
            <Input
              ref={yRef}
              type="text"
              inputMode="numeric"
              placeholder="YYYY"
              maxLength={4}
              value={y}
              onChange={(e) => setY(e.target.value.replace(/\D/g, ""))}
              className="rounded-xl border-border/60 bg-card/80 font-body text-center text-[16px] h-14 placeholder:text-muted-foreground/40"
            />
          </div>
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
            Used to confirm and display your age on your profile
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="font-body text-[13px] font-medium text-primary hover:text-primary/80 transition-colors text-left"
          >
            Can I change this later?
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!valid}
            className="h-12 w-12 rounded-xl flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity"
            style={{
              background: valid ? "var(--gradient-warm)" : "hsl(var(--secondary))",
              boxShadow: valid ? "0 6px 20px -4px hsl(32 70% 36% / 0.35)" : undefined,
            }}
          >
            <ArrowRight className={`h-5 w-5 ${!valid ? "text-muted-foreground" : ""}`} />
          </motion.button>
        </div>
      </motion.div>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="rounded-3xl max-w-[340px]">
          <DialogHeader>
            <DialogTitle className="font-display text-[20px]">Confirm your age</DialogTitle>
            <DialogDescription className="font-body text-[13px] pt-2">
              You are{" "}
              <span className="font-semibold text-primary">{age} years old</span>. This will be
              displayed on your profile and cannot be changed easily.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-xl border-0 text-primary-foreground"
              style={{ background: "var(--gradient-warm)" }}
              onClick={() => {
                setConfirmOpen(false);
                onNext({ d, m, y, age });
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Age restriction dialog */}
      <Dialog open={restrictOpen} onOpenChange={setRestrictOpen}>
        <DialogContent className="rounded-3xl max-w-[340px]">
          <DialogHeader>
            <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <DialogTitle className="font-display text-[20px] text-center">
              Age Restriction
            </DialogTitle>
            <DialogDescription className="font-body text-[13px] text-center pt-2">
              You must be at least 18 years to create an Elyxer account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-2">
            <button className="w-full font-body text-[13px] text-primary hover:text-primary/80 transition-colors">
              Contact support
            </button>
            <p className="font-body text-[11px] text-muted-foreground/60 text-center leading-relaxed">
              See our{" "}
              <span className="text-primary/70 cursor-pointer">Terms of Service</span> and{" "}
              <span className="text-primary/70 cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgeStep;
