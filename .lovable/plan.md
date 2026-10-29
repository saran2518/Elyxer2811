# Onboarding footer links audit (modules 1 to 3)

No code changes. This is the findings report. Of the footer links that aren't navigation, none point to a URL or a page. They are all placeholders.

## Module 1: Account (src/pages/OnboardingModule1.tsx)

| Screen | Link text | Points to | File |
|---|---|---|---|
| Phone number | "What if my phone number changes?" | Nothing (placeholder) | src/components/onboarding/PhoneStep.tsx |
| Phone code | "Resend code" | Resets the timer and the code (doesn't open a page) | src/components/onboarding/PhoneOTPStep.tsx |
| Phone code | "Change phone number" | Goes back to the Phone number step | src/components/onboarding/PhoneOTPStep.tsx |
| Name | "Can i change my name later?" | Nothing (placeholder) | src/components/onboarding/NameStep.tsx |
| Email | "Skip for now" | Skips the email step | src/components/onboarding/EmailStep.tsx |
| Email code | "Resend code" | Resets the timer and the code | src/components/onboarding/EmailOTPStep.tsx |
| Email code | "Change mail id" | Goes back to the Email step | src/components/onboarding/EmailOTPStep.tsx |

## Module 2: About you (src/pages/OnboardingModule2.tsx)

| Screen | Link text | Points to | File |
|---|---|---|---|
| Age | "Can I change this later?" | Nothing (placeholder) | src/components/onboarding/AgeStep.tsx |
| Age (under-18 pop-up) | "Contact support" | Nothing (placeholder) | src/components/onboarding/AgeStep.tsx |
| Age (under-18 pop-up) | "Terms of Service" | Nothing (plain text, styled as a link) | src/components/onboarding/AgeStep.tsx |
| Age (under-18 pop-up) | "Privacy Policy" | Nothing (plain text, styled as a link) | src/components/onboarding/AgeStep.tsx |
| Gender | "Are we missing something? Let us know" | Nothing (plain text, styled as a link) | src/components/onboarding/GenderStep.tsx |
| Pronouns | No footer link (only the Continue arrow) | n/a | src/components/onboarding/PronounStep.tsx |

## Module 3: Dating (src/pages/OnboardingModule3.tsx)

| Screen | Link text | Points to | File |
|---|---|---|---|
| Orientation | "Learn more" | Nothing (placeholder) | src/components/onboarding/OrientationStep.tsx |
| Dating preference | "Learn more" | Nothing (placeholder) | src/components/onboarding/DatingPreferenceStep.tsx |
| Dating goals | No footer link (only the Continue arrow) | n/a | src/components/onboarding/DatingGoalsStep.tsx |

## Note
The routes for Terms (/terms-of-use) and Privacy (/privacy-policy) already exist, so the placeholders could be linked to them later if you want.
