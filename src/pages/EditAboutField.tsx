import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Check, Search, X, LocateFixed, Loader2, MapPin, Home, Lock, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import GenderIdentityEditor from "@/components/edit-profile/GenderIdentityEditor";
import { toast } from "sonner";
import {
  getAboutFields,
  setAboutField,
  type AboutFields,
} from "@/lib/editProfileStore";

// ---------- shared data ----------
const ALL_LANGUAGES = [
  "English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam",
  "Marathi", "Bengali", "Gujarati", "Punjabi", "Urdu", "Odia",
  "Assamese", "Spanish", "French", "German", "Italian", "Portuguese",
  "Mandarin", "Japanese", "Korean", "Arabic", "Russian", "Dutch",
];
const MAX_LANGS = 6;


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

const FIELD_HEADINGS: Record<string, { lead: string; accent: string; helper?: string; label: string }> = {
  datingPreference: { lead: "Who are you", accent: "interested in dating?", helper: "Select all that apply", label: "Dating Preference" },
  gender: { lead: "How do you describe", accent: "your Gender?", label: "Gender & Identity" },
  pronouns: { lead: "How do you describe", accent: "your Pronouns?", helper: "Select up to 2 pronouns", label: "Pronouns" },
  orientation: { lead: "How do you describe", accent: "your sexual orientation?", label: "Sexual Orientation" },
  datingGoals: { lead: "Your", accent: "Dating Goals", helper: "Select up to 2 that fit your dating mindset.", label: "Dating Goals" },
  education: { lead: "Your", accent: "Education", helper: "Highest level of education", label: "Education" },
  profession: { lead: "Your", accent: "Profession", label: "Profession" },
  location: { lead: "Your", accent: "Location", label: "Location" },
  height: { lead: "Your", accent: "Height", helper: "Scroll to select your height", label: "Height" },
  languages: { lead: "Your", accent: "Languages", helper: "Search and add languages", label: "Languages" },
};

const parseList = (val: string) =>
  (val ?? "").split(",").map((s) => s.trim()).filter(Boolean);

const VALID_FIELDS = Object.keys(FIELD_HEADINGS) as (keyof AboutFields)[];

export default function EditAboutField() {
  const navigate = useNavigate();
  const params = useParams<{ field: string }>();
  const field = params.field as keyof AboutFields;

  const isValid = VALID_FIELDS.includes(field);
  useEffect(() => {
    if (!isValid) navigate("/edit-profile", { replace: true });
  }, [isValid, navigate]);

  const initial = getAboutFields();
  const initialVal = isValid ? initial[field] : "";

  // Generic single-value draft (used by orientation, education, location)
  const [draftValue, setDraftValue] = useState(initialVal);

  // Gender drafts
  const [draftGender, setDraftGender] = useState(initial.gender);
  const [draftCustomGender, setDraftCustomGender] = useState("");
  const [draftDisplayGender, setDraftDisplayGender] = useState(initial.gender);

  // Profession
  const initialProfParts = (initial.profession ?? "").split(/\s*[·,|]\s*/);
  const [draftProfession, setDraftProfession] = useState(initialProfParts[0] ?? "");
  const [draftIndustry, setDraftIndustry] = useState(initialProfParts[1] ?? "");

  // Location
  const [detectStatus, setDetectStatus] = useState<"idle" | "detecting" | "success" | "error">("idle");
  const [draftHometown, setDraftHometown] = useState(initial.hometown ?? "");

  // Languages
  const [langQuery, setLangQuery] = useState("");
  const [draftLanguages, setDraftLanguages] = useState<string[]>(parseList(initial.languages));

  // Multi-selects
  const [draftPrefList, setDraftPrefList] = useState<string[]>(parseList(initial.datingPreference));
  const [draftPronounList, setDraftPronounList] = useState<string[]>(() => {
    const list = parseList(initial.pronouns);
    return list.filter((p) => PRONOUN_OPTIONS.includes(p));
  });
  const [draftOtherPronounActive, setDraftOtherPronounActive] = useState(() => {
    const list = parseList(initial.pronouns);
    return list.some((p) => !PRONOUN_OPTIONS.includes(p));
  });
  const [draftOtherPronounText, setDraftOtherPronounText] = useState(() => {
    const list = parseList(initial.pronouns);
    return list.find((p) => !PRONOUN_OPTIONS.includes(p)) ?? "";
  });
  const [draftShowPronouns, setDraftShowPronouns] = useState(true);
  const [draftShowOrientation, setDraftShowOrientation] = useState(true);
  const [draftGoalList, setDraftGoalList] = useState<string[]>(parseList(initial.datingGoals));

  // Feedback dialogs
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [thanksOpen, setThanksOpen] = useState(false);

  // Height
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [draftHeightCm, setDraftHeightCm] = useState(parseHeightToCm(initial.height));
  const heightScrollRef = useRef<HTMLDivElement>(null);

  const heightValues = useMemo(() => {
    const arr: { cm: number; label: string }[] = [];
    for (let cm = 140; cm <= 220; cm++) {
      arr.push({ cm, label: heightUnit === "cm" ? `${cm} cm` : formatFt(cm) });
    }
    return arr;
  }, [heightUnit]);

  useEffect(() => {
    if (field !== "height") return;
    const el = heightScrollRef.current;
    if (!el) return;
    const idx = heightValues.findIndex((v) => v.cm === draftHeightCm);
    if (idx >= 0) {
      requestAnimationFrame(() => el.scrollTo({ top: idx * ITEM_HEIGHT, behavior: "auto" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field, heightUnit]);

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
          const city =
            data.city ||
            data.locality ||
            data.localityInfo?.administrative?.[3]?.name ||
            "";

          if (!city) throw new Error("No location data");

          setDraftValue(city);
          setDetectStatus("success");
          toast.success("Location detected");
        } catch {
          setDetectStatus("error");
          toast.error("Couldn't look up your city. Please try again.");
        }
      },
      (err) => {
        setDetectStatus("error");
        if (err.code === err.PERMISSION_DENIED) {
          toast.error("Permission denied. Location detection is unavailable.");
        } else {
          toast.error("Couldn't get your location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
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

  const handleDone = () => {
    if (!isValid) return;
    if (field === "gender") {
      const finalGender = draftDisplayGender || draftGender;
      if (!finalGender.trim()) return toast.error("Please select an option");
      setAboutField("gender", finalGender);
    } else if (field === "datingPreference") {
      if (draftPrefList.length === 0) return toast.error("Select at least one option");
      setAboutField("datingPreference", draftPrefList.join(", "));
    } else if (field === "pronouns") {
      const finalList = draftOtherPronounActive && draftOtherPronounText.trim()
        ? [...draftPronounList, draftOtherPronounText.trim()]
        : draftPronounList;
      if (finalList.length === 0) return toast.error("Select at least one pronoun");
      setAboutField("pronouns", finalList.join(", "));
    } else if (field === "datingGoals") {
      if (draftGoalList.length === 0) return toast.error("Select at least one goal");
      setAboutField("datingGoals", draftGoalList.join(", "));
    } else if (field === "profession") {
      const role = draftProfession.trim();
      const ind = draftIndustry.trim();
      if (!role && !ind) return toast.error("This field can't be empty");
      const finalValue = role && ind ? `${role} · ${ind}` : role || ind;
      setAboutField("profession", finalValue);
    } else if (field === "languages") {
      if (draftLanguages.length === 0) return toast.error("Add at least one language");
      setAboutField("languages", draftLanguages.join(", "));
    } else if (field === "height") {
      const finalValue = heightUnit === "cm" ? `${draftHeightCm} cm` : formatFt(draftHeightCm);
      setAboutField("height", finalValue);
    } else if (field === "location") {
      if (!draftValue.trim()) return toast.error("Location is required");
      setAboutField("location", draftValue);
      setAboutField("hometown", draftHometown.trim());
    } else {
      const finalValue = draftValue;
      if (!finalValue.trim()) return toast.error("This field can't be empty");
      setAboutField(field, finalValue);
    }
    navigate(-1);
  };

  if (!isValid) return null;
  const heading = FIELD_HEADINGS[field];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 pt-3 pb-2 bg-background/80 backdrop-blur-xl">
        <div
          className="flex items-center gap-3 rounded-full border border-border/40 bg-card/70 backdrop-blur-xl px-4 py-2.5"
          style={{ boxShadow: "0 4px 24px -4px hsl(var(--foreground) / 0.06)" }}
        >
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0 rounded-full h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-display text-base font-semibold text-foreground">{heading.label}</span>
        </div>
      </header>

      <main className="flex-1 px-5 pt-4 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 max-w-sm mx-auto w-full"
        >
          <h1 className="font-display text-[24px] sm:text-[28px] font-bold text-foreground leading-[1.2]">
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
          className="max-w-sm mx-auto w-full"
        >
          {field === "datingPreference" && (
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

          {field === "gender" && (
            <GenderIdentityEditor
              selectedGender={draftGender}
              customGender={draftCustomGender}
              displayOnProfile={draftDisplayGender}
              onGenderChange={setDraftGender}
              onCustomGenderChange={setDraftCustomGender}
              onDisplayOnProfileChange={setDraftDisplayGender}
            />
          )}

          {field === "pronouns" && (
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

          {field === "orientation" && (
            <div>
              <div className="space-y-2">
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

          {field === "datingGoals" && (
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

          {field === "education" && (
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

          {field === "profession" && (
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

          {field === "location" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="font-body text-[12px] font-medium text-foreground/80 px-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter your location"
                    value={draftValue}
                    readOnly
                    className="rounded-xl border-border/60 bg-card/80 h-12 pl-11 pr-12 font-body text-[14px] placeholder:text-muted-foreground/50 focus-visible:ring-primary/30 read-only:cursor-default grayscale"
                  />
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={detectStatus === "detecting"}
                    title={detectStatus === "success" ? "Detect again" : "Use my current location"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-all disabled:opacity-60"
                  >
                    {detectStatus === "detecting" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LocateFixed className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="flex items-start gap-1.5 px-1">
                  <Lock className="h-3 w-3 text-muted-foreground/60 mt-0.5 shrink-0" />
                  <p className="font-body text-[11px] text-muted-foreground/60 leading-relaxed">
                    Only your neighbourhood is visible — exact location stays private.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-body text-[12px] font-medium text-foreground/80 px-1">
                  Hometown <span className="text-muted-foreground/60 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter your hometown"
                    value={draftHometown}
                    maxLength={60}
                    onChange={(e) => setDraftHometown(e.target.value)}
                    className="rounded-xl border-border/60 bg-card/80 h-12 pl-11 font-body text-[14px] placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
                  />
                </div>
                <div className="flex items-start gap-1.5 px-1">
                  <Eye className="h-3 w-3 text-muted-foreground/60 mt-0.5 shrink-0" />
                  <p className="font-body text-[11px] text-muted-foreground/60 leading-relaxed">
                    Visible on your profile.
                  </p>
                </div>
              </div>
            </div>
          )}

          {field === "height" && (
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

          {field === "languages" && (
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
      </main>

      {/* Sticky bottom Done bar */}
      <div
        className="fixed bottom-0 inset-x-0 z-40 border-t border-border/40 bg-background/90 backdrop-blur-xl px-4 py-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="max-w-sm mx-auto flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-12"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-xl h-12 border-0 text-primary-foreground"
            style={{ background: "var(--gradient-warm)" }}
            onClick={handleDone}
          >
            <Check className="h-4 w-4 mr-1.5" />
            Done
          </Button>
        </div>
      </div>

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
}
