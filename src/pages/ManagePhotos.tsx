import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { ArrowLeft, Plus, X, GripVertical, ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROFILES } from "@/lib/profilesData";
import { toast } from "sonner";

const MAX_PHOTOS = 6;
const MIN_PHOTOS = 1;

const ManagePhotos = () => {
  const navigate = useNavigate();
  const initial = [...PROFILES[0].photos];
  const [photos, setPhotos] = useState<string[]>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const dirty = JSON.stringify(photos) !== JSON.stringify(initial);

  const handleAddPhoto = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;
      const remaining = MAX_PHOTOS - photos.length;
      const newPhotos: string[] = [];
      for (let i = 0; i < Math.min(files.length, remaining); i++) {
        newPhotos.push(URL.createObjectURL(files[i]));
      }
      setPhotos((prev) => [...prev, ...newPhotos]);
    };
    input.click();
  };

  const handleRemove = (index: number) => {
    if (photos.length <= MIN_PHOTOS) {
      toast.error(`You must have at least ${MIN_PHOTOS} photo`);
      return;
    }
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!dirty || isSaving) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Photos updated");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 pt-3 pb-2">
        <div
          className="flex items-center gap-3 rounded-full border border-border/40 bg-card/70 backdrop-blur-xl px-4 py-2.5"
          style={{ boxShadow: "0 4px 24px -4px hsl(var(--foreground) / 0.06)" }}
        >
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0 rounded-full h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-display text-base font-semibold text-foreground">Manage Photos</span>
          <span className="ml-auto text-xs text-muted-foreground font-medium">{photos.length}/{MAX_PHOTOS}</span>
        </div>
      </header>

      <main className="flex-1 px-4 pb-8 mt-3">
        <p className="text-xs text-muted-foreground mb-4">
          Drag to reorder. First photo is your main profile photo. Tap × to remove.
        </p>

        {/* Photo Grid */}
        <Reorder.Group
          axis="y"
          values={photos}
          onReorder={setPhotos}
          className="grid grid-cols-3 gap-3"
          style={{ listStyle: "none" }}
        >
          <AnimatePresence>
            {photos.map((photo, index) => (
              <Reorder.Item
                key={photo}
                value={photo}
                drag
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                className="relative"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border/30 bg-muted group"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />

                  {/* Main photo badge */}
                  {index === 0 && (
                    <div className="absolute bottom-1.5 left-1.5 bg-primary/90 text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Main
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-background/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  {/* Drag handle */}
                  <div className="absolute top-1.5 left-1.5 h-6 w-6 rounded-full bg-background/60 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </AnimatePresence>

          {/* Add Photo Slots */}
          {Array.from({ length: MAX_PHOTOS - photos.length }).map((_, i) => (
            <motion.button
              key={`empty-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 * i }}
              onClick={handleAddPhoto}
              className="aspect-[3/4] rounded-2xl border-2 border-dashed border-border/40 bg-muted/20 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center">
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">Add</span>
            </motion.button>
          ))}
        </Reorder.Group>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 rounded-2xl border border-border/30 bg-card p-4"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <ImagePlus className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Photo Tips</h3>
          </div>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li>• Use clear, well-lit photos of yourself</li>
            <li>• Show your face in at least 2 photos</li>
            <li>• Add variety — hobbies, travel, candid moments</li>
            <li>• Avoid heavy filters or group-only photos</li>
          </ul>
        </motion.div>
      </main>

      {/* Sticky Save bar */}
      <div className="sticky bottom-0 px-4 pt-3 pb-5 bg-background/90 backdrop-blur border-t border-border/30">
        <Button
          onClick={handleSave}
          disabled={!dirty || isSaving}
          className="w-full rounded-2xl h-12 text-[14px] font-semibold gap-2"
          style={dirty && !isSaving ? { background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" } : undefined}
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSaving ? "Saving…" : dirty ? "Save changes" : "All changes saved"}
        </Button>
      </div>
    </div>
  );
};

export default ManagePhotos;
