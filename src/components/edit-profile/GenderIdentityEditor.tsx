import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Pencil, X } from "lucide-react";
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

const labelToKey = (label: string): GenderKey | null => {
  const m = GENDER_OPTIONS.find((g) => g.label === label);
  return m ? m.key : null;
};

interface GenderIdentityEditorProps {
  selectedGender: string;
  customGender: string;
  displayOnProfile: string;
  onGenderChange: (gender: string) => void;
  onCustomGenderChange: (custom: string) => void;
  onDisplayOnProfileChange: (display: string) => void;
}

export default function GenderIdentityEditor({
  selectedGender,
  customGender,
  displayOnProfile,
  onGenderChange,
  onCustomGenderChange,
  onDisplayOnProfileChange,
}: GenderIdentityEditorProps) {
  const selectedKey = labelToKey(selectedGender);

  const subIdentities = useMemo(
    () =>
      customGender
        ? customGender.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    [customGender]
  );

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSelections, setSheetSelections] = useState<string[]>([]);

  const allItems = useMemo(
    () => (selectedGender ? [selectedGender, ...subIdentities] : []),
    [selectedGender, subIdentities]
  );

  const hiddenItems = useMemo(() => {
    if (!selectedGender) return new Set<string>();
    const shown = displayOnProfile
      ? displayOnProfile.split(",").map((s) => s.trim()).filter(Boolean)
      : allItems;
    return new Set(allItems.filter((i) => !shown.includes(i)));
  }, [displayOnProfile, allItems, selectedGender]);

  const toggleDisplay = (item: string) => {
    const next = new Set(hiddenItems);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    const shown = allItems.filter((i) => !next.has(i));
    onDisplayOnProfileChange(shown.join(", "));
  };

  const openSheet = () => {
    if (!selectedKey) return;
    setSheetSelections(subIdentities);
    setSheetOpen(true);
  };

  const toggleSub = (s: string) => {
    setSheetSelections((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const saveSubs = () => {
    onCustomGenderChange(sheetSelections.join(", "));
    // Reset display to show everything by default when subs change
    const next = [selectedGender, ...sheetSelections].filter(Boolean);
    onDisplayOnProfileChange(next.join(", "));
    setSheetOpen(false);
  };

  return (
    <>
      <div className="flex flex-col w-full">
        {/* 3-column gender grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-3 gap-2.5 mb-5"
        >
          {GENDER_OPTIONS.map((opt) => {
            const isActive = selectedKey === opt.key;
            return (
              <motion.button
                key={opt.key}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  onGenderChange(opt.label);
                  onCustomGenderChange("");
                  onDisplayOnProfileChange(opt.label);
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

        {/* Add more about gender identity */}
        {selectedKey && (
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
                      <button
                        onClick={openSheet}
                        className="text-primary/70 hover:text-primary"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Profile preview / display chips */}
        {selectedKey && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border/50 bg-card/60 px-3 py-2.5 space-y-2.5"
          >
            <div>
              <p className="font-body text-[11px] uppercase tracking-wider text-muted-foreground/70">
                Profile preview
              </p>
              <p className="font-body text-[11px] text-muted-foreground/80 mt-0.5">
                Tap chips to choose what shows on your profile
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allItems.map((item) => {
                const isShown = !hiddenItems.has(item);
                return (
                  <motion.button
                    key={item}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleDisplay(item)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-body text-[12px] border transition-all ${
                      isShown
                        ? "bg-primary/10 border-primary/40 text-foreground"
                        : "bg-transparent border-dashed border-border/60 text-muted-foreground/60"
                    }`}
                  >
                    {isShown && <Check className="h-3 w-3 text-primary" />}
                    {item}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

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
            {selectedKey &&
              SUB_IDENTITIES[selectedKey].map((s) => {
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
}
