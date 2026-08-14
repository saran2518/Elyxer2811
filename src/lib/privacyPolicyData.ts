export type PolicyBlock =
  | { type: "p"; text: string }
  | { type: "sub"; text: string }
  | { type: "list"; items: string[] }
  | { type: "note"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "fields"; items: { label: string; value: string }[] };

export interface PolicySection {
  number: string;
  title: string;
  blocks: PolicyBlock[];
}

export const policyMeta = {
  company: "PROAPEX INNOVATIONS PRIVATE LIMITED",
  version: "Version 1.0",
  effective: "Effective Date: [INSERT DATE]",
  updated: "Last Updated: [INSERT DATE]",
  notice:
    "This Privacy Policy applies to all users of the Elyxer application and related services operated by PROAPEX INNOVATIONS PRIVATE LIMITED. By registering or using Elyxer, you acknowledge that you have read, understood, and agreed to the collection and use of your personal data as described herein. This policy is compliant with the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000 and Rules thereunder.",
  footer:
    "This Privacy Policy was drafted in compliance with the Digital Personal Data Protection Act, 2023 (India), the Information Technology Act, 2000, and the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.",
  copyright: "© 2024 PROAPEX INNOVATIONS PRIVATE LIMITED. All rights reserved.",
};

export const policySections: PolicySection[] = [
  {
    number: "1",
    title: "About Us",
    blocks: [
      {
        type: "p",
        text: "Elyxer is a dating and social connection application owned and operated by PROAPEX INNOVATIONS PRIVATE LIMITED, a company incorporated under the Companies Act, 2013 in India.",
      },
      {
        type: "fields",
        items: [
          { label: "Registered Name", value: "PROAPEX INNOVATIONS PRIVATE LIMITED" },
          { label: "Application Name", value: "Elyxer" },
          {
            label: "Registered Address",
            value:
              "Unit 101, Oxford Towers, 139, HAL Old Airport Road, Kodihalli, Bengaluru, Karnataka - 560008, India",
          },
          { label: "Email", value: "support@elyxer.co" },
          { label: "Website", value: "www.elyxer.co" },
        ],
      },
      {
        type: "p",
        text: "Data Fiduciary: PROAPEX INNOVATIONS PRIVATE LIMITED is the Data Fiduciary under the Digital Personal Data Protection Act, 2023, and is responsible for all decisions relating to the processing of your personal data.",
      },
    ],
  },
  {
    number: "2",
    title: "Scope and Applicability",
    blocks: [
      { type: "p", text: "This Privacy Policy applies to:" },
      {
        type: "list",
        items: [
          "All users who download, install, register, or use the Elyxer mobile application;",
          "All personal data collected through the app, our website, customer support channels, and any related services;",
          "Users located in India. If you access Elyxer from outside India, please be aware that your data may be processed in India and in AWS data centres outside India.",
        ],
      },
      {
        type: "p",
        text: "Elyxer is strictly intended for users who are 18 years of age or older. We enforce this as follows:",
      },
      {
        type: "list",
        items: [
          "During registration, users are required to enter their date of birth. Our system automatically calculates the user's age from this entry.",
          "Users are then shown their calculated age and asked to explicitly confirm it before proceeding.",
          "Accounts where the entered date of birth indicates the user is below 18 years of age are automatically placed on hold and access to the application is suspended.",
          "A held account may only be reactivated by our support team upon the user providing valid proof of age (such as a government-issued ID). Until such proof is verified and approved, the account remains inaccessible.",
          "We do not knowingly collect or process personal data of persons below the age of 18. If we discover that a minor has provided data without valid age verification, we will permanently delete such data.",
        ],
      },
    ],
  },
  {
    number: "3",
    title: "Personal Data We Collect",
    blocks: [
      {
        type: "p",
        text: "We collect the following categories of personal data during your use of Elyxer. Where data is classified as Sensitive Personal Data under the DPDP Act 2023, explicit consent is obtained separately before collection.",
      },
      { type: "sub", text: "3.1 Onboarding & Identity Data" },
      {
        type: "table",
        headers: ["Data Point", "Purpose", "Sensitivity"],
        rows: [
          ["Mobile Number", "Account verification via OTP only; not stored post-verification", "Moderate"],
          ["Full Name", "Display name on your profile", "Low"],
          ["Email Address", "Account verification & service notifications", "Moderate"],
          ["Date of Birth / Age", "Age verification (18+ gate); profile display", "Moderate"],
        ],
      },
      { type: "sub", text: "3.2 Sensitive Personal Data" },
      {
        type: "table",
        headers: ["Data Point", "Purpose", "Legal Basis"],
        rows: [
          ["Gender & Gender Identity", "Profile personalisation and matching", "Explicit Consent (DPDP Act, S.4)"],
          ["Pronouns", "Profile display and user experience", "Explicit Consent (DPDP Act, S.4)"],
          ["Sexual Orientation", "Matching preferences and dating goals", "Explicit Consent (DPDP Act, S.4)"],
          ["Dating Gender Preference", "Core matching functionality", "Explicit Consent (DPDP Act, S.4)"],
          ["Dating Goals", "Matching quality and compatibility", "Explicit Consent (DPDP Act, S.4)"],
        ],
      },
      {
        type: "note",
        text: "The sensitive personal data listed above is collected only after your explicit, informed, and separate consent. You may withdraw this consent at any time through your account settings, though doing so may affect certain features of Elyxer.",
      },
      { type: "sub", text: "3.3 Profile & Lifestyle Data" },
      {
        type: "table",
        headers: ["Data Point", "Purpose", "Sensitivity"],
        rows: [
          ["Education", "Profile display and matching", "Low"],
          ["Profession / Occupation", "Profile display and matching", "Low"],
          ["Location (City/Area)", "Proximity-based matching", "Moderate"],
          ["Height", "Profile display preference", "Low"],
          ["Languages Spoken", "Compatibility matching", "Low"],
          ["Profile Photos", "Profile display; AI moderation for safety", "Moderate"],
        ],
      },
      { type: "sub", text: "3.4 AI-Generated Profile Data" },
      {
        type: "p",
        text: "When you provide descriptive inputs during onboarding (such as your bio, interests, and narratives), Elyxer uses artificial intelligence to:",
      },
      {
        type: "list",
        items: [
          "Process your free-text inputs and convert them into structured profile data;",
          "Generate your Profile Studio components including My Story, Interests, Narratives, and Join Me For sections;",
          "Power the Magic Search feature, which uses AI to identify users with similar interests and compatibility signals.",
        ],
      },
      {
        type: "p",
        text: "You retain the right to review, edit, or delete any AI-generated profile content through your account settings. AI-generated data is derived from information you voluntarily provide and is not used to make legally binding automated decisions about you.",
      },
      { type: "sub", text: "3.5 Technical & Usage Data" },
      {
        type: "list",
        items: [
          "Device information (device type, OS version, unique device identifiers);",
          "App usage data (features used, session duration, interaction logs);",
          "Log data (IP address, timestamps, crash reports);",
          "Push notification tokens (for service notifications).",
        ],
      },
      { type: "sub", text: "3.6 Payment & Subscription Data" },
      {
        type: "p",
        text: "For paid subscription features, payment processing is handled by our third-party payment gateway partner(s). We do not store your full card numbers or CVV on our servers. We retain:",
      },
      {
        type: "list",
        items: [
          "Transaction reference IDs and subscription status;",
          "Billing name and email for invoice generation;",
          "Payment history for dispute resolution.",
        ],
      },
    ],
  },
  {
    number: "4",
    title: "How We Collect Your Data",
    blocks: [
      {
        type: "list",
        items: [
          "Directly from you during account registration and onboarding;",
          "Through your active use of app features (profile updates, searches, interactions);",
          "Automatically via device and usage tracking technologies;",
          "From third-party services where you log in via Google or Apple Sign-In (limited to email and name);",
          "From payment processors upon completion of a subscription transaction.",
        ],
      },
    ],
  },
  {
    number: "5",
    title: "Purpose of Processing and Legal Basis",
    blocks: [
      {
        type: "table",
        headers: ["Purpose", "Legal Basis", "Data Used"],
        rows: [
          ["Account creation & verification", "Contractual necessity", "Mobile, Email, Name"],
          ["Core matching & recommendations", "Explicit Consent", "Sensitive data, preferences"],
          ["AI profile generation", "Explicit Consent + Legitimate Interest", "Profile inputs, photos"],
          ["Magic Search feature", "Explicit Consent", "Interests, preferences"],
          ["Service notifications & alerts", "Contractual necessity", "Email, Push token"],
          ["Subscription & billing", "Contractual necessity", "Payment data"],
          ["Safety & fraud prevention", "Legal obligation", "Usage logs, device data"],
          ["Product improvement & analytics", "Legitimate Interest", "Anonymised usage data"],
          ["Legal compliance", "Legal obligation", "As required by law"],
        ],
      },
    ],
  },
  {
    number: "6",
    title: "Data Storage and Infrastructure",
    blocks: [
      {
        type: "p",
        text: "Elyxer uses Amazon Web Services (AWS) as its cloud infrastructure provider. Our primary data infrastructure is hosted on AWS ap-south-1 (Mumbai, India). For operational requirements such as disaster recovery, performance, and service reliability, certain data may also be processed on additional AWS regions globally (including but not limited to Asia Pacific, US East, and EU regions).",
      },
      {
        type: "p",
        text: "We are committed to keeping your data stored in India as our primary location. Where data is transferred outside India, we ensure such transfers are carried out in compliance with applicable Indian law, including the DPDP Act 2023, and that AWS maintains equivalent data protection standards through internationally recognised certifications including ISO 27001 and SOC 2 Type II.",
      },
      {
        type: "p",
        text: "As and when the Central Government of India notifies specific countries or frameworks for permissible cross-border data transfers under the DPDP Act, we will ensure full compliance with such notifications and update this policy accordingly.",
      },
    ],
  },
  {
    number: "7",
    title: "Data Retention",
    blocks: [
      {
        type: "table",
        headers: ["Data Category", "Retention Period", "Notes"],
        rows: [
          ["Account & profile data", "Until account deletion + 90 days", "Retained for dispute resolution"],
          [
            "Deactivated account data",
            "Until reactivation or deletion request",
            "Full data retained; profile hidden from other users",
          ],
          [
            "Sensitive personal data",
            "Until consent withdrawn or account deleted",
            "Deleted upon withdrawal of consent",
          ],
          ["AI-generated profile data", "Until account deletion", "User may edit/delete anytime"],
          ["Payment transaction records", "7 years", "Required by Indian tax laws"],
          ["Usage & log data", "12 months rolling", "Anonymised after 12 months"],
          ["Verification data (OTP logs)", "30 days", "Deleted post-verification period"],
          [
            "Chat messages & conversation data",
            "90 days after account deletion",
            "Retained for safety investigations; encrypted at rest",
          ],
          [
            "Virtual date room session data",
            "90 days after session or account deletion",
            "Session metadata retained; recordings not stored",
          ],
          [
            "Invite / Vibe / interaction data",
            "90 days after account deletion",
            "Retained for safety and abuse investigations",
          ],
          [
            "Blocked / reported user data",
            "As long as legally required",
            "Retained for safety investigations and legal compliance even after account deletion",
          ],
        ],
      },
      {
        type: "p",
        text: "Upon deletion of your account, we will delete or anonymise your personal data within 90 days, except where retention is required by applicable law.",
      },
      { type: "sub", text: "7.1 Account Deactivation vs Deletion" },
      { type: "p", text: "Elyxer offers two options for users who wish to stop using the app:" },
      {
        type: "list",
        items: [
          "Deactivation (Pause): Your account and profile are hidden from other users immediately. Your data is fully retained on our servers. You may reactivate your account at any time and your profile will be restored exactly as you left it. Deactivation does not trigger any data deletion.",
          "Permanent Deletion: Your account and all associated personal data (except data we are legally required to retain) are permanently deleted within 90 days of your request. This action is irreversible. Deleted accounts cannot be recovered.",
        ],
      },
      {
        type: "p",
        text: "To deactivate or delete your account, go to Account Settings > Privacy Controls, or contact our support team at support@elyxer.co.",
      },
    ],
  },
  {
    number: "8",
    title: "How We Share Your Data",
    blocks: [
      {
        type: "p",
        text: "We do not sell your personal data to any third party. We may share your data only in the following circumstances:",
      },
      { type: "sub", text: "8.1 Service Providers" },
      {
        type: "p",
        text: "We share data with trusted third-party service providers who process data on our behalf under strict data processing agreements, including:",
      },
      {
        type: "list",
        items: [
          "Cloud infrastructure: Amazon Web Services (AWS);",
          "Payment processing: [INSERT PAYMENT GATEWAY NAME e.g. Razorpay / PayU];",
          "Analytics: [e.g. Firebase Analytics / Mixpanel] — anonymised data only;",
          "Customer support tools: [e.g. Freshdesk / Intercom];",
          "SMS / OTP verification: [e.g. Exotel / MSG91].",
        ],
      },
      { type: "sub", text: "8.2 Legal Obligations" },
      {
        type: "p",
        text: "We may disclose your data to law enforcement, government agencies, or courts when required by law, court order, or lawful governmental request, including under the Information Technology Act, 2000 and applicable Rules.",
      },
      { type: "sub", text: "8.3 Business Transfers" },
      {
        type: "p",
        text: "In the event of a merger, acquisition, or sale of all or part of our business, your personal data may be transferred to the successor entity. You will be notified of such transfer and any material changes to this policy.",
      },
      { type: "sub", text: "8.4 With Your Consent" },
      {
        type: "p",
        text: "We may share your data with other parties where you have given explicit consent to do so.",
      },
    ],
  },
  {
    number: "9",
    title: "Your Rights Under the DPDP Act 2023",
    blocks: [
      {
        type: "p",
        text: "As a Data Principal under the Digital Personal Data Protection Act, 2023, you have the following rights with respect to your personal data:",
      },
      {
        type: "table",
        headers: ["Right", "What It Means", "How to Exercise"],
        rows: [
          ["Right to Access", "Know what data we hold about you", "Account Settings > My Data"],
          ["Right to Correction", "Correct inaccurate or incomplete data", "Edit Profile or Contact Us"],
          ["Right to Erasure", "Request deletion of your personal data", "Account Settings > Delete Account"],
          [
            "Right to Grievance Redressal",
            "Raise complaints about data processing",
            "Contact Grievance Officer (see below)",
          ],
          [
            "Right to Withdraw Consent",
            "Withdraw consent for sensitive data processing",
            "Account Settings > Privacy Controls",
          ],
          [
            "Right to Nominate",
            "Nominate someone to exercise rights on your behalf in case of death/incapacity",
            "Contact Grievance Officer",
          ],
        ],
      },
      {
        type: "p",
        text: "We will respond to all valid requests within 30 days of receipt. In complex cases, we may request an extension and will notify you accordingly.",
      },
    ],
  },
  {
    number: "10",
    title: "Grievance Redressal",
    blocks: [
      {
        type: "p",
        text: "In accordance with the Information Technology Act, 2000, IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and the DPDP Act 2023, we have appointed a Grievance Officer to address concerns regarding the processing of your personal data.",
      },
      {
        type: "fields",
        items: [{ label: "Grievance Email", value: "grievance@elyxer.co" }],
      },
      {
        type: "p",
        text: "If you are not satisfied with our response, you may escalate your complaint to the Data Protection Board of India, once constituted under the DPDP Act 2023.",
      },
    ],
  },
  {
    number: "11",
    title: "Data Security",
    blocks: [
      {
        type: "p",
        text: "We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, alteration, or disclosure. Our security measures include:",
      },
      {
        type: "list",
        items: [
          "End-to-end encryption for data in transit (TLS 1.2 or higher);",
          "Encryption of data at rest for sensitive personal data categories;",
          "Role-based access controls limiting internal access to personal data;",
          "Regular security audits and vulnerability assessments;",
          "AWS security controls including VPC, IAM, and CloudTrail logging;",
          "Incident response and breach notification procedures.",
        ],
      },
      {
        type: "p",
        text: "In the event of a personal data breach that is likely to result in a risk to your rights, we will notify you and the relevant authorities as required under the DPDP Act 2023.",
      },
    ],
  },
  {
    number: "12",
    title: "Artificial Intelligence and Automated Processing",
    blocks: [
      { type: "p", text: "Elyxer uses AI and machine learning in the following ways:" },
      { type: "sub", text: "12.1 AI Profile Generation (Profile Studio)" },
      {
        type: "p",
        text: "Your free-text inputs during onboarding are processed by our AI to generate structured profile sections (My Story, Interests, Narratives, Join Me For). This processing helps create richer, more expressive profiles. You can edit or delete any AI-generated content at any time.",
      },
      { type: "sub", text: "12.2 Magic Search" },
      {
        type: "p",
        text: "Our Magic Search feature uses AI algorithms to identify and suggest users with similar interests and compatible traits. This involves automated analysis of your profile data and preferences. This feature does not produce legally binding decisions and is intended purely to facilitate connections between users.",
      },
      {
        type: "p",
        text: "You have the right to opt out of AI-based profiling features by contacting us at support@elyxer.co or through your privacy settings. Opting out may limit certain features of the application.",
      },
      { type: "sub", text: "12.3 Profile Photo and Content Moderation" },
      {
        type: "p",
        text: "All profile photos and bio content uploaded by users are subject to moderation to ensure the safety and integrity of the Elyxer community. Our moderation process uses a combination of:",
      },
      {
        type: "list",
        items: [
          "Automated AI scanning — profile photos and text inputs are automatically reviewed for content that violates our Community Guidelines, including explicit, offensive, or inappropriate material;",
          "Manual review by our trust and safety team — flagged content is escalated to human reviewers for a final determination.",
        ],
      },
      {
        type: "p",
        text: "Photos or content found to be in violation of our guidelines may be removed without prior notice. Repeated violations may result in account suspension or permanent termination. Users may appeal any moderation decision by contacting grievance@elyxer.co.",
      },
      {
        type: "note",
        text: "Our AI moderation systems process your photos solely for safety and policy compliance purposes. This processing does not constitute biometric identification and the results are not used for any purpose beyond content moderation.",
      },
    ],
  },
  {
    number: "13",
    title: "Messaging, Chat and Virtual Date Rooms",
    blocks: [
      {
        type: "p",
        text: "Elyxer facilitates connections through a unique interaction system — users can send Invites, express interest through Vibes, and when both users Vibe Back, a chat conversation is unlocked. Users may also engage in Virtual Date Rooms for real-time interaction.",
      },
      { type: "sub", text: "13.1 How Our Interaction System Works" },
      { type: "p", text: "The Elyxer connection flow works as follows:" },
      {
        type: "list",
        items: [
          "Invite: A user sends an invite to another user expressing interest;",
          "Vibe: A user expresses a positive reaction to another user's profile or Moment;",
          "Vibe Back: When both users Vibe each other, a chat conversation is automatically unlocked;",
          "Chat: Text-based messaging between two users who have mutually Vibed;",
          "Virtual Date Room: A dedicated in-app space for real-time interaction between connected users.",
        ],
      },
      { type: "sub", text: "13.2 Data Collected Through Messaging" },
      {
        type: "p",
        text: "When you use Elyxer's messaging and interaction features, we collect and process the following data:",
      },
      {
        type: "list",
        items: [
          "Content of text messages sent and received through the chat feature;",
          "Invite and Vibe interaction logs (who sent, who received, timestamps);",
          "Virtual Date Room session metadata (session duration, participants, timestamps);",
          "Message delivery and read status;",
          "Any media or content shared within chats (where applicable).",
        ],
      },
      { type: "sub", text: "13.3 Message Storage and Encryption" },
      {
        type: "p",
        text: "Your chat messages and interaction data are stored on our secure AWS infrastructure. We implement the following protections:",
      },
      {
        type: "list",
        items: [
          "All messages and interaction data are encrypted at rest using industry-standard encryption;",
          "All data in transit between your device and our servers is protected using TLS 1.2 or higher;",
          "Access to message content is strictly limited to authorised personnel for safety investigation purposes only.",
        ],
      },
      {
        type: "note",
        text: "Elyxer does not currently offer end-to-end encryption (E2E) for messages. This means message content is accessible to our systems for moderation, safety, and legal compliance purposes. We will update this policy if E2E encryption is implemented in future.",
      },
      { type: "sub", text: "13.4 Virtual Date Rooms" },
      {
        type: "p",
        text: "Virtual Date Rooms enable real-time interaction between connected users. We wish to clarify:",
      },
      {
        type: "list",
        items: [
          "Virtual Date Room sessions are not recorded or stored by Elyxer;",
          "Session metadata (duration, participants, timestamps) is retained for 90 days for safety and operational purposes;",
          "Users are solely responsible for their conduct during Virtual Date sessions and must comply with our Community Guidelines at all times.",
        ],
      },
      { type: "sub", text: "13.5 Message Data Upon Account Deletion" },
      { type: "p", text: "When you permanently delete your Elyxer account:" },
      {
        type: "list",
        items: [
          "Your chat messages and interaction data will be removed from active systems within 90 days;",
          "For safety investigation purposes, message data may be retained beyond 90 days where a report or complaint has been filed involving your account, and for as long as is legally required to resolve such matters;",
          "The other party in a conversation will no longer be able to see your profile, but may retain visibility of previously exchanged messages during the 90-day transition period;",
          "Invite and Vibe interaction logs associated with your account will be anonymised or deleted within 90 days.",
        ],
      },
    ],
  },
  {
    number: "14",
    title: "Profile Visibility and Discovery",
    blocks: [
      {
        type: "p",
        text: "Understanding how your profile is visible to others is important on a social connection platform. This section explains Elyxer's profile visibility model.",
      },
      { type: "sub", text: "14.1 Default Visibility" },
      {
        type: "p",
        text: "By default, your Elyxer profile — including your display name, photos, Profile Studio content (My Story, Interests, Narratives, Join Me For), age, and general location — is visible to all registered users on the Elyxer platform, subject to the following:",
      },
      {
        type: "list",
        items: [
          "Your profile is shown to users based on the Magic Search algorithm, which considers interests, preferences, and compatibility signals;",
          "Your precise location is never displayed — only a general area or approximate distance is shown to other users;",
          "Sensitive profile data such as sexual orientation and gender identity is displayed only to the extent you choose to include it on your profile.",
        ],
      },
      { type: "sub", text: "14.2 Moments" },
      {
        type: "p",
        text: "Elyxer allows users to post Moments — short-form content visible to other users on the platform. Moments are subject to the same moderation standards as profile content. You may delete your Moments at any time through your profile settings. Moments posted by you are visible to all Elyxer users unless deleted.",
      },
      { type: "sub", text: "14.3 What You Should Know" },
      {
        type: "p",
        text: "As Elyxer is a discovery-based social connection platform, please be aware of the following:",
      },
      {
        type: "list",
        items: [
          "Other users may screenshot or save your profile content or Moments outside of the Elyxer platform. We strongly advise discretion when sharing personal information;",
          "Elyxer does not control how other users use information they see on your profile outside of the app;",
          "We recommend not sharing sensitive personal information such as your home address, workplace, or financial details through the platform.",
        ],
      },
    ],
  },
  {
    number: "15",
    title: "Block, Report and Safety Controls",
    blocks: [
      {
        type: "p",
        text: "Elyxer is committed to maintaining a safe and respectful community. We provide users with the following safety controls:",
      },
      { type: "sub", text: "15.1 Block" },
      {
        type: "list",
        items: [
          "You may block any other user at any time through their profile or within a chat conversation;",
          "When you block a user, they will no longer be able to view your profile, send you Invites, Vibes, or messages;",
          "Blocking is mutual in effect — you will also no longer see the blocked user's profile or content;",
          "Block actions are logged and retained by Elyxer for safety and platform integrity purposes.",
        ],
      },
      { type: "sub", text: "15.2 Report" },
      {
        type: "list",
        items: [
          "You may report any user profile, chat message, or Moment that you believe violates our Community Guidelines;",
          "Reports can be submitted through the relevant profile, message, or Moment using the in-app report function;",
          "All reports are reviewed by our trust and safety team, using a combination of automated tools and manual review;",
          "We will take appropriate action, which may include content removal, account suspension, or permanent termination of the reported user's account;",
          "The outcome of a report investigation will not be disclosed to the reporting user except in limited circumstances.",
        ],
      },
      { type: "sub", text: "15.3 Data Retained for Safety Investigations" },
      {
        type: "p",
        text: "To ensure the integrity and safety of the Elyxer platform, we retain the following data even after an account is deleted, for as long as is legally required or necessary to resolve an active safety investigation:",
      },
      {
        type: "list",
        items: [
          "Block and report logs including the nature of the report, content reported, and actions taken;",
          "Chat messages, Invite/Vibe interaction data, and Moment content relevant to a reported incident;",
          "Account and identity data of users who have been reported for serious violations (harassment, abuse, impersonation, etc.);",
          "This data is stored securely and accessible only to authorised trust and safety personnel and, where required by law, to law enforcement authorities.",
        ],
      },
    ],
  },
  {
    number: "16",
    title: "Cookies and Tracking Technologies",
    blocks: [
      {
        type: "p",
        text: "The Elyxer mobile application does not use browser cookies. However, we use similar tracking technologies including:",
      },
      {
        type: "list",
        items: [
          "Device identifiers and advertising IDs (for analytics and fraud prevention);",
          "Session tokens (for maintaining your login state);",
          "Firebase or equivalent SDKs for crash reporting and performance monitoring.",
        ],
      },
      {
        type: "p",
        text: "For detailed information on tracking technologies used in our app, please refer to our Cookie and Tracking Policy available at [INSERT LINK].",
      },
    ],
  },
  {
    number: "17",
    title: "Paid Subscriptions",
    blocks: [
      {
        type: "p",
        text: "Elyxer offers paid subscription plans that unlock premium features. By subscribing, you authorise us to process your payment through our third-party payment gateway. Auto-renewal terms, cancellation procedures, and refund eligibility are governed by our Refund and Cancellation Policy, available separately.",
      },
      {
        type: "p",
        text: "Payment data is processed by PCI-DSS compliant payment gateway partners. We do not retain your full card details on our systems.",
      },
    ],
  },
  {
    number: "18",
    title: "Third-Party Links and Services",
    blocks: [
      {
        type: "p",
        text: "Elyxer may contain links to third-party websites or integrate with third-party services (such as social sign-in providers). This Privacy Policy does not apply to third-party services. We encourage you to review the privacy policies of any third-party services you access through Elyxer.",
      },
    ],
  },
  {
    number: "19",
    title: "Changes to This Privacy Policy",
    blocks: [
      {
        type: "p",
        text: "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes:",
      },
      {
        type: "list",
        items: [
          "We will update the Effective Date at the top of this policy;",
          "We will notify you via in-app notification and/or email at least 15 days before changes take effect;",
          "For changes involving sensitive personal data or a new purpose of processing, we will seek your fresh explicit consent.",
        ],
      },
      {
        type: "p",
        text: "Your continued use of Elyxer after the effective date of the revised policy constitutes your acceptance of the changes.",
      },
    ],
  },
  {
    number: "20",
    title: "Contact Us",
    blocks: [
      {
        type: "p",
        text: "For any questions, requests, or concerns regarding this Privacy Policy or the processing of your personal data, please contact us at:",
      },
      {
        type: "fields",
        items: [
          { label: "Email", value: "support@elyxer.co" },
          { label: "Grievance Email", value: "grievance@elyxer.co" },
          {
            label: "Postal Address",
            value:
              "PROAPEX INNOVATIONS PRIVATE LIMITED, Unit 101, Oxford Towers, 139, HAL Old Airport Road, Kodihalli, Bengaluru, Karnataka - 560008, India",
          },
        ],
      },
    ],
  },
];
