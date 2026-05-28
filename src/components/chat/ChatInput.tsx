import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip, X, Loader2 } from "lucide-react";
import EmojiPicker from "./EmojiPicker";

interface ChatInputProps {
  onSend: (text: string, image?: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (disabled) return;
    if (!input.trim() && !imagePreview) return;
    onSend(input.trim(), imagePreview || undefined);
    setInput("");
    setImagePreview(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const hasContent = input.trim().length > 0 || !!imagePreview;

  return (
    <div className="px-4 pb-2 pt-2">
      {/* Image preview */}
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

      {/* Input row */}
      <div className="flex items-end gap-1.5 bg-muted/30 rounded-3xl border border-border/30 px-2 py-1.5 transition-all focus-within:border-primary/30 focus-within:bg-muted/40 focus-within:shadow-lg focus-within:shadow-primary/5">
        <EmojiPicker onSelect={(emoji) => setInput((prev) => prev + emoji)} />

        <motion.button
          whileTap={{ scale: 0.85 }}
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
        >
          <Paperclip className="h-5 w-5" />
        </motion.button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
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
  );
}
