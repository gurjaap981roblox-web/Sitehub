import { SiteDocument } from '../types/site';

export const STARTER_TEMPLATES: SiteDocument[] = [
  {
    id: 'site-sitehub-launchpad',
    name: 'SiteHub Launchpad',
    slug: 'sitehub-launchpad',
    language: 'en',
    title: 'SiteHub Launchpad — Modern AI Web Application Platform',
    description: 'Build, customize, and deploy full-stack web applications with visual AST canvas, real-time code sync, and native GitHub integration.',
    version: 1,
    updatedAt: new Date().toISOString(),
    theme: {
      primaryColor: '#6366f1',
      secondaryColor: '#f59e0b',
      backgroundColor: '#09090b',
      textColor: '#fafaf9',
      accentColor: '#818cf8',
      fontHeading: 'Space Grotesk',
      fontBody: 'Inter',
      borderRadius: 'lg',
      shadowScale: 'lg',
      isDark: true,
    },
    pages: [
      {
        id: 'page-home',
        title: 'Home',
        slug: 'home',
        isHome: true,
        seoTitle: 'SiteHub Launchpad | Next-Generation AI Web Studio',
        seoDescription: 'Empowering creators and developers to build responsive web applications with multi-model AI routing, bi-directional code editing, and automated deployments.',
        sections: [
          {
            id: 'sec-nav',
            type: 'navbar',
            title: 'Navigation',
            props: {
              brandName: 'SiteHub Launchpad',
              links: [
                { label: 'Capabilities', href: '#features' },
                { label: 'Architecture', href: '#architecture' },
                { label: 'Interactive Demo', href: '#demo' },
                { label: 'Reviews', href: '#testimonials' },
              ],
              ctaText: 'Launch Studio',
              ctaHref: '#demo',
            },
          },
          {
            id: 'sec-hero',
            type: 'hero',
            title: 'Build, Customize & Ship Production Web Apps at AI Speed',
            subtitle: 'From natural language prompt to production React codebase with visual canvas, live preview, multi-model AI routing, and direct GitHub repository synchronization.',
            props: {
              badge: 'SiteHub Universal AI Studio 2026',
              primaryCta: 'Explore Features',
              primaryCtaHref: '#features',
              secondaryCta: 'View Live Demo',
              secondaryCtaHref: '#demo',
              bgImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80',
              metrics: [
                { value: '100%', label: 'Clean React Code' },
                { value: '<250ms', label: 'Preview Hot Reload' },
                { value: '1-Click', label: 'GitHub Synchronization' },
              ],
            },
          },
          {
            id: 'sec-features',
            type: 'features',
            title: 'Universal Studio Architecture',
            subtitle: 'Engineered for developers and product designers who demand precision, responsiveness, and zero-compromise code generation.',
            props: {
              items: [
                {
                  icon: 'Sparkles',
                  title: 'Multi-Model AI Router',
                  description: 'Intelligently orchestrates specialized models for planning, component synthesis, styling audits, and code optimization.',
                },
                {
                  icon: 'Code2',
                  title: 'Bi-Directional AST Sync',
                  description: 'Edit visually on the canvas or type directly into the Code Studio. All AST changes stay in exact bi-directional sync.',
                },
                {
                  icon: 'FolderGit2',
                  title: 'Real GitHub OAuth & Git Commits',
                  description: 'Automated repository provisioning, cryptographic CSRF verification, and atomic Git commit trees with zero tokens exposed.',
                },
              ],
            },
          },
          {
            id: 'sec-pricing',
            type: 'pricing',
            title: 'Flexible Deployment Plans',
            subtitle: 'Scale seamlessly from hobby prototypes to high-traffic production web applications.',
            props: {
              plans: [
                {
                  name: 'Developer Starter',
                  price: '$0',
                  period: 'forever free',
                  features: [
                    'Unlimited local projects',
                    'Interactive Visual Canvas',
                    'Bi-directional Code Studio',
                    'Static HTML & AST JSON export',
                  ],
                },
                {
                  name: 'Studio Pro',
                  price: '$29',
                  period: 'per month',
                  isPopular: true,
                  features: [
                    'Direct GitHub repository creation',
                    'Automated multi-commit push',
                    'Custom secrets manager & env vars',
                    'Multilingual localization engine',
                    'Dedicated Render & Vercel deploy hooks',
                  ],
                },
                {
                  name: 'Enterprise Cloud',
                  price: '$99',
                  period: 'per month',
                  features: [
                    'Dedicated VPC model endpoints',
                    'Custom database connectors',
                    'Team collaboration & audit logs',
                    'Priority SLA & automated QA suites',
                  ],
                },
              ],
            },
          },
          {
            id: 'sec-testimonials',
            type: 'testimonials',
            title: 'What Engineers & Founders Say',
            props: {
              items: [
                {
                  quote: 'SiteHub replaced our multi-tool pipeline. Going from natural language to clean, editable React with real Git commits is like magic.',
                  author: 'Marcus Vance',
                  title: 'CTO, NextWave SaaS',
                  rating: 5,
                },
                {
                  quote: 'The bi-directional AST synchronization and live device frames allowed our design team to collaborate directly with backend engineers seamlessly.',
                  author: 'Elena Rostova',
                  title: 'Lead Architect, Horizon Labs',
                  rating: 5,
                },
              ],
            },
          },
          {
            id: 'sec-contact',
            type: 'contact',
            title: 'Get in Touch with SiteHub Engineering',
            subtitle: 'Have a custom feature request or want to integrate enterprise SSO? Let us know.',
            props: {
              submitLabel: 'Send Inquiry',
              email: 'support@sitehub.build',
              phone: '+1 (800) 555-SITE',
            },
          },
          {
            id: 'sec-footer',
            type: 'footer',
            title: 'Footer',
            props: {
              brandName: 'SiteHub Launchpad',
              tagline: 'The universal AI website and web application development platform.',
              address: 'Silicon Valley & Global Cloud Infrastructure',
              hours: '24/7 Continuous Automated Deployments',
              phone: '+1 (800) 555-SITE',
              copyright: '© 2026 SiteHub Platform Inc. All rights reserved.',
            },
          },
        ],
      },
    ],
    collections: [],
  },

  {
    id: 'site-portfolio-hi-en',
    name: 'Arjun Visuals',
    slug: 'arjun-visuals',
    language: 'hi',
    title: 'अर्जुन शर्मा — छायाचित्रकार व सिनेमैटोग्राफर | Arjun Visuals',
    description: 'भारतीय संस्कृति, सिनेमाई पोर्ट्रेट और शाही शादियों की फोटोग्राफी। Visual storytelling across India & Europe.',
    version: 1,
    updatedAt: new Date().toISOString(),
    theme: {
      primaryColor: '#d97706',
      secondaryColor: '#6366f1',
      backgroundColor: '#0a0a0c',
      textColor: '#f3f4f6',
      accentColor: '#fbbf24',
      fontHeading: 'Space Grotesk',
      fontBody: 'Inter',
      borderRadius: 'md',
      shadowScale: 'md',
      isDark: true,
    },
    pages: [
      {
        id: 'page-home',
        title: 'होम (Home)',
        slug: 'home',
        isHome: true,
        seoTitle: 'अर्जुन शर्मा | सिनेमैटिक फोटोग्राफी',
        seoDescription: 'भव्य शादियां, डॉक्यूमेंट्री और सिनेमैटिक पोर्ट्रेट्स।',
        sections: [
          {
            id: 'sec-nav-p',
            type: 'navbar',
            title: 'नेविगेशन',
            props: {
              brandName: 'ARJUN VISUALS',
              links: [
                { label: 'पोर्टफोलियो (Work)', href: '#showcase' },
                { label: 'अनुभव (About)', href: '#features' },
                { label: 'पैकेज (Packages)', href: '#pricing' },
                { label: 'संपर्क (Inquire)', href: '#contact' },
              ],
              ctaText: 'तारीख बुक करें',
              ctaHref: '#contact',
            },
          },
          {
            id: 'sec-hero-p',
            type: 'hero',
            title: 'जिंदगी के अनमोल पलों को सिनेमाई रूप में कैद करना',
            subtitle: 'हर तस्वीर एक कहानी कहती है। शाही भारतीय शादियों से लेकर अंतरराष्ट्रीय फैशन और वृत्तचित्र तक।',
            props: {
              badge: 'Featured in Vogue India & National Geographic',
              primaryCta: 'प्रोजेक्ट्स देखें',
              primaryCtaHref: '#showcase',
              secondaryCta: 'बातचीत करें',
              secondaryCtaHref: '#contact',
              bgImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80',
              metrics: [
                { value: '250+', label: 'शाही शादियां' },
                { value: '14', label: 'देशों में शूट' },
                { value: '9', label: 'राष्ट्रीय पुरस्कार' },
              ],
            },
          },
          {
            id: 'sec-showcase-p',
            type: 'showcase',
            title: 'चयनित गैलरी (Selected Works)',
            subtitle: 'प्रकाश, भावना और वास्तविकता का संगम।',
            props: {
              items: [
                {
                  title: 'उदयपुर शाही विवाह (Royal Udaipur)',
                  category: 'Wedding Cinema',
                  image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
                },
                {
                  title: 'लद्दाख की आत्मा (Soul of Ladakh)',
                  category: 'Documentary',
                  image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
                },
                {
                  title: 'मूनलिट बनारस (Varanasi Ghats)',
                  category: 'Fine Art',
                  image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
                },
              ],
            },
          },
          {
            id: 'sec-pricing-p',
            type: 'pricing',
            title: 'शूटिंग पैकेजेस (Packages)',
            subtitle: 'आपकी जरूरतों के अनुसार कस्टमाइज़्ड फोटोग्राफी एवं 4K सिनेमा पैकेज।',
            props: {
              plans: [
                {
                  name: 'पोर्ट्रेट व एडिटोरियल',
                  price: '₹45,000',
                  period: 'प्रति दिन',
                  features: ['फुल डे स्टूडियो/लोकेशन', '35 हाई-एंड एडिटेड तस्वीरें', 'ड्रोन कवरेज', '7 दिन में डिलीवरी'],
                },
                {
                  name: 'शाही वेडिंग सिनेमा (पॉपुलर)',
                  price: '₹2,50,000',
                  period: '3 दिवसीय समारोह',
                  isPopular: true,
                  features: ['4K सिनेमैटिक टीज़र + पूरी फिल्म', '3 फ़ोटोग्राफ़र + 2 सिनेमैटोग्राफ़र', 'लग्जरी लेदर एल्बम', 'रॉ फुटेज हार्ड ड्राइव'],
                },
              ],
            },
          },
          {
            id: 'sec-contact-p',
            type: 'contact',
            title: 'तारीख बुक करें या पूछताछ करें',
            subtitle: 'हम 24 घंटे के भीतर उत्तर देते हैं। आइए साथ मिलकर कुछ यादगार बनाएं।',
            props: {
              submitLabel: 'संदेश भेजें',
              email: 'arjun@visuals-art.com',
              phone: '+91 98765 43210',
            },
          },
          {
            id: 'sec-footer-p',
            type: 'footer',
            title: 'फुटर',
            props: {
              brandName: 'ARJUN VISUALS',
              tagline: 'सिनेमैटिक विजुअल आर्ट व स्टोरीटेलिंग। नई दिल्ली एवं मुंबई।',
              copyright: '© 2026 अर्जुन शर्मा। सर्वाधिकार सुरक्षित।',
            },
          },
        ],
      },
    ],
    collections: [],
  },

  {
    id: 'site-crafts-store',
    name: 'Aura Artisan Crafts',
    slug: 'aura-crafts',
    language: 'en',
    title: 'Aura Artisan Crafts — Hand-Poured Botanical Candles & Ceramics',
    description: 'Sustainably crafted home scents, slow-made ceramics, and organic beeswax creations.',
    version: 1,
    updatedAt: new Date().toISOString(),
    theme: {
      primaryColor: '#059669',
      secondaryColor: '#d97706',
      backgroundColor: '#09090b',
      textColor: '#f4f4f5',
      accentColor: '#10b981',
      fontHeading: 'Inter',
      fontBody: 'Inter',
      borderRadius: 'md',
      shadowScale: 'md',
      isDark: true,
    },
    pages: [
      {
        id: 'page-home',
        title: 'Store',
        slug: 'home',
        isHome: true,
        sections: [
          {
            id: 'sec-nav-s',
            type: 'navbar',
            title: 'Store Navigation',
            props: {
              brandName: 'Aura Artisan',
              links: [
                { label: 'Shop Candles', href: '#store' },
                { label: 'Sustainability', href: '#features' },
                { label: 'FAQ', href: '#faq' },
              ],
              ctaText: 'Cart (0)',
              ctaHref: '#store',
            },
          },
          {
            id: 'sec-hero-s',
            type: 'hero',
            title: 'Slow Living, Handcrafted Botanical Scents',
            subtitle: '100% natural soy wax, therapeutic grade essential oils, and recycled clay jars poured by hand in small batches.',
            props: {
              badge: 'Carbon Neutral Delivery Worldwide',
              primaryCta: 'Explore Collection',
              primaryCtaHref: '#store',
              secondaryCta: 'Our Process',
              secondaryCtaHref: '#features',
              bgImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1600&q=80',
            },
          },
          {
            id: 'sec-store-s',
            type: 'store',
            title: 'Artisan Collection',
            subtitle: 'Honest craftsmanship. Each vessel is reusable as an herb planter.',
            props: {
              products: [
                {
                  id: 'prod-1',
                  name: 'Nordic Pine & Amber Soy Candle',
                  price: 28,
                  category: 'Woody & Fresh',
                  image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=600&q=80',
                  badge: 'Bestseller',
                },
                {
                  id: 'prod-2',
                  name: 'Wild Lavender & Bergamot Vessel',
                  price: 32,
                  category: 'Floral & Calming',
                  image: 'https://images.unsplash.com/photo-1543854589-ab99401b22e1?auto=format&fit=crop&w=600&q=80',
                },
                {
                  id: 'prod-3',
                  name: 'Smoked Vanilla & Cardamom Clay Pot',
                  price: 34,
                  category: 'Warm & Spicy',
                  image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80',
                  badge: 'Limited Batch',
                },
                {
                  id: 'prod-4',
                  name: 'Handmade Ceramic Candle Snuffer',
                  price: 18,
                  category: 'Accessories',
                  image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80',
                },
              ],
            },
          },
          {
            id: 'sec-faq-s',
            type: 'faq',
            title: 'Frequently Asked Questions',
            props: {
              items: [
                {
                  question: 'What is the burn time of the soy candles?',
                  answer: 'Our 280g ceramic vessels provide up to 60 hours of clean, soot-free burn time when trimmed to 5mm.',
                },
                {
                  question: 'Can the ceramic jars be repurposed?',
                  answer: 'Yes! Simply clean the remaining wax with hot soapy water, and the handmade vessel makes an ideal espresso cup or succulent planter.',
                },
                {
                  question: 'How do you handle shipping?',
                  answer: 'All orders are shipped in 100% biodegradable cornstarch packing and recycled kraft boxes within 48 hours.',
                },
              ],
            },
          },
          {
            id: 'sec-footer-s',
            type: 'footer',
            title: 'Footer',
            props: {
              brandName: 'Aura Artisan Crafts',
              tagline: 'Sustainable botanical candles poured with patience.',
              copyright: '© 2026 Aura Crafts Studio. Eco-certified.',
            },
          },
        ],
      },
    ],
    collections: [],
  },
];
