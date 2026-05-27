import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import PhoneStep from "@/components/onboarding/PhoneStep";
import PhoneOTPStep from "@/components/onboarding/PhoneOTPStep";
import NameStep from "@/components/onboarding/NameStep";
import EmailStep from "@/components/onboarding/EmailStep";
import EmailOTPStep from "@/components/onboarding/EmailOTPStep";

type Step = "phone" | "phone-otp" | "name" | "email" | "email-otp";

const STEP_CONFIG: Record<Step, { stepperStep: number; progress: string }> = {
  phone: { stepperStep: 0, progress: "0%" },
  "phone-otp": { stepperStep: 0, progress: "25%" },
  name: { stepperStep: 1, progress: "33%" },
  email: { stepperStep: 2, progress: "66%" },
  "email-otp": { stepperStep: 2, progress: "66%" },
};

const OnboardingModule1 = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const config = STEP_CONFIG[step];

  const goToProfileStudio = () => navigate("/onboarding-module-2");

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-10">
      <OnboardingStepper
        currentStep={config.stepperStep}
        progressPercent={emailVerified ? "100%" : config.progress}
        doneActive={emailVerified}
      />

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
              onNext={(phone) => {
                setPhoneNumber(phone);
                setStep("phone-otp");
              }}
            />
          )}

          {step === "phone-otp" && (
            <PhoneOTPStep
              phoneNumber={phoneNumber}
              onNext={() => setStep("name")}
              onBack={() => setStep("phone")}
            />
          )}

          {step === "name" && (
            <NameStep onNext={() => setStep("email")} />
          )}

          {step === "email" && (
            <EmailStep
              onNext={(e) => {
                setEmail(e);
                setStep("email-otp");
              }}
              onSkip={goToProfileStudio}
            />
          )}

          {step === "email-otp" && (
            <EmailOTPStep
              email={email}
              onNext={() => {
                setEmailVerified(true);
                goToProfileStudio();
              }}
              onBack={() => setStep("email")}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OnboardingModule1;
