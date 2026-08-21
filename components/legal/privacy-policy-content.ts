/**
 * The Privacy Policy, kept as structured data rather than JSX so the modal can
 * build its table of contents, deep links and section tracking from the same
 * source the text is rendered from.
 */

export type ListItem = string | { text: string; items: string[] };

export type Block =
  | { type: "p"; text: string }
  | { type: "h4"; text: string }
  | { type: "list"; items: ListItem[] }
  | { type: "note"; text: string };

export type Section = {
  id: string;
  number: number;
  title: string;
  blocks: Block[];
};

export const PRIVACY_POLICY_META = {
  company: "Xbanka Limited",
  version: "1.0",
  effectiveDate: "July 17, 2026",
  lastUpdated: "July 17, 2026",
};

export const PRIVACY_POLICY_SECTIONS: Section[] = [
  {
    id: "introduction",
    number: 1,
    title: "Introduction",
    blocks: [
      {
        type: "p",
        text: 'Xbanka Limited ("Xbanka", "we", "our", or "us") is committed to protecting the privacy and personal information of our customers, partners, and website visitors. This Privacy Policy explains how we collect, use, store, disclose, and protect your personal information when you use our cryptocurrency exchange, gift card exchange, cross-border payment, remittance, and other financial technology services.',
      },
      {
        type: "p",
        text: "By accessing or using any Xbanka platform, website, mobile application, or services, you agree to the collection and use of your information in accordance with this Privacy Policy.",
      },
    ],
  },
  {
    id: "about-xbanka",
    number: 2,
    title: "About Xbanka",
    blocks: [
      {
        type: "p",
        text: "Xbanka Limited is a Nigerian financial technology company providing services including:",
      },
      {
        type: "list",
        items: [
          "Cryptocurrency buying and selling",
          "Gift card exchange",
          "Cross-border money transfers",
          "International remittance services",
          "Digital payment solutions",
          "Wallet and settlement services",
          "Business payment solutions",
        ],
      },
      {
        type: "p",
        text: "As a regulated business, Xbanka complies with applicable Nigerian laws relating to Anti-Money Laundering (AML), Counter-Terrorist Financing (CFT), Know Your Customer (KYC), and data protection.",
      },
    ],
  },
  {
    id: "information-we-collect",
    number: 3,
    title: "Information We Collect",
    blocks: [
      {
        type: "p",
        text: "We collect personal information necessary to provide our services and comply with legal obligations.",
      },
      { type: "h4", text: "A. Personal Information" },
      { type: "p", text: "This may include:" },
      {
        type: "list",
        items: [
          "Full name",
          "Date of birth",
          "Residential address",
          "Email address",
          "Phone number",
          "Nationality",
          "Occupation",
          {
            text: "Government-issued identification",
            items: [
              "National Identification Number (NIN)",
              "International Passport",
              "Driver's Licence",
              "Voter's Card",
            ],
          },
          "Selfie or biometric verification",
          "Utility bills",
          "Tax Identification Number (where applicable)",
        ],
      },
      { type: "h4", text: "B. Financial Information" },
      {
        type: "p",
        text: "Depending on the service used, we may collect:",
      },
      {
        type: "list",
        items: [
          "Bank account information",
          "Account name",
          "Bank Verification Number (BVN)",
          "Wallet addresses",
          "Cryptocurrency wallet information",
          "Transaction references",
          "Payment history",
          "Gift card details",
          "International transfer information",
        ],
      },
      { type: "h4", text: "C. Technical Information" },
      {
        type: "p",
        text: "When using our website or applications, we automatically collect:",
      },
      {
        type: "list",
        items: [
          "IP address",
          "Device type",
          "Operating system",
          "Browser information",
          "Device identifiers",
          "Login history",
          "Cookies",
          "Mobile application identifiers",
          "Time zone",
          "Language settings",
        ],
      },
      { type: "h4", text: "D. Transaction Information" },
      { type: "p", text: "We collect:" },
      {
        type: "list",
        items: [
          "Cryptocurrency transactions",
          "Gift card transactions",
          "Beneficiary details",
          "Sender details",
          "Transfer amounts",
          "Currency exchanged",
          "Exchange rates",
          "Wallet addresses",
          "Blockchain transaction hashes",
          "Payment confirmations",
        ],
      },
    ],
  },
  {
    id: "how-we-collect",
    number: 4,
    title: "How We Collect Information",
    blocks: [
      { type: "p", text: "Information is collected when you:" },
      {
        type: "list",
        items: [
          "Register an account",
          "Complete KYC verification",
          "Make deposits",
          "Buy or sell cryptocurrency",
          "Exchange gift cards",
          "Send cross-border payments",
          "Contact customer support",
          "Participate in surveys",
          "Use our website or mobile applications",
          "Interact with us through social media",
          "Communicate via email, chat, or telephone",
        ],
      },
    ],
  },
  {
    id: "why-we-collect",
    number: 5,
    title: "Why We Collect Your Information",
    blocks: [
      {
        type: "p",
        text: "We process your information for purposes including:",
      },
      { type: "h4", text: "Service Delivery" },
      {
        type: "list",
        items: [
          "Creating your account",
          "Processing transactions",
          "Facilitating cryptocurrency trades",
          "Executing gift card exchanges",
          "Processing international transfers",
          "Customer authentication",
        ],
      },
      { type: "h4", text: "Legal Compliance" },
      { type: "p", text: "To comply with:" },
      {
        type: "list",
        items: [
          "Nigerian Data Protection Act (NDPA) 2023",
          "Nigerian Data Protection Regulation (NDPR), where applicable",
          "Money Laundering (Prevention and Prohibition) Act",
          "Central Bank of Nigeria (CBN) regulations",
          "Nigerian Financial Intelligence Unit (NFIU) requirements",
          "Sanctions screening obligations",
          "Court orders",
          "Law enforcement requests",
        ],
      },
      { type: "h4", text: "Fraud Prevention" },
      { type: "p", text: "To:" },
      {
        type: "list",
        items: [
          "Prevent identity theft",
          "Detect fraudulent activities",
          "Monitor suspicious transactions",
          "Prevent account takeover",
          "Perform sanctions screening",
          "Conduct AML monitoring",
          "Protect customers",
        ],
      },
      { type: "h4", text: "Customer Support" },
      { type: "p", text: "To:" },
      {
        type: "list",
        items: [
          "Respond to enquiries",
          "Resolve complaints",
          "Improve user experience",
          "Provide transaction assistance",
        ],
      },
      { type: "h4", text: "Business Improvement" },
      { type: "p", text: "To:" },
      {
        type: "list",
        items: [
          "Improve products",
          "Develop new services",
          "Conduct analytics",
          "Perform risk assessments",
          "Monitor platform performance",
        ],
      },
    ],
  },
  {
    id: "legal-basis",
    number: 6,
    title: "Legal Basis for Processing",
    blocks: [
      { type: "p", text: "We process personal information based on:" },
      {
        type: "list",
        items: [
          "Your consent",
          "Performance of a contract",
          "Compliance with legal obligations",
          "Protection of vital interests",
          "Legitimate business interests",
          "Public interest where applicable",
        ],
      },
    ],
  },
  {
    id: "cookies",
    number: 7,
    title: "Cookies and Similar Technologies",
    blocks: [
      { type: "p", text: "Our website uses cookies to:" },
      {
        type: "list",
        items: [
          "Remember login preferences",
          "Improve website functionality",
          "Enhance security",
          "Measure website performance",
          "Prevent fraud",
          "Analyse website traffic",
        ],
      },
      {
        type: "p",
        text: "You may disable cookies through your browser settings, although certain features may become unavailable.",
      },
    ],
  },
  {
    id: "sharing",
    number: 8,
    title: "Sharing of Information",
    blocks: [
      { type: "note", text: "We do not sell your personal information." },
      { type: "p", text: "However, we may share information with:" },
      { type: "h4", text: "Banking Partners" },
      { type: "p", text: "To facilitate settlements and transfers." },
      { type: "h4", text: "Payment Service Providers" },
      { type: "p", text: "For payment processing." },
      { type: "h4", text: "Liquidity Providers" },
      { type: "p", text: "To execute cryptocurrency transactions." },
      { type: "h4", text: "Identity Verification Providers" },
      { type: "p", text: "For KYC verification." },
      { type: "h4", text: "Blockchain Analytics Providers" },
      { type: "p", text: "For AML monitoring and fraud detection." },
      { type: "h4", text: "Regulatory Authorities" },
      { type: "p", text: "Including:" },
      {
        type: "list",
        items: [
          "Central Bank of Nigeria (where applicable)",
          "Nigerian Financial Intelligence Unit",
          "Nigerian Police Force",
          "Economic and Financial Crimes Commission (EFCC)",
          "Independent Corrupt Practices Commission (ICPC)",
          "Courts of competent jurisdiction",
          "Other legally authorized agencies",
        ],
      },
      { type: "h4", text: "Technology Vendors" },
      {
        type: "p",
        text: "Cloud providers, hosting providers, cybersecurity providers, and communication service providers that support our operations under appropriate confidentiality and security obligations.",
      },
    ],
  },
  {
    id: "international-transfers",
    number: 9,
    title: "International Transfers of Personal Data",
    blocks: [
      {
        type: "p",
        text: "Because Xbanka provides international payment services, your personal information may be transferred outside Nigeria.",
      },
      {
        type: "p",
        text: "Where such transfers occur, we ensure appropriate safeguards are implemented, including:",
      },
      {
        type: "list",
        items: [
          "Contractual protections",
          "Secure data transmission",
          "Approved international processors",
          "Compliance with applicable Nigerian data protection laws",
        ],
      },
    ],
  },
  {
    id: "data-security",
    number: 10,
    title: "Data Security",
    blocks: [
      {
        type: "p",
        text: "We implement appropriate technical and organizational security measures, including:",
      },
      {
        type: "list",
        items: [
          "SSL/TLS encryption",
          "Multi-factor authentication",
          "Access controls",
          "Data encryption",
          "Secure servers",
          "Continuous security monitoring",
          "Firewalls",
          "Employee confidentiality obligations",
          "Periodic security audits",
          "Fraud detection systems",
        ],
      },
      {
        type: "p",
        text: "Despite our efforts, no electronic transmission or storage system can be guaranteed to be completely secure.",
      },
    ],
  },
  {
    id: "data-retention",
    number: 11,
    title: "Data Retention",
    blocks: [
      {
        type: "p",
        text: "We retain personal information only for as long as necessary to:",
      },
      {
        type: "list",
        items: [
          "Provide our services",
          "Resolve disputes",
          "Meet legal and regulatory obligations",
          "Comply with AML and CFT record-keeping requirements",
          "Enforce our agreements",
        ],
      },
      {
        type: "p",
        text: "Records may be retained for a minimum period required under applicable Nigerian law, including financial crime prevention regulations.",
      },
    ],
  },
  {
    id: "your-rights",
    number: 12,
    title: "Your Privacy Rights",
    blocks: [
      {
        type: "p",
        text: "Subject to applicable law, you have the right to:",
      },
      {
        type: "list",
        items: [
          "Access your personal information",
          "Request correction of inaccurate information",
          "Request deletion where legally permissible",
          "Withdraw consent where processing is based on consent",
          "Object to certain processing activities",
          "Restrict processing in appropriate circumstances",
          "Request portability of your information",
          "Lodge a complaint with the relevant data protection authority",
        ],
      },
      {
        type: "p",
        text: "Some requests may be limited where Xbanka is legally required to retain information for regulatory or financial crime prevention purposes.",
      },
    ],
  },
  {
    id: "marketing",
    number: 13,
    title: "Marketing Communications",
    blocks: [
      {
        type: "p",
        text: "With your consent or where otherwise permitted by law, we may send:",
      },
      {
        type: "list",
        items: [
          "Product updates",
          "Promotions",
          "Security alerts",
          "Service announcements",
          "Educational content",
        ],
      },
      {
        type: "p",
        text: "You may opt out of marketing communications at any time. We will continue to send essential transactional and security notifications related to your account.",
      },
    ],
  },
  {
    id: "childrens-privacy",
    number: 14,
    title: "Children's Privacy",
    blocks: [
      {
        type: "p",
        text: "Xbanka services are intended only for individuals who are at least 18 years old and legally capable of entering into binding agreements. We do not knowingly collect personal information from children. If we become aware that personal information has been collected from a minor, we will take appropriate steps to delete it, subject to applicable legal requirements.",
      },
    ],
  },
  {
    id: "third-party-websites",
    number: 15,
    title: "Third-Party Websites",
    blocks: [
      {
        type: "p",
        text: "Our platform may contain links to third-party websites. Xbanka is not responsible for the privacy practices, security, or content of those websites. We encourage users to review the privacy policies of any third-party sites they visit.",
      },
    ],
  },
  {
    id: "changes",
    number: 16,
    title: "Changes to This Privacy Policy",
    blocks: [
      {
        type: "p",
        text: "We may amend this Privacy Policy from time to time to reflect changes in our services, legal obligations, or business practices. Updated versions will be published on our website with a revised effective date. Continued use of our services after any update constitutes acceptance of the revised Privacy Policy.",
      },
    ],
  },
  {
    id: "contact-us",
    number: 17,
    title: "Contact Us",
    blocks: [
      {
        type: "p",
        text: "If you have questions, requests, or complaints regarding this Privacy Policy or the processing of your personal information, please contact:",
      },
    ],
  },
  {
    id: "regulatory-compliance",
    number: 18,
    title: "Regulatory Compliance Statement",
    blocks: [
      {
        type: "p",
        text: "Xbanka Limited is committed to maintaining the highest standards of privacy, confidentiality, cybersecurity, and financial crime compliance. We process personal information in accordance with applicable Nigerian data protection legislation and maintain robust internal controls to safeguard customer information while meeting our obligations under AML, CFT, sanctions, and other applicable regulatory frameworks.",
      },
    ],
  },
];

export const PRIVACY_POLICY_CONTACTS = [
  {
    label: "Data Protection Officer",
    value: "info@xbankang.com",
    href: "mailto:info@xbankang.com",
  },
  {
    label: "Customer Support",
    value: "support@xbankang.com",
    href: "mailto:support@xbankang.com",
  },
  {
    label: "Website",
    value: "www.xbankang.com",
    href: "https://www.xbankang.com",
  },
  {
    label: "Registered Office",
    value: "25 Maya Street, Yaba, Lagos, Nigeria",
  },
];
