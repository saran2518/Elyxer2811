import { supabase } from "@/integrations/supabase/client";

/**
 * Global Early Access switch.
 * true  → app runs in Early Access mode (locked features behind the
 *         "Your spot is saved" sheet, Discover shows the welcome screen).
 * false → app behaves exactly as the full version.
 */
export const EARLY_ACCESS_MODE = true;

/** Placeholder — replace with the real Elyxer Instagram profile URL. */
export const INSTAGRAM_URL = "https://instagram.com/elyxer";

export type EarlyAccessMember = {
  memberNumber: number | null;
  hasSeenPlusPopup: boolean;
};

/**
 * Fetches the user's early-access membership row, creating it on first use.
 * The member number is the signup position (identity column = creation order).
 * Returns nulls when signed out so UI can degrade gracefully.
 */
export async function getEarlyAccessMember(): Promise<EarlyAccessMember> {
  const empty: EarlyAccessMember = { memberNumber: null, hasSeenPlusPopup: false };
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return empty;

  const { data: existing } = await supabase
    .from("early_access_members")
    .select("member_number, has_seen_plus_popup")
    .eq("user_id", uid)
    .maybeSingle();

  if (existing) {
    return {
      memberNumber: existing.member_number,
      hasSeenPlusPopup: existing.has_seen_plus_popup,
    };
  }

  const { data: inserted } = await supabase
    .from("early_access_members")
    .insert({ user_id: uid })
    .select("member_number, has_seen_plus_popup")
    .single();

  if (!inserted) return empty;
  return {
    memberNumber: inserted.member_number,
    hasSeenPlusPopup: inserted.has_seen_plus_popup,
  };
}

/** Marks the Complimentary Plus popup as seen for the current user. */
export async function markPlusPopupSeen(): Promise<void> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return;
  await supabase
    .from("early_access_members")
    .upsert({ user_id: uid, has_seen_plus_popup: true }, { onConflict: "user_id" });
}
