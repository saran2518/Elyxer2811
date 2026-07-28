import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  EyeOff,
  ShieldCheck,
  HeartHandshake,
  Phone,
  Mail,
  Bell,
  MailOpen,
  Globe,
  Lock,
  DatabaseZap,
  FileText,
  Scale,
  LogOut,
  Trash2,
  HelpCircle,
  ChevronRight,
  MapPin,
  CreditCard,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Info,
  ExternalLink,
  PauseCircle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import DeleteAccountDialog from "./DeleteAccountDialog";
import UpdateEmailDialog from "./UpdateEmailDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// Mocked entitlement + Play Billing identifiers
const HAS_ACTIVE_SUBSCRIPTION = true;
const PLAY_PRODUCT_ID = "elyxer_plus_weekly";
const PLAY_PACKAGE_NAME = "app.lovable.elyxer";

type RestoreState = "idle" | "loading" | "success" | "empty";

const SettingsSection = () => {
  const navigate = useNavigate();
  const [pauseProfile, setPauseProfile] = useState(false);
  const [privateBrowsing, setPrivateBrowsing] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [restoreState, setRestoreState] = useState<RestoreState>("idle");
  const [restoredPlan, setRestoredPlan] = useState<string>("Elyxer Plus");
  const [infoOpen, setInfoOpen] = useState(false);

  const openManage = () => {
    if (!HAS_ACTIVE_SUBSCRIPTION) {
      navigate("/upgrade");
      return;
    }
    setManageOpen(true);
  };

  const continueToPlayStore = () => {
    const url = `https://play.google.com/store/account/subscriptions?sku=${PLAY_PRODUCT_ID}&package=${PLAY_PACKAGE_NAME}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setManageOpen(false);
  };

  const startRestore = async () => {
    setRestoreOpen(true);
    setRestoreState("loading");
    // Simulated Play Billing queryPurchasesAsync + backend validation
    await new Promise((r) => setTimeout(r, 1400));
    if (HAS_ACTIVE_SUBSCRIPTION) {
      setRestoredPlan("Elyxer Plus");
      setRestoreState("success");
    } else {
      setRestoreState("empty");
    }
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-3 pb-4"
    >
      {/* Profile & Presence */}
      <SettingsGroup
        title="Profile & Presence"
        infoAction={
          <button
            onClick={() => setInfoOpen(true)}
            className="h-6 w-6 rounded-full flex items-center justify-center text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 transition-colors"
            aria-label="What do Pause and Private do?"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        }
      >
        <SettingRow
          icon={<EyeOff className="h-4 w-4" />}
          label="Pause Profile"
          subtitle="Temporarily hide from discovery"
          action={<Switch checked={pauseProfile} onCheckedChange={setPauseProfile} />}
        />
        <SettingRow
          icon={<MapPin className="h-4 w-4" />}
          label="Travel Mode"
          subtitle="Connect with people in other cities"
          badge="Coming Soon"
        />
        <SettingRow
          icon={<EyeOff className="h-4 w-4" />}
          label="Private Browsing"
          subtitle="Browse without being seen"
          badge="Premium"
          action={<Switch checked={privateBrowsing} onCheckedChange={setPrivateBrowsing} />}
          last
        />
      </SettingsGroup>

      {/* Safety */}
      <SettingsGroup title="Safety">
        <SettingRow icon={<HeartHandshake className="h-4 w-4" />} label="Dating Guide" subtitle="Date smarter, connect deeper" onClick={() => navigate("/dating-tips")} last />
      </SettingsGroup>

      {/* Login & Security */}
      <SettingsGroup title="Login & Security">
        <SettingRow icon={<Phone className="h-4 w-4" />} label="Phone Number" subtitle="+91 •••• ••• 890" value="Verified" noChevron />
        <SettingRow icon={<Mail className="h-4 w-4" />} label="Email Address" subtitle="Add or update your email" onClick={() => setShowEmailDialog(true)} last />
      </SettingsGroup>

      {/* Subscriptions */}
      <SettingsGroup title="Subscriptions">
        {HAS_ACTIVE_SUBSCRIPTION && (
          <SettingRow
            icon={<CreditCard className="h-4 w-4" />}
            label="Manage subscription"
            subtitle="Update or cancel on Google Play"
            onClick={openManage}
          />
        )}
        <SettingRow
          icon={<RefreshCw className="h-4 w-4" />}
          label="Restore subscription"
          subtitle="Recover a previous purchase"
          onClick={startRestore}
          last
        />
      </SettingsGroup>


      {/* Notifications */}
      <SettingsGroup title="Notifications">
        <SettingRow
          icon={<Bell className="h-4 w-4" />}
          label="Push Notifications"
          subtitle="Matches, messages & more"
          action={<Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />}
        />
        <SettingRow
          icon={<MailOpen className="h-4 w-4" />}
          label="Email Notifications"
          subtitle="Weekly recaps & updates"
          action={<Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />}
          last
        />
      </SettingsGroup>

      {/* Language */}
      <SettingsGroup title="Language">
        <SettingRow icon={<Globe className="h-4 w-4" />} label="App Language" subtitle="Change display language" value="English" last />
      </SettingsGroup>

      {/* Privacy & Data */}
      <SettingsGroup title="Privacy & Data">
        <SettingRow icon={<Lock className="h-4 w-4" />} label="Privacy Preferences" subtitle="Control your data sharing" />
        <SettingRow icon={<DatabaseZap className="h-4 w-4" />} label="Request Your Data" subtitle="Download a copy" last />
      </SettingsGroup>

      {/* Help & Support */}
      <SettingsGroup title="Help & Support">
        <SettingRow icon={<HelpCircle className="h-4 w-4" />} label="Help & FAQ" subtitle="Get answers fast" onClick={() => navigate("/help-faq")} last />
      </SettingsGroup>

      {/* Legal */}
      <SettingsGroup title="Legal">
        <SettingRow icon={<FileText className="h-4 w-4" />} label="Privacy Policy" subtitle="How we handle your data" />
        <SettingRow icon={<Scale className="h-4 w-4" />} label="Terms of Service" subtitle="Rules of the road" last />
      </SettingsGroup>

      {/* Account Actions */}
      <motion.div variants={fadeUp} className="pt-2 space-y-2.5">
        <button
          className="w-full flex items-center justify-center gap-2.5 h-12 rounded-2xl border border-border/30 bg-card text-foreground font-semibold text-[13.5px] hover:bg-muted/40 active:scale-[0.98] transition-all duration-200"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
        <button
          className="w-full flex items-center justify-center gap-2.5 h-12 rounded-2xl border border-destructive/15 bg-destructive/5 text-destructive font-semibold text-[13.5px] hover:bg-destructive/10 active:scale-[0.98] transition-all duration-200"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </button>
      </motion.div>

      <DeleteAccountDialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
      <UpdateEmailDialog open={showEmailDialog} onClose={() => setShowEmailDialog(false)} />

      {/* Manage subscription confirmation */}
      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="rounded-2xl max-w-[92vw] sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2">
              <ExternalLink className="h-5 w-5" />
            </div>
            <DialogTitle className="text-center">Manage on Google Play</DialogTitle>
            <DialogDescription className="text-center">
              Subscriptions are handled by Google Play. You'll be redirected to Google Play to update or cancel your Elyxer plan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col-reverse sm:flex-col-reverse gap-2 sm:gap-2">
            <Button variant="outline" className="w-full rounded-xl" onClick={() => setManageOpen(false)}>
              Stay in Elyxer
            </Button>
            <Button className="w-full rounded-xl gap-2" onClick={continueToPlayStore}>
              <ExternalLink className="h-4 w-4" />
              Continue to Google Play
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore subscription flow */}
      <Dialog
        open={restoreOpen}
        onOpenChange={(o) => {
          setRestoreOpen(o);
          if (!o) setRestoreState("idle");
        }}
      >
        <DialogContent className="rounded-2xl max-w-[92vw] sm:max-w-md">
          {restoreState === "loading" && (
            <div className="py-6 flex flex-col items-center text-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
              <p className="text-[14px] font-semibold text-foreground">Restoring your subscription</p>
              <p className="text-[12.5px] text-muted-foreground mt-1">
                Checking Google Play for active purchases…
              </p>
            </div>
          )}
          {restoreState === "success" && (
            <>
              <DialogHeader>
                <div className="mx-auto h-12 w-12 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <DialogTitle className="text-center">Subscription restored</DialogTitle>
                <DialogDescription className="text-center">
                  {restoredPlan} restored — your benefits are active again.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button className="w-full rounded-xl" onClick={() => setRestoreOpen(false)}>
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
          {restoreState === "empty" && (
            <>
              <DialogHeader>
                <div className="mx-auto h-12 w-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mb-2">
                  <Info className="h-6 w-6" />
                </div>
                <DialogTitle className="text-center">No purchases found</DialogTitle>
                <DialogDescription className="text-center">
                  This Google account has no Elyxer subscription to restore.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" className="w-full rounded-xl" onClick={() => setRestoreOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>


      {/* App Info */}
      <motion.div variants={fadeUp} className="flex flex-col items-center gap-1 pt-2 pb-2">
        <span className="text-[11px] font-medium text-muted-foreground/40 tracking-wide">
          Version 1.0.0
        </span>
        <span className="text-[10px] text-muted-foreground/30">
          Made with ❤️
        </span>
      </motion.div>

      {/* Profile & Presence info dialog */}
      <Dialog open={infoOpen} onOpenChange={(o) => !o && setInfoOpen(false)}>
        <DialogContent className="p-0 overflow-hidden rounded-[28px] max-w-[92vw] sm:max-w-md border border-primary/20 bg-card/85 backdrop-blur-2xl shadow-2xl">
          {/* Top accent bar */}
          <div className="h-[2px] w-full" style={{ background: "var(--gradient-warm)" }} />

          <DialogHeader className="pt-7 pb-5 px-6 text-center">
            <div className="mx-auto mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full p-[1px]" style={{ background: "var(--gradient-warm)" }}>
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                <Info className="h-5 w-5 text-primary" />
              </div>
            </div>
            <DialogTitle className="sr-only">Profile &amp; Presence</DialogTitle>
            <h2 className="text-[22px] font-display font-semibold text-foreground tracking-wide">
              Profile &amp; Presence
            </h2>
            <div className="mt-2 h-px w-12 mx-auto" style={{ background: "linear-gradient(to right, transparent, hsl(var(--primary)), transparent)" }} />
          </DialogHeader>

          <DialogDescription asChild>
            <div className="px-5 pb-6 space-y-3">
              {/* Pause Profile */}
              <div className="p-4 rounded-2xl border border-border/20 bg-background/40">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <PauseCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-semibold text-foreground">Pause Profile</h3>
                    <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                      Temporarily hide from discovery. You won't appear in recommendations, but your existing vibes, invites and chats stay untouched.
                    </p>
                  </div>
                </div>
              </div>

              {/* Private Browsing */}
              <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <EyeOff className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[13px] font-semibold text-foreground">Private Browsing</h3>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-bold text-primary-foreground border-0 rounded-full" style={{ background: "var(--gradient-warm)" }}>
                        Infinity
                      </Badge>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                      Browse profiles without being seen. Your activity won't notify others while this is on, so you can explore freely.
                    </p>
                  </div>
                </div>
              </div>

              {/* Travel */}
              <div className="p-4 rounded-2xl border border-border/20 bg-background/40 opacity-70">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0 w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[13px] font-semibold text-foreground">Travel</h3>
                      <span className="text-[10px] italic text-muted-foreground uppercase tracking-tighter">Coming soon</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                      Discover and connect in other cities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogDescription>

          <div className="px-6 pb-7">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setInfoOpen(false)}
              className="w-full h-12 rounded-full text-sm font-semibold tracking-wide text-primary-foreground shadow-lg"
              style={{ background: "var(--gradient-warm)" }}
            >
              Got it
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

function SettingsGroup({ title, children, infoAction }: { title: string; children: React.ReactNode; infoAction?: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeUp}
      className="relative rounded-[20px] border border-border/30 bg-card overflow-hidden"
      style={{ boxShadow: "0 8px 32px -8px hsl(var(--foreground) / 0.08), 0 2px 8px -2px hsl(var(--foreground) / 0.04)" }}
    >
      {/* Warm tint wash */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, hsl(var(--primary) / 0.06) 0%, hsl(var(--primary) / 0.02) 60%, transparent 100%)" }} />
      {/* Decorative corner motif */}
      <div className="absolute top-2 right-0 w-24 h-24 opacity-[0.035] pointer-events-none">
        <div className="w-full h-full rounded-full" style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }} />
      </div>
      <div className="relative">
        <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-transparent bg-clip-text" style={{ backgroundImage: "var(--gradient-warm)" }}>{title}</span>
          {infoAction}
        </div>
        {children}
      </div>
    </motion.div>
  );
}

function SettingRow({
  icon,
  label,
  subtitle,
  value,
  action,
  badge,
  last,
  onClick,
  noChevron,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  value?: string;
  action?: React.ReactNode;
  badge?: string;
  last?: boolean;
  onClick?: () => void;
  noChevron?: boolean;
}) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 w-full text-left transition-colors duration-150 ${
        last ? "" : "border-b border-border/10"
      } ${onClick ? "hover:bg-muted/25 active:bg-muted/40" : ""}`}
    >
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/12 to-accent/6 flex items-center justify-center text-primary shrink-0 ring-1 ring-primary/10">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13.5px] text-foreground font-semibold truncate">{label}</span>
          {badge && (
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-bold bg-primary/10 text-primary border-0 rounded-md">
              {badge}
            </Badge>
          )}
        </div>
        {subtitle && (
          <span className="text-[11.5px] text-muted-foreground/70 leading-tight block mt-0.5 truncate">{subtitle}</span>
        )}
      </div>
      {action ? action : noChevron ? (
        value ? <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{value}</span> : null
      ) : (
        <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
          {value && <span className="text-[12px] font-medium text-muted-foreground/70">{value}</span>}
          <ChevronRight className="h-4 w-4 opacity-30" />
        </div>
      )}
    </Wrapper>
  );
}

export default SettingsSection;
