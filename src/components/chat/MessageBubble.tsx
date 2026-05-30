import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, AlertCircle, RotateCw, Reply, X } from "lucide-react";
import { createPortal } from "react-dom";
import { ChatMessage } from "@/lib/chatStore";

interface MessageBubbleProps {
  msg: ChatMessage;
  isLast: boolean;
  showAvatar?: boolean;
  partnerPhoto?: string;
  onRetry?: (msg: ChatMessage) => void;
  onReply?: (msg: ChatMessage) => void;
  partnerName?: string;
}

export default function MessageBubble({ msg, isLast, showAvatar, partnerPhoto, onRetry, onReply, partnerName }: MessageBubbleProps) {
  const isMe = msg.sender === "me";
  const status = msg.status;
  const failed = status === "failed";
  const [actionsOpen, setActionsOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightboxOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightboxOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
      className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
    >
      {/* Partner avatar for grouped messages */}
      {!isMe && (
        <div className="w-7 shrink-0">
          {showAvatar && partnerPhoto ? (
            <img
              src={partnerPhoto}
              alt=""
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : null}
        </div>
      )}

      <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col relative`}>
        <motion.div
          drag={onReply ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: 0, right: 0.6 }}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            if (onReply && info.offset.x > 60) {
              onReply(msg);
            }
          }}
          onClick={() => onReply && setActionsOpen((v) => !v)}
          className={`relative rounded-2xl font-body text-[14px] leading-relaxed overflow-hidden transition-all cursor-pointer touch-pan-y ${
            isMe
              ? "rounded-br-sm text-primary-foreground shadow-md"
              : "rounded-bl-sm bg-card text-foreground border border-border/30 shadow-sm"
          } ${status === "sending" ? "opacity-70" : ""} ${failed ? "ring-1 ring-destructive/40" : ""}`}
          style={
            isMe
              ? {
                  background: "var(--gradient-warm)",
                  boxShadow: "0 4px 16px -4px hsl(12 76% 61% / 0.25)",
                }
              : undefined
          }
        >
          {/* Quoted reply preview */}
          {msg.replyTo && (
            <div
              className={`mx-2 mt-2 px-2.5 py-1.5 rounded-lg border-l-2 ${
                isMe
                  ? "bg-primary-foreground/15 border-primary-foreground/60"
                  : "bg-muted/60 border-primary/60"
              }`}
            >
              <div className={`text-[10px] font-semibold mb-0.5 ${isMe ? "text-primary-foreground/90" : "text-primary"}`}>
                {msg.replyTo.sender === "me" ? "You" : partnerName || "Them"}
              </div>
              <div className={`text-[11px] line-clamp-2 ${isMe ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {msg.replyTo.image && !msg.replyTo.text ? "📷 Photo" : msg.replyTo.text}
              </div>
            </div>
          )}

          {msg.image && (
            <motion.img
              layoutId={`img-${msg.id}`}
              src={msg.image}
              alt="Shared"
              className="w-full max-h-[220px] object-cover"
            />
          )}
          {msg.text && (
            <div className="px-3.5 py-2.5">{msg.text}</div>
          )}
        </motion.div>

        {/* Reply action */}
        <AnimatePresence>
          {actionsOpen && onReply && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className={`mt-1 ${isMe ? "self-end" : "self-start"}`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReply(msg);
                  setActionsOpen(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-card border border-border/40 shadow-sm text-[11px] font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                <Reply className="h-3 w-3" />
                Reply
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timestamp + status */}
        <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-muted-foreground/60 font-medium">{msg.time}</span>
          {isMe && status && (
            <span className="flex items-center" aria-label={`Message ${status}`}>
              {status === "sending" && (
                <Loader2 className="h-3 w-3 text-muted-foreground/50 animate-spin" />
              )}
              {status === "sent" && <Check className="h-3 w-3 text-muted-foreground/60" />}
              {status === "failed" && (
                <AlertCircle className="h-3 w-3 text-destructive" />
              )}
            </span>
          )}
          {isMe && failed && onRetry && (
            <button
              onClick={() => onRetry(msg)}
              className="flex items-center gap-1 text-[10px] font-medium text-destructive hover:text-destructive/80"
            >
              <RotateCw className="h-2.5 w-2.5" />
              Retry
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
