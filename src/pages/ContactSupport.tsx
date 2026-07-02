import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, CheckCircle, Paperclip, Send, X, FileText, Image, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const subjects = [
  "Account Issue",
  "Profile Help",
  "Billing & Payments",
  "Safety Concern",
  "Bug Report",
  "Feature Request",
  "Other",
];

const ContactSupport = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    const total = attachments.length + newFiles.length;
    if (total > 5) {
      toast.error("You can attach up to 5 files");
      return;
    }
    for (const file of newFiles) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit`);
        return;
      }
    }
    setAttachments((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const isImage = (file: File) => file.type.startsWith("image/");

  const handleSend = () => {
    if (!subject || !message.trim()) {
      toast.error("Please fill in subject and message");
      return;
    }
    setSubmitted(true);
  };

  const isValid = subject && message.trim().length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 px-2 py-2.5">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary font-medium gap-1 px-2 hover:bg-primary/5"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <span className="flex-1 text-center font-display text-base font-semibold text-foreground tracking-tight pr-12">
            Contact Support
          </span>
        </div>
      </header>

      <main className="flex-1 px-5 mt-4 flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-6"
        >
          {/* Subtitle */}
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-[13px] text-muted-foreground text-center">
              We usually respond within 24 hours.
            </p>
          </div>

          {/* Subject Select */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-1">
              Subject
            </label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger
                className="h-12 rounded-2xl border-border/20 bg-card text-[13px] focus:ring-primary/30"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <SelectValue placeholder="Choose a topic..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {subjects.map((s) => (
                  <SelectItem key={s} value={s} className="text-[13px]">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-1">
              Message
            </label>
            <Textarea
              placeholder="Describe your issue or question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[140px] rounded-2xl border-border/20 bg-card text-[13px] placeholder:text-muted-foreground/40 resize-none focus-visible:ring-primary/30 leading-relaxed"
              style={{ boxShadow: "var(--shadow-card)" }}
            />
            <p className="text-[11px] text-muted-foreground/40 px-1 text-right">
              {message.length > 0 ? `${message.length} characters` : ""}
            </p>
          </div>

          {/* Attachment */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-1">
              Attachment <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-dashed border-border/30 bg-card/50 hover:border-primary/25 hover:bg-card transition-all group"
            >
              <div className="h-8 w-8 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                <Paperclip className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors" />
              </div>
              <span className="text-[12px] text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                Add a screenshot or file
              </span>
            </button>

            {/* Attached files */}
            {attachments.length > 0 && (
              <div className="flex flex-col gap-2 mt-1">
                {attachments.map((file, i) => (
                  <motion.div
                    key={`${file.name}-${i}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border/20 bg-card"
                    style={{ boxShadow: "var(--shadow-card)" }}
                  >
                    <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {isImage(file) ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <FileText className="h-4 w-4 text-muted-foreground/60" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-[10px] text-muted-foreground/50">
                        {(file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => removeAttachment(i)}
                      className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-destructive/10 transition-colors"
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground/50 hover:text-destructive" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Submit Button */}
      <div className="px-5 mt-auto pt-4 pb-8">
        <Button
          onClick={handleSend}
          disabled={submitted || !isValid}
          className={`w-full h-12 rounded-2xl text-[15px] font-semibold text-primary-foreground gap-2 transition-all duration-300 ${
            isValid ? "opacity-100 shadow-lg" : "opacity-60"
          }`}
          style={{ background: "var(--gradient-warm)", boxShadow: isValid ? "var(--shadow-warm)" : "none" }}
        >
          <Send className="h-4 w-4" />
          {submitted ? "Submitted" : "Submit"}
        </Button>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm px-8"
            onClick={() => navigate(-1)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              className="bg-card rounded-3xl border border-border/20 px-8 py-10 flex flex-col items-center gap-5 max-w-[300px] w-full"
              style={{ boxShadow: "0 24px 48px -12px hsl(20 25% 12% / 0.15)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4, delay: 0.15 }}
                className="h-16 w-16 rounded-full flex items-center justify-center"
                style={{ background: "var(--gradient-warm)" }}
              >
                <CheckCircle className="h-8 w-8 text-primary-foreground" />
              </motion.div>
              <h3 className="text-[20px] font-display font-semibold text-foreground">Submitted</h3>
              <p className="text-[13px] text-muted-foreground text-center leading-relaxed">
                We have received your message. We will get back to you shortly.
              </p>
              <Button
                onClick={() => navigate(-1)}
                className="mt-1 rounded-2xl text-[13px] px-8 h-10 font-semibold text-primary-foreground"
                style={{ background: "var(--gradient-warm)" }}
              >
                Done
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactSupport;
