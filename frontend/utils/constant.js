export const highlightItems = [
  "AI-Powered Design: Our platform uses advanced AI algorithms to generate stunning website designs tailored to your preferences and industry.",
  "Responsive Layouts: Your website will look great on any device, thanks to our responsive design templates.",
  "Production Ready Output: Get clean, production-ready code that you can easily deploy or customize further.",
];

export const loadingStages = [
  "Analyzing prompt...",
  "Planning website structure...",
  "Generating premium UI...",
  "Optimizing responsiveness...",
  "Finalizing production code...",
];

export const plans = [
  {
    key: "free",
    name: "Free",
    price: "₹0",
    credits: 100,
    description: "Perfect to explore GenWeb.ai",
    features: [
      "AI website generation",
      "Responsive HTML output",
      "Basic animations",
    ],
    popular: false,
    button: "Get Started",
  },
  {
    key: "pro",
    name: "Pro",
    price: "₹499",
    credits: 500,
    description: "For serious creators & freelancers",
    features: ["Everything in Free", "Faster generation", "Edit & regenerate"],
    popular: true,
    button: "Upgrade to Pro",
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: "₹1499",
    credits: 1000,
    description: "For teams & power users",
    features: [
      "Unlimited iterations",
      "Highest priority",
      "Team collaboration",
      "Dedicated support",
    ],
    popular: false,
    button: "Upgrade to Enterprise",
  },
];