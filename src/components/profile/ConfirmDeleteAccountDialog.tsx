import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function ConfirmDeleteAccountDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setBusy(true);
    const { error } = await supabase.functions.invoke("delete-account");
    if (error) {
      setBusy(false);
      toast.error("We couldn't delete your account. Please try again.");
      return;
    }
    await supabase.auth.signOut();
    try { localStorage.clear(); } catch { /* ignore */ }
    setBusy(false);
    onClose();
    navigate("/welcome", { replace: true });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => !busy && onClose()} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            className="relative z-10 w-full max-w-sm rounded-[20px] border border-border/30 bg-card shadow-2xl px-6 pt-7 pb-6 text-center"
            initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 16 }}
          >
            <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <h3 id="delete-account-title" className="text-lg font-semibold text-foreground tracking-tight">Delete your account?</h3>
            <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">
              Your profile, photos, Moments, Vibes, Invites, connections and chats will be removed from Elyxer straight away. Some data is kept for a limited time only where the law requires it, and is never used in the app.
            </p>
            <div className="mt-6 space-y-2.5">
              <Button variant="destructive" className="w-full h-12 rounded-2xl font-semibold" disabled={busy} onClick={handleDelete}>
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete account
              </Button>
              <Button variant="outline" className="w-full h-12 rounded-2xl font-semibold" disabled={busy} onClick={onClose}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
