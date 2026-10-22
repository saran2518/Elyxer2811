import { supabase } from "@/integrations/supabase/client";

/**
 * Early Access mode is controlled by the master switch in
 * `src/config/earlyAccess.ts` — edit it there.
 */
export { EARLY_ACCESS_MODE } from "@/config/earlyAccess";


/** Placeholder — replace with the real Elyxer Instagram profile URL. */
export const INSTAGRAM_URL = "https://instagram.com/elyxer";

/** Illustrative community total, not a live membership count. */
export function referenceEarlyAccessTotal(memberNumber: number | null): number {
  return memberNumber !== null && Number.isSafeInteger(memberNumber) && memberNumber > 0
    ? memberNumber + 37
    : 2845;
}

/** Only a successful positive total is eligible for display. */
export function visibleEarlyAccessTotal(value: unknown): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : null;
}

export async function getEarlyAccessTotal(): Promise<number | null> {
  try {
    const { data, error } = await supabase.rpc("get_early_access_total");
    return error ? null : visibleEarlyAccessTotal(data);
  } catch {
    return null;
  }
}

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
