/* ============================================================
   =======  INTERESTS — FREE-MODE LOCKS (temporary)  ==========
   ============================================================

   This is the one place to control whether the Interests
   screen hides activity from free members.

   INTERESTS_FREE_MODE_LOCKS = true   → Locked behaviour:
       • the Free / Plus switch shows in the Interests header
       • every vibe and invite after the first is blurred and
         opens the Subscribe page when tapped

   INTERESTS_FREE_MODE_LOCKS = false  → Everything open:
       • no Free / Plus switch in the header
       • every vibe and invite is visible and tappable

   Flip the value below when you want the locks back.
   ============================================================ */

export const INTERESTS_FREE_MODE_LOCKS = false;
