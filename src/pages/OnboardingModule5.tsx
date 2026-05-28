import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Module5Stepper from "@/components/onboarding/Module5Stepper";
import HeightStep from "@/components/onboarding/HeightStep";
import LanguagesStep from "@/components/onboarding/LanguagesStep";
import PhotosStep from "@/components/onboarding/PhotosStep";

type Step = "height" | "languages" | "photos";

const STEP_CONFIG: Record<Step, { stepperStep: number; progress: string }> = {
  height: { stepperStep: 0, progress: "0%" },
  languages: { stepperStep: 1, progress: "33%" },
  photos: { stepperStep: 2, progress: "66%" },
};

const OnboardingModule5 = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("height");
  const [completed, setCompleted] = useState(false);

  const config = STEP_CONFIG[step];

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-6">
      <Module5Stepper
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
          {step === "height" && (
            <HeightStep
              onNext={() => setStep("languages")}
              onSkip={() => setStep("languages")}
            />
          )}
          {step === "languages" && (
            <LanguagesStep
              onNext={() => setStep("photos")}
              onSkip={() => setStep("photos")}
            />
          )}
          {step === "photos" && (
            <PhotosStep
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

export default OnboardingModule5;
