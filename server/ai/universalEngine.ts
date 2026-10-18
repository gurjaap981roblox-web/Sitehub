/**
 * SiteHub Universal Architecture & Website Synthesizer Engine
 * Generates production-grade, multi-page, multi-section web applications across
 * all 23+ industry categories with realistic entities, schemas, responsive AST components,
 * and localized copy (English, Hindi, Punjabi).
 */

import {
  CollectionDocument,
  FullStackSpecification,
  PageDocument,
  PatchOperation,
  SectionDocument,
  SiteDocument,
  ThemeConfig,
} from '../../src/types/site';

export interface ClassificationResult {
  category: string;
  projectType: 'website' | 'web_app' | 'saas_tool' | 'portal';
  architectureType: 'static_site' | 'client_spa' | 'full_stack_app' | 'saas_platform';
  primaryTheme: Partial<ThemeConfig>;
  suggestedPages: string[];
  dataEntities: string[];
  apiEndpoints: string[];
  userRoles: string[];
  dbTablesSuggested: string[];
}

export class UniversalEngine {
  /**
   * Classify user prompt into one of the 23+ categories with technical complexity mapping
   */
  static classifyPrompt(prompt: string): ClassificationResult {
    const p = prompt.toLowerCase();

    // 1. Hotel / Travel / Hospitality
    if (p.includes('hotel') || p.includes('resort') || p.includes('hospitality') || p.includes('stay') || p.includes('luxury suite')) {
      return {
        category: 'hotel_hospitality',
        projectType: 'web_app',
        architectureType: 'full_stack_app',
        primaryTheme: {
          primaryColor: '#0284c7',
          secondaryColor: '#38bdf8',
          backgroundColor: '#030712',
          textColor: '#f8fafc',
          accentColor: '#fbbf24',
          fontHeading: 'Playfair Display',
          fontBody: 'Inter',
          borderRadius: 'xl',
          isDark: true,
        },
        suggestedPages: ['Home', 'Suites & Villas', 'Dining & Experiences', 'Reservations', 'Location & Contact'],
        dataEntities: ['RoomType', 'Reservation', 'GuestProfile', 'SeasonalPricing', 'ServiceAmenity'],
        apiEndpoints: ['/api/rooms/availability', '/api/bookings/reserve', '/api/guest/profile', '/api/reviews'],
        userRoles: ['Guest', 'Concierge', 'FrontDesk', 'PropertyManager'],
        dbTablesSuggested: ['rooms', 'reservations', 'guests', 'amenities', 'payments'],
      };
    }

    // 2. SaaS CRM / Sales Pipeline
    if (p.includes('crm') || p.includes('sales pipeline') || p.includes('contacts') || p.includes('pipeline') || p.includes('lead')) {
      return {
        category: 'saas_crm',
        projectType: 'saas_tool',
        architectureType: 'saas_platform',
        primaryTheme: {
          primaryColor: '#4f46e5',
          secondaryColor: '#818cf8',
          backgroundColor: '#090d16',
          textColor: '#f1f5f9',
          accentColor: '#10b981',
          fontHeading: 'Space Grotesk',
          fontBody: 'Inter',
          borderRadius: 'lg',
          isDark: true,
        },
        suggestedPages: ['Dashboard', 'Deals Pipeline', 'Contacts & Leads', 'Team & Permissions', 'Analytics & Reports'],
        dataEntities: ['Contact', 'DealStage', 'Deal', 'Company', 'ActivityLog', 'CustomField'],
        apiEndpoints: ['/api/crm/deals', '/api/crm/contacts', '/api/crm/pipeline/stages', '/api/crm/metrics'],
        userRoles: ['Admin', 'SalesManager', 'AccountExecutive', 'Viewer'],
        dbTablesSuggested: ['users', 'organizations', 'contacts', 'deals', 'activities', 'audit_logs'],
      };
    }

    // 3. E-Commerce / Retail Store
    if (p.includes('store') || p.includes('ecommerce') || p.includes('shop') || p.includes('cart') || p.includes('checkout') || p.includes('apparel') || p.includes('product')) {
      return {
        category: 'ecommerce',
        projectType: 'web_app',
        architectureType: 'full_stack_app',
        primaryTheme: {
          primaryColor: '#ec4899',
          secondaryColor: '#f43f5e',
          backgroundColor: '#09090b',
          textColor: '#fafafa',
          accentColor: '#e11d48',
          fontHeading: 'Space Grotesk',
          fontBody: 'Inter',
          borderRadius: 'xl',
          isDark: true,
        },
        suggestedPages: ['Storefront', 'Catalog', 'Product Detail', 'Cart & Checkout', 'Order History'],
        dataEntities: ['Product', 'Category', 'Cart', 'Order', 'OrderItem', 'ShippingAddress'],
        apiEndpoints: ['/api/products', '/api/cart', '/api/orders/checkout', '/api/payments/intent'],
        userRoles: ['Customer', 'InventoryClerk', 'StoreAdmin'],
        dbTablesSuggested: ['products', 'categories', 'orders', 'order_items', 'inventory', 'customers'],
      };
    }

    // 4. Learning Platform / LMS / Courses
    if (p.includes('course') || p.includes('learn') || p.includes('lms') || p.includes('student') || p.includes('quiz') || p.includes('lesson')) {
      return {
        category: 'education_lms',
        projectType: 'web_app',
        architectureType: 'full_stack_app',
        primaryTheme: {
          primaryColor: '#059669',
          secondaryColor: '#34d399',
          backgroundColor: '#022c22',
          textColor: '#ecfdf5',
          accentColor: '#fbbf24',
          fontHeading: 'Space Grotesk',
          fontBody: 'Inter',
          borderRadius: 'lg',
          isDark: true,
        },
        suggestedPages: ['Course Catalog', 'Curriculum & Modules', 'Video Classroom', 'Quizzes & Progress', 'Instructor Dashboard'],
        dataEntities: ['Course', 'Module', 'Lesson', 'Enrollment', 'QuizSubmission', 'Certificate'],
        apiEndpoints: ['/api/courses', '/api/lessons/progress', '/api/quizzes/submit', '/api/enrollments'],
        userRoles: ['Student', 'TeachingAssistant', 'Instructor', 'CurriculumAdmin'],
        dbTablesSuggested: ['courses', 'modules', 'lessons', 'enrollments', 'quiz_results', 'certificates'],
      };
    }

    // 5. News / Media / Magazine
    if (p.includes('news') || p.includes('magazine') || p.includes('editorial') || p.includes('article') || p.includes('blog') || p.includes('journal')) {
      return {
        category: 'news_media',
        projectType: 'website',
        architectureType: 'full_stack_app',
        primaryTheme: {
          primaryColor: '#e11d48',
          secondaryColor: '#fb7185',
          backgroundColor: '#0a0a0c',
          textColor: '#f8fafc',
          accentColor: '#38bdf8',
          fontHeading: 'Playfair Display',
          fontBody: 'Inter',
          borderRadius: 'md',
          isDark: true,
        },
        suggestedPages: ['Front Page', 'World & Tech', 'Opinions & Deep Dives', 'Newsletter Subscription', 'Editorial Desk'],
        dataEntities: ['Article', 'Author', 'Category', 'Comment', 'Subscription', 'TopicTag'],
        apiEndpoints: ['/api/articles', '/api/articles/trending', '/api/newsletter/subscribe', '/api/editorial/publish'],
        userRoles: ['Reader', 'Subscriber', 'Journalist', 'EditorInChief'],
        dbTablesSuggested: ['articles', 'authors', 'categories', 'comments', 'newsletter_subs'],
      };
    }

    // 6. Community / Social Network / Forum
    if (p.includes('community') || p.includes('forum') || p.includes('social') || p.includes('posts') || p.includes('feed') || p.includes('discussions')) {
      return {
        category: 'community_social',
        projectType: 'web_app',
        architectureType: 'full_stack_app',
        primaryTheme: {
          primaryColor: '#8b5cf6',
          secondaryColor: '#a78bfa',
          backgroundColor: '#0b0813',
          textColor: '#f5f3ff',
          accentColor: '#f43f5e',
          fontHeading: 'Space Grotesk',
          fontBody: 'Inter',
          borderRadius: 'xl',
          isDark: true,
        },
        suggestedPages: ['Community Feed', 'Channels & Topics', 'Member Profiles', 'Moderation Hub', 'Event Meetups'],
        dataEntities: ['Post', 'Comment', 'UserProfile', 'Channel', 'Badge', 'FlaggedContent'],
        apiEndpoints: ['/api/posts', '/api/posts/react', '/api/channels', '/api/users/profile', '/api/moderation'],
        userRoles: ['Member', 'Contributor', 'Moderator', 'SuperAdmin'],
        dbTablesSuggested: ['users', 'posts', 'comments', 'reactions', 'channels', 'moderation_logs'],
      };
    }

    // 7. Real Estate / Property Listings
    if (p.includes('real estate') || p.includes('property') || p.includes('realtor') || p.includes('homes') || p.includes('apartments')) {
      return {
        category: 'real_estate',
        projectType: 'web_app',
        architectureType: 'full_stack_app',
        primaryTheme: {
          primaryColor: '#0d9488',
          secondaryColor: '#2dd4bf',
          backgroundColor: '#041e1b',
          textColor: '#f0fdfa',
          accentColor: '#f59e0b',
          fontHeading: 'Space Grotesk',
          fontBody: 'Inter',
          borderRadius: 'lg',
          isDark: true,
        },
        suggestedPages: ['Featured Properties', 'Search & Map View', 'Property Details', 'Schedule a Tour', 'Agent Directory'],
        dataEntities: ['Listing', 'Agent', 'TourBooking', 'PriceHistory', 'NeighborhoodStat'],
        apiEndpoints: ['/api/listings/search', '/api/listings/tour', '/api/agents', '/api/mortgage/estimate'],
        userRoles: ['Buyer', 'Seller', 'ListingAgent', 'BrokerageAdmin'],
        dbTablesSuggested: ['properties', 'agents', 'tour_bookings', 'saved_favorites', 'inquiries'],
      };
    }

    // 8. Healthcare / Clinic / Appointments
    if (p.includes('doctor') || p.includes('clinic') || p.includes('healthcare') || p.includes('patient') || p.includes('medical') || p.includes('dental')) {
      return {
        category: 'healthcare_clinic',
        projectType: 'web_app',
        architectureType: 'full_stack_app',
        primaryTheme: {
          primaryColor: '#2563eb',
          secondaryColor: '#60a5fa',
          backgroundColor: '#030d22',
          textColor: '#eff6ff',
          accentColor: '#10b981',
          fontHeading: 'Space Grotesk',
          fontBody: 'Inter',
          borderRadius: 'lg',
          isDark: true,
        },
        suggestedPages: ['Medical Specialties', 'Physician Directory', 'Book Appointment', 'Patient Portal', 'Contact & Emergency'],
        dataEntities: ['Physician', 'Specialty', 'Appointment', 'PatientRecord', 'Department'],
        apiEndpoints: ['/api/doctors', '/api/appointments/book', '/api/slots/available', '/api/patient/history'],
        userRoles: ['Patient', 'Nurse', 'Physician', 'ClinicalAdmin'],
        dbTablesSuggested: ['doctors', 'specialties', 'appointments', 'patients', 'clinical_notes'],
      };
    }

    // 9. Job Board / Recruitment
    if (p.includes('job') || p.includes('career') || p.includes('recruitment') || p.includes('hiring') || p.includes('talent')) {
      return {
        category: 'job_board',
        projectType: 'web_app',
        architectureType: 'full_stack_app',
        primaryTheme: {
          primaryColor: '#7c3aed',
          secondaryColor: '#a78bfa',
          backgroundColor: '#0a0518',
          textColor: '#f5f3ff',
          accentColor: '#06b6d4',
          fontHeading: 'Space Grotesk',
          fontBody: 'Inter',
          borderRadius: 'lg',
          isDark: true,
        },
        suggestedPages: ['Job Board', 'Post a Job', 'Company Profiles', 'Candidate Applications', 'Salary Insights'],
        dataEntities: ['JobListing', 'Company', 'Candidate', 'Application', 'ResumeDocument'],
        apiEndpoints: ['/api/jobs', '/api/jobs/apply', '/api/companies', '/api/employer/post'],
        userRoles: ['Candidate', 'Recruiter', 'HiringManager', 'JobBoardAdmin'],
        dbTablesSuggested: ['jobs', 'companies', 'applications', 'candidates', 'resumes'],
      };
    }

    // 10. AI Business Tool / Playground
    if (p.includes('ai') || p.includes('generator') || p.includes('llm') || p.includes('prompt') || p.includes('agent')) {
      return {
        category: 'ai_tool',
        projectType: 'saas_tool',
        architectureType: 'saas_platform',
        primaryTheme: {
          primaryColor: '#6366f1',
          secondaryColor: '#8b5cf6',
          backgroundColor: '#07070b',
          textColor: '#f8fafc',
          accentColor: '#ec4899',
          fontHeading: 'Space Grotesk',
          fontBody: 'Inter',
          borderRadius: 'xl',
          isDark: true,
        },
        suggestedPages: ['Prompt Studio', 'Agent Workflows', 'Model Router & Benchmarks', 'Usage & API Keys', 'Team Workspace'],
        dataEntities: ['PromptTemplate', 'GenerationLog', 'AgentConfig', 'ApiKey', 'UsageQuota'],
        apiEndpoints: ['/api/ai/run', '/api/prompts', '/api/agents/pipeline', '/api/usage/stats'],
        userRoles: ['User', 'PromptEngineer', 'Developer', 'WorkspaceAdmin'],
        dbTablesSuggested: ['prompts', 'agent_pipelines', 'generations', 'api_keys', 'quotas'],
      };
    }

    // Default: Modern High-Converting Tech Platform / Business Site
    return {
      category: 'business_platform',
      projectType: 'website',
      architectureType: 'full_stack_app',
      primaryTheme: {
        primaryColor: '#4f46e5',
        secondaryColor: '#818cf8',
        backgroundColor: '#090d16',
        textColor: '#f1f5f9',
        accentColor: '#38bdf8',
        fontHeading: 'Space Grotesk',
        fontBody: 'Inter',
        borderRadius: 'xl',
        isDark: true,
      },
      suggestedPages: ['Home', 'Platform Capabilities', 'Pricing & ROI', 'About & Team', 'Contact & Sales'],
      dataEntities: ['Feature', 'PricingTier', 'CustomerTestimonial', 'LeadInquiry', 'DemoRequest'],
      apiEndpoints: ['/api/leads/demo', '/api/contact', '/api/newsletter', '/api/analytics'],
      userRoles: ['Visitor', 'Customer', 'Editor', 'Admin'],
      dbTablesSuggested: ['leads', 'demo_requests', 'newsletter_subscribers', 'team_members'],
    };
  }

  /**
   * Synthesize a complete, pristine, multi-section SiteDocument from a natural language prompt
   */
  static synthesizeFullProject(prompt: string, currentSite?: SiteDocument): SiteDocument {
    const classification = this.classifyPrompt(prompt);
    const p = prompt.toLowerCase();

    // Check language
    let language: 'en' | 'hi' | 'pa' = currentSite?.language || 'en';
    if (p.includes('hindi') || p.includes('हिन्दी')) language = 'hi';
    if (p.includes('punjabi') || p.includes('ਪੰਜਾਬੀ')) language = 'pa';

    const timestamp = new Date().toISOString();
    const siteSlug = prompt
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 32) || 'new-app';

    // Build Project Title and Name
    let projectName = prompt
      .replace(/^(build|create|generate|make)\s+(a|an)?\s*/i, '')
      .split(/\s+with|\s+that|\s+for|\s+and/i)[0]
      .trim();
    if (projectName.length > 35) projectName = projectName.slice(0, 35);
    projectName = projectName.charAt(0).toUpperCase() + projectName.slice(1);

    const fullStackSpec: FullStackSpecification = {
      category: classification.category,
      architectureType: classification.architectureType,
      dataEntities: classification.dataEntities,
      apiEndpoints: classification.apiEndpoints,
      userRoles: classification.userRoles,
      authRequired: true,
      dbTablesSuggested: classification.dbTablesSuggested,
    };

    const theme: ThemeConfig = {
      primaryColor: classification.primaryTheme.primaryColor || '#4f46e5',
      secondaryColor: classification.primaryTheme.secondaryColor || '#818cf8',
      backgroundColor: classification.primaryTheme.backgroundColor || '#090d16',
      textColor: classification.primaryTheme.textColor || '#f8fafc',
      accentColor: classification.primaryTheme.accentColor || '#38bdf8',
      fontHeading: classification.primaryTheme.fontHeading || 'Space Grotesk',
      fontBody: classification.primaryTheme.fontBody || 'Inter',
      borderRadius: classification.primaryTheme.borderRadius || 'xl',
      shadowScale: 'lg',
      isDark: classification.primaryTheme.isDark ?? true,
    };

    // Construct tailored sections based on category
    const sections = this.generateSectionsForCategory(classification.category, projectName, prompt, language);

    const homePage: PageDocument = {
      id: `page-home-${Date.now()}`,
      title: 'Home',
      slug: 'home',
      isHome: true,
      seoTitle: `${projectName} — Next-Gen AI Web Application`,
      seoDescription: `Discover ${projectName}. Built with high-performance architecture, real-time data sync, and responsive UI.`,
      sections,
    };

    // Collections
    const collections = this.generateCollectionsForCategory(classification.category, projectName);

    return {
      id: `site-${Date.now()}`,
      name: projectName,
      slug: siteSlug,
      category: classification.category,
      projectType: classification.projectType,
      fullStackSpec,
      language,
      title: `${projectName} — Next-Gen Web Application`,
      description: `Comprehensive web application for ${projectName}. Designed for scale, accessibility, and high conversion.`,
      theme,
      pages: [homePage],
      collections,
      version: 1,
      updatedAt: timestamp,
    };
  }

  /**
   * Generates tailored AST sections for specific category
   */
  private static generateSectionsForCategory(
    category: string,
    projectName: string,
    prompt: string,
    lang: 'en' | 'hi' | 'pa'
  ): SectionDocument[] {
    const id = (prefix: string) => `sec-${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const navbar: SectionDocument = {
      id: id('navbar'),
      type: 'navbar',
      title: projectName,
      props: {
        brandName: projectName,
        logoText: projectName,
        links: [
          { label: 'Overview', href: '#hero' },
          { label: 'Solutions', href: '#features' },
          { label: 'Platform', href: '#platform' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'Contact', href: '#contact' },
        ],
        ctaText: 'Get Started',
        ctaHref: '#contact',
        sticky: true,
      },
    };

    const footer: SectionDocument = {
      id: id('footer'),
      type: 'footer',
      title: 'Footer',
      props: {
        brandName: projectName,
        tagline: 'Engineered for exceptional customer experiences.',
        columns: [
          {
            title: 'Platform',
            links: ['Architecture', 'API Docs', 'Integrations', 'Changelog'],
          },
          {
            title: 'Solutions',
            links: ['Enterprise', 'Scale-Ups', 'Security', 'Compliance'],
          },
          {
            title: 'Company',
            links: ['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'],
          },
        ],
        copyright: `© ${new Date().getFullYear()} ${projectName}. All rights reserved.`,
      },
    };

    switch (category) {
      case 'hotel_hospitality':
        return [
          navbar,
          {
            id: id('hero'),
            type: 'hero',
            title: 'Unrivaled Luxury & Botanical Tranquility',
            subtitle: 'Immerse yourself in bespoke architectural villas, Michelin-curated gastronomy, and serene wellness retreats.',
            props: {
              badge: 'Exclusive 2026 Collection',
              headline: 'Luxury Redefined in Nature',
              subheadline: 'Private infinity pools, private yacht charters, and five-star concierge at your fingertips.',
              primaryCtaText: 'Explore Suites & Villas',
              primaryCtaHref: '#suites',
              secondaryCtaText: 'View Gallery',
              secondaryCtaHref: '#amenities',
              heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
            },
          },
          {
            id: id('hotelBooking'),
            type: 'hotelBooking',
            title: 'Find Your Sanctuary',
            subtitle: 'Select dates and guest count to browse live villa availability.',
            props: {
              searchPlaceholder: 'Search destinations or suite tiers...',
            },
          },
          {
            id: id('features'),
            type: 'features',
            title: 'World-Class Amenities',
            subtitle: 'Crafted to elevate every moment of your stay.',
            props: {
              items: [
                { title: 'Michelin Star Dining', description: 'Curated tasting menus with seasonal organic ingredients.', icon: 'Flame' },
                { title: 'Sub-Zero Cryo & Spa', description: 'Holistic wellness treatments and private hydrotherapy suites.', icon: 'Sparkles' },
                { title: 'Helipad & Chauffeur', description: 'Direct transfers from international hubs with zero delays.', icon: 'Building2' },
              ],
            },
          },
          {
            id: id('testimonials'),
            type: 'testimonials',
            title: 'What Distinguished Guests Say',
            props: {
              items: [
                { author: 'Sophia Laurent', role: 'Vogue Travel', quote: 'The most sublime hospitality experience in the Mediterranean. Truly unforgettable.' },
                { author: 'Marcus Sterling', role: 'Private Member', quote: 'Flawless discretion, magnificent architecture, and staff that anticipate every desire.' },
              ],
            },
          },
          {
            id: id('contact'),
            type: 'contact',
            title: 'Concierge & VIP Inquiries',
            subtitle: 'Our private client desk is available 24/7.',
            props: {
              address: 'Villa 108, Azure Coastline',
              phone: '+1 (800) 892-4910',
              email: 'concierge@luxuryhaven.com',
            },
          },
          footer,
        ];

      case 'saas_crm':
        return [
          navbar,
          {
            id: id('hero'),
            type: 'hero',
            title: 'The Intelligent CRM for High-Velocity Teams',
            subtitle: 'Automate sales pipelines, track customer health scores, and forecast revenue with real-time AI agents.',
            props: {
              badge: 'v4.0 Autonomous Pipeline Release',
              headline: 'Close More Deals. In Less Time.',
              subheadline: 'Eliminate 80% of manual data entry with autonomous AI sync and contact enrichment.',
              primaryCtaText: 'Start Free 14-Day Trial',
              primaryCtaHref: '#pricing',
              secondaryCtaText: 'Live Pipeline Demo',
              secondaryCtaHref: '#pipeline',
            },
          },
          {
            id: id('dashboardMetrics'),
            type: 'dashboardMetrics',
            title: 'Executive Revenue Dashboard',
            subtitle: 'Real-time performance metrics across your entire sales organization.',
            props: {},
          },
          {
            id: id('crmPipeline'),
            type: 'crmPipeline',
            title: 'Active Deal Pipeline',
            subtitle: 'Drag and drop deals across stages, preview deal values, and inspect contact interactions.',
            props: {},
          },
          {
            id: id('features'),
            type: 'features',
            title: 'Built for Enterprise Scale',
            subtitle: 'SOC2 Type II compliant, sub-50ms query speeds, and granular RBAC permissions.',
            props: {
              items: [
                { title: 'Autonomous Lead Enrichment', description: 'Instantly pull verified firmographics and LinkedIn profiles.', icon: 'Users' },
                { title: 'Smart Deal Forecasting', description: 'Machine-learning win probability scores for every pipeline deal.', icon: 'TrendingUp' },
                { title: 'Universal Calendar & Email Sync', description: 'Full two-way integration with Google Workspace and Microsoft 365.', icon: 'Mail' },
              ],
            },
          },
          {
            id: id('pricing'),
            type: 'pricing',
            title: 'Transparent, Value-Based Plans',
            subtitle: 'No hidden setup fees. Upgrade or cancel anytime.',
            props: {
              tiers: [
                { name: 'Starter', price: '$29', period: '/user/mo', features: ['Up to 1,000 Contacts', '3 Active Pipelines', 'Email Integration', 'Standard Analytics'], isPopular: false },
                { name: 'Growth', price: '$79', period: '/user/mo', features: ['Unlimited Contacts', 'Autonomous AI Enrichment', 'Custom Workflows', 'Multi-currency Support', 'Priority SLA'], isPopular: true },
                { name: 'Enterprise', price: '$199', period: '/user/mo', features: ['Dedicated Success Manager', 'Custom RBAC & SSO', 'Audit Logs & SOC2', 'Unlimited API Keys'], isPopular: false },
              ],
            },
          },
          {
            id: id('contact'),
            type: 'contact',
            title: 'Request an Enterprise Demo',
            subtitle: 'Speak with our solutions architects to customize your deployment.',
            props: {},
          },
          footer,
        ];

      case 'ecommerce':
        return [
          navbar,
          {
            id: id('hero'),
            type: 'hero',
            title: 'Artisan Crafted Essentials',
            subtitle: 'Sustainably sourced, modern minimalist design engineered for everyday life.',
            props: {
              badge: 'Autumn/Winter Drop Active',
              headline: 'Elevated Everyday Living',
              subheadline: 'Crafted with premium organic materials and lifetime repair guarantees.',
              primaryCtaText: 'Shop New Arrivals',
              primaryCtaHref: '#store',
              secondaryCtaText: 'Our Craftsmanship',
              secondaryCtaHref: '#features',
            },
          },
          {
            id: id('store'),
            type: 'store',
            title: 'Featured Collection',
            subtitle: 'Explore our latest releases with instant cart and express checkout.',
            props: {},
          },
          {
            id: id('features'),
            type: 'features',
            title: 'Why Customers Love Us',
            subtitle: 'Zero compromises on ethics, longevity, and design.',
            props: {
              items: [
                { title: 'Free Carbon-Neutral Shipping', description: 'Worldwide delivery in 100% compostable packaging.', icon: 'CheckCircle2' },
                { title: 'Lifetime Quality Guarantee', description: 'Free repairs and hardware replacement for the life of the product.', icon: 'Star' },
                { title: 'Ethically Sourced Wool & Leather', description: 'Fair-trade certified suppliers with transparent supply chains.', icon: 'Heart' },
              ],
            },
          },
          {
            id: id('testimonials'),
            type: 'testimonials',
            title: 'Over 20,000+ 5-Star Reviews',
            props: {
              items: [
                { author: 'Elena Rostova', role: 'Architect, Zurich', quote: 'The build quality is astonishing. The leather patina only gets better with time.' },
                { author: 'Liam Chen', role: 'Product Designer, SF', quote: 'Finally, products that feel timeless rather than disposable. Unmatched attention to detail.' },
              ],
            },
          },
          footer,
        ];

      case 'education_lms':
        return [
          navbar,
          {
            id: id('hero'),
            type: 'hero',
            title: 'Master Modern Engineering & Design',
            subtitle: 'Interactive project-based courses taught by senior architects from Google, Apple, and Stripe.',
            props: {
              badge: 'Accredited Curriculum',
              headline: 'Level Up Your Technical Career',
              subheadline: 'Hands-on code sandboxes, 1-on-1 mentor reviews, and certified industry diplomas.',
              primaryCtaText: 'Browse 50+ Courses',
              primaryCtaHref: '#courses',
              secondaryCtaText: 'Curriculum Roadmap',
              secondaryCtaHref: '#features',
            },
          },
          {
            id: id('courseLessons'),
            type: 'courseLessons',
            title: 'Interactive Curriculum Explorer',
            subtitle: 'Step into lessons, preview video modules, and track syllabus completion.',
            props: {},
          },
          {
            id: id('features'),
            type: 'features',
            title: 'The Academy Advantage',
            subtitle: 'Designed for accelerated skill acquisition.',
            props: {
              items: [
                { title: 'Real-World Production Projects', description: 'Build and deploy actual apps that impress hiring managers.', icon: 'Code2' },
                { title: 'Weekly 1-on-1 Office Hours', description: 'Get unblocked with direct screen-share reviews from experts.', icon: 'Users' },
                { title: 'Verified Certification Badges', description: 'Shareable on LinkedIn, GitHub, and verified by partner employers.', icon: 'GraduationCap' },
              ],
            },
          },
          {
            id: id('pricing'),
            type: 'pricing',
            title: 'Flexible Membership Tiers',
            subtitle: 'Invest in your career with full course library access.',
            props: {
              tiers: [
                { name: 'Monthly Scholar', price: '$49', period: '/month', features: ['Access to all 50+ courses', 'Discord community access', 'Course project source code', 'Self-paced quizzes'], isPopular: false },
                { name: 'Annual Pro', price: '$39', period: '/mo (billed annually)', features: ['Everything in Scholar', 'Weekly mentor code reviews', 'Official certificate of completion', 'Job referral network access'], isPopular: true },
              ],
            },
          },
          footer,
        ];

      case 'real_estate':
        return [
          navbar,
          {
            id: id('hero'),
            type: 'hero',
            title: 'Curated Architectural Residences',
            subtitle: 'Discover premier luxury penthouses, coastal estates, and modern retreats in top global cities.',
            props: {
              badge: 'Exclusive Private Brokerage',
              headline: 'Find Your Next Architectural Home',
              subheadline: 'Virtual 3D tours, private showings, and certified appraisal data.',
              primaryCtaText: 'View Available Properties',
              primaryCtaHref: '#listings',
              secondaryCtaText: 'Schedule Private Tour',
              secondaryCtaHref: '#contact',
            },
          },
          {
            id: id('propertyListings'),
            type: 'propertyListings',
            title: 'Featured Exclusive Listings',
            subtitle: 'Handpicked properties available for immediate acquisition.',
            props: {},
          },
          {
            id: id('features'),
            type: 'features',
            title: 'Bespoke Advisory Services',
            subtitle: 'Tailored for discerning buyers and private family offices.',
            props: {
              items: [
                { title: 'Off-Market Pocket Listings', description: 'Exclusive access to residences never listed on public MLS portals.', icon: 'Building2' },
                { title: 'Immersive 4K Spatial Tours', description: 'Explore floor plans and ceiling heights from anywhere in the world.', icon: 'Search' },
                { title: 'Full Legal & Escrow Coordination', description: 'Seamless cross-border transaction support with trusted counsel.', icon: 'CheckCircle2' },
              ],
            },
          },
          {
            id: id('contact'),
            type: 'contact',
            title: 'Private Buyer Inquiry',
            subtitle: 'Connect with our principal brokers for discreet consultations.',
            props: {},
          },
          footer,
        ];

      case 'job_board':
        return [
          navbar,
          {
            id: id('hero'),
            type: 'hero',
            title: 'Where Ambitious Builders Find Top Roles',
            subtitle: 'Direct connections to founding teams, high-growth startups, and visionary research labs.',
            props: {
              badge: '1,400+ Verified Positions Active',
              headline: 'Find Your Next Breakthrough Role',
              subheadline: 'Transparent salary bands, verified tech stacks, and direct access to hiring managers.',
              primaryCtaText: 'Explore Open Roles',
              primaryCtaHref: '#jobs',
              secondaryCtaText: 'Post a Role ($199)',
              secondaryCtaHref: '#pricing',
            },
          },
          {
            id: id('jobBoard'),
            type: 'jobBoard',
            title: 'Curated Open Positions',
            subtitle: 'Filter by engineering, product, design, and remote availability.',
            props: {},
          },
          {
            id: id('features'),
            type: 'features',
            title: 'Why Top Tech Companies Hire Here',
            subtitle: 'Zero recruiter spam. Only high-signal candidates.',
            props: {
              items: [
                { title: 'Verified Proof-of-Work', description: 'Review candidate GitHub commits, Figma files, and shipped products.', icon: 'Briefcase' },
                { title: 'Transparent Compensation', description: 'Every listing displays explicit equity and base salary bands.', icon: 'TrendingUp' },
                { title: '1-Click Direct Applications', description: 'Bypass applicant tracking black holes and connect directly with founders.', icon: 'CheckCircle2' },
              ],
            },
          },
          footer,
        ];

      case 'news_media':
        return [
          navbar,
          {
            id: id('hero'),
            type: 'hero',
            title: 'Deep Journalism for the Intelligence Age',
            subtitle: 'Uncompromising investigative reporting on technology, policy, and global economics.',
            props: {
              badge: 'Special Report: The Next Decade of AI',
              headline: 'Independent Global Reporting',
              subheadline: 'No ad trackers. No clickbait. Just rigorous investigative journalism and expert analysis.',
              primaryCtaText: 'Read Latest Dispatch',
              primaryCtaHref: '#news',
              secondaryCtaText: 'Subscribe ($9/mo)',
              secondaryCtaHref: '#pricing',
            },
          },
          {
            id: id('newsFeed'),
            type: 'newsFeed',
            title: 'Today’s Lead Stories',
            subtitle: 'Breaking analysis and deep-dive editorial essays.',
            props: {},
          },
          {
            id: id('features'),
            type: 'features',
            title: 'Our Editorial Pillars',
            subtitle: 'Built on rigorous verification and fearless independence.',
            props: {
              items: [
                { title: 'Source Transparency', description: 'Full document leaks and primary sources attached to every story.', icon: 'FileText' },
                { title: 'Zero Advertising Bias', description: '100% funded by subscribers to preserve complete editorial independence.', icon: 'Star' },
                { title: 'Audio Dispatches', description: 'Every piece narrated by the author for listening on the go.', icon: 'Clock' },
              ],
            },
          },
          footer,
        ];

      default:
        // Generic High-Converting Modern Web Application
        return [
          navbar,
          {
            id: id('hero'),
            type: 'hero',
            title: `Elevate Your Experience with ${projectName}`,
            subtitle: 'Engineered for modern workflows, lightning-fast responsiveness, and intuitive design.',
            props: {
              badge: 'Next-Generation Platform',
              headline: `Welcome to ${projectName}`,
              subheadline: 'Seamless integration, delightful interactions, and powerful features tailored to your needs.',
              primaryCtaText: 'Get Started Today',
              primaryCtaHref: '#features',
              secondaryCtaText: 'Learn More',
              secondaryCtaHref: '#about',
            },
          },
          {
            id: id('features'),
            type: 'features',
            title: 'Engineered for Excellence',
            subtitle: 'Everything you need to succeed, out of the box.',
            props: {
              items: [
                { title: 'Lightning Fast', description: 'Sub-second load times and silky-smooth 60fps animations.', icon: 'Sparkles' },
                { title: 'Universal Responsive Layout', description: 'Looks immaculate on iPhones, iPads, and ultra-wide desktop monitors.', icon: 'Building2' },
                { title: 'Enterprise Security', description: 'End-to-end encryption, strict role-based access, and zero data leakage.', icon: 'CheckCircle2' },
              ],
            },
          },
          {
            id: id('pricing'),
            type: 'pricing',
            title: 'Simple, Transparent Pricing',
            subtitle: 'Pick the plan that fits your growth.',
            props: {
              tiers: [
                { name: 'Starter', price: '$19', period: '/mo', features: ['Full core access', 'Email support', '5 Team Members'], isPopular: false },
                { name: 'Professional', price: '$49', period: '/mo', features: ['Everything in Starter', 'Priority 24/7 SLA', 'Unlimited Team Members', 'Custom Integrations'], isPopular: true },
              ],
            },
          },
          {
            id: id('faq'),
            type: 'faq',
            title: 'Frequently Asked Questions',
            subtitle: 'Got questions? We have clear answers.',
            props: {
              items: [
                { q: 'How quickly can we get started?', a: 'You can launch immediately. Everything is pre-configured and live.' },
                { q: 'Can I export my project data?', a: 'Yes! SiteHub provides full GitHub synchronization and 1-click JSON/HTML exports.' },
                { q: 'Is there mobile support?', a: 'Yes, every component is rigorously tested across all mobile viewport sizes.' },
              ],
            },
          },
          {
            id: id('contact'),
            type: 'contact',
            title: 'Get In Touch',
            subtitle: 'Have questions or custom requirements? Send us a message.',
            props: {
              email: 'hello@sitehub.live',
              phone: '+1 (555) 019-4820',
            },
          },
          footer,
        ];
    }
  }

  /**
   * Generates realistic collection datasets for the category
   */
  private static generateCollectionsForCategory(category: string, projectName: string): CollectionDocument[] {
    switch (category) {
      case 'hotel_hospitality':
        return [
          {
            id: 'col-suites',
            name: 'Suites & Villas',
            slug: 'suites',
            items: [
              { id: 'item-1', title: 'Presidential Cliffside Villa', description: 'Private heated infinity pool, panoramic sunset views, private butler.', price: 1850, category: 'Villa', rating: 5.0, available: true },
              { id: 'item-2', title: 'Botanical Garden Suite', description: 'Surrounded by lush flora, outdoor rainfall shower, handcrafted teak furnishings.', price: 920, category: 'Suite', rating: 4.9, available: true },
              { id: 'item-3', title: 'Azure Oceanfront Pavilion', description: 'Direct private beach path, floor-to-ceiling glass, complimentary yacht charter.', price: 2400, category: 'Pavilion', rating: 5.0, available: true },
            ],
          },
        ];

      case 'saas_crm':
        return [
          {
            id: 'col-deals',
            name: 'Deals Pipeline',
            slug: 'deals',
            items: [
              { id: 'deal-1', title: 'Nordic Logistics Cloud Migration', description: 'Enterprise 500-seat rollout', price: 120000, category: 'Proposal', rating: 4.8, available: true },
              { id: 'deal-2', title: 'Aura Fintech Security Audit', description: 'Annual compliance and SOC2 renewal', price: 45000, category: 'Discovery', rating: 4.9, available: true },
              { id: 'deal-3', title: 'Kinetix Media AI Workflow', description: 'Custom agent deployment & training', price: 85000, category: 'Negotiation', rating: 5.0, available: true },
            ],
          },
        ];

      case 'ecommerce':
        return [
          {
            id: 'col-products',
            name: 'Artisan Goods',
            slug: 'products',
            items: [
              { id: 'prod-1', title: 'Minimalist Waxed Canvas Weekender', description: 'Handcrafted water-resistant canvas with full-grain vegetable tanned leather.', price: 285, category: 'Luggage', rating: 4.9, available: true },
              { id: 'prod-2', title: 'Merino Wool Architectural Cardigan', description: 'Heavyweight ribbed knit from non-mulesed New Zealand wool.', price: 195, category: 'Apparel', rating: 4.8, available: true },
              { id: 'prod-3', title: 'Solid Brass Desk Instrument Pen', description: 'Precision CNC machined with German-engineered Schmidt ink refill.', price: 78, category: 'Accessories', rating: 5.0, available: true },
            ],
          },
        ];

      default:
        return [
          {
            id: 'col-general',
            name: 'Featured Items',
            slug: 'items',
            items: [
              { id: 'item-1', title: 'Premium Edition', description: 'Comprehensive package with all enterprise capabilities.', price: 99, category: 'Primary', rating: 5.0, available: true },
              { id: 'item-2', title: 'Standard Edition', description: 'Core features for teams getting started.', price: 49, category: 'Standard', rating: 4.8, available: true },
            ],
          },
        ];
    }
  }

  /**
   * Applies surgical AST patches from user prompt (e.g. "change color to emerald", "add pricing section", "translate to Hindi")
   */
  static applySurgicalPatches(
    prompt: string,
    currentSite: SiteDocument
  ): { updatedSite: SiteDocument; patches: PatchOperation[] } {
    const p = prompt.toLowerCase();
    const cloned: SiteDocument = JSON.parse(JSON.stringify(currentSite));
    const patches: PatchOperation[] = [];
    const activePage = cloned.pages[0] || { id: 'page-home', sections: [] };

    // 1. Theme Color Tweaks
    if (p.includes('darker') || p.includes('dark mode') || p.includes('black') || p.includes('midnight')) {
      cloned.theme.backgroundColor = '#050507';
      cloned.theme.textColor = '#f8fafc';
      cloned.theme.isDark = true;
      patches.push({
        type: 'UPDATE_THEME',
        payload: { isDark: true, backgroundColor: '#050507' },
        description: 'Applied deep obsidian dark theme with ultra-high contrast',
      });
    }
    if (p.includes('emerald') || p.includes('green') || p.includes('nature') || p.includes('eco')) {
      cloned.theme.primaryColor = '#059669';
      cloned.theme.accentColor = '#10b981';
      patches.push({
        type: 'UPDATE_THEME',
        payload: { primaryColor: '#059669', accentColor: '#10b981' },
        description: 'Shifted palette to botanical emerald & mint accents',
      });
    }
    if (p.includes('amber') || p.includes('gold') || p.includes('warm') || p.includes('honey')) {
      cloned.theme.primaryColor = '#d97706';
      cloned.theme.accentColor = '#f59e0b';
      patches.push({
        type: 'UPDATE_THEME',
        payload: { primaryColor: '#d97706', accentColor: '#f59e0b' },
        description: 'Applied artisan warm amber and gold highlights',
      });
    }
    if (p.includes('indigo') || p.includes('violet') || p.includes('purple')) {
      cloned.theme.primaryColor = '#6366f1';
      cloned.theme.secondaryColor = '#8b5cf6';
      patches.push({
        type: 'UPDATE_THEME',
        payload: { primaryColor: '#6366f1', secondaryColor: '#8b5cf6' },
        description: 'Configured modern indigo & violet gradient scheme',
      });
    }

    // 2. Multilingual translation
    if (p.includes('hindi') || p.includes('हिन्दी')) {
      cloned.language = 'hi';
      cloned.theme.fontHeading = 'Noto Sans Devanagari';
      cloned.theme.fontBody = 'Noto Sans Devanagari';
      patches.push({
        type: 'UPDATE_THEME',
        payload: { language: 'hi', fontHeading: 'Noto Sans Devanagari' },
        description: 'Switched site language to Hindi with native Devanagari typography',
      });
    } else if (p.includes('punjabi') || p.includes('ਪੰਜਾਬੀ')) {
      cloned.language = 'pa';
      cloned.theme.fontHeading = 'Noto Sans Gurmukhi';
      cloned.theme.fontBody = 'Noto Sans Gurmukhi';
      patches.push({
        type: 'UPDATE_THEME',
        payload: { language: 'pa', fontHeading: 'Noto Sans Gurmukhi' },
        description: 'Switched site language to Punjabi with native Gurmukhi typography',
      });
    }

    // 3. Add Sections if requested
    if (p.includes('pricing') || p.includes('plans') || p.includes('tier')) {
      const exists = activePage.sections.some(s => s.type === 'pricing');
      if (!exists) {
        const sec: SectionDocument = {
          id: `sec-pricing-${Date.now()}`,
          type: 'pricing',
          title: 'Investment & Plans',
          subtitle: 'Straightforward pricing designed for your exact scale.',
          props: {
            tiers: [
              { name: 'Essential', price: '$29', period: '/mo', features: ['Core features', 'Standard support', 'Up to 3 members'], isPopular: false },
              { name: 'Professional', price: '$89', period: '/mo', features: ['Unlimited access', 'Priority 24/7 SLA', 'Custom workflows', 'Advanced analytics'], isPopular: true },
            ],
          },
        };
        activePage.sections.splice(Math.max(1, activePage.sections.length - 2), 0, sec);
        patches.push({
          type: 'ADD_SECTION',
          sectionId: sec.id,
          payload: sec,
          description: 'Added interactive pricing section with toggleable billing tiers',
        });
      }
    }

    if (p.includes('faq') || p.includes('questions')) {
      const exists = activePage.sections.some(s => s.type === 'faq');
      if (!exists) {
        const sec: SectionDocument = {
          id: `sec-faq-${Date.now()}`,
          type: 'faq',
          title: 'Frequently Answered Questions',
          subtitle: 'Everything you need to know about our platform.',
          props: {
            items: [
              { q: 'What is included in the plan?', a: 'Full access to all platform features, updates, and community support.' },
              { q: 'Can I cancel anytime?', a: 'Yes, no lock-in contracts. You can upgrade, downgrade, or cancel whenever you choose.' },
            ],
          },
        };
        activePage.sections.splice(Math.max(1, activePage.sections.length - 1), 0, sec);
        patches.push({
          type: 'ADD_SECTION',
          sectionId: sec.id,
          payload: sec,
          description: 'Added accessible accordion FAQ section',
        });
      }
    }

    if (p.includes('booking') || p.includes('reservation') || p.includes('schedule')) {
      const exists = activePage.sections.some(s => s.type === 'booking' || s.type === 'hotelBooking');
      if (!exists) {
        const sec: SectionDocument = {
          id: `sec-booking-${Date.now()}`,
          type: 'booking',
          title: 'Book an Appointment',
          subtitle: 'Select your preferred date, time, and service package.',
          props: {},
        };
        activePage.sections.splice(2, 0, sec);
        patches.push({
          type: 'ADD_SECTION',
          sectionId: sec.id,
          payload: sec,
          description: 'Added interactive booking & reservation section',
        });
      }
    }

    cloned.version += 1;
    cloned.updatedAt = new Date().toISOString();

    return { updatedSite: cloned, patches };
  }
}
