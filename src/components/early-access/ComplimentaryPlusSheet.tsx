import { Sparkles } from "lucide-react";
import { EarlyAccessSheet } from "./EarlyAccessProvider";

/**
 * "Plus is on us" sheet — shown automatically the first time a user
 * opens the Profile page in Early Access mode (tracked per user in the
 * database via has_seen_plus_popup).
 */
const ComplimentaryPlusSheet = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <EarlyAccessSheet
    open={open}
    onClose={onClose}
    icon={<Sparkles style={{ width: 26, height: 26, color: "#3D2E0A" }} />}
    badge={
      <span
        className="mb-2 text-[9.5px] font-bold uppercase tracking-[0.22em] px-3 py-1 rounded-full"
        style={{
          background: "rgba(184,137,46,0.12)",
          border: "0.5px solid rgba(184,137,46,0.4)",
          color: "#8A6A1F",
        }}
      >
        Complimentary Plus
      </span>
    }
    title="Plus is on us"
    bodies={[
      "We're a growing community. While we grow in Bengaluru, Plus is complimentary for early members.",
      "Upgrading and adding extra Invites, Magic Search and Virtual dates will open when Elyxer opens to everyone.",
    ]}
  />
);

export default ComplimentaryPlusSheet;
