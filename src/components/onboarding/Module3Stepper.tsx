import { motion } from "framer-motion";
import { Heart, Users, Target, CheckCircle } from "lucide-react";

const STEPS = [
  { label: "Orientation", icon: Heart },
  { label: "Interested in", icon: Users },
  { label: "Goals", icon: Target },
  { label: "Done", icon: CheckCircle },
];

interface Module3StepperProps {
  currentStep: number;
  progressPercent: string;
  doneActive?: boolean;
}

const Module3Stepper = ({ currentStep, progressPercent, doneActive }: Module3StepperProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-xs mx-auto mb-14"
  >
    <div className="flex items-start justify-between relative">
      <div className="absolute top-[18px] left-[12%] right-[12%] h-[2px] bg-border/50 rounded-full" />
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: progressPercent }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-[18px] left-[12%] h-[2px] rounded-full"
        style={{ background: "var(--gradient-warm)" }}
      />
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const isActive = i === currentStep;
        const isCompleted = i < currentStep || (doneActive && i === 3);
        return (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
            className="flex flex-col items-center z-10 gap-2"
          >
            <motion.div
              animate={doneActive && i === 3 ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.4 }}
              className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                isActive || isCompleted
                  ? "text-primary-foreground shadow-md"
                  : "bg-secondary text-muted-foreground"
              }`}
              style={
                isActive || isCompleted
                  ? {
                      background: "var(--gradient-warm)",
                      boxShadow: "0 4px 14px -3px hsl(32 70% 36% / 0.35)",
                    }
                  : undefined
              }
            >
              <Icon className="h-4 w-4" />
            </motion.div>
            <span
              className={`font-body text-[10px] text-center leading-tight ${
                isActive || isCompleted
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground/70"
              }`}
            >
              {step.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  </motion.div>
);

export default Module3Stepper;
