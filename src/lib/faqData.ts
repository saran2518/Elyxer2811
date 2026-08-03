export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  slug: string;
  title: string;
  subtitle: string;
  questions: FAQItem[];
}

export const faqCategories: FAQCategory[] = [
  {
    slug: "profile-account",
    title: "Profile & Account",
    subtitle: "We usually respond within 24 hours.",
    questions: [
      {
        question: "How do I edit my profile?",
        answer:
          "Open the Profile tab from the bottom navigation and tap Edit Profile. From there you can edit your current profile, create a new one via Profile Studio, or update any field in the About You section.",
      },
      {
        question: "How does Profile Studio work?",
        answer:
          "Profile Studio uses AI to help you craft an expressive dating profile. You share a few prompts about yourself and it generates a bio, narratives, interests, and Join Me For ideas. You can refine the tone and edit every section after it's generated.",
      },
      {
        question: "How do I update my details (education, location, etc.)?",
        answer:
          "Go to Profile › Edit Profile › About You. Tap any field — name, age, location, education, profession, height, languages, gender, orientation, or dating goals — to open a dedicated edit page. Your changes save when you tap Save Changes on the sticky bottom bar.",
      },
      {
        question: "How do I manage my photos?",
        answer:
          "On the Profile tab, tap the camera icon on your hero card or open Edit Profile and choose Manage Photos. You can add up to 6 photos, reorder them, and replace your verified selfie in the last slot.",
      },
      {
        question: "Why is my profile not visible?",
        answer:
          "Your profile may not be visible if onboarding is incomplete or your account is under review. Make sure you've added at least one photo and finished the About You basics. If the issue persists, contact support.",
      },
    ],
  },
  {
    slug: "discovery-preferences",
    title: "Discovery Preferences",
    subtitle: "We usually respond within 24 hours.",
    questions: [
      {
        question: "How do I refine who I see on Discover?",
        answer:
          "Open the Discover tab and tap the Magic Search icon at the top. You can filter the profile stack by age range, distance, gender, and height. Tap Apply to refresh the stack with your preferences.",
      },
      {
        question: "Why am I not seeing any profiles?",
        answer:
          "This usually happens when your Magic Search filters are too narrow. Try widening the age range or distance, or clearing filters from the Magic Search panel. Also check your internet connection.",
      },
      {
        question: "Can I reset my filters?",
        answer:
          "Yes. Open Magic Search on the Discover page and tap Reset to return age, distance, gender, and height to their defaults.",
      },
    ],
  },
  {
    slug: "invites-connections",
    title: "Invites & Vibes",
    subtitle: "We usually respond within 24 hours.",
    questions: [
      {
        question: "How do invites work?",
        answer:
          "On a profile, tap Invite to send a date idea — Coffee, Dinner, Movie, Virtual, Walk, Travel, Pets, or Other — with an optional message. If they accept, a chat thread opens automatically in your Chat tab.",
      },
      {
        question: "What's the difference between a Vibe and an Invite?",
        answer:
          "A Vibe is a lightweight signal of interest sent from a profile in Discover. An Invite is a specific date proposal with a category and message. Both appear in the other person's Interests tab.",
      },
      {
        question: "Where can I see invites and vibes I've sent or received?",
        answer:
          "Open the Interests tab from the bottom navigation. It shows the vibes and invites you've received, plus the ones you've sent and their status.",
      },
      {
        question: "How do I disconnect from someone?",
        answer:
          "Open the chat with that person, tap the three-dot menu in the top right, and choose Block. Blocking removes the connection and prevents further contact. You can also Report them from the same menu.",
      },
      {
        question: "Why can't I send more invites or vibes?",
        answer:
          "Free accounts have a daily limit on vibes and invites. Upgrading to Elyxer Plus or Infinity increases your daily quota — see the Subscriptions tab in your Profile for current limits.",
      },
    ],
  },
  {
    slug: "safety-privacy",
    title: "Safety & Privacy",
    subtitle: "We usually respond within 24 hours.",
    questions: [
      {
        question: "How do I block someone?",
        answer:
          "Open the chat with that person and tap the three-dot menu in the top right, then choose Block. You can also block from a profile in Discover via the more options menu. Blocking immediately removes the connection and prevents further contact.",
      },
      {
        question: "How do I report a user?",
        answer:
          "From a chat, tap the three-dot menu in the top right and choose Report. You can also report from a profile in Discover. Pick a reason — Inappropriate Content, Harassment, Fake Profile, Spam, or Other — and add details. Our team reviews reports within 24 hours.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Yes. We use industry-standard encryption to protect your data and never share your personal information with other users without your consent.",
      },
      {
        question: "Who can see my profile?",
        answer:
          "Only registered members in Elyxer can see your profile.",
      },
    ],
  },
  {
    slug: "payments",
    title: "Payments",
    subtitle: "We usually respond within 24 hours.",
    questions: [
      {
        question: "What subscription plans are available?",
        answer:
          "We offer several subscription tiers with different features. Visit the Subscriptions section in your Profile tab to see current plans and pricing.",
      },
      {
        question: "How do I cancel my subscription?",
        answer:
          "Go to Profile > Subscriptions > Manage Subscription. You can cancel anytime and your benefits will continue until the end of your billing period.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "Refund eligibility depends on your subscription type and when you purchased it. Contact support with your purchase details and we'll review your request.",
      },
    ],
  },
  {
    slug: "profile-studio",
    title: "Profile Studio",
    subtitle: "We usually respond within 24 hours.",
    questions: [
      {
        question: "What is Profile Studio?",
        answer:
          "Profile Studio is Elyxer's AI-powered profile builder. You write a few prompts about yourself and it generates a complete profile — bio, narratives, interests, and Join Me For ideas — that you can refine before publishing.",
      },
      {
        question: "Can I edit my AI-generated profile?",
        answer:
          "Yes. After Profile Studio generates your profile you can edit every section — bio, narratives, interests, and Join Me For experiences — directly from the results page or later from Profile › Edit Profile › Edit Current Profile.",
      },
      {
        question: "How do I create a new profile from scratch?",
        answer:
          "Open Profile › Edit Profile and tap Create New Profile. This opens the Profile Studio intro, then walks you through new prompts to generate a fresh profile. You can come back any time using the back button on the intro screen.",
      },
      {
        question: "Are there limits on profile generation?",
        answer:
          "Free users can generate a limited number of profiles. Elyxer Plus and Infinity subscribers get expanded generation limits — see the Subscriptions tab for details.",
      },
    ],
  },
];
