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
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import DeleteAccountDialog from "./DeleteAccountDialog";
import UpdateEmailDialog from "./UpdateEmailDialog";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const SettingsSection = () => {
  const navigate = useNavigate();
  const [pauseProfile, setPauseProfile] = useState(false);
  const [privateBrowsing, setPrivateBrowsing] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-3 pb-4"
    >
      {/* Profile & Presence */}
      <SettingsGroup title="Profile & Presence">
        <SettingRow
          icon={<EyeOff className="h-4 w-4" />}
          label="Pause Profile"
          subtitle="Temporarily hide from discovery"
          action={<Switch checked={pauseProfile} onCheckedChange={setPauseProfile} />}
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
        <SettingRow icon={<ShieldCheck className="h-4 w-4" />} label="Selfie Badge" subtitle="Verify your identity" />
        <SettingRow icon={<HeartHandshake className="h-4 w-4" />} label="Safe Dating Tips" subtitle="Stay safe out there" onClick={() => navigate("/dating-tips")} last />
      </SettingsGroup>

      {/* Login & Security */}
      <SettingsGroup title="Login & Security">
        <SettingRow icon={<Phone className="h-4 w-4" />} label="Phone Number" subtitle="+91 •••• ••• 890" value="Verified" noChevron />
        <SettingRow icon={<Mail className="h-4 w-4" />} label="Email Address" subtitle="Add or update your email" onClick={() => setShowEmailDialog(true)} last />
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

      {/* App Info */}
      <motion.div variants={fadeUp} className="flex flex-col items-center gap-1 pt-2 pb-2">
        <span className="text-[11px] font-medium text-muted-foreground/40 tracking-wide">
          Version 1.0.0
        </span>
        <span className="text-[10px] text-muted-foreground/30">
          Made with ❤️
        </span>
      </motion.div>
    </motion.div>
  );
};

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-border/25 bg-card overflow-hidden"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="px-4 py-2.5 flex items-center gap-2">
        <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">{title}</span>
      </div>
      {children}
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
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-muted/60 to-muted/30 flex items-center justify-center text-muted-foreground shrink-0">
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
