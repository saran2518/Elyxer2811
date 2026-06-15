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
const DATING_PREFERENCE_OPTIONS = ["Men", "Women", "Non-Binary", "Everyone"];
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
  { title: "Long-term relationship", subtitle: "Building something lasting" },
];
const EDUCATION_OPTIONS = [
  "High School", "Undergraduate", "Postgraduate", "Doctorate/PhD", "Studying", "Prefer not to say",
];

// Per-field onboarding-style heading
const FIELD_HEADINGS: Record<string, { lead: string; accent: string; helper?: string }> = {
  datingPreference: { lead: "Who are you", accent: "interested in dating?", helper: "Pick the option that fits best" },
  gender: { lead: "How do you describe", accent: "your Gender?" },
  pronouns: { lead: "How do you describe", accent: "your Pronouns?", helper: "Choose the set that fits you" },
  orientation: { lead: "How do you describe", accent: "your sexual orientation?" },
  datingGoals: { lead: "Your", accent: "Dating Goals", helper: "Pick the mindset that fits you" },
  education: { lead: "Your", accent: "Education", helper: "Highest level of education" },
  profession: { lead: "Your", accent: "Profession", helper: "What you do, day to day" },
  location: { lead: "Your", accent: "Location", helper: "City or area you call home" },
  height: { lead: "Your", accent: "Height", helper: "How tall are you?" },
  languages: { lead: "Your", accent: "Languages", helper: "Languages you speak (comma-separated)" },
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

  const openEdit = (key: string) => {
    setEditTarget(key);
    const val = fields[key as keyof typeof fields];
    setDraftValue(val);
    if (key === "gender") {
      setDraftGender(fields.gender);
      setDraftDisplayGender(fields.gender);
      setDraftCustomGender("");
    }
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
                        const isOn = draftValue === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => setDraftValue(opt)}
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
                    <div className="flex flex-wrap gap-2">
                      {PRONOUN_OPTIONS.map((p) => {
                        const isOn = draftValue === p;
                        return (
                          <button
                            key={p}
                            onClick={() => setDraftValue(p)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-body text-[13px] border transition-all ${
                              isOn
                                ? "bg-primary text-primary-foreground border-primary shadow-md"
                                : "bg-card border-border/60 text-foreground hover:border-primary/40"
                            }`}
                            style={isOn ? { boxShadow: "0 4px 14px -4px hsl(32 70% 36% / 0.3)" } : undefined}
                          >
                            {isOn && <Check className="h-3 w-3" />}
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {editTarget === "orientation" && (
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
                    </div>
                  )}

                  {editTarget === "datingGoals" && (
                    <div className="space-y-2.5">
                      {DATING_GOAL_OPTIONS.map((g) => {
                        const isOn = draftValue === g.title;
                        return (
                          <button
                            key={g.title}
                            onClick={() => setDraftValue(g.title)}
                            className={`w-full flex items-center justify-between rounded-2xl border-2 px-4 py-3.5 text-left transition-all ${
                              isOn ? "border-primary shadow-md" : "border-border/60 bg-card/80 text-foreground hover:border-border"
                            }`}
                            style={isOn ? { background: "var(--gradient-warm)", boxShadow: "0 6px 20px -4px hsl(32 70% 36% / 0.35)" } : undefined}
                          >
                            <div className="flex-1 min-w-0">
                              <p className={`font-body text-[14px] font-semibold ${isOn ? "text-primary-foreground" : "text-foreground"}`}>
                                {g.title}
                              </p>
                              <p className={`font-body text-[12px] mt-0.5 ${isOn ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
                                {g.subtitle}
                              </p>
                            </div>
                            {isOn && (
                              <span className="h-5 w-5 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </span>
                            )}
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

                  {(editTarget === "profession" || editTarget === "location" || editTarget === "height" || editTarget === "languages") && (
                    <div className="space-y-2">
                      <Label className="font-body text-[14px] font-semibold text-foreground">
                        {currentField?.label}
                      </Label>
                      <Input
                        value={draftValue}
                        onChange={(e) => setDraftValue(e.target.value)}
                        placeholder={currentField?.placeholder}
                        autoFocus
                        className="rounded-xl border-border/60 bg-card/80 h-12 font-body text-[14px] placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
                      />
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
    </div>
  );
};

export default EditProfile;
