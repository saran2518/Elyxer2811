import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Eye, Feather, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileOutput from "@/components/ProfileOutput";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { GeneratedProfile } from "@/lib/profileGenerator";

type Tone = "elegant" | "natural";

const STORAGE_KEY = "results:lastProfile";

const readStored = (): { profile?: any; input?: string } => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const stored = readStored();
  const rawProfile = (location.state?.profile as any) ?? stored.profile;
  const initialInput = (location.state?.input as string) || stored.input || "";

  // Truncation helpers for display
  const truncateWords = (value: string, max: number): string =>
    value.trim().split(/\s+/).slice(0, max).join(" ");

  const toTwoWords = (value: string): string => truncateWords(value, 2);

  const normalizeProfile = (p: any): GeneratedProfile | undefined => {
    if (!p) return undefined;
    return {
      ...p,
      bio: typeof p.bio === "string" ? truncateWords(p.bio, 40) : "",
      interests:
        p.interests?.map((interest: any) =>
          typeof interest === "string" ? toTwoWords(interest) : ""
        ).filter(Boolean) ?? [],
      narratives: p.narratives?.map((n: any, i: number) =>
        typeof n === "string"
          ? { title: `Story ${i + 1}`, content: truncateWords(n, 25) }
          : { title: truncateWords(n.title || "", 4), content: truncateWords(n.content || "", 25) }
      ) ?? [],
      joinMeFor:
        p.joinMeFor?.map((j: any) =>
          typeof j === "string" ? truncateWords(j, 5) : ""
        ).filter(Boolean).slice(0, 3) ?? [],
    };
  };

  const [profile, setProfile] = useState<GeneratedProfile | undefined>(normalizeProfile(rawProfile));
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeTone, setActiveTone] = useState<Tone>("elegant");

  useEffect(() => {
    if (profile) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, input: initialInput }));
      } catch {}
    }
  }, [profile, initialInput]);


  const handleToneChange = async (tone: Tone) => {
    if (tone === activeTone || !initialInput) return;
    setActiveTone(tone);
    setIsRegenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-profile", {
        body: { input: initialInput, tone },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const normalized = normalizeProfile(data.profile);
      if (normalized) setProfile(normalized);
    } catch (e: any) {
      toast({
        title: "Regeneration failed",
        description: e.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      // revert tone on failure
      setActiveTone(activeTone);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-5 p-8"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-foreground">No profile yet</p>
            <p className="mt-1 font-body text-sm text-muted-foreground">
              Head back and describe yourself to generate one.
            </p>
          </div>
          <Button onClick={() => navigate("/")} className="font-body" size="lg">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container max-w-2xl flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/create", { state: { input: initialInput } })}
              className="shrink-0 rounded-xl h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Your Profile, <span className="text-primary italic">Refined</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl py-6 pb-16 space-y-6">
        {/* Tone selector */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex justify-center"
        >
          <div className="inline-flex rounded-xl border border-border/60 bg-card p-1 gap-1" style={{ boxShadow: "var(--shadow-card)" }}>
            {([
              { key: "natural" as Tone, label: "Natural", icon: Feather },
              { key: "elegant" as Tone, label: "Elegant", icon: Crown },
            ]).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleToneChange(key)}
                disabled={isRegenerating}
                className={`flex items-center gap-1.5 rounded-lg px-5 py-2 text-[13px] font-body font-medium transition-all duration-200 ${
                  activeTone === key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-body text-xs text-muted-foreground/60 text-center"
        >
          Tap the edit button on any section to customize it
        </motion.p>

        {/* Profile sections */}
        {isRegenerating ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer"
              />
            ))}
          </motion.div>
        ) : (
          <ProfileOutput profile={profile} onProfileChange={setProfile} />
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-3 pt-4"
        >
          <div className="h-px w-16 bg-border/50" />
          <Button
            onClick={() => navigate("/preview", { state: { profile } })}
            variant="outline"
            size="lg"
            className="font-body font-medium rounded-xl px-8 text-[15px] h-12 w-full max-w-xs"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview Profile
          </Button>
          <Button
            onClick={() => navigate("/welcome")}
            size="lg"
            className="font-body font-medium rounded-xl px-8 text-[15px] h-12 w-full max-w-xs"
            style={{
              background: "var(--gradient-warm)",
              boxShadow: "var(--shadow-warm)",
            }}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Complete my Profile
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Results;