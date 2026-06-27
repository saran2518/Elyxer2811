import { motion } from "framer-motion";
import { Video, Check, X } from "lucide-react";
import { ChatMessage } from "@/lib/chatStore";

interface VirtualDateInviteBubbleProps {
  msg: ChatMessage;
  isMe: boolean;
  onJoin?: () => void;
  onDecline?: () => void;
  showAvatar?: boolean;
  partnerPhoto?: string;
  partnerName: string;
}

export default function VirtualDateInviteBubble({
  msg,
  isMe,
  partnerName,
  onJoin,
  onDecline,
  showAvatar,
  partnerPhoto,
}: VirtualDateInviteBubbleProps) {
  const status = msg.dateInviteStatus || "pending";
  const isIncoming = !isMe;

  const firstName = partnerName.split(" ")[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
      className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
    >
      {!isMe && (
        <div className="w-7 shrink-0">
          {showAvatar && partnerPhoto ? (
            <img src={partnerPhoto} alt="" className="h-7 w-7 rounded-full object-cover" />
          ) : null}
        </div>
      )}

      <div className={`max-w-[80%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`rounded-2xl overflow-hidden shadow-sm border ${
            isMe ? "border-primary/30 bg-card" : "border-accent/30 bg-accent/5"
          }`}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{
              background: isMe
                ? "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--primary) / 0.04))"
                : "linear-gradient(135deg, hsl(var(--accent) / 0.14), hsl(var(--accent) / 0.04))",
            }}
          >
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--gradient-warm)" }}
            >
              <Video className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-display text-sm font-bold text-foreground">
                  Virtual Date Invite
                </p>
                <span
                  className={`text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded-md ${
                    isMe
                      ? "bg-primary/15 text-primary"
                      : "bg-accent/20 text-accent-foreground"
                  }`}
                >
                  {isMe ? "Sent" : "Received"}
                </span>
              </div>
              <p className="font-body text-xs text-muted-foreground mt-0.5 truncate">
                {isMe
                  ? `You invited ${firstName} on a virtual date`
                  : `${firstName} invited you on a virtual date`}
              </p>
            </div>
          </div>

          {/* Status or CTAs */}
          <div className="px-4 py-3">
            {status === "pending" && isMe && (
              <div className="flex items-center gap-2 py-1">
                <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-body text-xs text-muted-foreground">
                  Waiting for {firstName} to respond…
                </span>
              </div>
            )}

            {status === "pending" && isIncoming && (
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onJoin}
                  className="flex-1 py-2.5 rounded-xl font-body text-sm font-semibold text-primary-foreground flex items-center justify-center gap-1.5"
                  style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
                >
                  <Check className="h-4 w-4" />
                  Accept
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onDecline}
                  className="flex-1 py-2.5 rounded-xl bg-muted text-foreground font-body text-sm font-semibold flex items-center justify-center gap-1.5"
                >
                  <X className="h-4 w-4" />
                  Decline
                </motion.button>
              </div>
            )}

            {status === "accepted" && isMe && (
              <div className="flex items-center gap-2 py-1">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-body text-xs text-emerald-600 font-medium">
                  {firstName} joined the date!
                </span>
              </div>
            )}

            {status === "accepted" && isIncoming && (
              <div className="flex items-center gap-2 py-1">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-body text-xs text-emerald-600 font-medium">
                  You joined the date!
                </span>
              </div>
            )}

            {status === "declined" && isMe && (
              <div className="flex items-center gap-2 py-1">
                <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                <span className="font-body text-xs text-muted-foreground">
                  {firstName} declined your invite. Try again later.
                </span>
              </div>
            )}

            {status === "declined" && isIncoming && (
              <div className="flex items-center gap-2 py-1">
                <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />

                <span className="font-body text-xs text-muted-foreground">
                  You declined the invite
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Timestamp */}
        <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-muted-foreground/60 font-medium">{msg.time}</span>
        </div>
      </div>
    </motion.div>
  );
}
