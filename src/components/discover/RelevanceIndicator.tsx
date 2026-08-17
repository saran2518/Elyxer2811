import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import sparkleAsset from "@/assets/sparkle-1.png.asset.json";

interface Props {
  level: 1 | 2 | 3;
}

const LABELS: Record<1 | 2 | 3, string> = {
  1: "Loosely aligned",
  2: "Closely aligned",
  3: "Strongly aligned",
};

export default function RelevanceIndicator({ level }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-primary/25 px-5 py-4"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--primary) / 0.14) 0%, hsl(var(--card)) 55%, hsl(var(--primary) / 0.08) 100%)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* soft glow */}
      <div
        className="pointer-events-none absolute -top-10 -right-8 h-28 w-28 rounded-full blur-2xl opacity-40"
        style={{ background: "var(--gradient-gold)" }}
      />

      <div className="relative flex items-center gap-3">
        <div
          className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center"
          style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
        >
          <Wand2 className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-[15px] font-semibold text-card-foreground">
              {LABELS[level]}
            </span>
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => {
                const active = i < level;
                return (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={active ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                    transition={{
                      duration: level === 3 ? 0.9 : level === 2 ? 1.2 : 1.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.12,
                    }}
                    className="relative h-3 w-3"
                  >
                    {active && (
                      <span
                        className="absolute inset-0 rounded-full blur-[4px] opacity-50"
                        style={{ backgroundColor: "hsl(var(--primary))" }}
                      />
                    )}
                    <div
                      className="relative h-3 w-3"
                      style={{
                        WebkitMaskImage: `url(${sparkleAsset.url})`,
                        maskImage: `url(${sparkleAsset.url})`,
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                        backgroundColor: "hsl(var(--primary))",
                        opacity: active ? 1 : 0.22,
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
