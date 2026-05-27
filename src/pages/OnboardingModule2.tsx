import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Module2Stepper from "@/components/onboarding/Module2Stepper";
import AgeStep from "@/components/onboarding/AgeStep";
import GenderStep from "@/components/onboarding/GenderStep";
import PronounStep from "@/components/onboarding/PronounStep";

type Step = "age" | "gender" | "pronouns";

const STEP_CONFIG: Record<Step, { stepperStep: number; progress: string }> = {
  age: { stepperStep: 0, progress: "0%" },
  gender: { stepperStep: 1, progress: "33%" },
  pronouns: { stepperStep: 2, progress: "66%" },
};

const OnboardingModule2 = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("age");
  const [completed, setCompleted] = useState(false);

  const config = STEP_CONFIG[step];

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-10">
      <Module2Stepper
        currentStep={config.stepperStep}
        progressPercent={completed ? "100%" : config.progress}
        doneActive={completed}
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
          {step === "age" && <AgeStep onNext={() => setStep("gender")} />}
          {step === "gender" && <GenderStep onNext={() => setStep("pronouns")} />}
          {step === "pronouns" && (
            <PronounStep
              onNext={() => {
                setCompleted(true);
                setTimeout(() => navigate("/profile-studio-intro"), 700);
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OnboardingModule2;
