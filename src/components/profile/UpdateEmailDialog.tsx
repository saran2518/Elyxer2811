import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, ArrowRight, AlertCircle, Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  currentEmail?: string;
}

type Stage = "email" | "otp" | "success";

const UpdateEmailDialog = ({ open, onClose, currentEmail }: Props) => {
  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (stage !== "otp" || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [stage, timeLeft]);

  // Auto-verify once all 6 digits are entered
  useEffect(() => {
    if (stage !== "otp") return;
    if (otp.length < 6) {
      if (error) setError(null);
      return;
    }
    setIsVerifying(true);
    setError(null);
    const submitted = otp;
    const t = setTimeout(() => {
      setIsVerifying(false);
      // Demo: codes ending in "00" simulate an incorrect code
      if (submitted.endsWith("00")) {
        setError("Incorrect code. Please try again.");
        setOtp("");
        return;
      }
      setStage("success");
    }, 800);
    return () => clearTimeout(t);
  }, [otp, stage]);

  const reset = () => {
    setStage("email");
    setEmail("");
    setOtp("");
    setError(null);
    setIsVerifying(false);
    setTimeLeft(60);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const sendCode = () => {
    if (!isValid) return;
    setOtp("");
    setError(null);
    setTimeLeft(60);
    setStage("otp");
    toast({ title: "Verification code sent", description: `We've sent a 6-digit code to ${email}` });
  };

  const resend = () => {
    if (timeLeft > 0) return;
    setOtp("");
    setError(null);
    setTimeLeft(60);
    toast({ title: "Code resent", description: `A new 6-digit code is on its way to ${email}` });
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Sheet */}
          <motion.div
            className="relative w-full max-w-md rounded-t-3xl bg-card border border-border/20 shadow-2xl overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
            </div>

            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground hover:bg-muted/60 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="px-6 pt-2 pb-8 space-y-5">
              {stage === "email" && (
                <>
                  <motion.div
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-[16px] font-bold text-foreground">Update Email</h3>
                    <p className="text-[12px] text-muted-foreground/70 text-center leading-relaxed">
                      {currentEmail
                        ? `Current email: ${currentEmail}`
                        : "Add an email to secure your account & receive updates"}
                    </p>
                  </motion.div>

                  <Input
                    type="email"
                    placeholder="Enter your new email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={255}
                    className="h-12 rounded-xl border-border/30 bg-muted/20 text-[14px] placeholder:text-muted-foreground/40 focus-visible:ring-primary/30"
                  />

                  <p className="text-[11px] text-muted-foreground/50 text-center leading-relaxed">
                    We'll send a 6-digit verification code to confirm your new email
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="flex-1 h-12 rounded-2xl border border-border/30 bg-card text-foreground font-semibold text-[13px] hover:bg-muted/40 active:scale-[0.98] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendCode}
                      disabled={!isValid}
                      className="flex-1 h-12 rounded-2xl bg-primary text-primary-foreground font-semibold text-[13px] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Send code
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}

              {stage === "otp" && (
                <>
                  <motion.div
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-[16px] font-bold text-foreground">Verify your email</h3>
                    <p className="text-[12px] text-muted-foreground/70 text-center">
                      Enter the 6-digit code sent to
                    </p>
                    <p className="text-[13px] font-semibold text-foreground">{email}</p>
                  </motion.div>

                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp} containerClassName="gap-2">
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className={`h-12 w-11 rounded-xl bg-muted/20 text-[16px] font-semibold text-foreground first:rounded-xl first:border-l last:rounded-xl ${
                              error ? "border-destructive/60 ring-1 ring-destructive/30" : "border-border/40"
                            }`}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <div className="min-h-[20px] flex items-center justify-center">
                    {error ? (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1.5 text-destructive"
                      >
                        <AlertCircle className="h-3.5 w-3.5" />
                        <p className="text-[12px] font-medium">{error}</p>
                      </motion.div>
                    ) : isVerifying ? (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <p className="text-[12px] font-medium">Verifying…</p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted-foreground/50">
                        For your security, don't share this code.
                      </p>
                    )}
                  </div>

                  <div className="text-center space-y-2">
                    {timeLeft > 0 ? (
                      <p className="text-[12px] text-muted-foreground/70">
                        Resend available in{" "}
                        <span className="font-semibold text-foreground">{formatTime(timeLeft)}</span>
                      </p>
                    ) : (
                      <p className="text-[12px] text-muted-foreground/60">Didn't receive the code?</p>
                    )}
                    <button
                      type="button"
                      onClick={resend}
                      disabled={timeLeft > 0}
                      className="text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors disabled:text-muted-foreground/40 disabled:cursor-not-allowed"
                    >
                      Resend code
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setStage("email");
                      setOtp("");
                      setError(null);
                    }}
                    className="w-full h-11 rounded-2xl border border-border/30 bg-card text-foreground font-semibold text-[13px] hover:bg-muted/40 active:scale-[0.98] transition-all"
                  >
                    Change email
                  </button>
                </>
              )}

              {stage === "success" && (
                <motion.div
                  className="flex flex-col items-center gap-3 pt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <motion.div
                    className="h-14 w-14 rounded-full flex items-center justify-center"
                    style={{ background: "var(--gradient-warm)" }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, delay: 0.05 }}
                  >
                    <Check className="h-7 w-7 text-primary-foreground" />
                  </motion.div>
                  <h3 className="text-[17px] font-bold text-foreground">Email successfully updated</h3>
                  <p className="text-[12.5px] text-muted-foreground/70 text-center leading-relaxed px-2">
                    Your email is now{" "}
                    <span className="font-semibold text-foreground">{email}</span>
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full h-12 mt-2 rounded-2xl text-primary-foreground font-semibold text-[14px] active:scale-[0.98] transition-all"
                    style={{ background: "var(--gradient-warm)" }}
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateEmailDialog;
