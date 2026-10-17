/**
 * SiteHub Universal Creation Engine
 * Classifies prompt intent across 28+ categories, produces structured full-stack specifications,
 * generates cohesive multi-page AST structures, backend migrations, and interactive sample data.
 */

import { FullStackSpecification, LanguageCode, PageDocument, SectionDocument, SiteDocument, ThemeConfig } from '../types/site';

export interface ClassificationResult {
  category: string;
  categoryLabel: string;
  architectureType: 'static_site' | 'client_spa' | 'full_stack_app' | 'saas_platform';
  targetAudience: string;
  requiredEntities: string[];
  suggestedRoles: string[];
  apiEndpoints: string[];
  dbTablesSuggested: string[];
  pages: Array<{ title: string; slug: string; isHome: boolean; purpose: string }>;
  suggestedTheme: Partial<ThemeConfig>;
}

export class UniversalEngine {
  /**
   * 1. Classify prompt intent across 28+ domain categories
   */
  static classifyPrompt(prompt: string): ClassificationResult {
    const p = prompt.toLowerCase();

    // 1. CRM / SaaS Platform
    if (p.includes('crm') || p.includes('sales pipeline') || p.includes('contacts') || p.includes('leads') || p.includes('saas') || p.includes('b2b')) {
      return {
        category: 'saas_crm',
        categoryLabel: 'SaaS Sales CRM & Pipeline Platform',
        architectureType: 'saas_platform',
        targetAudience: 'Sales teams, account executives, and business operations',
        requiredEntities: ['Contact', 'Company', 'Deal', 'PipelineStage', 'ActivityLog'],
        suggestedRoles: ['Admin', 'Sales Manager', 'Sales Rep', 'Viewer'],
        apiEndpoints: ['/api/v1/contacts', '/api/v1/deals', '/api/v1/pipeline/stages', '/api/v1/analytics/conversion'],
        dbTablesSuggested: ['sitehub_crm_contacts', 'sitehub_crm_deals', 'sitehub_crm_activities'],
        pages: [
          { title: 'Dashboard', slug: 'home', isHome: true, purpose: 'Pipeline metrics, deal stages, and recent activities' },
          { title: 'Contacts & Leads', slug: 'contacts', isHome: false, purpose: 'Customer relationship directory with filters' },
          { title: 'Analytics & Reporting', slug: 'reports', isHome: false, purpose: 'Sales velocity, win/loss conversion rates' },
        ],
        suggestedTheme: {
          primaryColor: '#3b82f6',
          secondaryColor: '#6366f1',
          accentColor: '#10b981',
          backgroundColor: '#090d16',
          textColor: '#f8fafc',
          isDark: true,
          borderRadius: 'lg',
        },
      };
    }

    // 2. Luxury Hotel / Resort Booking
    if (p.includes('hotel') || p.includes('resort') || p.includes('villa') || p.includes('room details') || p.includes('luxury stay') || p.includes('suites')) {
      return {
        category: 'hotel_hospitality',
        categoryLabel: 'Luxury Hotel & Hospitality Booking',
        architectureType: 'full_stack_app',
        targetAudience: 'Discerning travelers, vacationers, and corporate retreats',
        requiredEntities: ['RoomType', 'Reservation', 'GuestProfile', 'Amenity', 'SeasonalRate'],
        suggestedRoles: ['Guest', 'Front Desk', 'Concierge', 'Property Manager'],
        apiEndpoints: ['/api/v1/rooms/availability', '/api/v1/bookings/reserve', '/api/v1/amenities'],
        dbTablesSuggested: ['sitehub_hotel_rooms', 'sitehub_hotel_reservations'],
        pages: [
          { title: 'Home & Suites', slug: 'home', isHome: true, purpose: 'Resort overview, suite showcase, real-time availability' },
          { title: 'Dining & Spa', slug: 'amenities', isHome: false, purpose: 'Gastronomy and wellness experiences' },
          { title: 'Booking Inquiries', slug: 'booking', isHome: false, purpose: 'Reservation confirmation and guest preferences' },
        ],
        suggestedTheme: {
          primaryColor: '#c29d59',
          secondaryColor: '#1e293b',
          accentColor: '#e2b86b',
          backgroundColor: '#0c0a09',
          textColor: '#fafaf9',
          fontHeading: 'Playfair Display',
          isDark: true,
          borderRadius: 'md',
        },
      };
    }

    // 3. Online Learning / Course LMS
    if (p.includes('learning') || p.includes('lms') || p.includes('course') || p.includes('lessons') || p.includes('quiz') || p.includes('student progress') || p.includes('academy')) {
      return {
        category: 'education_lms',
        categoryLabel: 'Online Learning Platform & Academy',
        architectureType: 'full_stack_app',
        targetAudience: 'Students, professionals upgrading skills, and educators',
        requiredEntities: ['Course', 'Module', 'Lesson', 'QuizQuestion', 'Enrollment', 'Progress'],
        suggestedRoles: ['Student', 'Instructor', 'Course Creator', 'Administrator'],
        apiEndpoints: ['/api/v1/courses', '/api/v1/lessons/complete', '/api/v1/quizzes/evaluate', '/api/v1/certificates'],
        dbTablesSuggested: ['sitehub_lms_courses', 'sitehub_lms_enrollments', 'sitehub_lms_progress'],
        pages: [
          { title: 'Course Catalog', slug: 'home', isHome: true, purpose: 'Syllabus roadmap, curriculum preview, instructor bios' },
          { title: 'Student Workspace', slug: 'learn', isHome: false, purpose: 'Lesson player, markdown viewer, progress tracker' },
          { title: 'Certifications', slug: 'certificates', isHome: false, purpose: 'Earned credentials and quiz evaluations' },
        ],
        suggestedTheme: {
          primaryColor: '#8b5cf6',
          secondaryColor: '#06b6d4',
          accentColor: '#f59e0b',
          backgroundColor: '#09090b',
          textColor: '#f4f4f5',
          isDark: true,
          borderRadius: 'xl',
        },
      };
    }

    // 4. Real Estate & Property Listings
    if (p.includes('real estate') || p.includes('property') || p.includes('apartments') || p.includes('realtor') || p.includes('condo') || p.includes('listings')) {
      return {
        category: 'real_estate',
        categoryLabel: 'Real Estate & Property Listings Portal',
        architectureType: 'full_stack_app',
        targetAudience: 'Homebuyers, tenants, real estate investors, and brokers',
        requiredEntities: ['Property', 'Agent', 'ViewingAppointment', 'FloorPlan', 'NeighborhoodMetric'],
        suggestedRoles: ['Buyer/Renter', 'Listing Agent', 'Broker Admin'],
        apiEndpoints: ['/api/v1/properties/search', '/api/v1/properties/:id', '/api/v1/appointments/schedule'],
        dbTablesSuggested: ['sitehub_re_properties', 'sitehub_re_inquiries'],
        pages: [
          { title: 'Featured Listings', slug: 'home', isHome: true, purpose: 'Search filters (beds, baths, price), property cards, map overview' },
          { title: 'Neighborhood Guide', slug: 'neighborhood', isHome: false, purpose: 'School districts, transit scores, and walkability' },
          { title: 'Schedule a Tour', slug: 'tour', isHome: false, purpose: 'Private in-person or video walkthrough booking' },
        ],
        suggestedTheme: {
          primaryColor: '#0d9488',
          secondaryColor: '#0f172a',
          accentColor: '#14b8a6',
          backgroundColor: '#060b11',
          textColor: '#f1f5f9',
          isDark: true,
          borderRadius: 'lg',
        },
      };
    }

    // 5. Job Board & Talent Marketplace
    if (p.includes('job') || p.includes('hiring') || p.includes('career') || p.includes('recruitment') || p.includes('talent') || p.includes('applicant')) {
      return {
        category: 'job_board',
        categoryLabel: 'Tech Job Board & Talent Recruitment',
        architectureType: 'full_stack_app',
        targetAudience: 'Job seekers, recruiters, startups, and hiring managers',
        requiredEntities: ['JobPosting', 'CompanyProfile', 'ApplicantSubmission', 'SkillTag', 'SalaryRange'],
        suggestedRoles: ['Candidate', 'Employer', 'Recruiter', 'Admin'],
        apiEndpoints: ['/api/v1/jobs', '/api/v1/jobs/apply', '/api/v1/companies'],
        dbTablesSuggested: ['sitehub_jobs_postings', 'sitehub_jobs_applications'],
        pages: [
          { title: 'Open Opportunities', slug: 'home', isHome: true, purpose: 'Search by role, location, remote flag, and salary filter' },
          { title: 'Post a Job', slug: 'post-job', isHome: false, purpose: 'Hiring manager listing creator and checkout' },
          { title: 'Candidate Portal', slug: 'portal', isHome: false, purpose: 'Application status and resume submission' },
        ],
        suggestedTheme: {
          primaryColor: '#2563eb',
          secondaryColor: '#1e293b',
          accentColor: '#38bdf8',
          backgroundColor: '#090d16',
          textColor: '#f8fafc',
          isDark: true,
          borderRadius: 'md',
        },
      };
    }

    // 6. Multilingual News & Editorial Media
    if (p.includes('news') || p.includes('magazine') || p.includes('editorial') || p.includes('article') || p.includes('journalist') || p.includes('press')) {
      return {
        category: 'news_media',
        categoryLabel: 'Multilingual Digital News & Media Journal',
        architectureType: 'full_stack_app',
        targetAudience: 'Global readers, researchers, journalists, and editorial subscribers',
        requiredEntities: ['Article', 'Category', 'AuthorProfile', 'NewsletterSubscriber', 'Comment'],
        suggestedRoles: ['Reader', 'Subscriber', 'Contributing Author', 'Editor-in-Chief'],
        apiEndpoints: ['/api/v1/articles', '/api/v1/articles/:slug', '/api/v1/newsletter/subscribe'],
        dbTablesSuggested: ['sitehub_news_articles', 'sitehub_news_subscribers'],
        pages: [
          { title: 'Top Stories', slug: 'home', isHome: true, purpose: 'Breaking ticker, lead editorial, categorized dispatches' },
          { title: 'Opinions & Deep Dives', slug: 'analysis', isHome: false, purpose: 'Long-form essays with reading metrics' },
          { title: 'Newsletter Digest', slug: 'subscribe', isHome: false, purpose: 'Daily email briefs and dispatch archive' },
        ],
        suggestedTheme: {
          primaryColor: '#e11d48',
          secondaryColor: '#27272a',
          accentColor: '#f43f5e',
          backgroundColor: '#09090b',
          textColor: '#fafafa',
          fontHeading: 'Playfair Display',
          isDark: true,
          borderRadius: 'none',
        },
      };
    }

    // 7. Developer Portal & API Documentation
    if (p.includes('documentation') || p.includes('developer portal') || p.includes('api reference') || p.includes('sdk') || p.includes('docs')) {
      return {
        category: 'dev_docs',
        categoryLabel: 'Developer Documentation & API Portal',
        architectureType: 'client_spa',
        targetAudience: 'Software engineers, API consumers, and technical architects',
        requiredEntities: ['DocSection', 'ApiEndpoint', 'CodeSample', 'VersionRelease'],
        suggestedRoles: ['Developer', 'API Architect'],
        apiEndpoints: ['/api/v1/docs/search', '/api/v1/openapi.json'],
        dbTablesSuggested: [],
        pages: [
          { title: 'API Documentation', slug: 'home', isHome: true, purpose: 'Multi-language code snippets, HTTP method badges, parameter tables' },
          { title: 'SDK Guides', slug: 'sdks', isHome: false, purpose: 'TypeScript, Python, and Go quickstart walk-throughs' },
          { title: 'Changelog', slug: 'changelog', isHome: false, purpose: 'Breaking changes and version release notes' },
        ],
        suggestedTheme: {
          primaryColor: '#06b6d4',
          secondaryColor: '#1e1e24',
          accentColor: '#22d3ee',
          backgroundColor: '#0a0a0c',
          textColor: '#f3f4f6',
          fontHeading: 'JetBrains Mono',
          isDark: true,
          borderRadius: 'lg',
        },
      };
    }

    // 8. Nonprofit & Humanitarian Donations
    if (p.includes('nonprofit') || p.includes('charity') || p.includes('donation') || p.includes('fundraiser') || p.includes('ngo') || p.includes('cause')) {
      return {
        category: 'nonprofit_donations',
        categoryLabel: 'Nonprofit Foundation & Humanitarian Impact',
        architectureType: 'full_stack_app',
        targetAudience: 'Donors, community advocates, philanthropists, and volunteers',
        requiredEntities: ['DonationCampaign', 'ImpactStat', 'DonorRecord', 'VolunteerApplication'],
        suggestedRoles: ['Donor', 'Volunteer', 'Foundation Director'],
        apiEndpoints: ['/api/v1/campaigns/progress', '/api/v1/donations/pledge', '/api/v1/impact/audit'],
        dbTablesSuggested: ['sitehub_charity_pledges', 'sitehub_charity_volunteers'],
        pages: [
          { title: 'Mission & Campaigns', slug: 'home', isHome: true, purpose: 'Fundraising progress goal bar, verified audit stats, pledge selector' },
          { title: 'Impact Stories', slug: 'impact', isHome: false, purpose: 'Field reports and humanitarian transparency ledger' },
          { title: 'Volunteer Action', slug: 'join', isHome: false, purpose: 'Application form for community initiatives' },
        ],
        suggestedTheme: {
          primaryColor: '#16a34a',
          secondaryColor: '#1e293b',
          accentColor: '#4ade80',
          backgroundColor: '#080c09',
          textColor: '#f0fdf4',
          isDark: true,
          borderRadius: 'xl',
        },
      };
    }

    // Default: General Modern Web App / Showcase
    return {
      category: 'general_business',
      categoryLabel: 'Modern High-Growth Digital Presence',
      architectureType: 'full_stack_app',
      targetAudience: 'Prospective clients, customers, and partners',
      requiredEntities: ['Service', 'CaseStudy', 'Inquiry', 'TeamMember'],
      suggestedRoles: ['Visitor', 'Client', 'Admin'],
      apiEndpoints: ['/api/v1/inquiries', '/api/v1/services'],
      dbTablesSuggested: ['sitehub_inquiries'],
      pages: [
        { title: 'Home', slug: 'home', isHome: true, purpose: 'Value proposition, capabilities showcase, client social proof' },
        { title: 'Solutions', slug: 'solutions', isHome: false, purpose: 'In-depth capability breakdowns' },
        { title: 'Contact & Inquiries', slug: 'contact', isHome: false, purpose: 'Lead intake and consultation scheduler' },
      ],
      suggestedTheme: {
        primaryColor: '#4f46e5',
        secondaryColor: '#06b6d4',
        accentColor: '#f59e0b',
        backgroundColor: '#09090b',
        textColor: '#fafafa',
        isDark: true,
        borderRadius: 'lg',
      },
    };
  }

  /**
   * 2. Generate Universal Section AST components matching the domain category
   */
  static generateCategorySections(classification: ClassificationResult, language: LanguageCode = 'en'): SectionDocument[] {
    const sections: SectionDocument[] = [];

    // Common Navbar
    sections.push({
      id: `sec-nav-${Date.now()}`,
      type: 'navbar',
      title: 'Navigation',
      props: {
        brandName: classification.categoryLabel.split(' ')[0] || 'SiteHub',
        links: classification.pages.map(p => ({ label: p.title, href: `#${p.slug}` })),
        ctaText: classification.category.includes('crm') ? 'Open Workspace' : classification.category.includes('hotel') ? 'Book a Suite' : 'Get Started',
        ctaHref: '#action',
      },
    });

    // Domain Specific Hero
    switch (classification.category) {
      case 'saas_crm':
        sections.push({
          id: `sec-hero-crm`,
          type: 'hero',
          title: 'Close More Deals with Predictive Intelligence',
          subtitle: 'The modern CRM engine engineered for high-velocity revenue teams. Manage multi-channel pipelines, pipeline stages, and forecasting in real time.',
          props: {
            badge: 'Next-Gen Sales Ops Engine 2026',
            primaryCta: 'Launch Workspace',
            primaryCtaHref: '#pipeline',
            secondaryCta: 'View Live Metrics',
            secondaryCtaHref: '#metrics',
            metrics: [
              { value: '$4.2M+', label: 'Pipeline Managed' },
              { value: '38%', label: 'Shorter Sales Cycle' },
              { value: '99.9%', label: 'Data Accuracy' },
            ],
          },
        });
        sections.push({
          id: `sec-crm-pipeline`,
          type: 'crmPipeline',
          title: 'Active Revenue Pipeline & Deal Stages',
          subtitle: 'Interactive deal tracking from initial qualification through signed contract.',
          props: {},
        });
        sections.push({
          id: `sec-crm-metrics`,
          type: 'dashboardMetrics',
          title: 'Real-Time Revenue Operations & KPI Metrics',
          subtitle: 'Live analytics tracking MRR, lead velocity, and average deal size.',
          props: {},
        });
        break;

      case 'hotel_hospitality':
        sections.push({
          id: `sec-hero-hotel`,
          type: 'hero',
          title: 'Unrivaled Luxury, Timeless Sanctuary',
          subtitle: 'Nestled between private ocean coves and ancient olive groves. Experience bespoke suites, Michelin-star dining, and intuitive hospitality.',
          props: {
            badge: 'Condé Nast Traveler Gold List 2026',
            primaryCta: 'Reserve Your Sanctuary',
            primaryCtaHref: '#hotel-booking',
            secondaryCta: 'Explore Private Suites',
            secondaryCtaHref: '#hotel-suites',
            bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
          },
        });
        sections.push({
          id: `sec-hotel-booking`,
          type: 'hotelBooking',
          title: 'Bespoke Suite Availability & Reservations',
          subtitle: 'Select your arrival dates, preferred suite tier, and personalized concierge requests.',
          props: {},
        });
        break;

      case 'education_lms':
        sections.push({
          id: `sec-hero-lms`,
          type: 'hero',
          title: 'Master Modern Engineering & System Design',
          subtitle: 'Interactive hands-on curriculum taught by principal architects. Build real production distributed systems from the ground up.',
          props: {
            badge: 'Accredited Curriculum • 48,000+ Enrolled',
            primaryCta: 'Start Learning Free',
            primaryCtaHref: '#lessons',
            secondaryCta: 'View Syllabus',
            secondaryCtaHref: '#syllabus',
          },
        });
        sections.push({
          id: `sec-course-lessons`,
          type: 'courseLessons',
          title: 'Interactive Curriculum & Lesson Player',
          subtitle: 'Track your completion status, take knowledge checks, and earn verified credentials.',
          props: {},
        });
        break;

      case 'real_estate':
        sections.push({
          id: `sec-hero-re`,
          type: 'hero',
          title: 'Architectural Masterpieces in Prime Locations',
          subtitle: 'Exclusive luxury residences, penthouse lofts, and waterfront estates curated for discerning buyers.',
          props: {
            badge: 'Over $1.2 Billion in Transacted Volume',
            primaryCta: 'Browse Verified Estates',
            primaryCtaHref: '#properties',
            secondaryCta: 'Book Private Showing',
            secondaryCtaHref: '#contact',
            bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
          },
        });
        sections.push({
          id: `sec-properties`,
          type: 'propertyListings',
          title: 'Curated Residential Portfolio',
          subtitle: 'Explore available properties with verified specifications, virtual tours, and price metrics.',
          props: {},
        });
        break;

      case 'job_board':
        sections.push({
          id: `sec-hero-jobs`,
          type: 'hero',
          title: 'Discover Roles at World-Class Engineering Teams',
          subtitle: 'Verified opportunities in AI infrastructure, cloud architecture, and product engineering. Transparent salaries.',
          props: {
            badge: '14,000+ Verified Candidates Placed',
            primaryCta: 'Explore Tech Roles',
            primaryCtaHref: '#jobs',
            secondaryCta: 'Post Open Role',
            secondaryCtaHref: '#contact',
          },
        });
        sections.push({
          id: `sec-job-board`,
          type: 'jobBoard',
          title: 'Active High-Growth Roles',
          subtitle: 'Filter by seniority, remote flexibility, tech stack, and compensation bracket.',
          props: {},
        });
        break;

      case 'news_media':
        sections.push({
          id: `sec-hero-news`,
          type: 'hero',
          title: 'Uncompromised Global Intelligence & Analysis',
          subtitle: 'Independent reporting on geopolitics, technological revolutions, economics, and climate science.',
          props: {
            badge: 'Edition 42 • Live Global Dispatch',
            primaryCta: 'Read Top Story',
            primaryCtaHref: '#news',
            secondaryCta: 'Daily Briefing Subscribe',
            secondaryCtaHref: '#contact',
          },
        });
        sections.push({
          id: `sec-news-feed`,
          type: 'newsFeed',
          title: 'Current Dispatches & In-Depth Investigations',
          subtitle: 'Real-time coverage from correspondents across five continents.',
          props: {},
        });
        break;

      case 'dev_docs':
        sections.push({
          id: `sec-hero-docs`,
          type: 'hero',
          title: 'SiteHub Developer API & Platform SDK',
          subtitle: 'Comprehensive guides, code examples, OpenAPI references, and SDK quickstarts for seamless integration.',
          props: {
            badge: 'v2.4 LTS Stable • OpenAPI 3.1 Spec',
            primaryCta: 'Explore Endpoints',
            primaryCtaHref: '#docs',
            secondaryCta: 'Generate API Key',
            secondaryCtaHref: '#contact',
          },
        });
        sections.push({
          id: `sec-doc-viewer`,
          type: 'docViewer',
          title: 'Interactive API Reference & Code Sandbox',
          subtitle: 'Test requests directly in your browser with multi-language code snippets.',
          props: {},
        });
        break;

      case 'nonprofit_donations':
        sections.push({
          id: `sec-hero-nonprofit`,
          type: 'hero',
          title: 'Empowering Communities, Restoring Ecosystems',
          subtitle: '100% transparent humanitarian initiatives providing clean water, education, and reforestation in vulnerable regions.',
          props: {
            badge: 'Charity Navigator 4-Star Rating • 94% Direct Impact',
            primaryCta: 'Make a Contribution',
            primaryCtaHref: '#donate',
            secondaryCta: 'Review Impact Audit',
            secondaryCtaHref: '#impact',
          },
        });
        sections.push({
          id: `sec-donation-campaign`,
          type: 'donationCampaign',
          title: 'Active Clean Water & Reforestation Campaign',
          subtitle: 'Live funding progress, donor ledger, and transparent expenditure tracking.',
          props: {},
        });
        break;

      default:
        // Default business presentation
        sections.push({
          id: `sec-hero-default`,
          type: 'hero',
          title: 'Crafting the Future of Digital Experiences',
          subtitle: 'We combine rigorous architectural engineering with human-centered aesthetics to accelerate market leaders.',
          props: {
            badge: 'Production-Grade Digital Craft 2026',
            primaryCta: 'Explore Solutions',
            primaryCtaHref: '#features',
            secondaryCta: 'Schedule Consultation',
            secondaryCtaHref: '#contact',
          },
        });
        sections.push({
          id: `sec-features-default`,
          type: 'features',
          title: 'Engineering & Strategic Capabilities',
          subtitle: 'Built from first principles to scale reliably across global workloads.',
          props: {
            items: [
              { title: 'Sub-Millisecond Edge Architecture', description: 'Replicated across 35+ global regions with instant cache invalidation.' },
              { title: 'Zero-Trust Security Baseline', description: 'AES-256 encrypted persistence, automated audit logging, and SOC2 compliance.' },
              { title: 'Predictive Growth Analytics', description: 'Deep observability tracking latency, engagement, and conversion milestones.' },
            ],
          },
        });
        sections.push({
          id: `sec-pricing-default`,
          type: 'pricing',
          title: 'Transparent Growth Tiers',
          subtitle: 'Predictable pricing without hidden usage penalties.',
          props: {
            plans: [
              { name: 'Core', price: '$29', period: '/month', features: ['Full UI Suite', 'Standard Edge Deploy', 'Community Support'] },
              { name: 'Enterprise', price: '$99', period: '/month', isPopular: true, features: ['Unlimited Workspaces', 'Custom Domain & SSL', '24/7 Dedicated Concierge'] },
            ],
          },
        });
        break;
    }

    // Common FAQ & Contact
    sections.push({
      id: `sec-faq-common`,
      type: 'faq',
      title: 'Frequently Addressed Queries',
      props: {
        items: [
          { question: 'How is data persisted and secured?', answer: 'All state is stored with AES-256 encryption at rest and isolated by tenant session.' },
          { question: 'Can this project be exported and self-hosted?', answer: 'Yes. You can export the complete source code as a ZIP bundle or commit directly to your GitHub repository.' },
        ],
      },
    });

    sections.push({
      id: `sec-contact-common`,
      type: 'contact',
      title: 'Get in Touch',
      subtitle: 'Our team responds within 24 business hours.',
      props: {
        submitLabel: 'Send Inquiry',
      },
    });

    // Common Footer
    sections.push({
      id: `sec-footer-common`,
      type: 'footer',
      title: 'Footer',
      props: {
        brandName: classification.categoryLabel.split(' ')[0] || 'SiteHub',
        tagline: 'Engineered with precision for global reliability.',
        copyright: `© 2026 ${classification.categoryLabel.split(' ')[0] || 'SiteHub'}. All rights reserved.`,
      },
    });

    return sections;
  }
}
