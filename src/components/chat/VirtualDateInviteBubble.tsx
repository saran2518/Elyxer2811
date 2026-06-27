import { motion } from "framer-motion";
import { Video, Check, X } from "lucide-react";
import { ChatMessage } from "@/lib/chatStore";

interface VirtualDateInviteBubbleProps {
  msg: ChatMessage;
  isMe: boolean;
  partnerName: string;
  onJoin?: () => void;
  onDecline?: () => void;
  showAvatar?: boolean;
  partnerPhoto?: string;
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
        <div className="rounded-2xl border border-primary/20 bg-card overflow-hidden shadow-sm">
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--accent) / 0.06))" }}
          >
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--gradient-warm)" }}
            >
              <Video className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-foreground">
                Virtual Date Invite
              </p>
              <p className="font-body text-xs text-muted-foreground mt-0.5">
                {isMe
                  ? `You invited ${partnerName} to a virtual date`
                  : `${partnerName} invited you to a virtual date`}
              </p>
            </div>
          </div>

          {/* Status or CTAs */}
          <div className="px-4 py-3">
            {status === "pending" && (
              <>
                {isMe && (
                  <div className="flex items-center gap-2 pb-2">
                    <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-body text-xs text-muted-foreground">
                      Waiting for {partnerName} to respond…
                    </span>
                  </div>
                )}
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
              </>
            )}

            {status === "accepted" && isMe && (
              <div className="flex items-center gap-2 py-1">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-body text-xs text-emerald-600 font-medium">
                  {partnerName} joined the date!
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
                  Your request has been declined, Try again later
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
