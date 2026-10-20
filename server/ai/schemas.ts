/**
 * Zod Schemas for SiteHub AST, AI Generation, and Validation
 */

import { z } from 'zod';

export const SectionTypeSchema = z.enum([
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
]);

export const SectionDocumentSchema = z.object({
  id: z.string(),
  type: SectionTypeSchema,
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
  isHidden: z.boolean().optional(),
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

export const ThemeConfigSchema = z.object({
  primaryColor: z.string().default('#6366f1'),
  secondaryColor: z.string().default('#f59e0b'),
  backgroundColor: z.string().default('#09090b'),
  textColor: z.string().default('#fafaf9'),
  accentColor: z.string().default('#818cf8'),
  fontHeading: z.string().default('Inter'),
  fontBody: z.string().default('Inter'),
  borderRadius: z.enum(['none', 'sm', 'md', 'lg', 'xl', 'full']).default('lg'),
  shadowScale: z.enum(['none', 'sm', 'md', 'lg']).default('md'),
  isDark: z.boolean().default(true),
});

export const SiteDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  language: z.enum(['en', 'hi', 'pa']).default('en'),
  title: z.string(),
  description: z.string(),
  version: z.number().default(1),
  updatedAt: z.string(),
  theme: ThemeConfigSchema,
  pages: z.array(PageDocumentSchema).min(1),
  collections: z.array(z.any()).default([]),
  meta: z
    .object({
      generatedBy: z.string().optional(),
      modelUsed: z.string().optional(),
      promptUsed: z.string().optional(),
      timestamp: z.string().optional(),
    })
    .optional(),
});

export const AiPlanSchema = z.object({
  projectName: z.string(),
  slug: z.string(),
  category: z.string(),
  language: z.enum(['en', 'hi', 'pa']).default('en'),
  headline: z.string(),
  description: z.string(),
  colorPalette: z.object({
    primary: z.string(),
    secondary: z.string(),
    background: z.string(),
    accent: z.string(),
  }),
  targetPages: z.array(
    z.object({
      title: z.string(),
      slug: z.string(),
      isHome: z.boolean(),
      plannedSections: z.array(SectionTypeSchema),
    })
  ),
});

export const SurgicalPatchSchema = z.object({
  type: z.enum(['ADD_SECTION', 'UPDATE_SECTION', 'REMOVE_SECTION', 'UPDATE_THEME', 'UPDATE_COPY', 'BATCH']),
  sectionId: z.string().optional(),
  sectionType: SectionTypeSchema.optional(),
  payload: z.any(),
  description: z.string(),
});
