import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Inspiration = {
  text: string;
  tags: string[];
};

const INSPIRATION_POOL: Inspiration[] = [
  {
    text: "Weekends on trail, chai in hand. I sketch, I cook, I get lost in flea markets. Looking for someone who finds magic in the ordinary.",
    tags: ["HOBBIES", "LIFESTYLE", "INTENT"],
  },
  {
    text: "My work is about building things that matter, and I approach life with quiet curiosity and a soft sense of humor.",
    tags: ["WORK", "PERSONALITY"],
  },
  {
    text: "A weekend that feels right includes long walks, a great book, and slow conversations over coffee with someone thoughtful.",
    tags: ["LIFESTYLE", "INTENT"],
  },
  {
    text: "One quality people notice about me is the way I listen, fully and without rushing. I value depth over noise.",
    tags: ["PERSONALITY", "VALUES"],
  },
  {
    text: "I value connections that are honest, playful, and unafraid of stillness. Less performance, more presence.",
    tags: ["VALUES", "INTENT"],
  },
  {
    text: "When I truly switch off, you will find me on a quiet trail, in a noisy kitchen, or watching old films.",
    tags: ["HOBBIES", "LIFESTYLE"],
  },
  {
    text: "Right now, I am focused on creative work, slow mornings, and learning to keep plants alive on my balcony.",
    tags: ["WORK", "LIFESTYLE"],
  },
  {
    text: "I love road trips with no plan, neighborhood bookstores, and people who can hold a real conversation.",
    tags: ["HOBBIES", "INTENT"],
  },
  {
    text: "Equal parts dreamer and doer. I journal at sunrise, lift heavy by evening, and cook dinner like it's a ritual.",
    tags: ["LIFESTYLE", "PERSONALITY"],
  },
  {
    text: "Music is my second language. Vinyl nights, acoustic sets, and dancing badly in the kitchen are non-negotiable.",
    tags: ["HOBBIES", "PERSONALITY"],
  },
  {
    text: "I am drawn to people who care deeply, laugh loudly, and ask better questions than they give answers.",
    tags: ["VALUES", "INTENT"],
  },
  {
    text: "Most days you'll find me with a camera, a coffee, and a quiet plan to get pleasantly lost in the city.",
    tags: ["HOBBIES", "LIFESTYLE"],
  },
  {
    text: "Building a life that feels light. Travel without itineraries, friendships without scorekeeping, love without performance.",
    tags: ["VALUES", "LIFESTYLE", "INTENT"],
  },
  {
    text: "Therapist by training, comedian by accident. I take feelings seriously and almost nothing else.",
    tags: ["WORK", "PERSONALITY"],
  },
  {
    text: "I am the friend who plans the trip, picks the playlist, and still cries at the airport goodbye.",
    tags: ["PERSONALITY", "VALUES"],
  },
  {
    text: "Ocean over mountains, mornings over nights, real conversation over small talk. Looking for my favorite person.",
    tags: ["LIFESTYLE", "INTENT"],
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const Index = () => {
  const location = useLocation();
  const restoredInput = (location.state as any)?.input || "";
  const [input, setInput] = useState(restoredInput);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Pick 10 random inspirations per visit
  const INSPIRATIONS = useMemo(() => shuffle(INSPIRATION_POOL).slice(0, 10), []);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-profile", {
        body: { input: input.trim() },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      navigate("/results", { state: { profile: data.profile, input: input.trim() } });
    } catch (e: any) {
      toast({
        title: "Generation failed",
        description: e.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInspirationClick = (idx: number) => {
    setSelectedIdx(idx);
    setInput(INSPIRATIONS[idx].text);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleClear = () => {
    setInput("");
    setSelectedIdx(null);
    textareaRef.current?.focus();
  };

  // Track scroll position for dot indicators
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      // Each card ~ 85% viewport width + gap; use container width as step
      const step = el.clientWidth * 0.88;
      const idx = Math.round(scrollLeft / step);
      setActiveIndex(Math.min(Math.max(idx, 0), INSPIRATIONS.length - 1));
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse drag-to-scroll for desktop (touch swipe works natively)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    const onDown = (e: MouseEvent) => {
      isDown = true;
      moved = false;
      startX = e.pageX;
      startScroll = el.scrollLeft;
      el.style.cursor = "grabbing";
    };
    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startScroll - dx;
    };
    const onUp = () => {
      isDown = false;
      el.style.cursor = "grab";
    };
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    el.style.cursor = "grab";
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    el.addEventListener("click", onClickCapture, true);
    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col px-5 pt-10 pb-6">
        {/* Header with back button + centered title */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative flex items-center justify-center mb-2"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="absolute left-0 rounded-full h-9 w-9 -ml-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <h1 className="font-display text-[28px] leading-tight font-bold text-foreground tracking-tight">
            Profile <span className="italic font-semibold text-primary">Studio</span>
          </h1>
        </motion.div>

        {/* Subtitle row + Clear pill */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-2 flex items-center justify-between gap-3"
        >
          <p className="font-body text-[14px] text-foreground/70">
            Your words will be shaped into your story.
          </p>
          <button
            onClick={handleClear}
            className="shrink-0 rounded-full border border-border px-3.5 py-1 font-body text-[12px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          >
            Clear
          </button>
        </motion.div>

        {/* Input card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative mt-4 rounded-2xl border border-border bg-card p-4 pb-10"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tap an inspiration below or write in your own words…"
            className="w-full min-h-[160px] resize-none bg-transparent border-0 outline-none font-display italic text-[17px] leading-relaxed text-foreground placeholder:text-muted-foreground/50 placeholder:not-italic placeholder:font-body"
          />
          <div className="absolute bottom-3 right-3 text-primary/80">
            <Pencil className="h-4 w-4" />
          </div>
        </motion.div>

        {/* Inspirations section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="mt-7"
        >
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
            Input Inspirations
          </p>
          <p className="mt-1.5 font-body text-[13.5px] text-muted-foreground">
            Tap an inspiration or write in your own words
          </p>

          <div
            ref={scrollRef}
            className="mt-4 flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 pb-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {INSPIRATIONS.map((insp, idx) => {
              const isActive = selectedIdx === idx;
              return (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 + idx * 0.03, duration: 0.3 }}
                  onClick={() => handleInspirationClick(idx)}
                  className={`relative snap-start shrink-0 w-[82%] text-left rounded-2xl bg-card p-4 pl-5 transition-all duration-200 overflow-hidden ${
                    isActive
                      ? "border-2 border-primary shadow-[0_4px_18px_-6px_hsl(36_53%_51%/0.35)]"
                      : "border border-border"
                  }`}
                  style={!isActive ? { boxShadow: "var(--shadow-card)" } : undefined}
                >
                  {/* Gold left accent */}
                  <span
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ background: "var(--gradient-warm)" }}
                  />
                  <p className="font-display italic text-[15px] leading-snug text-foreground">
                    {insp.text}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {insp.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-primary/40 px-2.5 py-0.5 font-body text-[10px] font-medium tracking-wider text-accent"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Pagination dots */}
          <div className="mt-3 flex justify-center gap-1.5">
            {INSPIRATIONS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-5 bg-primary"
                    : "w-1.5 bg-primary/20"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="mt-auto pt-8"
        >
          <Button
            onClick={handleGenerate}
            disabled={!input.trim() || isGenerating}
            size="lg"
            className="w-full font-body font-medium rounded-full text-[16px] h-14 text-primary-foreground"
            style={{
              background: "var(--gradient-gold)",
              boxShadow: "var(--shadow-warm)",
            }}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                Crafting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Create My Profile
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </motion.div>

        {/* Loading skeleton (s-loading) — untouched */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 space-y-4"
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer"
              />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Index;
