import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Info, Pencil, Check, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type GenderKey = "man" | "woman" | "nonbinary";

const GENDER_OPTIONS: { key: GenderKey; label: string }[] = [
  { key: "man", label: "Man" },
  { key: "woman", label: "Woman" },
  { key: "nonbinary", label: "Non-Binary" },
];

const SUB_IDENTITIES: Record<GenderKey, string[]> = {
  man: [
    "Cisgender man",
    "Intersex Man",
    "Transgender man",
    "Transmasculine",
    "Man and Nonbinary",
  ],
  woman: [
    "Cisgender Woman",
    "Intersex women",
    "Trans woman",
    "Transfeminine",
    "Women and Nonbinary",
  ],
  nonbinary: [
    "Agender",
    "Bigender",
    "Genderfluid",
    "Genderqueer",
    "Gender nonconforming",
    "Gender questioning",
    "Gender variant",
    "Intersex",
    "Neutrois",
    "Nonbinary man",
    "Pangender",
    "Polygender",
  ],
};

interface GenderStepProps {
  onNext: (data: { gender: GenderKey; subIdentities: string[]; showOnProfile: boolean }) => void;
}

const GenderStep = ({ onNext }: GenderStepProps) => {
  const [selected, setSelected] = useState<GenderKey | null>(null);
  const [subIdentities, setSubIdentities] = useState<string[]>([]);
  const [sheetSelections, setSheetSelections] = useState<string[]>([]);
  const [showOnProfile, setShowOnProfile] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [displaySelections, setDisplaySelections] = useState<string[]>([]);

  const toggleDisplay = (item: string) => {
    setDisplaySelections((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const openSheet = () => {
    if (!selected) return;
    setSheetSelections(subIdentities);
    setSheetOpen(true);
  };

  const toggleSub = (s: string) => {
    setSheetSelections((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const saveSubs = () => {
    setSubIdentities(sheetSelections);
    setSheetOpen(false);
  };

  return (
    <>
      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6"
        >
          <h1 className="font-display text-[24px] sm:text-[28px] font-bold text-foreground leading-[1.2]">
            How do you describe
            <br />
            <span className="text-primary italic">your Gender?</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="grid grid-cols-3 gap-2.5 mb-5"
        >
          {GENDER_OPTIONS.map((opt) => {
            const isActive = selected === opt.key;
            return (
              <motion.button
                key={opt.key}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setSelected(opt.key);
                  setSubIdentities([]);
                }}
                className={`rounded-2xl border-2 py-5 px-2 font-body text-[13px] font-semibold transition-all ${
                  isActive
                    ? "border-primary bg-primary/5 text-foreground shadow-md"
                    : "border-border/60 bg-card/80 text-muted-foreground hover:border-border"
                }`}
                style={
                  isActive
                    ? { boxShadow: "0 6px 20px -6px hsl(32 70% 36% / 0.25)" }
                    : undefined
                }
              >
                {opt.label}
              </motion.button>
            );
          })}
        </motion.div>

        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <button
              onClick={openSheet}
              className="font-body text-[13px] font-medium text-primary hover:text-primary/80 underline-offset-2 hover:underline"
            >
              + Add more about your gender identity
            </button>

            <AnimatePresence>
              {subIdentities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 mt-3"
                >
                  {subIdentities.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 font-body text-[12px] font-medium text-foreground"
                    >
                      {s}
                      <button onClick={openSheet} className="text-primary/70 hover:text-primary">
                        <Pencil className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-3 mt-2"
        >
          <div className="flex items-center gap-3">
            <Checkbox
              id="show-gender"
              checked={showOnProfile}
              onCheckedChange={(c) => setShowOnProfile(c === true)}
              className="h-5 w-5 rounded border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor="show-gender"
              className="font-body text-[14px] font-semibold text-foreground cursor-pointer"
            >
              Show on your profile
            </label>
          </div>

          {showOnProfile && selected && (() => {
            const genderLabel = GENDER_OPTIONS.find((g) => g.key === selected)!.label;
            const allItems = [genderLabel, ...subIdentities];
            const visibleItems = allItems.filter(
              (i) => !displaySelections.includes(`__hide__${i}`)
            );
            return (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="ml-8 rounded-xl border border-border/50 bg-card/60 px-3 py-2.5 space-y-2"
              >
                <p className="font-body text-[11px] uppercase tracking-wider text-muted-foreground/70">
                  Profile preview
                </p>
                <p className="font-body text-[11px] text-muted-foreground/80">
                  Select what to show on your profile
                </p>
                <div className="space-y-1.5">
                  {allItems.map((item) => {
                    const hideKey = `__hide__${item}`;
                    const isShown = !displaySelections.includes(hideKey);
                    return (
                      <label
                        key={item}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={isShown}
                          onCheckedChange={() => toggleDisplay(hideKey)}
                          className="h-4 w-4 rounded border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <span className="font-body text-[13px] text-foreground">{item}</span>
                      </label>
                    );
                  })}
                </div>
                {visibleItems.length > 0 && (
                  <div className="pt-2 border-t border-border/40">
                    <p className="font-body text-[11px] text-muted-foreground/70 mb-0.5">
                      Showing
                    </p>
                    <p className="font-body text-[13px] text-foreground">
                      {visibleItems[0]}
                      {visibleItems.length > 1 && (
                        <span className="text-muted-foreground"> · {visibleItems.slice(1).join(", ")}</span>
                      )}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })()}
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
            Helps represent you as you identify. You can change this anytime.
          </p>
        </div>

        <div className="flex items-center justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              selected && onNext({ gender: selected, subIdentities, showOnProfile })
            }
            disabled={!selected}
            className="h-12 w-12 rounded-xl flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity"
            style={{
              background: selected ? "var(--gradient-warm)" : "hsl(var(--secondary))",
              boxShadow: selected ? "0 6px 20px -4px hsl(32 70% 36% / 0.35)" : undefined,
            }}
          >
            <ArrowRight className={`h-5 w-5 ${!selected ? "text-muted-foreground" : ""}`} />
          </motion.button>
        </div>
      </motion.div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl max-h-[80vh] overflow-y-auto"
        >
          <SheetHeader className="text-left mb-4">
            <SheetTitle className="font-display text-[20px]">
              Gender identity
            </SheetTitle>
            <p className="font-body text-[12px] text-muted-foreground">
              Select all that describe you
            </p>
          </SheetHeader>

          <div className="flex flex-wrap gap-2 mb-6">
            {selected &&
              SUB_IDENTITIES[selected].map((s) => {
                const isOn = sheetSelections.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSub(s)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-body text-[13px] border transition-all ${
                      isOn
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border/60 text-foreground hover:border-primary/40"
                    }`}
                  >
                    {isOn && <Check className="h-3 w-3" />}
                    {s}
                  </button>
                );
              })}
          </div>

          <p className="font-body text-[12px] text-muted-foreground/80 text-center mb-4">
            Are we missing something?{" "}
            <span className="text-primary cursor-pointer underline-offset-2 hover:underline">
              Let us know
            </span>
          </p>

          <div className="flex gap-2 sticky bottom-0 bg-background pt-2 pb-1">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setSheetOpen(false)}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-xl border-0 text-primary-foreground"
              style={{ background: "var(--gradient-warm)" }}
              onClick={saveSubs}
            >
              Save
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default GenderStep;
