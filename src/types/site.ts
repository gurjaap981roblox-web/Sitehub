/**
 * SiteHub Types & AST Schema Definitions
 */

export type LanguageCode = 'en' | 'hi' | 'pa';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export type WorkspaceTab = 'build' | 'code' | 'console' | 'files' | 'secrets' | 'settings';

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadowScale: 'none' | 'sm' | 'md' | 'lg';
  isDark: boolean;
}

export type SectionType =
  | 'navbar'
  | 'hero'
  | 'features'
  | 'showcase'
  | 'menu'
  | 'pricing'
  | 'testimonials'
  | 'booking'
  | 'store'
  | 'faq'
  | 'contact'
  | 'cta'
  | 'footer'
  | 'customCode';

export interface SectionDocument {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  props: Record<string, any>;
  styleOverrides?: {
    backgroundColor?: string;
    textColor?: string;
    paddingY?: 'sm' | 'md' | 'lg' | 'xl';
    backgroundMedia?: string;
  };
  isHidden?: boolean;
}

export interface PageDocument {
  id: string;
  title: string;
  slug: string;
  isHome: boolean;
  seoTitle?: string;
  seoDescription?: string;
  sections: SectionDocument[];
}

export interface CollectionItem {
  id: string;
  title: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  rating?: number;
  available?: boolean;
  metadata?: Record<string, any>;
}

export interface CollectionDocument {
  id: string;
  name: string;
  slug: string;
  items: CollectionItem[];
}

export interface CustomCodeConfig {
  headScript?: string;
  bodyEndScript?: string;
  customCss?: string;
}

export interface SiteEnvVar {
  id: string;
  name: string;
  description?: string;
  isSecret: boolean;
}

export interface SiteDocument {
  id: string;
  name: string;
  slug: string;
  language: LanguageCode;
  title: string;
  description: string;
  favicon?: string;
  theme: ThemeConfig;
  pages: PageDocument[];
  collections: CollectionDocument[];
  customCode?: CustomCodeConfig;
  environmentVars?: SiteEnvVar[];
  systemInstructions?: string;
  pinnedModel?: string;
  version: number;
  updatedAt: string;
  publishedUrl?: string;
  githubRepo?: string;
}

export type PatchType =
  | 'UPDATE_PROPS'
  | 'ADD_SECTION'
  | 'MOVE_SECTION'
  | 'DELETE_SECTION'
  | 'UPDATE_THEME'
  | 'ADD_PAGE'
  | 'DELETE_PAGE'
  | 'UPDATE_SEO'
  | 'UPDATE_CUSTOM_CODE'
  | 'BATCH';

export interface PatchOperation {
  type: PatchType;
  pageId?: string;
  sectionId?: string;
  payload: any;
  description: string;
}

export interface VersionSnapshot {
  id: string;
  name: string;
  timestamp: string;
  author: 'AI' | 'User';
  document: SiteDocument;
}

export type SecretCategory =
  | 'AI key'
  | 'GitHub'
  | 'Database'
  | 'Email'
  | 'Payments'
  | 'Analytics'
  | 'Custom';

export type SecretScope = 'App' | 'Workspace' | 'Project';

export type SecretStatus = 'Working' | 'Failing' | 'Untested';

export interface SecretItem {
  id: string;
  name: string;
  category: SecretCategory;
  scope: SecretScope;
  last4: string;
  status: SecretStatus;
  lastUsedAt?: string;
  note?: string;
  usedBy?: string[];
  createdAt: string;
}

export type ModelRole =
  | 'planner'
  | 'reviewer'
  | 'copywriter'
  | 'builder'
  | 'code-writer'
  | 'fast-helper'
  | 'vision'
  | 'image';

export interface ModelRouteConfig {
  role: ModelRole;
  label: string;
  description: string;
  primaryProvider: string;
  primaryModel: string;
  fallbackChain: Array<{ provider: string; model: string }>;
}

export interface ProviderConfig {
  id: string;
  name: string;
  baseUrl: string;
  secretKeyName: string;
  models: Array<{
    id: string;
    name: string;
    tags: Array<'general' | 'coding' | 'vision' | 'image' | 'fast'>;
  }>;
  status: 'operational' | 'rate_limited' | 'failing' | 'untested';
  callsToday: number;
  lastSuccess?: string;
  latencyMs?: number;
  errorRate: number;
}

export interface UsageRecord {
  id: string;
  timestamp: string;
  role: ModelRole;
  provider: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
  costEstimated: number;
  durationMs: number;
  status: 'success' | 'fallback' | 'failed';
  note?: string;
}

export interface LogEvent {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  source: 'AI' | 'Build' | 'Console' | 'GitHub' | 'System';
  message: string;
  details?: any;
}

export interface FormSubmission {
  id: string;
  formType: 'contact' | 'newsletter' | 'booking' | 'custom';
  data: Record<string, any>;
  createdAt: string;
  status: 'new' | 'reviewed' | 'responded';
}

export interface BookingItem {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface OrderItem {
  id: string;
  items: Array<{ id: string; title: string; price: number; quantity: number }>;
  total: number;
  customerName: string;
  email: string;
  address: string;
  status: 'pending' | 'paid_test' | 'fulfilled';
  createdAt: string;
}

export interface GitHubConnection {
  isConnected: boolean;
  username?: string;
  avatarUrl?: string;
  repoName?: string;
  repoUrl?: string;
  branch: string;
  lastSyncedAt?: string;
  commits: Array<{
    sha: string;
    message: string;
    timestamp: string;
    author: string;
  }>;
}

export interface AppSettings {
  appName: string;
  appMode: 'personal' | 'public';
  isEverythingUnlimited: boolean;
  limits: {
    generationsPerDay: number | null;
    agentStepsPerRun: number | null;
    fixRoundsPerOrder: number | null;
    maxSites: number | null;
    maxPagesPerSite: number | null;
    concurrentBuilds: number | null;
  };
  defaultLanguage: LanguageCode;
  enableLoopProtection: boolean;
}
