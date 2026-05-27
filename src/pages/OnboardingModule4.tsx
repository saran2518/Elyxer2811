import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Module4Stepper from "@/components/onboarding/Module4Stepper";
import EducationStep from "@/components/onboarding/EducationStep";
import ProfessionStep from "@/components/onboarding/ProfessionStep";
import LocationStep from "@/components/onboarding/LocationStep";

type Step = "education" | "profession" | "location";

const STEP_CONFIG: Record<Step, { stepperStep: number; progress: string }> = {
  education: { stepperStep: 0, progress: "0%" },
  profession: { stepperStep: 1, progress: "33%" },
  location: { stepperStep: 2, progress: "66%" },
};

const OnboardingModule4 = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("education");
  const [completed, setCompleted] = useState(false);

  const config = STEP_CONFIG[step];

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-10">
      <Module4Stepper
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
          {step === "education" && (
            <EducationStep
              onNext={() => setStep("profession")}
              onSkip={() => setStep("profession")}
            />
          )}
          {step === "profession" && (
            <ProfessionStep
              onNext={() => setStep("location")}
              onSkip={() => setStep("location")}
            />
          )}
          {step === "location" && (
            <LocationStep
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

export default OnboardingModule4;
