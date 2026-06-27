import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  Sparkles,
  X,
} from "lucide-react";

interface VirtualDateRoomProps {
  partnerName: string;
  partnerPhoto: string;
  onEnd: () => void;
}

const ICEBREAKERS = [
  "What's the most spontaneous thing you've ever done?",
  "If you could travel anywhere tomorrow, where would you go?",
  "What's a hobby you've always wanted to try?",
  "What does your perfect weekend look like?",
  "What's a movie or show that changed your perspective?",
  "If you could have dinner with anyone, who would it be?",
  "What's your go-to comfort food?",
  "What's one thing on your bucket list?",
  "What's the best advice you've ever received?",
  "What makes you laugh the most?",
];

export default function VirtualDateRoom({
  partnerName,
  partnerPhoto,
  onEnd,
}: VirtualDateRoomProps) {
  const DURATION = 10 * 60; // 10 minutes in seconds
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [currentIcebreaker, setCurrentIcebreaker] = useState(0);
  const [showIcebreaker, setShowIcebreaker] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsConnecting(false), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isConnecting) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [isConnecting]);

  // Auto-disconnect after 10 minutes
  useEffect(() => {
    if (elapsed >= DURATION) {
      onEnd();
    }
  }, [elapsed, DURATION, onEnd]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const nextIcebreaker = () => {
    setCurrentIcebreaker((c) => (c + 1) % ICEBREAKERS.length);
    setShowIcebreaker(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-foreground flex flex-col"
    >
      {isConnecting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[55] bg-foreground flex flex-col items-center justify-center gap-4"
        >
          <div className="h-20 w-20 rounded-full overflow-hidden ring-4 ring-primary/40 animate-pulse">
            <img src={partnerPhoto} alt={partnerName} className="h-full w-full object-cover" />
          </div>
          <p className="font-display text-base font-semibold text-primary-foreground">
            Connecting to {partnerName}…
          </p>
          <div className="flex items-center gap-1.5 text-primary-foreground/60">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </motion.div>
      )}
      {/* Partner video (full background) */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/95">
          <img
            src={partnerPhoto}
            alt={partnerName}
            className="w-full h-full object-cover opacity-30 blur-sm"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="h-24 w-24 rounded-full overflow-hidden ring-4 ring-primary/30 ring-offset-2 ring-offset-foreground">
              <img
                src={partnerPhoto}
                alt={partnerName}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="font-display text-lg font-bold text-primary-foreground">
              {partnerName}
            </p>
            <span className="font-body text-xs text-primary-foreground/60">
              Virtual Date • {formatTime(DURATION - elapsed > 0 ? DURATION - elapsed : 0)} remaining
            </span>
          </div>
        </div>

        {/* Self view (pip) */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-4 right-4 h-36 w-24 rounded-2xl overflow-hidden border-2 border-primary-foreground/20 shadow-lg"
        >
          {videoOn ? (
            <div className="h-full w-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ background: "var(--gradient-warm)" }}>
                <span className="text-primary-foreground font-display text-lg font-bold">
                  You
                </span>
              </div>
            </div>
          ) : (
            <div className="h-full w-full bg-foreground/80 flex items-center justify-center">
              <VideoOff className="h-5 w-5 text-primary-foreground/40" />
            </div>
          )}
        </motion.div>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 pt-12 px-4 pb-3 flex items-center justify-between bg-gradient-to-b from-foreground/60 to-transparent">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-body text-xs text-primary-foreground/80 font-medium">
              Live
            </span>
          </div>
          <span className="font-body text-sm text-primary-foreground/90 font-semibold tabular-nums">
            {formatTime(elapsed)}
          </span>
        </div>

        {/* Icebreaker prompt */}
        <AnimatePresence>
          {showIcebreaker && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute top-24 left-4 right-4"
            >
              <div className="rounded-2xl border border-primary/30 bg-foreground/80 backdrop-blur-xl px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="font-body text-sm text-primary-foreground/90 leading-relaxed">
                      {ICEBREAKERS[currentIcebreaker]}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowIcebreaker(false)}
                    className="p-1 rounded-full hover:bg-primary-foreground/10"
                  >
                    <X className="h-3.5 w-3.5 text-primary-foreground/50" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls bar */}
      <div className="bg-foreground/95 border-t border-primary-foreground/10 px-4 py-5 pb-8">
        <div className="flex items-center justify-center gap-4">
          <ControlButton
            icon={micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            active={micOn}
            onClick={() => setMicOn((v) => !v)}
          />
          <ControlButton
            icon={videoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            active={videoOn}
            onClick={() => setVideoOn((v) => !v)}
          />
          <ControlButton
            icon={<Sparkles className="h-5 w-5" />}
            active={showIcebreaker}
            onClick={nextIcebreaker}
            accent
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowEndConfirm(true)}
            className="h-14 w-14 rounded-full bg-destructive flex items-center justify-center shadow-lg"
          >
            <Phone className="h-5 w-5 text-destructive-foreground rotate-[135deg]" />
          </motion.button>
        </div>
      </div>

      {/* End call confirmation */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-foreground/60 backdrop-blur-sm flex items-center justify-center px-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl"
            >
              <h3 className="font-display text-lg font-bold text-foreground text-center">
                End Virtual Date?
              </h3>
              <p className="font-body text-sm text-muted-foreground text-center mt-2">
                You've been on this date for {formatTime(elapsed)}. Are you sure
                you want to leave?
              </p>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowEndConfirm(false)}
                  className="flex-1 py-3 rounded-2xl bg-muted text-foreground font-body text-sm font-semibold"
                >
                  Stay
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onEnd}
                  className="flex-1 py-3 rounded-2xl bg-destructive text-destructive-foreground font-body text-sm font-semibold"
                >
                  End Date
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ControlButton({
  icon,
  active,
  onClick,
  accent,
}: {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
        accent
          ? "text-primary-foreground"
          : active
          ? "bg-primary-foreground/15 text-primary-foreground"
          : "bg-primary-foreground/5 text-primary-foreground/40"
      }`}
      style={accent ? { background: "var(--gradient-warm)" } : undefined}
    >
      {icon}
    </motion.button>
  );
}