import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Module3Stepper from "@/components/onboarding/Module3Stepper";
import OrientationStep from "@/components/onboarding/OrientationStep";
import DatingPreferenceStep from "@/components/onboarding/DatingPreferenceStep";
import DatingGoalsStep from "@/components/onboarding/DatingGoalsStep";

type Step = "orientation" | "preference" | "goals";

const STEP_CONFIG: Record<Step, { stepperStep: number; progress: string }> = {
  orientation: { stepperStep: 0, progress: "0%" },
  preference: { stepperStep: 1, progress: "33%" },
  goals: { stepperStep: 2, progress: "66%" },
};

const OnboardingModule3 = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("orientation");
  const [completed, setCompleted] = useState(false);

  const config = STEP_CONFIG[step];

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-10">
      <Module3Stepper
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
          {step === "orientation" && <OrientationStep onNext={() => setStep("preference")} />}
          {step === "preference" && <DatingPreferenceStep onNext={() => setStep("goals")} />}
          {step === "goals" && (
            <DatingGoalsStep
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

export default OnboardingModule3;
