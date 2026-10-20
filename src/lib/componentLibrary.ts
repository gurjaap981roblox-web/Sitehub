/**
 * SiteHub Pre-Generated AI Component Library
 * Curated, production-grade AI components ready for instant drag-and-drop into site structures.
 */

import { SectionDocument, SectionType } from '../types/site';

export interface ComponentTemplate {
  id: string;
  name: string;
  category: 'pricing' | 'social-proof' | 'faq' | 'hero' | 'features' | 'commerce' | 'conversion' | 'metrics';
  categoryLabel: string;
  description: string;
  iconName: string; // Lucide icon identifier
  previewSnippet: string;
  badge?: string;
  sectionType: SectionType;
  createSection: () => SectionDocument;
}

export const COMPONENT_CATEGORIES = [
  { id: 'all', label: 'All Components' },
  { id: 'pricing', label: 'Pricing Tables' },
  { id: 'social-proof', label: 'Testimonials' },
  { id: 'faq', label: 'FAQ Sections' },
  { id: 'hero', label: 'Hero Banners' },
  { id: 'features', label: 'Feature Grids' },
  { id: 'conversion', label: 'Contact & CTA' },
  { id: 'commerce', label: 'Commerce & Menu' },
  { id: 'metrics', label: 'Stats & Metrics' },
] as const;

export const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  // PRICING TABLES
  {
    id: 'pricing-saas-matrix',
    name: 'SaaS 3-Tier Matrix',
    category: 'pricing',
    categoryLabel: 'Pricing Table',
    description: '3-tier pricing matrix with monthly plans, popular badge, and feature checklists.',
    iconName: 'CreditCard',
    badge: 'Popular',
    sectionType: 'pricing',
    previewSnippet: 'Starter $19 · Pro $49 · Enterprise $129',
    createSection: () => ({
      id: `sec-pricing-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'pricing',
      title: 'Transparent, Scalable Pricing',
      subtitle: 'Pick the plan that fits your current stage. Upgrade or cancel anytime.',
      props: {
        plans: [
          {
            name: 'Starter',
            price: '$19',
            period: '/mo',
            features: [
              'Up to 3 active projects',
              'Standard edge delivery',
              'Community support',
              'Basic analytics',
            ],
            isPopular: false,
          },
          {
            name: 'Pro Builder',
            price: '$49',
            period: '/mo',
            features: [
              'Unlimited active projects',
              'Multi-model AI generation',
              'Direct GitHub bi-directional sync',
              'Custom domains & SSL',
              'Priority Discord support',
            ],
            isPopular: true,
          },
          {
            name: 'Enterprise',
            price: '$149',
            period: '/mo',
            features: [
              'Dedicated inference cluster',
              'Zero-data retention SLA',
              'SSO & SAML authentication',
              '24/7 Phone & Slack support',
              'Custom model fine-tuning',
            ],
            isPopular: false,
          },
        ],
      },
    }),
  },
  {
    id: 'pricing-dual-minimal',
    name: 'Dual Free & Pro Comparison',
    category: 'pricing',
    categoryLabel: 'Pricing Table',
    description: 'Streamlined 2-column pricing comparison ideal for developer tools and consumer apps.',
    iconName: 'Layers',
    sectionType: 'pricing',
    previewSnippet: 'Hobby $0 · Unlimited $29',
    createSection: () => ({
      id: `sec-pricing-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'pricing',
      title: 'Simple, Honest Pricing',
      subtitle: 'Start free forever. Upgrade when you need team collaboration and automated deployments.',
      props: {
        plans: [
          {
            name: 'Hobby & Open Source',
            price: '$0',
            period: 'forever',
            features: [
              'Public repositories only',
              'Community AI models',
              'Basic web preview',
              'Community forum help',
            ],
            isPopular: false,
          },
          {
            name: 'Unlimited Solo',
            price: '$29',
            period: '/mo',
            features: [
              'Private project isolation',
              'Commercial generation license',
              '1-Click Render & Vercel deploy',
              'Encrypted secret storage',
            ],
            isPopular: true,
          },
        ],
      },
    }),
  },

  // TESTIMONIALS & SOCIAL PROOF
  {
    id: 'testimonials-reviews-grid',
    name: 'Customer Review Grid',
    category: 'social-proof',
    categoryLabel: 'Testimonials',
    description: 'Two-column grid with 5-star ratings, author titles, and real user feedback.',
    iconName: 'Star',
    badge: 'High Conversion',
    sectionType: 'testimonials',
    previewSnippet: '5-star reviews with verified customer badges',
    createSection: () => ({
      id: `sec-testi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'testimonials',
      title: 'Loved by Teams Worldwide',
      props: {
        items: [
          {
            quote: 'SiteHub reduced our landing page prototyping cycle from 3 weeks to under 30 minutes. The multi-model synthesis is astonishingly precise.',
            author: 'Elena Rostova',
            title: 'VP of Product at HyperScale',
            rating: 5,
          },
          {
            quote: 'The AST engine combined with direct GitHub export meant zero throwaway code. We shipped to production on Render the very same day.',
            author: 'Marcus Vance',
            title: 'Principal Architect at CloudShift',
            rating: 5,
          },
          {
            quote: 'Being able to visually edit while the code updates synchronously in real time is a dream developer workflow.',
            author: 'Priya Sharma',
            title: 'Design Lead at Nexus Labs',
            rating: 5,
          },
          {
            quote: 'Unquestionably the cleanest UI studio we have evaluated. The zero-pill discipline and dark mode make it feel like a pro developer IDE.',
            author: 'David Tanaka',
            title: 'Founder & CTO at StackPulse',
            rating: 5,
          },
        ],
      },
    }),
  },
  {
    id: 'testimonials-executive-spotlight',
    name: 'Executive Spotlight Review',
    category: 'social-proof',
    categoryLabel: 'Testimonials',
    description: 'High-impact customer endorsement with ratings and industry impact.',
    iconName: 'Quote',
    sectionType: 'testimonials',
    previewSnippet: 'Executive endorsement with 5 stars',
    createSection: () => ({
      id: `sec-testi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'testimonials',
      title: 'What Industry Leaders Say',
      props: {
        items: [
          {
            quote: 'This is the first AI tool that generates structured, validated semantic trees rather than hallucinated spaghetti markup. An absolute game-changer.',
            author: 'Dr. Sean K.',
            title: 'Chief Technology Officer, Quantum Ventures',
            rating: 5,
          },
          {
            quote: 'Our engineering velocity doubled in Q3 alone. Non-technical marketers can prototype pages directly, and developers pull clean TypeScript code.',
            author: 'Amina Al-Mansoor',
            title: 'Head of Engineering, Apex Global',
            rating: 5,
          },
        ],
      },
    }),
  },

  // FAQ SECTIONS
  {
    id: 'faq-interactive-accordion',
    name: 'Expandable FAQ Accordion',
    category: 'faq',
    categoryLabel: 'FAQ Section',
    description: 'Collapsible accordion answering critical buyer objections and technical questions.',
    iconName: 'HelpCircle',
    badge: 'Essential',
    sectionType: 'faq',
    previewSnippet: '5 collapsible technical & billing Q&As',
    createSection: () => ({
      id: `sec-faq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'faq',
      title: 'Frequently Asked Questions',
      props: {
        items: [
          {
            question: 'How does the AI website generation work under the hood?',
            answer: 'SiteHub uses a multi-model AST synthesis engine. Prompts are translated into validated, hierarchical component nodes that render directly into production React and HTML5 code.',
          },
          {
            question: 'Can I export the code and host it anywhere?',
            answer: 'Yes! You have full ownership. Export clean standalone HTML/ZIP bundles or sync directly with your GitHub repository to deploy to Render, Vercel, or Netlify with zero vendor lock-in.',
          },
          {
            question: 'Can I bring my own AI provider API keys?',
            answer: 'Absolutely. Configure your own Google Gemini, NVIDIA NIM, or OpenAI keys in the Secrets Manager. All credentials are encrypted in local AES storage and never shared.',
          },
          {
            question: 'Is multi-language translation supported?',
            answer: 'Yes, SiteHub supports instantaneous native translations with specialized typographies for Hindi (Devanagari), Punjabi (Gurmukhi), and English.',
          },
          {
            question: 'What is your refund policy if I am not satisfied?',
            answer: 'We provide a 14-day no-questions-asked refund guarantee on all paid tier upgrades.',
          },
        ],
      },
    }),
  },
  {
    id: 'faq-getting-started',
    name: 'Getting Started FAQ',
    category: 'faq',
    categoryLabel: 'FAQ Section',
    description: 'Quick answers for onboarding, integration, and deployment questions.',
    iconName: 'Sparkles',
    sectionType: 'faq',
    previewSnippet: '3 quick onboarding questions',
    createSection: () => ({
      id: `sec-faq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'faq',
      title: 'Everything You Need to Know',
      props: {
        items: [
          {
            question: 'Do I need coding experience to use this builder?',
            answer: 'No coding knowledge is required. You can describe what you need in plain natural language, or visually drag and drop components and edit text inline.',
          },
          {
            question: 'Are generated websites optimized for mobile screens?',
            answer: 'Every generated component is fully responsive and tested against mobile (375px), tablet (768px), and desktop (1440px) breakpoints.',
          },
          {
            question: 'Can I add custom CSS styling or JavaScript?',
            answer: 'Yes. Switch to Code Studio mode anytime to edit the raw components, Tailwind utilities, or AST props directly.',
          },
        ],
      },
    }),
  },

  // HERO BANNERS
  {
    id: 'hero-saas-gradient',
    name: 'High-Impact SaaS Hero',
    category: 'hero',
    categoryLabel: 'Hero Banner',
    description: 'Hero section with prominent headline, value subtitle, dual CTAs, and KPI metrics.',
    iconName: 'Layout',
    badge: 'Hero',
    sectionType: 'hero',
    previewSnippet: 'Headline, dual CTAs, and live metrics',
    createSection: () => ({
      id: `sec-hero-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'hero',
      title: 'Build Exceptional Software, 10x Faster',
      subtitle: 'The intelligent development workspace combining generative AI, visual canvas editing, and direct GitHub sync.',
      props: {
        badge: '✨ Next-Generation AI Studio',
        primaryCta: 'Start Building Free',
        primaryCtaHref: '#pricing',
        secondaryCta: 'Explore Live Demo',
        secondaryCtaHref: '#features',
        metrics: [
          { value: '99.9%', label: 'Uptime SLA' },
          { value: '< 100ms', label: 'Edge Latency' },
          { value: '45,000+', label: 'Sites Deployed' },
        ],
      },
    }),
  },

  // FEATURE GRIDS
  {
    id: 'features-bento-grid',
    name: 'Bento Feature Grid',
    category: 'features',
    categoryLabel: 'Feature Grid',
    description: 'Modern 3-column card grid highlighting core platform capabilities with icons.',
    iconName: 'Grid',
    sectionType: 'features',
    previewSnippet: '3 feature cards with icons and descriptions',
    createSection: () => ({
      id: `sec-feat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'features',
      title: 'Built for Production Velocity',
      subtitle: 'Every layer of the platform is designed for reliability, speed, and clean code.',
      props: {
        items: [
          {
            title: 'Multi-Model AI Intelligence',
            description: 'Intelligent routing selects the best model for layout synthesis, code generation, and content creation.',
          },
          {
            title: 'Visual + Code Synchronization',
            description: 'Make visual edits on the interactive canvas or modify TypeScript code directly in Code Studio without drift.',
          },
          {
            title: 'Direct GitHub CI/CD Sync',
            description: 'Push commits directly to your GitHub repository with cryptographically secured OAuth tokens.',
          },
        ],
      },
    }),
  },

  // CONTACT & CONVERSION
  {
    id: 'contact-interactive-form',
    name: 'Interactive Contact & Inquiry',
    category: 'conversion',
    categoryLabel: 'Contact Form',
    description: 'Clean lead capture form with instant submission feedback and email validation.',
    iconName: 'Mail',
    sectionType: 'contact',
    previewSnippet: 'Name, email, message form & submit button',
    createSection: () => ({
      id: `sec-contact-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'contact',
      title: 'Get in Touch with Our Team',
      subtitle: 'Have questions or need a custom enterprise deployment? We respond within 24 business hours.',
      props: {
        submitLabel: 'Send Inquiry',
      },
    }),
  },

  // COMMERCE & MENU
  {
    id: 'commerce-product-catalog',
    name: 'E-Commerce Product Showcase',
    category: 'commerce',
    categoryLabel: 'Commerce Catalog',
    description: 'Product showcase grid with real imagery, price tags, category badges, and shopping cart integration.',
    iconName: 'ShoppingBag',
    sectionType: 'store',
    previewSnippet: '4 artisan products with cart integration',
    createSection: () => ({
      id: `sec-store-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'store',
      title: 'Featured Collection',
      subtitle: 'Handcrafted items made with sustainable materials and timeless craftsmanship.',
      props: {
        products: [
          {
            id: `prod-1-${Date.now()}`,
            name: 'Handcrafted Ceramic Vase',
            price: 48,
            category: 'Home & Living',
            image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80',
            badge: 'Bestseller',
          },
          {
            id: `prod-2-${Date.now()}`,
            name: 'Minimalist Desk Lamp',
            price: 85,
            category: 'Lighting',
            image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
            badge: 'New',
          },
          {
            id: `prod-3-${Date.now()}`,
            name: 'Linen Throw Blanket',
            price: 64,
            category: 'Textiles',
            image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
          },
          {
            id: `prod-4-${Date.now()}`,
            name: 'Artisan Pour-Over Dripper',
            price: 36,
            category: 'Kitchen',
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
          },
        ],
      },
    }),
  },
  {
    id: 'menu-culinary-showcase',
    name: 'Restaurant / Cafe Menu',
    category: 'commerce',
    categoryLabel: 'Culinary Menu',
    description: 'Interactive restaurant menu with category tabs, prices, and chef specialty badges.',
    iconName: 'Utensils',
    sectionType: 'menu',
    previewSnippet: 'Categorized menu items with prices',
    createSection: () => ({
      id: `sec-menu-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'menu',
      title: 'Artisan Culinary Menu',
      subtitle: 'Seasonal delicacies prepared with fresh local ingredients.',
      props: {
        categories: ['Starters', 'Main Courses', 'Artisan Desserts'],
        items: [
          {
            title: 'Truffle Sourdough Crostini',
            category: 'Starters',
            price: '$16',
            description: 'Toasted wild yeast sourdough with whipped ricotta and shaved black summer truffles.',
            badge: 'Chef Special',
          },
          {
            title: 'Pan-Seared Sea Bass',
            category: 'Main Courses',
            price: '$34',
            description: 'Wild sea bass served over saffron risotto with charred asparagus and lemon thyme emulsion.',
          },
          {
            title: 'Smoked Cedar Salmon',
            category: 'Main Courses',
            price: '$32',
            description: 'Slow-roasted Pacific salmon infused with aromatic cedar smoke and crushed pistachios.',
          },
          {
            title: 'Dark Chocolate Ganache Tart',
            category: 'Artisan Desserts',
            price: '$14',
            description: '70% Valrhona single-origin chocolate with sea salt flakes and Madagascar vanilla gelato.',
            badge: 'Signature',
          },
        ],
      },
    }),
  },
  {
    id: 'booking-table-reservations',
    name: 'Interactive Table Booking Form',
    category: 'conversion',
    categoryLabel: 'Reservation Desk',
    description: 'Interactive reservation form with date selector, time slots, guest counter, and instant confirmation.',
    iconName: 'Calendar',
    sectionType: 'booking',
    previewSnippet: 'Date, time, guest selector & booking',
    createSection: () => ({
      id: `sec-book-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'booking',
      title: 'Reserve Your Table',
      subtitle: 'Experience an unforgettable culinary journey. Instant confirmation sent to your email.',
      props: {
        submitText: 'Confirm Table Reservation',
      },
    }),
  },

  // METRICS & TELEMETRY
  {
    id: 'metrics-dashboard-kpi',
    name: 'SaaS Live Telemetry & Metrics',
    category: 'metrics',
    categoryLabel: 'Stats & Metrics',
    description: 'Live KPI counters and transactions table showcasing business health and velocity.',
    iconName: 'TrendingUp',
    sectionType: 'dashboardMetrics',
    previewSnippet: 'MRR, Active Seats, NRR, Churn Rate',
    createSection: () => ({
      id: `sec-metrics-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'dashboardMetrics',
      title: 'Real-Time Performance Telemetry',
      subtitle: 'Global infrastructure and enterprise revenue telemetry updated every 60 seconds.',
      props: {},
    }),
  },
];
