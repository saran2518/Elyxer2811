/* ============================================================
   ============  EARLY ACCESS — MASTER SWITCH  ================
   ============================================================

   This is the one place to control Early Access mode.

   EARLY_ACCESS_MODE = true   → Early Access is ON:
       • Discover shows the welcome screen (founding member,
         Instagram CTA) with no profile cards or actions
       • Moments, Interests, Chat show their intro screens
       • Locked settings/features open the "Your spot is saved"
         sheet instead of navigating
       • Profile shows the complimentary Plus plan

   EARLY_ACCESS_MODE = false  → Early Access is OFF:
       the app behaves exactly as the full version.

   Flip the value below and the whole app updates instantly.
   ============================================================ */

export const EARLY_ACCESS_MODE = true;
