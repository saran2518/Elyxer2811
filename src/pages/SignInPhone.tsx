import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PhoneStep from "@/components/onboarding/PhoneStep";
import PhoneOTPStep from "@/components/onboarding/PhoneOTPStep";
import logoAsset from "@/assets/elyxer-logo.png.asset.json";

type Step = "phone" | "phone-otp";

const SignInPhone = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-10">
      {/* Brand header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2.5 mb-8"
      >
        <img
          src={logoAsset.url}
          alt="Elyxer"
          className="h-10 w-10 rounded-lg"
        />
        <span
          className="text-[26px] leading-none text-foreground"
          style={{ fontFamily: "'Marcellus', serif", fontWeight: 400 }}
        >
          Elyxer
        </span>
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="flex-1 flex flex-col"
        >
          {step === "phone" && (
            <PhoneStep
              title="Welcome back"
              subtitle="Sign in with the phone number linked to your Elyxer account."
              onNext={(phone) => {
                setPhoneNumber(phone);
                setStep("phone-otp");
              }}
            />
          )}

          {step === "phone-otp" && (
            <PhoneOTPStep
              phoneNumber={phoneNumber}
              onNext={() => navigate("/discover")}
              onBack={() => setStep("phone")}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SignInPhone;
