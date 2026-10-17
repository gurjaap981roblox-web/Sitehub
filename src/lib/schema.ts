import { z } from 'zod';

export const ThemeConfigSchema = z.object({
  primaryColor: z.string().default('#4f46e5'),
  secondaryColor: z.string().default('#06b6d4'),
  backgroundColor: z.string().default('#09090b'),
  textColor: z.string().default('#f4f4f5'),
  accentColor: z.string().default('#f59e0b'),
  fontHeading: z.string().default('Inter'),
  fontBody: z.string().default('Inter'),
  borderRadius: z.enum(['none', 'sm', 'md', 'lg', 'full']).default('md'),
  shadowScale: z.enum(['none', 'sm', 'md', 'lg']).default('md'),
  isDark: z.boolean().default(true),
});

export const SectionDocumentSchema = z.object({
  id: z.string(),
  type: z.enum([
    'navbar',
    'hero',
    'features',
    'showcase',
    'menu',
    'pricing',
    'testimonials',
    'booking',
    'store',
    'faq',
    'contact',
    'cta',
    'footer',
    'customCode',
    'dashboardMetrics',
    'crmPipeline',
    'hotelBooking',
    'courseLessons',
    'propertyListings',
    'jobBoard',
    'communityFeed',
    'docViewer',
    'donationCampaign',
    'marketplaceServices',
    'newsFeed',
  ]),
  title: z.string(),
  subtitle: z.string().optional(),
  props: z.record(z.string(), z.any()).default({}),
  styleOverrides: z
    .object({
      backgroundColor: z.string().optional(),
      textColor: z.string().optional(),
      paddingY: z.enum(['sm', 'md', 'lg', 'xl']).optional(),
      backgroundMedia: z.string().optional(),
    })
    .optional(),
  isHidden: z.boolean().optional().default(false),
});

export const PageDocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  isHome: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  sections: z.array(SectionDocumentSchema).default([]),
});

export const CollectionItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  price: z.number().optional(),
  category: z.string().optional(),
  image: z.string().optional(),
  rating: z.number().optional(),
  available: z.boolean().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const CollectionDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  items: z.array(CollectionItemSchema).default([]),
});

export const SiteDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  language: z.enum(['en', 'hi', 'pa']).default('en'),
  title: z.string(),
  description: z.string(),
  favicon: z.string().optional(),
  theme: ThemeConfigSchema,
  pages: z.array(PageDocumentSchema).min(1),
  collections: z.array(CollectionDocumentSchema).default([]),
  customCode: z
    .object({
      headScript: z.string().optional(),
      bodyEndScript: z.string().optional(),
      customCss: z.string().optional(),
    })
    .optional(),
  systemInstructions: z.string().optional(),
  pinnedModel: z.string().optional(),
  version: z.number().default(1),
  updatedAt: z.string(),
});

export const PatchOperationSchema = z.object({
  type: z.enum([
    'UPDATE_PROPS',
    'ADD_SECTION',
    'MOVE_SECTION',
    'DELETE_SECTION',
    'UPDATE_THEME',
    'ADD_PAGE',
    'DELETE_PAGE',
    'UPDATE_SEO',
    'UPDATE_CUSTOM_CODE',
    'BATCH',
  ]),
  pageId: z.string().optional(),
  sectionId: z.string().optional(),
  payload: z.any(),
  description: z.string(),
});

export function validateSiteDocument(data: unknown) {
  return SiteDocumentSchema.safeParse(data);
}

export function validatePatchOperation(data: unknown) {
  return PatchOperationSchema.safeParse(data);
}
