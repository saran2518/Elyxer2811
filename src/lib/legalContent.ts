export type LegalKey = "terms" | "privacy" | "cookies";

export const LEGAL_CONTENT: Record<LegalKey, { title: string; body: { heading?: string; paragraphs: string[] }[] }> = {
  terms: {
    title: "Terms of Service",
    body: [
      {
        paragraphs: [
          "Welcome to Elyxer. By creating an account or using our services, you agree to these Terms of Service. Please read them carefully.",
        ],
      },
      {
        heading: "1. Eligibility",
        paragraphs: [
          "You must be at least 18 years old to use Elyxer. By using the app you represent that you meet this requirement and that the information you provide is accurate.",
        ],
      },
      {
        heading: "2. Your Account",
        paragraphs: [
          "You are responsible for keeping your account credentials secure and for all activity that occurs under your account. Notify us immediately of any unauthorized use.",
        ],
      },
      {
        heading: "3. Acceptable Use",
        paragraphs: [
          "You agree not to use Elyxer to harass, harm, impersonate, or deceive others, to post unlawful content, or to attempt to disrupt the service.",
        ],
      },
      {
        heading: "4. Content",
        paragraphs: [
          "You retain ownership of the content you submit, but grant Elyxer a worldwide, non-exclusive license to host, display, and distribute it for the purpose of operating the service.",
        ],
      },
      {
        heading: "5. Termination",
        paragraphs: [
          "We may suspend or terminate your access to Elyxer at any time if you violate these terms or use the service in a harmful way.",
        ],
      },
      {
        heading: "6. Changes",
        paragraphs: [
          "We may update these terms from time to time. Continued use of the service after changes are posted means you accept the updated terms.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      {
        paragraphs: [
          "This Privacy Policy explains how Elyxer collects, uses, and protects your personal information.",
        ],
      },
      {
        heading: "Information We Collect",
        paragraphs: [
          "We collect information you provide directly (such as your name, photos, age, preferences, and contact details) and information generated through your use of the app (such as device info, interactions, and approximate location).",
        ],
      },
      {
        heading: "How We Use Your Information",
        paragraphs: [
          "We use your information to operate and personalize the service, match you with compatible profiles, communicate with you, and keep Elyxer safe.",
        ],
      },
      {
        heading: "Sharing",
        paragraphs: [
          "We do not sell your personal information. We share data only with service providers who help us run Elyxer, or when required by law.",
        ],
      },
      {
        heading: "Your Choices",
        paragraphs: [
          "You can review, update, or delete your profile information at any time from the app's settings. You may also request deletion of your account.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          "For privacy questions, please reach out through the Contact Support page inside the app.",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookies Policy",
    body: [
      {
        paragraphs: [
          "This Cookies Policy explains how Elyxer uses cookies and similar technologies.",
        ],
      },
      {
        heading: "What Are Cookies",
        paragraphs: [
          "Cookies are small text files stored on your device that help websites and apps function and remember your preferences.",
        ],
      },
      {
        heading: "How We Use Cookies",
        paragraphs: [
          "We use cookies to keep you signed in, remember your preferences, measure how the service is used, and improve performance and security.",
        ],
      },
      {
        heading: "Managing Cookies",
        paragraphs: [
          "Most browsers let you control cookies through their settings. Disabling cookies may affect certain features of Elyxer.",
        ],
      },
      {
        heading: "Updates",
        paragraphs: [
          "We may update this Cookies Policy from time to time. Please check back periodically for any changes.",
        ],
      },
    ],
  },
};
