import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, X, Loader2, Reply, Image as ImageIcon, Camera, ShieldAlert } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import EmojiPicker from "./EmojiPicker";
import { ReplyPreview } from "@/lib/chatStore";

interface ChatInputProps {
  onSend: (text: string, image?: string) => void;
  disabled?: boolean;
  replyingTo?: ReplyPreview | null;
  onCancelReply?: () => void;
  partnerName?: string;
}

export default function ChatInput({ onSend, disabled = false, replyingTo, onCancelReply, partnerName }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [attachOpen, setAttachOpen] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (disabled) return;
    if (!input.trim() && !imagePreview) return;
    onSend(input.trim(), imagePreview || undefined);
    setInput("");
    setImagePreview(null);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setImagePreview(compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  async function compressImage(file: File, maxDim = 1280, quality = 0.8): Promise<string> {
    const dataUrl: string = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });
    const img: HTMLImageElement = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("img load failed"));
      i.src = dataUrl;
    });
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", quality);
  }

  const hasContent = input.trim().length > 0 || !!imagePreview;

  return (
    <div className="px-4 pb-2 pt-2">
      {/* Image preview (kept separate above input) */}
      {imagePreview && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2"
        >
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-20 w-20 rounded-2xl object-cover border-2 border-primary/20 shadow-md"
            />
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => setImagePreview(null)}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg"
            >
              <X className="h-3 w-3" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Unified input container (reply preview lives inside) */}
      <div className="bg-muted/30 rounded-3xl border border-border/30 transition-all focus-within:border-primary/30 focus-within:bg-muted/40 focus-within:shadow-lg focus-within:shadow-primary/5 overflow-hidden">
        <AnimatePresence initial={false}>
          {replyingTo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-2 px-3 py-2 mx-2 mt-2 rounded-2xl bg-primary/10 border border-primary/20 border-l-4 border-l-primary shadow-sm">
                <Reply className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-semibold text-primary mb-0.5">
                    Replying to {replyingTo.sender === "me" ? "yourself" : partnerName || "them"}
                  </div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">
                    {replyingTo.image && !replyingTo.text ? "📷 Photo" : replyingTo.text}
                  </div>
                </div>
                <button
                  onClick={onCancelReply}
                  className="p-1 rounded-full hover:bg-muted/60 text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attach panel — extends stylishly above the input row */}
        <AnimatePresence initial={false}>
          {attachOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mx-2 mt-2 mb-1 px-1.5 py-1.5 rounded-2xl bg-gradient-to-r from-primary/10 via-background/70 to-primary/10 border border-primary/20 backdrop-blur-xl shadow-[0_4px_20px_-8px_hsl(var(--primary)/0.25)] flex items-center gap-1.5 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,hsl(var(--primary)/0.12),transparent_70%)]" />

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setAttachOpen(false);
                    galleryInputRef.current?.click();
                  }}
                  className="relative flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-background/80 hover:bg-background border border-border/50 hover:border-primary/40 hover:shadow-md hover:shadow-primary/10 transition-all"
                >
                  <div
                    className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0 ring-1 ring-white/30"
                    style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
                  >
                    <ImageIcon className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[12px] font-semibold text-foreground">Gallery</span>
                    <span className="text-[9px] text-muted-foreground">Pick a photo</span>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    setAttachOpen(false);
                    cameraInputRef.current?.click();
                  }}
                  className="relative flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-background/80 hover:bg-background border border-border/50 hover:border-primary/40 hover:shadow-md hover:shadow-primary/10 transition-all"
                >
                  <div
                    className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0 ring-1 ring-white/30"
                    style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
                  >
                    <Camera className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[12px] font-semibold text-foreground">Camera</span>
                    <span className="text-[9px] text-muted-foreground">Snap & send</span>
                  </div>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAttachOpen(false)}
                  className="relative p-1.5 rounded-full bg-background/60 hover:bg-background border border-border/40 text-muted-foreground hover:text-foreground shrink-0"
                  aria-label="Close attach menu"
                >
                  <X className="h-3 w-3" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-1.5 px-2 py-1.5">
          <EmojiPicker onSelect={(emoji) => setInput((prev) => prev + emoji)} />

          <motion.button
            whileTap={{ scale: 0.85 }}
            type="button"
            onClick={() => setAttachOpen((v) => !v)}
            aria-expanded={attachOpen}
            className={`p-2 rounded-xl transition-colors ${
              attachOpen ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Paperclip className="h-5 w-5" />
          </motion.button>

          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageSelect}
          />


          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={disabled ? "Sending…" : "Type a message..."}
            disabled={disabled}
            maxLength={1000}
            className="flex-1 px-2 py-2.5 bg-transparent font-body text-[14px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-60"
          />

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={hasContent && !disabled ? handleSend : undefined}
            disabled={disabled}
            aria-busy={disabled}
            className="h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 transition-all disabled:opacity-60"
            style={
              hasContent && !disabled
                ? {
                    background: "var(--gradient-warm)",
                    boxShadow: "var(--shadow-warm)",
                  }
                : undefined
            }
          >
            {disabled ? (
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <Send className={`h-4 w-4 ${hasContent ? "text-primary-foreground" : "text-muted-foreground/40"}`} />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
