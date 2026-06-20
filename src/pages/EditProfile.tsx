import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  Sparkles,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAboutFields } from "@/lib/editProfileStore";

interface AboutRow {
  key: string;
  label: string;
  icon: React.ReactNode;
  value: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const fields = useAboutFields();

  const fieldConfig: AboutRow[] = [
    { key: "datingPreference", label: "Dating Preference", icon: <Heart className="h-4.5 w-4.5 text-primary" />, value: fields.datingPreference },
    { key: "gender", label: "Gender & Identity", icon: <User className="h-4.5 w-4.5 text-primary" />, value: fields.gender },
    { key: "pronouns", label: "Pronouns", icon: <MessageCircle className="h-4.5 w-4.5 text-primary" />, value: fields.pronouns },
    { key: "orientation", label: "Sexual Orientation", icon: <Compass className="h-4.5 w-4.5 text-primary" />, value: fields.orientation },
    { key: "datingGoals", label: "Dating Goals", icon: <Heart className="h-4.5 w-4.5 text-primary" />, value: fields.datingGoals },
    { key: "education", label: "Education", icon: <GraduationCap className="h-4.5 w-4.5 text-primary" />, value: fields.education },
    { key: "profession", label: "Profession", icon: <Briefcase className="h-4.5 w-4.5 text-primary" />, value: fields.profession },
    { key: "location", label: "Location", icon: <MapPin className="h-4.5 w-4.5 text-primary" />, value: fields.location },
    { key: "height", label: "Height", icon: <Ruler className="h-4.5 w-4.5 text-primary" />, value: fields.height },
    { key: "languages", label: "Languages", icon: <Languages className="h-4.5 w-4.5 text-primary" />, value: fields.languages },
  ];

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
                onClick={() => navigate(`/edit-profile/about/${field.key}`)}
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
    </div>
  );
};

export default EditProfile;
