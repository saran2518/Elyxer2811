import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, Home, Info, Loader2, LocateFixed, Lock, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface LocationStepProps {
  onNext: (data: { location: string; hometown?: string }) => void;
}

type DetectStatus = "idle" | "prompting" | "detecting" | "success" | "denied" | "error";

const LocationStep = ({ onNext }: LocationStepProps) => {
  const [location, setLocation] = useState("");
  const [hometown, setHometown] = useState("");
  const [status, setStatus] = useState<DetectStatus>("idle");

  const canContinue = location.trim().length > 0;

  const detectLocation = () => {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      toast.error("Geolocation isn't supported on this device");
      return;
    }
    setStatus("detecting");
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

          setLocation(city);
          setStatus("success");
          toast.success("Location detected");
        } catch (e) {
          setStatus("error");
          toast.error("Couldn't look up your city. Please try again.");
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("denied");
          toast.error("Permission denied. Location detection is unavailable.");
        } else {
          setStatus("error");
          toast.error("Couldn't get your location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    setStatus("prompting");
    const t = setTimeout(detectLocation, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detecting = status === "detecting" || status === "prompting";

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
            Your <span className="text-primary italic">Location</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="space-y-2"
        >
          <label className="font-body text-[12px] font-medium text-foreground/80 px-1">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter your location"
              value={location}
              readOnly
              className="rounded-xl border-border/60 bg-card/80 h-12 pl-11 pr-12 font-body text-[14px] placeholder:text-muted-foreground/50 focus-visible:ring-primary/30 read-only:cursor-default"
            />
            <button
              type="button"
              onClick={detectLocation}
              disabled={detecting}
              title={status === "success" ? "Detect again" : "Use my current location"}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-all disabled:opacity-60"
            >
              {detecting ? (
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-5 space-y-2"
        >
          <label className="font-body text-[12px] font-medium text-foreground/80 px-1">
            Hometown (optional)
          </label>
          <div className="relative">
            <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter your hometown"
              value={hometown}
              maxLength={60}
              onChange={(e) => setHometown(e.target.value)}
              className="rounded-xl border-border/60 bg-card/80 h-12 pl-11 font-body text-[14px] placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
            />
          </div>
          <div className="flex items-start gap-1.5 px-1">
            <Eye className="h-3 w-3 text-muted-foreground/60 mt-0.5 shrink-0" />
            <p className="font-body text-[11px] text-muted-foreground/60 leading-relaxed">
              Visible on your profile.
            </p>
          </div>
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
            Location helps us curate profile recommendations close to you.
          </p>
        </div>

        <div className="flex items-center justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              canContinue && onNext({ location, hometown: hometown.trim() || undefined })
            }
            disabled={!canContinue}
            className="h-12 w-12 rounded-xl flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity"
            style={{
              background: canContinue ? "var(--gradient-warm)" : "hsl(var(--secondary))",
              boxShadow: canContinue ? "0 6px 20px -4px hsl(32 70% 36% / 0.35)" : undefined,
            }}
          >
            <ArrowRight className={`h-5 w-5 ${!canContinue ? "text-muted-foreground" : ""}`} />
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default LocationStep;
