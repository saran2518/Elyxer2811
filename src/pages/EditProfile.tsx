import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  User,
  MessageCircle,
  Compass,
  GraduationCap,
  Briefcase,
  MapPin,
  Ruler,
  Languages,
  ChevronRight,
  Check,
  Sparkles,
  Pencil,
  Plus,
  Search,
  X,
  LocateFixed,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { PROFILES } from "@/lib/profilesData";
import GenderIdentityEditor from "@/components/edit-profile/GenderIdentityEditor";
import { toast } from "sonner";

// Onboarding-style data
const ALL_LANGUAGES = [
  "English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam",
  "Marathi", "Bengali", "Gujarati", "Punjabi", "Urdu", "Odia",
  "Assamese", "Spanish", "French", "German", "Italian", "Portuguese",
  "Mandarin", "Japanese", "Korean", "Arabic", "Russian", "Dutch",
];
const MAX_LANGS = 6;

const SUGGESTED_LOCATIONS = [
  "Bengaluru Urban", "Mumbai", "Delhi NCR", "Hyderabad",
  "Chennai", "Pune", "Kolkata", "Ahmedabad",
];

const ITEM_HEIGHT = 44;
type HeightUnit = "ft" | "cm";

const formatFt = (cm: number) => {
  const totalInches = cm / 2.54;
  const ft = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - ft * 12);
  if (inches === 12) return `${ft + 1}' 0"`;
  return `${ft}' ${inches}"`;
};

const parseHeightToCm = (val: string): number => {
  if (!val) return 170;
  const cmMatch = val.match(/(\d+)\s*cm/i);
  if (cmMatch) return parseInt(cmMatch[1], 10);
  const ftMatch = val.match(/(\d+)\s*[''’]\s*(\d+)?/);
  if (ftMatch) {
    const ft = parseInt(ftMatch[1], 10);
    const inches = ftMatch[2] ? parseInt(ftMatch[2], 10) : 0;
    return Math.round((ft * 12 + inches) * 2.54);
  }
  const num = parseInt(val, 10);
  return Number.isFinite(num) && num > 80 ? num : 170;
};

interface EditableField {
  key: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  placeholder: string;
}

// Onboarding-style option sets
const DATING_PREFERENCE_OPTIONS = ["Men", "Women", "Non-binary", "Open to all"];
const PRONOUN_OPTIONS = ["She/Her", "He/Him", "They/Them", "Co/Co", "Ze/Zir", "Xe/Xim", "Ey/Em", "Ve/Ver", "Per/Per"];
const ORIENTATION_OPTIONS = [
  "Straight (Heterosexual)", "Gay", "Lesbian", "Bisexual", "Pansexual",
  "Asexual", "Queer", "Demisexual", "Questioning", "Prefer not to say",
];
const DATING_GOAL_OPTIONS = [
  { title: "Meaningful Connection", subtitle: "Trust, depth & commitment" },
  { title: "Keeping it Light", subtitle: "Fun, ease & smiles" },
  { title: "Travel Buddy", subtitle: "Journeys, stories & sunsets" },
  { title: "Shared Experiences", subtitle: "Moments, memories & laughter" },
  { title: "Discovery Mode", subtitle: "Curiosity, openness & flow" },
];
const EDUCATION_OPTIONS = [
  "High School", "Undergraduate", "Postgraduate", "Doctorate/PhD", "Studying", "Prefer not to say",
];

// Per-field onboarding-style heading
const FIELD_HEADINGS: Record<string, { lead: string; accent: string; helper?: string }> = {
  datingPreference: { lead: "Who are you", accent: "interested in dating?", helper: "Select all that apply" },
  gender: { lead: "How do you describe", accent: "your Gender?" },
  pronouns: { lead: "How do you describe", accent: "your Pronouns?", helper: "Select up to 2 pronouns" },
  orientation: { lead: "How do you describe", accent: "your sexual orientation?" },
  datingGoals: { lead: "Your", accent: "Dating Goals", helper: "Select up to 2 that fit your dating mindset." },
  education: { lead: "Your", accent: "Education", helper: "Highest level of education" },
  profession: { lead: "Your", accent: "Profession" },
  location: { lead: "Your", accent: "Location", helper: "We'll detect your city automatically. Your exact address stays private." },
  height: { lead: "Your", accent: "Height", helper: "Scroll to select your height" },
  languages: { lead: "Your", accent: "Languages", helper: "Search and add languages" },
};


const EditProfile = () => {
  const navigate = useNavigate();
  const template = PROFILES[0];

  const [fields, setFields] = useState({
    datingPreference: "Women",
    gender: template.about.gender,
    pronouns: template.about.pronouns,
    orientation: template.about.orientation,
    datingGoals: template.relationshipIntent?.[0] ?? "Long-term relationship",
    education: template.about.education,
    profession: template.profession,
    location: template.location,
    height: template.about.height,
    languages: template.languages?.join(", ") ?? "English",
  });

  const [editTarget, setEditTarget] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState("");

  // Gender identity state
  const [draftGender, setDraftGender] = useState(fields.gender);
  const [draftCustomGender, setDraftCustomGender] = useState("");
  const [draftDisplayGender, setDraftDisplayGender] = useState(fields.gender);

  // Profession draft (industry + role)
  const [draftIndustry, setDraftIndustry] = useState("");
  const [draftProfession, setDraftProfession] = useState("");

  // Location draft (with detect)
  const [showLocSuggestions, setShowLocSuggestions] = useState(false);
  const [detectStatus, setDetectStatus] = useState<"idle" | "detecting" | "success" | "error">("idle");

  // Languages draft
  const [langQuery, setLangQuery] = useState("");
  const [draftLanguages, setDraftLanguages] = useState<string[]>([]);

  // Multi-select drafts (onboarding parity)
  const [draftPrefList, setDraftPrefList] = useState<string[]>([]);
  const [draftPronounList, setDraftPronounList] = useState<string[]>([]);
  const [draftOtherPronounActive, setDraftOtherPronounActive] = useState(false);
  const [draftOtherPronounText, setDraftOtherPronounText] = useState("");
  const [draftShowPronouns, setDraftShowPronouns] = useState(true);
  const [draftShowOrientation, setDraftShowOrientation] = useState(true);
  const [draftGoalList, setDraftGoalList] = useState<string[]>([]);

  // Orientation feedback dialog
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [thanksOpen, setThanksOpen] = useState(false);

  // Height draft
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [draftHeightCm, setDraftHeightCm] = useState(170);
  const heightScrollRef = useRef<HTMLDivElement>(null);

  const heightValues = useMemo(() => {
    const arr: { cm: number; label: string }[] = [];
    for (let cm = 140; cm <= 220; cm++) {
      arr.push({ cm, label: heightUnit === "cm" ? `${cm} cm` : formatFt(cm) });
    }
    return arr;
  }, [heightUnit]);

  useEffect(() => {
    if (editTarget !== "height") return;
    const el = heightScrollRef.current;
    if (!el) return;
    const idx = heightValues.findIndex((v) => v.cm === draftHeightCm);
    if (idx >= 0) {
      requestAnimationFrame(() => el.scrollTo({ top: idx * ITEM_HEIGHT, behavior: "auto" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTarget, heightUnit]);

  const handleHeightScroll = () => {
    const el = heightScrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
    const v = heightValues[Math.min(Math.max(idx, 0), heightValues.length - 1)];
    if (v && v.cm !== draftHeightCm) setDraftHeightCm(v.cm);
  };

  const langSuggestions = useMemo(() => {
    const q = langQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_LANGUAGES.filter(
      (l) => l.toLowerCase().includes(q) && !draftLanguages.includes(l),
    ).slice(0, 6);
  }, [langQuery, draftLanguages]);

  const addLanguage = (l: string) => {
    if (draftLanguages.length >= MAX_LANGS || draftLanguages.includes(l)) return;
    setDraftLanguages([...draftLanguages, l]);
    setLangQuery("");
  };
  const removeLanguage = (l: string) => setDraftLanguages(draftLanguages.filter((x) => x !== l));

  const detectLocation = () => {
    if (!("geolocation" in navigator)) {
      setDetectStatus("error");
      toast.error("Geolocation isn't supported on this device");
      return;
    }
    setDetectStatus("detecting");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
          );
          const data = await res.json();
          const primary = data.city || data.locality || data.principalSubdivision || "";
          const state = data.principalSubdivision || "";
          const choice = primary && state && primary !== state ? `${primary}, ${state}` : primary || state;
          if (!choice) throw new Error("No location");
          setDraftValue(choice);
          setDetectStatus("success");
          setShowLocSuggestions(false);
          toast.success("Location detected");
        } catch {
          setDetectStatus("error");
          toast.error("Couldn't look up your city. Please type it in.");
        }
      },
      (err) => {
        setDetectStatus("error");
        if (err.code === err.PERMISSION_DENIED) {
          toast.error("Permission denied. You can type your location instead.");
        } else {
          toast.error("Couldn't get your location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const fieldConfig: EditableField[] = [
    { key: "datingPreference", label: "Dating Preference", icon: <Heart className="h-4.5 w-4.5 text-primary" />, value: fields.datingPreference, placeholder: "e.g. Women, Men, Everyone" },
    { key: "gender", label: "Gender & Identity", icon: <User className="h-4.5 w-4.5 text-primary" />, value: fields.gender, placeholder: "e.g. Female, Male, Non-binary" },
    { key: "pronouns", label: "Pronouns", icon: <MessageCircle className="h-4.5 w-4.5 text-primary" />, value: fields.pronouns, placeholder: "e.g. She/Her, He/Him, They/Them" },
    { key: "orientation", label: "Sexual Orientation", icon: <Compass className="h-4.5 w-4.5 text-primary" />, value: fields.orientation, placeholder: "e.g. Straight, Gay, Bisexual" },
    { key: "datingGoals", label: "Dating Goals", icon: <Heart className="h-4.5 w-4.5 text-primary" />, value: fields.datingGoals, placeholder: "e.g. Long-term, Casual, Figuring it out" },
    { key: "education", label: "Education", icon: <GraduationCap className="h-4.5 w-4.5 text-primary" />, value: fields.education, placeholder: "e.g. Master's, Bachelor's" },
    { key: "profession", label: "Profession", icon: <Briefcase className="h-4.5 w-4.5 text-primary" />, value: fields.profession, placeholder: "e.g. Software Engineer" },
    { key: "location", label: "Location", icon: <MapPin className="h-4.5 w-4.5 text-primary" />, value: fields.location, placeholder: "e.g. Mumbai, India" },
    { key: "height", label: "Height", icon: <Ruler className="h-4.5 w-4.5 text-primary" />, value: fields.height, placeholder: "e.g. 5'6\"" },
    { key: "languages", label: "Languages", icon: <Languages className="h-4.5 w-4.5 text-primary" />, value: fields.languages, placeholder: "e.g. English, Hindi, Tamil" },
  ];

  const parseList = (val: string) =>
    (val ?? "").split(",").map((s) => s.trim()).filter(Boolean);

  const openEdit = (key: string) => {
    setEditTarget(key);
    const val = fields[key as keyof typeof fields];
    setDraftValue(val);
    if (key === "gender") {
      setDraftGender(fields.gender);
      setDraftDisplayGender(fields.gender);
      setDraftCustomGender("");
    }
    if (key === "datingPreference") {
      setDraftPrefList(parseList(val));
    }
    if (key === "pronouns") {
      const list = parseList(val);
      const known = list.filter((p) => PRONOUN_OPTIONS.includes(p));
      const other = list.find((p) => !PRONOUN_OPTIONS.includes(p));
      setDraftPronounList(known);
      setDraftOtherPronounActive(!!other);
      setDraftOtherPronounText(other ?? "");
      setDraftShowPronouns(true);
    }
    if (key === "orientation") {
      setDraftShowOrientation(true);
    }
    if (key === "datingGoals") {
      setDraftGoalList(parseList(val));
    }
    if (key === "profession") {
      // Try splitting "Role · Industry" or "Role, Industry"
      const parts = val.split(/\s*[·,|]\s*/);
      setDraftProfession(parts[0] ?? "");
      setDraftIndustry(parts[1] ?? "");
    }
    if (key === "location") {
      setShowLocSuggestions(false);
      setDetectStatus("idle");
    }
    if (key === "languages") {
      setLangQuery("");
      setDraftLanguages(parseList(val));
    }
    if (key === "height") {
      setDraftHeightCm(parseHeightToCm(val));
    }
  };

  const togglePref = (opt: string) => {
    setDraftPrefList((prev) => {
      if (opt === "Open to all") {
        return prev.includes(opt) ? [] : ["Open to all"];
      }
      const without = prev.filter((x) => x !== "Open to all");
      return without.includes(opt) ? without.filter((x) => x !== opt) : [...without, opt];
    });
  };

  const togglePronoun = (p: string) => {
    setDraftPronounList((prev) => {
      if (prev.includes(p)) return prev.filter((x) => x !== p);
      const cap = draftOtherPronounActive ? 1 : 2;
      if (prev.length >= cap) return prev;
      return [...prev, p];
    });
  };

  const toggleOtherPronoun = () => {
    if (draftOtherPronounActive) {
      setDraftOtherPronounActive(false);
      setDraftOtherPronounText("");
    } else if (draftPronounList.length < 2) {
      setDraftOtherPronounActive(true);
    }
  };

  const toggleGoal = (title: string) => {
    setDraftGoalList((prev) => {
      if (prev.includes(title)) return prev.filter((x) => x !== title);
      if (prev.length >= 2) return prev;
      return [...prev, title];
    });
  };

  const submitFeedback = () => {
    if (!feedbackText.trim()) return;
    setFeedbackOpen(false);
    setFeedbackText("");
    setThanksOpen(true);
  };

  const saveEdit = () => {
    if (!editTarget) return;
    if (editTarget === "gender") {
      const finalGender = draftDisplayGender || draftGender;
      if (!finalGender.trim()) {
        toast.error("Please select an option");
        return;
      }
      setFields((prev) => ({ ...prev, gender: finalGender }));
    } else if (editTarget === "datingPreference") {
      if (draftPrefList.length === 0) {
        toast.error("Select at least one option");
        return;
      }
      setFields((prev) => ({ ...prev, datingPreference: draftPrefList.join(", ") }));
    } else if (editTarget === "pronouns") {
      const finalList = draftOtherPronounActive && draftOtherPronounText.trim()
        ? [...draftPronounList, draftOtherPronounText.trim()]
        : draftPronounList;
      if (finalList.length === 0) {
        toast.error("Select at least one pronoun");
        return;
      }
      setFields((prev) => ({ ...prev, pronouns: finalList.join(", ") }));
    } else if (editTarget === "datingGoals") {
      if (draftGoalList.length === 0) {
        toast.error("Select at least one goal");
        return;
      }
      setFields((prev) => ({ ...prev, datingGoals: draftGoalList.join(", ") }));
    } else if (editTarget === "profession") {
      const role = draftProfession.trim();
      const ind = draftIndustry.trim();
      if (!role && !ind) {
        toast.error("This field can't be empty");
        return;
      }
      const finalValue = role && ind ? `${role} · ${ind}` : role || ind;
      setFields((prev) => ({ ...prev, profession: finalValue }));
    } else if (editTarget === "languages") {
      if (draftLanguages.length === 0) {
        toast.error("Add at least one language");
        return;
      }
      setFields((prev) => ({ ...prev, languages: draftLanguages.join(", ") }));
    } else if (editTarget === "height") {
      const finalValue = heightUnit === "cm" ? `${draftHeightCm} cm` : formatFt(draftHeightCm);
      setFields((prev) => ({ ...prev, height: finalValue }));
    } else {
      const finalValue = draftValue;
      if (!finalValue.trim()) {
        toast.error("This field can't be empty");
        return;
      }
      setFields((prev) => ({ ...prev, [editTarget]: finalValue }));
    }
    toast.success("Saved");
    setEditTarget(null);
  };

  const currentField = fieldConfig.find((f) => f.key === editTarget);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 pt-3 pb-2">
        <div
          className="flex items-center gap-3 rounded-full border border-border/40 bg-card/70 backdrop-blur-xl px-4 py-2.5"
          style={{ boxShadow: "0 4px 24px -4px hsl(var(--foreground) / 0.06)" }}
        >
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0 rounded-full h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-display text-base font-semibold text-foreground">Edit Profile</span>
        </div>
      </header>

      <main className="flex-1 px-4 pb-8 mt-2 space-y-5">
        {/* Profile Studio Section */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">Profile Studio</h2>
          <div className="rounded-2xl border border-border/30 bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate("/edit-current-profile")}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left hover:bg-muted/30 active:bg-muted/50 transition-colors border-b border-border/20"
            >
              <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                <Pencil className="h-4.5 w-4.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Edit Current Profile</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
              onClick={() => navigate("/profile-studio-intro")}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left hover:bg-muted/30 active:bg-muted/50 transition-colors"
            >
              <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Create New Profile</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
            </motion.button>
          </div>
        </div>

        {/* About You Section */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">About You</h2>
          <div className="rounded-2xl border border-border/30 bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
            {fieldConfig.map((field, index) => (
              <motion.button
                key={field.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => openEdit(field.key)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left hover:bg-muted/30 active:bg-muted/50 transition-colors ${
                  index < fieldConfig.length - 1 ? "border-b border-border/20" : ""
                }`}
              >
                <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                  {field.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{field.label}</p>
                  <p className="text-sm font-medium text-foreground truncate">{field.value || "Not set"}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
              </motion.button>
            ))}
          </div>
        </div>
      </main>

      {/* Edit Sheet — onboarding-style content */}
      <Sheet open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[88vh] overflow-y-auto">
          {/* a11y-only title; visible heading rendered below */}
          <SheetHeader className="sr-only">
            <SheetTitle>{currentField?.label}</SheetTitle>
          </SheetHeader>

          {editTarget && (() => {
            const heading = FIELD_HEADINGS[editTarget];
            return (
              <div className="pt-1 pb-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mb-5"
                >
                  <h1 className="font-display text-[24px] sm:text-[26px] font-bold text-foreground leading-[1.2]">
                    {heading.lead}
                    <br />
                    <span className="text-primary italic">{heading.accent}</span>
                  </h1>
                  {heading.helper && (
                    <p className="font-body text-[13px] text-muted-foreground/80 mt-3">
                      {heading.helper}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.08 }}
                >
                  {editTarget === "datingPreference" && (
                    <div className="space-y-2.5">
                      {DATING_PREFERENCE_OPTIONS.map((opt) => {
                        const isOn = draftPrefList.includes(opt);
                        return (
                          <button
                            key={opt}
                            onClick={() => togglePref(opt)}
                            className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3.5 font-body text-[14px] transition-all ${
                              isOn
                                ? "border-primary bg-primary/5 text-foreground shadow-sm"
                                : "border-border/60 bg-card/80 text-foreground hover:border-border"
                            }`}
                            style={isOn ? { boxShadow: "0 4px 14px -4px hsl(32 70% 36% / 0.25)" } : undefined}
                          >
                            <span className="font-medium">{opt}</span>
                            <span className={`h-5 w-5 rounded-md border-2 flex items-center justify-center ${isOn ? "border-primary bg-primary" : "border-border"}`}>
                              {isOn && <Check className="h-3 w-3 text-primary-foreground" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {editTarget === "gender" && (
                    <GenderIdentityEditor
                      selectedGender={draftGender}
                      customGender={draftCustomGender}
                      displayOnProfile={draftDisplayGender}
                      onGenderChange={setDraftGender}
                      onCustomGenderChange={setDraftCustomGender}
                      onDisplayOnProfileChange={setDraftDisplayGender}
                    />
                  )}

                  {editTarget === "pronouns" && (
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {PRONOUN_OPTIONS.map((p) => {
                          const isOn = draftPronounList.includes(p);
                          const cap = draftOtherPronounActive ? 1 : 2;
                          const disabled = !isOn && draftPronounList.length >= cap;
                          return (
                            <button
                              key={p}
                              onClick={() => togglePronoun(p)}
                              disabled={disabled}
                              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-body text-[13px] border transition-all ${
                                isOn
                                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                                  : disabled
                                  ? "bg-card/40 border-border/40 text-muted-foreground/50 cursor-not-allowed"
                                  : "bg-card border-border/60 text-foreground hover:border-primary/40"
                              }`}
                              style={isOn ? { boxShadow: "0 4px 14px -4px hsl(32 70% 36% / 0.3)" } : undefined}
                            >
                              {isOn && <Check className="h-3 w-3" />}
                              {p}
                            </button>
                          );
                        })}
                        <button
                          onClick={toggleOtherPronoun}
                          disabled={!draftOtherPronounActive && draftPronounList.length >= 2}
                          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-body text-[13px] border transition-all ${
                            draftOtherPronounActive
                              ? "bg-primary text-primary-foreground border-primary"
                              : draftPronounList.length >= 2
                              ? "bg-card/40 border-border/40 text-muted-foreground/50 cursor-not-allowed"
                              : "bg-card border-border/60 text-foreground hover:border-primary/40"
                          }`}
                        >
                          {draftOtherPronounActive && <Check className="h-3 w-3" />}
                          Other (self-describe)
                        </button>
                      </div>

                      {draftOtherPronounActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4"
                        >
                          <Input
                            placeholder="Describe your pronouns"
                            value={draftOtherPronounText}
                            onChange={(e) => setDraftOtherPronounText(e.target.value)}
                            maxLength={30}
                            className="rounded-xl border-border/60 bg-card/80 font-body text-[14px] h-11 px-4"
                          />
                        </motion.div>
                      )}

                      <div className="flex items-center gap-3 mt-5">
                        <Checkbox
                          id="show-pronouns-edit"
                          checked={draftShowPronouns}
                          onCheckedChange={(c) => setDraftShowPronouns(c === true)}
                          className="h-5 w-5 rounded border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label
                          htmlFor="show-pronouns-edit"
                          className="font-body text-[14px] font-semibold text-foreground cursor-pointer"
                        >
                          Show on your profile
                        </label>
                      </div>
                    </div>
                  )}

                  {editTarget === "orientation" && (
                    <div>
                      <div className="space-y-2 max-h-[44vh] overflow-y-auto pr-1">
                        {ORIENTATION_OPTIONS.map((o) => {
                          const isOn = draftValue === o;
                          return (
                            <button
                              key={o}
                              onClick={() => setDraftValue(o)}
                              className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3.5 font-body text-[14px] transition-all ${
                                isOn
                                  ? "border-primary bg-primary/5 text-foreground shadow-sm"
                                  : "border-border/60 bg-card/80 text-foreground hover:border-border"
                              }`}
                              style={isOn ? { boxShadow: "0 4px 14px -4px hsl(32 70% 36% / 0.25)" } : undefined}
                            >
                              <span className="font-medium">{o}</span>
                              <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${isOn ? "border-primary bg-primary" : "border-border"}`}>
                                {isOn && <span className="h-2 w-2 rounded-full bg-primary-foreground" />}
                              </span>
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setFeedbackOpen(true)}
                          className="w-full text-center font-body text-[12px] text-muted-foreground/80 pt-2 hover:text-primary transition-colors"
                        >
                          Are we missing something?{" "}
                          <span className="text-primary underline-offset-2 hover:underline">Let us know</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mt-5">
                        <Checkbox
                          id="show-orientation-edit"
                          checked={draftShowOrientation}
                          onCheckedChange={(c) => setDraftShowOrientation(c === true)}
                          className="h-5 w-5 rounded border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label
                          htmlFor="show-orientation-edit"
                          className="font-body text-[14px] font-semibold text-foreground cursor-pointer"
                        >
                          Show on your profile
                        </label>
                      </div>
                    </div>
                  )}

                  {editTarget === "datingGoals" && (
                    <div className="space-y-2.5">
                      {DATING_GOAL_OPTIONS.map((g) => {
                        const isOn = draftGoalList.includes(g.title);
                        const disabled = !isOn && draftGoalList.length >= 2;
                        return (
                          <button
                            key={g.title}
                            onClick={() => toggleGoal(g.title)}
                            disabled={disabled}
                            className={`w-full flex items-center justify-between rounded-2xl border-2 px-4 py-3.5 text-left transition-all ${
                              isOn
                                ? "border-primary text-primary-foreground shadow-md"
                                : disabled
                                ? "border-border/40 bg-card/40 text-muted-foreground/60 cursor-not-allowed"
                                : "border-border/60 bg-card/80 text-foreground hover:border-border"
                            }`}
                            style={isOn ? { background: "var(--gradient-warm)", boxShadow: "0 6px 20px -4px hsl(32 70% 36% / 0.35)" } : undefined}
                          >
                            <div className="flex-1 min-w-0">
                              <p className={`font-body text-[14px] font-semibold ${isOn ? "text-primary-foreground" : ""}`}>
                                {g.title}
                              </p>
                              <p className={`font-body text-[12px] mt-0.5 ${isOn ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
                                {g.subtitle}
                              </p>
                            </div>
                            <span
                              className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 ml-3 ${
                                isOn ? "border-primary-foreground bg-primary-foreground/20" : "border-border"
                              }`}
                            >
                              {isOn && <Check className="h-3 w-3 text-primary-foreground" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}


                  {editTarget === "education" && (
                    <div className="space-y-2.5">
                      {EDUCATION_OPTIONS.map((level) => {
                        const isOn = draftValue === level;
                        return (
                          <button
                            key={level}
                            onClick={() => setDraftValue(level)}
                            className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3.5 font-body text-[14px] transition-all ${
                              isOn
                                ? "border-primary bg-primary/5 text-foreground shadow-sm"
                                : "border-border/60 bg-card/80 text-foreground hover:border-border"
                            }`}
                            style={isOn ? { boxShadow: "0 4px 14px -4px hsl(32 70% 36% / 0.25)" } : undefined}
                          >
                            <span className="font-medium">{level}</span>
                            <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${isOn ? "border-primary bg-primary" : "border-border"}`}>
                              {isOn && <span className="h-2 w-2 rounded-full bg-primary-foreground" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {editTarget === "profession" && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="font-body text-[14px] font-semibold text-foreground">
                          Your industry
                        </label>
                        <Input
                          placeholder="e.g., Technology, Healthcare, Arts, Finance"
                          value={draftIndustry}
                          onChange={(e) => setDraftIndustry(e.target.value)}
                          className="rounded-xl border-border/60 bg-card/80 h-12 font-body text-[14px] placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-body text-[14px] font-semibold text-foreground">
                          What do you do?
                        </label>
                        <Input
                          placeholder="e.g., Product Designer, Teacher, Entrepreneur..."
                          value={draftProfession}
                          onChange={(e) => setDraftProfession(e.target.value)}
                          className="rounded-xl border-border/60 bg-card/80 h-12 font-body text-[14px] placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
                        />
                      </div>
                    </div>
                  )}

                  {editTarget === "location" && (
                    <div className="relative">
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter your location"
                          value={draftValue}
                          onChange={(e) => {
                            setDraftValue(e.target.value);
                            setShowLocSuggestions(e.target.value.length === 0);
                          }}
                          onFocus={() => setShowLocSuggestions(draftValue.length === 0)}
                          onBlur={() => setTimeout(() => setShowLocSuggestions(false), 200)}
                          className="rounded-xl border-border/60 bg-card/80 h-12 pl-11 pr-12 font-body text-[14px] placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
                        />
                        <button
                          type="button"
                          onClick={detectLocation}
                          disabled={detectStatus === "detecting"}
                          title="Use my current location"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-all disabled:opacity-60"
                        >
                          {detectStatus === "detecting" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <LocateFixed className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {showLocSuggestions && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-3 space-y-1"
                        >
                          <p className="font-body text-[11px] text-muted-foreground/60 px-1">
                            Suggested locations
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {SUGGESTED_LOCATIONS.map((loc) => (
                              <button
                                key={loc}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  setDraftValue(loc);
                                  setShowLocSuggestions(false);
                                }}
                                className="rounded-full border border-border/60 bg-card/80 px-3 py-1.5 font-body text-[12px] text-foreground hover:border-primary hover:bg-primary/5 transition-all"
                              >
                                {loc}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {editTarget === "height" && (
                    <div>
                      <div className="inline-flex p-1 rounded-full border border-border/60 bg-card/80">
                        {(["ft", "cm"] as HeightUnit[]).map((u) => (
                          <button
                            key={u}
                            onClick={() => setHeightUnit(u)}
                            className={`px-5 py-1.5 rounded-full font-body text-[12px] font-semibold uppercase tracking-wide transition-all ${
                              heightUnit === u ? "text-primary-foreground" : "text-muted-foreground"
                            }`}
                            style={heightUnit === u ? { background: "var(--gradient-warm)" } : undefined}
                          >
                            {u}
                          </button>
                        ))}
                      </div>

                      <div className="relative mt-5 h-[220px] rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
                        <div
                          className="pointer-events-none absolute left-4 right-4 top-1/2 -translate-y-1/2 rounded-xl border-2 z-10"
                          style={{
                            height: ITEM_HEIGHT,
                            borderColor: "hsl(var(--primary))",
                            boxShadow: "0 0 0 4px hsl(32 70% 36% / 0.08)",
                          }}
                        />
                        <div
                          ref={heightScrollRef}
                          onScroll={handleHeightScroll}
                          className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
                          style={{
                            paddingTop: 220 / 2 - ITEM_HEIGHT / 2,
                            paddingBottom: 220 / 2 - ITEM_HEIGHT / 2,
                            scrollbarWidth: "none",
                          }}
                        >
                          {heightValues.map((v) => {
                            const isOn = v.cm === draftHeightCm;
                            return (
                              <div
                                key={v.cm}
                                className={`snap-center flex items-center justify-center font-display transition-all ${
                                  isOn ? "text-primary font-bold text-[20px]" : "text-muted-foreground/60 text-[18px]"
                                }`}
                                style={{ height: ITEM_HEIGHT }}
                              >
                                {v.label}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {editTarget === "languages" && (
                    <div>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Start Typing"
                          value={langQuery}
                          onChange={(e) => setLangQuery(e.target.value)}
                          disabled={draftLanguages.length >= MAX_LANGS}
                          className="rounded-xl border-border/60 bg-card/80 h-12 pl-11 pr-4 font-body text-[14px] placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
                        />
                      </div>
                      <p className="font-body text-[11px] text-muted-foreground/70 mt-2 px-1">
                        You can add up to {MAX_LANGS} languages. ({draftLanguages.length}/{MAX_LANGS})
                      </p>

                      {langSuggestions.length > 0 && (
                        <div className="mt-2 rounded-xl border border-border/60 bg-card/95 overflow-hidden">
                          {langSuggestions.map((l) => (
                            <button
                              key={l}
                              onClick={() => addLanguage(l)}
                              className="w-full text-left px-4 py-2.5 font-body text-[13px] text-foreground hover:bg-primary/5 transition-colors"
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      )}

                      {draftLanguages.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {draftLanguages.map((l) => (
                            <span
                              key={l}
                              className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 pl-3 pr-1 py-1 font-body text-[12px] text-foreground"
                            >
                              {l}
                              <button
                                onClick={() => removeLanguage(l)}
                                className="h-5 w-5 rounded-full flex items-center justify-center hover:bg-primary/20"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            );
          })()}

          <SheetFooter className="flex-row gap-3 pt-4">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-xl border-0 text-primary-foreground"
              style={{ background: "var(--gradient-warm)" }}
              onClick={saveEdit}
            >
              <Check className="h-4 w-4 mr-1.5" />
              Save
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Orientation feedback dialog */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="rounded-3xl max-w-[360px]">
          <DialogHeader>
            <DialogTitle className="font-display text-[20px]">Share your feedback</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Add your Thoughts..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="rounded-xl border-border/60 bg-card/80 min-h-[120px] font-body text-[14px]"
          />
          <DialogFooter className="flex flex-row gap-2 sm:gap-2">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setFeedbackOpen(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-xl border-0 text-primary-foreground"
              style={{ background: "var(--gradient-warm)" }}
              onClick={submitFeedback}
              disabled={!feedbackText.trim()}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Thank you dialog */}
      <Dialog open={thanksOpen} onOpenChange={setThanksOpen}>
        <DialogContent className="rounded-3xl max-w-[340px]">
          <DialogHeader>
            <div
              className="mx-auto h-14 w-14 rounded-full flex items-center justify-center mb-2"
              style={{ background: "var(--gradient-warm)" }}
            >
              <CheckCircle2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <DialogTitle className="font-display text-[20px] text-center">Thank you</DialogTitle>
          </DialogHeader>
          <p className="font-body text-[13px] text-muted-foreground text-center pb-2">
            Your feedback helps us improve Elyxer.
          </p>
          <Button
            className="w-full rounded-xl border-0 text-primary-foreground"
            style={{ background: "var(--gradient-warm)" }}
            onClick={() => setThanksOpen(false)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfile;
