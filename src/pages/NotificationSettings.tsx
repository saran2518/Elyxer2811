import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, MessageSquare, Heart, Sparkle } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type Prefs = { messages: boolean; vibes: boolean; reminders: boolean };
const KEY = "elyxer_notification_prefs";

const load = (): Prefs => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { messages: true, vibes: true, reminders: true, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { messages: true, vibes: true, reminders: true };
};

const ROWS: { key: keyof Prefs; label: string; subtitle: string; Icon: typeof Bell }[] = [
  { key: "messages", label: "Messages", subtitle: "New messages and Virtual Dates", Icon: MessageSquare },
  { key: "vibes", label: "Vibes & Invites", subtitle: "New Vibes, Invites and connections", Icon: Heart },
  { key: "reminders", label: "Reminders & tips", subtitle: "New introductions and gentle reminders", Icon: Sparkle },
];

const NotificationSettings = () => {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState<Prefs>(load);
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(prefs)), [prefs]);

  const all = prefs.messages && prefs.vibes && prefs.reminders;
  const setAll = (v: boolean) => setPrefs({ messages: v, vibes: v, reminders: v });

  return (
    <div className="min-h-screen bg-background px-4 pt-10 pb-10">
      <div className="mb-6 flex items-center gap-3">
        <button aria-label="Back" onClick={() => navigate(-1)} className="p-1 text-foreground">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="font-display text-3xl text-foreground" style={{ fontFamily: "Marcellus, serif" }}>
          Notifications
        </h1>
      </div>

      <div className="flex items-center gap-4 rounded-[20px] border border-border bg-card p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
          <Bell className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-foreground">All notifications</p>
          <p className="text-sm text-muted-foreground">Turn everything on or off at once</p>
        </div>
        <Switch aria-label="All notifications" checked={all} onCheckedChange={setAll} />
      </div>

      <p className="mt-7 mb-3 px-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Notify me about</p>

      <div className="overflow-hidden rounded-[20px] border border-border bg-card">
        {ROWS.map(({ key, label, subtitle, Icon }, i) => (
          <div key={key} className={`flex items-center gap-4 p-4 ${i < ROWS.length - 1 ? "border-b border-border" : ""}`}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-medium text-foreground">{label}</p>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <Switch aria-label={label} checked={prefs[key]} onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;
