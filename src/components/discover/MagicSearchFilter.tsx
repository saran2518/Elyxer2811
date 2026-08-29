import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star,
  Calendar,
  MapPin,
  User,
  Ruler,
  Check,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// ─── Constants ──────────────────────────────────────────────────────────────
const GENDER_OPTIONS = ["Man", "Woman", "Non-binary"];

const DEFAULTS = {
  ageRange: [18, 60] as [number, number],
  distance: [0, 200] as [number, number],
  heightRange: [140, 220] as [number, number],
  gender: [] as string[],
};

const INSPIRATIONS: { quote: string; tag: string; intent?: boolean }[] = [
  { quote: "A startup founder who reads and loves indie films", tag: "CAREER · CULTURE · PERSONALITY" },
  { quote: "Someone adventurous, dog lover, early riser", tag: "LIFESTYLE · PERSONALITY" },
  { quote: "Ready to settle down, looking for something real and lasting", tag: "RELATIONSHIP INTENT", intent: true },
  { quote: "A creative soul who loves the outdoors and morning coffee", tag: "LIFESTYLE · CREATIVITY" },
  { quote: "Bookworm, tea drinker, weekend hiker", tag: "INTERESTS · LIFESTYLE" },
  { quote: "Looking for a deep, meaningful connection", tag: "RELATIONSHIP INTENT", intent: true },
  { quote: "Loves art galleries, jazz nights and slow Sundays", tag: "CULTURE · LIFESTYLE" },
  { quote: "Multilingual traveller, foodie, curious mind", tag: "LIFESTYLE · PERSONALITY" },
  { quote: "Wants a partner to build a quiet, intentional life with", tag: "RELATIONSHIP INTENT", intent: true },
  { quote: "Pilates in the morning, wine and poetry by night", tag: "LIFESTYLE · INTERESTS" },
  { quote: "Engineer by day, vinyl collector by night", tag: "CAREER · INTERESTS" },
  { quote: "Open to something casual that could grow into more", tag: "RELATIONSHIP INTENT", intent: true },
  { quote: "Trail runner, plant parent, café hopper", tag: "LIFESTYLE · INTERESTS" },
  { quote: "A curious traveller who values deep conversation", tag: "PERSONALITY · LIFESTYLE" },
  { quote: "Looking for a travel buddy first, anything else second", tag: "RELATIONSHIP INTENT", intent: true },
  { quote: "Designer who loves ceramics and ocean swims", tag: "CAREER · INTERESTS" },
  { quote: "Calm, kind, into wellness and slow living", tag: "PERSONALITY · LIFESTYLE" },
  { quote: "Open to wherever this goes — no pressure", tag: "RELATIONSHIP INTENT", intent: true },
];

// 9 pages × 2 cards — fewer per page so the screen breathes
const PAGES: typeof INSPIRATIONS[] = Array.from({ length: Math.ceil(INSPIRATIONS.length / 2) }, (_, i) =>
  INSPIRATIONS.slice(i * 2, i * 2 + 2),
);

// Blocked keyword patterns (kept from prior implementation)
const BLOCKED_PATTERNS = [
  /\b(f+u+c+k+|sh[i1]+t+|a+ss+h+o+l+e|b[i1]+t+c+h|d[i1]+c+k|c+u+n+t)\b/i,
  /\b(n[i1]+g+[e3]+r|n[i1]+g+a|ch[i1]+n+k|sp[i1]+c|k[i1]+k+e)\b/i,
  /\b(p+o+r+n|s+e+x+|n+u+d+e+s*|p+e+n+[i1]+s|v+a+g+[i1]+n+a|x+x+x+)\b/i,
  /\b(k+[i1]+l+l+|m+u+r+d+e+r|r+a+p+[e3]|s+h+o+o+t|b+o+m+b+|s+u+[i1]+c+[i1]+d+e)\b/i,
  /\b(c+o+c+a+[i1]+n+e|h+e+r+o+[i1]+n|m+e+t+h|w+e+e+d|l+s+d|m+o+l+l+y)\b/i,
];
const isBlocked = (s: string) => BLOCKED_PATTERNS.some((r) => r.test(s.trim().toLowerCase()));

// ─── Component ──────────────────────────────────────────────────────────────
interface MagicSearchFilterProps {
  children: React.ReactNode;
  onApply?: (tags: string[]) => void;
}

type Screen = "hub" | "magic";
type FilterKey = "age" | "distance" | "gender" | "height";

const MagicSearchFilter = ({ children, onApply }: MagicSearchFilterProps) => {
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>("hub");

  // Shared filter state
  const [ageRange, setAgeRange] = useState<[number, number]>([...DEFAULTS.ageRange]);
  const [distance, setDistance] = useState<[number, number]>([...DEFAULTS.distance]);
  const [heightRange, setHeightRange] = useState<[number, number]>([...DEFAULTS.heightRange]);
  const [gender, setGender] = useState<string[]>([...DEFAULTS.gender]);
  const [openToEveryone, setOpenToEveryone] = useState(true);

  // Hub UI
  const [expanded, setExpanded] = useState<FilterKey | null>(null);

  // Magic Search UI
  const [prompt, setPrompt] = useState("");
  const [page, setPage] = useState(0);
  const [pageVisible, setPageVisible] = useState(true);
  const [blockedWarn, setBlockedWarn] = useState(false);

  // ─── Derived: which filters are non-default ──────────────────────────────
  const isAgeSet = ageRange[0] !== DEFAULTS.ageRange[0] || ageRange[1] !== DEFAULTS.ageRange[1];
  const isDistSet = distance[0] !== DEFAULTS.distance[0] || distance[1] !== DEFAULTS.distance[1];
  const isHeightSet = heightRange[0] !== DEFAULTS.heightRange[0] || heightRange[1] !== DEFAULTS.heightRange[1];
  const isGenderSet = gender.length > 0;
  const anyFilter = isAgeSet || isDistSet || isHeightSet || isGenderSet;

  const handleClearAll = useCallback(() => {
    setAgeRange([...DEFAULTS.ageRange]);
    setDistance([...DEFAULTS.distance]);
    setHeightRange([...DEFAULTS.heightRange]);
    setGender([...DEFAULTS.gender]);
  }, []);

  const toggleGender = (g: string) => {
    setGender((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const handleApply = () => {
    setExpanded(null);
    const tags: string[] = [];
    if (prompt.trim()) tags.push(prompt.trim());
    if (isGenderSet) tags.push(...gender);
    onApply?.(tags);
    setOpen(false);
  };

  const goToPage = (next: number) => {
    if (next === page) return;
    setPageVisible(false);
    setTimeout(() => {
      setPage(next);
      setPageVisible(true);
    }, 180);
  };

  // Reset screen when sheet closes
  useEffect(() => {
    if (!open) {
      setScreen("hub");
      setExpanded(null);
    }
  }, [open]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col bg-background overflow-hidden"
      >
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {screen === "hub" ? (
              <motion.div
                key="hub"
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col"
              >
                <HubScreen
                  onClose={() => setOpen(false)}
                  onOpenMagic={() => setScreen("magic")}
                  ageRange={ageRange}
                  setAgeRange={setAgeRange}
                  distance={distance}
                  setDistance={setDistance}
                  heightRange={heightRange}
                  setHeightRange={setHeightRange}
                  gender={gender}
                  toggleGender={toggleGender}
                  openToEveryone={openToEveryone}
                  setOpenToEveryone={setOpenToEveryone}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  isAgeSet={isAgeSet}
                  isDistSet={isDistSet}
                  isHeightSet={isHeightSet}
                  isGenderSet={isGenderSet}
                  anyFilter={anyFilter}
                  handleClearAll={handleClearAll}
                  handleApply={handleApply}
                />
              </motion.div>
            ) : (
              <motion.div
                key="magic"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 40, opacity: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col"
              >
                <MagicScreen
                  onBack={() => setScreen("hub")}
                  prompt={prompt}
                  setPrompt={setPrompt}
                  blockedWarn={blockedWarn}
                  setBlockedWarn={setBlockedWarn}
                  page={page}
                  pageVisible={pageVisible}
                  goToPage={goToPage}
                  ageRange={ageRange}
                  distance={distance}
                  heightRange={heightRange}
                  gender={gender}
                  isAgeSet={isAgeSet}
                  isDistSet={isDistSet}
                  isHeightSet={isHeightSet}
                  isGenderSet={isGenderSet}
                  anyFilter={anyFilter}
                  handleClearAll={handleClearAll}
                  openToEveryone={openToEveryone}
                  setOpenToEveryone={setOpenToEveryone}
                  handleApply={handleApply}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MagicSearchFilter;

// ════════════════════════════════════════════════════════════════════════════
// HUB SCREEN
// ════════════════════════════════════════════════════════════════════════════
interface HubProps {
  onClose: () => void;
  onOpenMagic: () => void;
  ageRange: [number, number];
  setAgeRange: (v: [number, number]) => void;
  distance: [number, number];
  setDistance: (v: [number, number]) => void;
  heightRange: [number, number];
  setHeightRange: (v: [number, number]) => void;
  gender: string[];
  toggleGender: (g: string) => void;
  openToEveryone: boolean;
  setOpenToEveryone: (v: boolean) => void;
  expanded: FilterKey | null;
  setExpanded: (k: FilterKey | null) => void;
  isAgeSet: boolean;
  isDistSet: boolean;
  isHeightSet: boolean;
  isGenderSet: boolean;
  anyFilter: boolean;
  handleClearAll: () => void;
  handleApply: () => void;
}

const HubScreen = (p: HubProps) => {
  const toggle = (k: FilterKey) => p.setExpanded(p.expanded === k ? null : k);

  return (
    <>
      {/* Header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <button
          onClick={p.onClose}
          className="h-9 w-9 rounded-full bg-card border border-border/50 flex items-center justify-center text-foreground/70 hover:text-foreground transition-all active:scale-90"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="font-display text-[21px] text-foreground tracking-tight">Refine Discovery</h2>
        <div className="w-9" />
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-4 space-y-4">
        {/* Magic Search entry card */}
        <motion.button
          onClick={p.onOpenMagic}
          whileTap={{ scale: 0.985 }}
          aria-label="Magic Search"
          className="relative w-full text-left rounded-[22px] overflow-hidden group"
          style={{
            background: "var(--gradient-gold)",
            boxShadow: "var(--shadow-elegant)",
          }}
        >
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -top-12 -right-10 h-36 w-36 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

          <div className="relative px-5 py-4">
            {/* Top row: eyebrow */}
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span className="font-body text-[10px] uppercase tracking-[0.22em] text-white/85">
                Magic Search
              </span>
            </div>

            {/* Headline */}
            <h3 className="mt-3 font-display text-[20px] leading-[1.2] text-white">
              Find someone who aligns
              <br />
              with your <span className="italic">world.</span>
            </h3>

            {/* Search bar element */}
            <div
              className="mt-3 w-full flex items-center gap-3 rounded-full bg-background border border-white/40 px-3.5 py-2.5 shadow-sm"
              aria-hidden="true"
            >
              <Sparkles className="h-4 w-4 text-primary shrink-0" fill="currentColor" />
              <span className="flex-1 font-display italic text-[14px] text-muted-foreground/80 truncate">
                Describe your kind of person…
              </span>
              <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </motion.button>

        {/* Helper text */}
        <div className="flex items-start gap-2 px-1">
          <Sparkles className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" fill="currentColor" />
          <p className="font-body text-[12px] leading-relaxed text-muted-foreground/80">
            Pair Magic Search with the Standard Filters below for an even more refined profiles.
          </p>
        </div>

        {/* Standard Filters card */}
        <div
          className="rounded-2xl bg-card border border-border/40 overflow-hidden"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {/* Card header — editorial serif treatment */}
          <div className="px-4 pt-4 pb-2.5 flex items-end justify-between border-b border-[#C5A059]/50">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#8C8C7B] font-semibold mb-1">
                Refinement
              </span>
              <h4 className="font-display text-[22px] text-[#1C1C1A] leading-none tracking-tight">
                Standard Filters
              </h4>
            </div>
            <button
              onClick={p.handleClearAll}
              className="text-[10px] uppercase tracking-[0.15em] text-[#8C8C7B] hover:text-[#1C1C1A] transition-colors cursor-pointer pb-0.5"
            >
              Clear all
            </button>
          </div>

          {/* Show others toggle */}
          <div className="px-4 py-3.5 flex items-center justify-between border-b border-border/40">
            <div>
              <p className="font-body text-[13px] font-semibold text-foreground">Show others if I run out</p>
              <p className="font-body text-[11px] text-muted-foreground/80 mt-0.5">Relax filters when results are limited</p>
            </div>
            <Switch checked={p.openToEveryone} onCheckedChange={p.setOpenToEveryone} />
          </div>

          {/* Filter rows */}
          <FilterRow
            icon={<Calendar className="h-4 w-4" />}
            iconBg="bg-secondary"
            iconColor="text-accent"
            label="Age range"
            value={p.isAgeSet ? `${p.ageRange[0]} – ${p.ageRange[1]}` : "Any"}
            active={p.isAgeSet}
            open={p.expanded === "age"}
            onToggle={() => toggle("age")}
          >
            <SliderField
              min={18}
              max={60}
              value={p.ageRange}
              onChange={(v) => p.setAgeRange(v as [number, number])}
              format={(v) => `${v}`}
              suffix=" yrs"
            />
          </FilterRow>

          <FilterRow
            icon={<MapPin className="h-4 w-4" />}
            iconBg="bg-muted"
            iconColor="text-primary"
            label="Distance"
            value={p.isDistSet ? `${p.distance[0]} – ${p.distance[1]} km` : "Any"}
            active={p.isDistSet}
            open={p.expanded === "distance"}
            onToggle={() => toggle("distance")}
          >
            <SliderField
              min={0}
              max={200}
              value={p.distance}
              onChange={(v) => p.setDistance(v as [number, number])}
              format={(v) => `${v}`}
              suffix=" km"
            />
          </FilterRow>

          <FilterRow
            icon={<User className="h-4 w-4" />}
            iconBg="bg-secondary"
            iconColor="text-accent"
            label="Gender"
            value={p.isGenderSet ? p.gender.join(" · ") : "Any"}
            active={p.isGenderSet}
            open={p.expanded === "gender"}
            onToggle={() => toggle("gender")}
          >
            <div className="space-y-1.5 pt-1">
              {GENDER_OPTIONS.map((g) => {
                const checked = p.gender.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => p.toggleGender(g)}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted/40 transition-colors"
                  >
                    <span
                      className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                        checked
                          ? "bg-foreground border-foreground"
                          : "border-border bg-card"
                      }`}
                    >
                      {checked && <Check className="h-3 w-3 text-background" strokeWidth={3} />}
                    </span>
                    <span className="font-body text-[13px] text-foreground">{g}</span>
                  </button>
                );
              })}
            </div>
          </FilterRow>

          <FilterRow
            icon={<Ruler className="h-4 w-4" />}
            iconBg="bg-muted"
            iconColor="text-primary"
            label="Height"
            value={p.isHeightSet ? `${p.heightRange[0]} – ${p.heightRange[1]} cm` : "Any"}
            active={p.isHeightSet}
            open={p.expanded === "height"}
            onToggle={() => toggle("height")}
            isLast
          >
            <SliderField
              min={140}
              max={220}
              value={p.heightRange}
              onChange={(v) => p.setHeightRange(v as [number, number])}
              format={(v) => `${v}`}
              suffix=" cm"
            />
          </FilterRow>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="px-5 pt-3 pb-5 border-t border-border/30 bg-background/80 backdrop-blur-xl">
        <button
          onClick={p.handleApply}
          className="w-full py-4 rounded-2xl font-display text-[17px] text-primary-foreground transition-all active:scale-[0.98]"
          style={{
            background: "var(--gradient-warm)",
            boxShadow: "var(--shadow-elegant)",
          }}
        >
          Apply filters
        </button>
      </div>
    </>
  );
};

// ─── FilterRow ──────────────────────────────────────────────────────────────
interface FilterRowProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  active: boolean;
  open: boolean;
  onToggle: () => void;
  isLast?: boolean;
  children: React.ReactNode;
}

const FilterRow = ({ icon, iconBg, iconColor, label, value, active, open, onToggle, isLast, children }: FilterRowProps) => {
  return (
    <div className={isLast ? "" : "border-b border-border/40"}>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-muted/30 transition-colors"
      >
        <div className={`h-8 w-8 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <span className="flex-1 text-left font-body text-[14px] font-medium text-foreground">{label}</span>
        {active && (
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        )}
        <span className="font-body text-[12px] text-muted-foreground/80">{value}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="h-4 w-4 text-muted-foreground/60" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── SliderField (dual-handle) ──────────────────────────────────────────────
interface SliderFieldProps {
  min: number;
  max: number;
  value: number[];
  onChange: (v: number[]) => void;
  format: (v: number) => string;
  suffix?: string;
}
const SliderField = ({ min, max, value, onChange, format, suffix = "" }: SliderFieldProps) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between font-body text-[12px] text-muted-foreground">
      <span>{format(min)}{suffix}</span>
      <span className="text-foreground font-semibold">
        {format(value[0])} – {format(value[1])}{suffix}
      </span>
      <span>{format(max)}{suffix}</span>
    </div>
    <Slider min={min} max={max} step={1} value={value} onValueChange={onChange} />
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// MAGIC SEARCH SCREEN
// ════════════════════════════════════════════════════════════════════════════
interface MagicProps {
  onBack: () => void;
  prompt: string;
  setPrompt: (s: string) => void;
  blockedWarn: boolean;
  setBlockedWarn: (b: boolean) => void;
  page: number;
  pageVisible: boolean;
  goToPage: (n: number) => void;
  ageRange: [number, number];
  distance: [number, number];
  heightRange: [number, number];
  gender: string[];
  isAgeSet: boolean;
  isDistSet: boolean;
  isHeightSet: boolean;
  isGenderSet: boolean;
  anyFilter: boolean;
  handleClearAll: () => void;
  openToEveryone: boolean;
  setOpenToEveryone: (v: boolean) => void;
  handleApply: () => void;
}

const MagicScreen = (p: MagicProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(timer);
  }, []);

  const handlePromptChange = (val: string) => {
    if (isBlocked(val)) {
      p.setBlockedWarn(true);
      setTimeout(() => p.setBlockedWarn(false), 2200);
      return;
    }
    p.setPrompt(val);
  };

  return (
    <>
      {/* Warm gradient header block */}
      <div
        className="relative px-5 pt-4 pb-4 overflow-hidden"
        style={{ background: "var(--gradient-gold)" }}
      >
        {/* Decorative soft glow */}
        <div className="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex items-center justify-between">
          <button
            onClick={p.onBack}
            className="h-9 w-9 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white hover:bg-white/25 transition-all active:scale-90"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-white" fill="currentColor" />
            <h2 className="font-display text-[21px] text-primary-foreground">Magic Search</h2>
          </div>
          <span className="h-9 w-9" />
        </div>
      </div>

      {/* Input area — separated card below the header */}
      <div className="relative px-5 pt-4 z-10">
        <div
          className="relative rounded-2xl bg-card border border-border/40 overflow-hidden"
          style={{ boxShadow: "var(--shadow-elegant)" }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/10" />
          <Sparkles className="absolute top-3 right-3 h-3.5 w-3.5 text-primary/50" fill="currentColor" />

          <div className="relative px-4 pt-3.5 pb-2.5">
            <p className="text-[9px] font-body font-bold tracking-[0.2em] uppercase text-accent/80 mb-1.5">
              Describe your kind of person
            </p>
            <textarea
              ref={inputRef}
              value={p.prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              placeholder="A creative soul who loves the outdoors and morning coffee…"
              rows={2}
              maxLength={140}
              className="w-full bg-transparent resize-none outline-none font-display italic text-[15px] text-foreground placeholder:text-muted-foreground/50 leading-relaxed"
            />
            <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-border/40">
              <span className="text-[10px] font-body text-muted-foreground/70 tabular-nums">
                {p.prompt.length}<span className="text-muted-foreground/40">/140</span>
              </span>
              {p.prompt.length > 0 && (
                <button
                  onClick={() => p.setPrompt("")}
                  className="flex items-center gap-1 text-[10px] font-body font-semibold tracking-[0.12em] uppercase text-muted-foreground hover:text-accent transition-colors"
                >
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {p.blockedWarn && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-[11px] font-body text-destructive-foreground bg-destructive/85 px-3 py-1.5 rounded-lg"
            >
              That phrase is not allowed. Please rephrase respectfully.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4 space-y-5">
        {/* Search Inspirations */}
        <div>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[10px] font-body font-bold tracking-[0.18em] uppercase text-muted-foreground/70">
                Inspiration
              </p>
              <h4 className="font-display italic text-[18px] text-foreground leading-tight">
                Not sure what to say?
              </h4>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => p.goToPage((p.page - 1 + PAGES.length) % PAGES.length)}
                className="h-7 w-7 rounded-full bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/40 transition-all active:scale-90"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-center gap-1">
                {PAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => p.goToPage(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === p.page ? "w-4 bg-accent" : "w-1.5 bg-border hover:bg-muted-foreground/40"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => p.goToPage((p.page + 1) % PAGES.length)}
                className="h-7 w-7 rounded-full bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/40 transition-all active:scale-90"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <motion.div
            animate={{ opacity: p.pageVisible ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-2.5"
          >
            {PAGES[p.page].map((item, i) => {
              const selected = p.prompt === item.quote;
              return (
                <motion.button
                  key={`${p.page}-${i}`}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => p.setPrompt(item.quote)}
                  className={`relative w-full text-left rounded-2xl px-4 py-3.5 transition-all overflow-hidden ${
                    selected
                      ? "bg-gradient-to-br from-accent/10 via-card to-primary/5 border border-accent/40"
                      : "bg-card border border-border/50 hover:border-primary/30"
                  }`}
                  style={{ boxShadow: selected ? "var(--shadow-warm)" : "var(--shadow-card)" }}
                >
                  <span
                    className={`pointer-events-none absolute -top-2 -left-1 font-display italic text-[56px] leading-none select-none transition-colors ${
                      selected ? "text-accent/15" : "text-muted-foreground/10"
                    }`}
                  >
                    “
                  </span>
                  <div className="relative flex items-start gap-3 pl-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-display italic text-[14px] text-foreground leading-snug">
                        {item.quote}
                      </p>
                      <p className="mt-2 text-[9px] font-body font-bold tracking-[0.16em] uppercase text-muted-foreground/70">
                        {item.tag}
                      </p>
                    </div>
                    <div
                      className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        selected ? "text-primary-foreground" : "bg-secondary text-muted-foreground/60"
                      }`}
                      style={selected ? { background: "var(--gradient-warm)" } : undefined}
                    >
                      {selected ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <Sparkles className="h-3 w-3" />}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* Helper text */}
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="h-3 w-3 text-muted-foreground/50" />
          <p className="text-[11px] font-body text-muted-foreground/70 leading-snug">
            Pair Magic Search with the Standard Filters for an even more refined profiles.
          </p>
        </div>

        {/* Show others toggle */}
        <div
          className="rounded-2xl bg-card border border-border/40 px-4 py-3.5 flex items-center justify-between"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="pr-4">
            <p className="font-body text-[13px] font-semibold text-foreground">Show others if I run out</p>
            <p className="font-body text-[11px] text-muted-foreground/80 mt-0.5">Relax filters when results are limited</p>
          </div>
          <Switch checked={p.openToEveryone} onCheckedChange={p.setOpenToEveryone} />
        </div>

        {/* Active filters section */}
        <AnimatePresence initial={false}>
          {p.anyFilter && (
            <motion.div
              initial={{ opacity: 0, y: 6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 6, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-secondary/60 to-secondary/20 px-3.5 py-3 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-accent" fill="currentColor" />
                    <h4 className="text-[10px] font-body font-semibold tracking-[0.16em] uppercase text-muted-foreground/90">
                      Active
                    </h4>
                    <span className="h-4 min-w-[16px] px-1 rounded-full bg-accent/15 text-accent text-[9px] font-bold flex items-center justify-center">
                      {[p.isAgeSet, p.isDistSet, p.isGenderSet, p.isHeightSet].filter(Boolean).length}
                    </span>
                  </div>
                  <button
                    onClick={p.handleClearAll}
                    className="text-[10px] font-body font-semibold tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {p.isAgeSet && (
                    <FilterChip icon={<Calendar className="h-2.5 w-2.5" />} label="Age" value={`${p.ageRange[0]}–${p.ageRange[1]}`} />
                  )}
                  {p.isDistSet && (
                    <FilterChip icon={<MapPin className="h-2.5 w-2.5" />} label="Dist" value={`${p.distance[0]}–${p.distance[1]}km`} />
                  )}
                  {p.isGenderSet && (
                    <FilterChip icon={<User className="h-2.5 w-2.5" />} label="Gender" value={p.gender.join(", ")} />
                  )}
                  {p.isHeightSet && (
                    <FilterChip icon={<Ruler className="h-2.5 w-2.5" />} label="Height" value={`${p.heightRange[0]}–${p.heightRange[1]}cm`} />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky footer */}
      <div className="px-5 pt-3 pb-5 border-t border-border/30 bg-background/85 backdrop-blur-xl">
        <button
          onClick={p.handleApply}
          className="group w-full py-4 rounded-2xl font-display text-[17px] text-primary-foreground transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            background: "var(--gradient-warm)",
            boxShadow: "var(--shadow-elegant)",
          }}
        >
          <Sparkles className="h-4 w-4" fill="currentColor" />
          <span>Discover</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </>
  );
};

// ─── FilterChip (compact icon+value chip) ───────────────────────────────────
const FilterChip = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <span
    aria-label={`${label}: ${value}`}
    className="inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full bg-card/90 border border-border/60 backdrop-blur-sm shadow-sm"
  >
    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/10 text-accent">
      {icon}
    </span>
    <span className="text-[11px] font-body font-semibold text-foreground tabular-nums tracking-tight">{value}</span>
  </span>
);

// ─── Pill ───────────────────────────────────────────────────────────────────
const Pill = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-body font-semibold whitespace-nowrap text-accent border border-primary/30 bg-secondary"
  >
    {children}
  </span>
);

// ─── FrostedChip (used on gradient header) ─────────────────────────────────
const FrostedChip = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-body font-semibold whitespace-nowrap text-white border border-white/30 bg-white/15 backdrop-blur-sm"
  >
    {children}
  </span>
);
