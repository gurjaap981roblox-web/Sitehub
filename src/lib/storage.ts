import {
  AppSettings,
  BookingItem,
  FormSubmission,
  GitHubConnection,
  LogEvent,
  ModelRouteConfig,
  OrderItem,
  ProviderConfig,
  SecretItem,
  SiteDocument,
  UsageRecord,
  VersionSnapshot,
} from '../types/site';
import { STARTER_TEMPLATES } from './templates';

const STORAGE_KEYS = {
  SETTINGS: 'sitehub_app_settings_v1',
  SITES: 'sitehub_sites_v1',
  ACTIVE_SITE_ID: 'sitehub_active_site_id_v1',
  SECRETS: 'sitehub_encrypted_secrets_v1',
  PROVIDERS: 'sitehub_providers_v1',
  ROUTES: 'sitehub_model_routes_v1',
  USAGE: 'sitehub_usage_history_v1',
  LOGS: 'sitehub_logs_v1',
  GITHUB: 'sitehub_github_conn_v1',
  SUBMISSIONS: 'sitehub_form_submissions_v1',
  BOOKINGS: 'sitehub_bookings_v1',
  ORDERS: 'sitehub_orders_v1',
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  appName: 'SiteHub',
  appMode: 'personal',
  isEverythingUnlimited: true,
  limits: {
    generationsPerDay: null,
    agentStepsPerRun: null,
    fixRoundsPerOrder: null,
    maxSites: null,
    maxPagesPerSite: null,
    concurrentBuilds: null,
  },
  defaultLanguage: 'en',
  enableLoopProtection: true,
};

export const DEFAULT_PROVIDERS: ProviderConfig[] = [
  {
    id: 'kira-general',
    name: 'kiraai.vn General',
    baseUrl: 'https://api.kiraai.vn/v1',
    secretKeyName: 'KIRA_API_KEY',
    models: [
      { id: 'kira-general-strong', name: 'Kira General Strong', tags: ['general'] },
      { id: 'kira-general-fast', name: 'Kira General Fast', tags: ['general', 'fast'] },
      { id: 'kira-vision', name: 'Kira Vision 4K', tags: ['vision'] },
      { id: 'kira-image', name: 'Kira Image Gen', tags: ['image'] },
    ],
    status: 'operational',
    callsToday: 14,
    latencyMs: 420,
    errorRate: 0.0,
    lastSuccess: new Date().toISOString(),
  },
  {
    id: 'kira-coding',
    name: 'kiraai.vn Coding',
    baseUrl: 'https://api.kiraai.vn/v1',
    secretKeyName: 'KIRA_CODE_API_KEY',
    models: [
      { id: 'deepseek-v4.1-flash', name: 'DeepSeek V4.1 Flash', tags: ['coding', 'fast'] },
      { id: 'glm-5.1', name: 'GLM 5.1 (Stronger)', tags: ['coding'] },
    ],
    status: 'operational',
    callsToday: 38,
    latencyMs: 310,
    errorRate: 0.0,
    lastSuccess: new Date().toISOString(),
  },
  {
    id: 'nemotron-ultra',
    name: 'Nemotron 3 Ultra',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    secretKeyName: 'NEMOTRON_API_KEY',
    models: [
      { id: 'nvidia/nemotron-3-ultra', name: 'Nemotron 3 Ultra 70B', tags: ['general'] },
    ],
    status: 'operational',
    callsToday: 8,
    latencyMs: 580,
    errorRate: 0.0,
    lastSuccess: new Date().toISOString(),
  },
  {
    id: 'mock-provider',
    name: 'Built-in Mock AI (Free / Offline)',
    baseUrl: 'internal://mock-ai',
    secretKeyName: 'NONE_REQUIRED',
    models: [
      { id: 'mock-smart-builder', name: 'Mock Smart Builder v2', tags: ['general', 'coding', 'fast'] },
    ],
    status: 'operational',
    callsToday: 42,
    latencyMs: 150,
    errorRate: 0.0,
    lastSuccess: new Date().toISOString(),
  },
];

export const DEFAULT_MODEL_ROUTES: ModelRouteConfig[] = [
  {
    role: 'planner',
    label: 'Planner & Architect',
    description: 'Generates comprehensive site architecture, layout maps, and feature plans.',
    primaryProvider: 'nemotron-ultra',
    primaryModel: 'nvidia/nemotron-3-ultra',
    fallbackChain: [
      { provider: 'kira-general', model: 'kira-general-strong' },
      { provider: 'kira-coding', model: 'glm-5.1' },
      { provider: 'mock-provider', model: 'mock-smart-builder' },
    ],
  },
  {
    role: 'reviewer',
    label: 'Reviewer & Auditor',
    description: 'Audits responsive layouts, accessibility, contrast, and performance.',
    primaryProvider: 'nemotron-ultra',
    primaryModel: 'nvidia/nemotron-3-ultra',
    fallbackChain: [
      { provider: 'kira-general', model: 'kira-general-strong' },
      { provider: 'kira-coding', model: 'glm-5.1' },
      { provider: 'mock-provider', model: 'mock-smart-builder' },
    ],
  },
  {
    role: 'copywriter',
    label: 'Copywriter & Translator',
    description: 'Generates marketing copy, headlines, and Hindi / Punjabi translations.',
    primaryProvider: 'kira-general',
    primaryModel: 'kira-general-strong',
    fallbackChain: [
      { provider: 'nemotron-ultra', model: 'nvidia/nemotron-3-ultra' },
      { provider: 'kira-general', model: 'kira-general-fast' },
      { provider: 'mock-provider', model: 'mock-smart-builder' },
    ],
  },
  {
    role: 'builder',
    label: 'Builder (Site AST & Patches)',
    description: 'Generates structured JSON AST nodes and surgical document patches.',
    primaryProvider: 'kira-coding',
    primaryModel: 'deepseek-v4.1-flash',
    fallbackChain: [
      { provider: 'kira-coding', model: 'glm-5.1' },
      { provider: 'kira-general', model: 'kira-general-strong' },
      { provider: 'mock-provider', model: 'mock-smart-builder' },
    ],
  },
  {
    role: 'code-writer',
    label: 'Code-Writer & Code-Fixer',
    description: 'Writes clean TSX, Tailwind CSS, custom blocks, and fixes browser console errors.',
    primaryProvider: 'kira-coding',
    primaryModel: 'deepseek-v4.1-flash',
    fallbackChain: [
      { provider: 'kira-coding', model: 'glm-5.1' },
      { provider: 'kira-general', model: 'kira-general-strong' },
      { provider: 'mock-provider', model: 'mock-smart-builder' },
    ],
  },
  {
    role: 'fast-helper',
    label: 'Fast Helper (Micro-Edits)',
    description: 'Single-sentence tweaks, renames, style token shifts, and quick checks.',
    primaryProvider: 'kira-general',
    primaryModel: 'kira-general-fast',
    fallbackChain: [
      { provider: 'kira-coding', model: 'deepseek-v4.1-flash' },
      { provider: 'mock-provider', model: 'mock-smart-builder' },
    ],
  },
  {
    role: 'vision',
    label: 'Vision & Reference Analysis',
    description: 'Analyzes design screenshots and layout inspirations.',
    primaryProvider: 'kira-general',
    primaryModel: 'kira-vision',
    fallbackChain: [
      { provider: 'kira-general', model: 'kira-general-strong' },
      { provider: 'mock-provider', model: 'mock-smart-builder' },
    ],
  },
  {
    role: 'image',
    label: 'Image Generator',
    description: 'Creates custom illustrations or falls back to curated Unsplash placeholders.',
    primaryProvider: 'kira-general',
    primaryModel: 'kira-image',
    fallbackChain: [
      { provider: 'mock-provider', model: 'mock-smart-builder' },
    ],
  },
];

export const INITIAL_SECRETS: SecretItem[] = [
  {
    id: 'sec-kira-gen',
    name: 'KIRA_API_KEY',
    category: 'AI key',
    scope: 'App',
    last4: '89f2',
    status: 'Untested',
    note: 'KiraAI General Key for planner, copywriting and translation',
    usedBy: ['kiraai.vn General Provider', 'Copywriter', 'Planner'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sec-kira-code',
    name: 'KIRA_CODE_API_KEY',
    category: 'AI key',
    scope: 'App',
    last4: 'd4c1',
    status: 'Untested',
    note: 'KiraAI Coding Key for DeepSeek V4.1 Flash and GLM 5.1',
    usedBy: ['kiraai.vn Coding Provider', 'Builder', 'Code Studio'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sec-nemotron',
    name: 'NEMOTRON_API_KEY',
    category: 'AI key',
    scope: 'App',
    last4: 'a71b',
    status: 'Untested',
    note: 'NVIDIA Nemotron 3 Ultra for second-opinion planning and reviews',
    usedBy: ['Nemotron 3 Ultra Provider'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sec-github',
    name: 'GITHUB_ACCESS_TOKEN',
    category: 'GitHub',
    scope: 'Workspace',
    last4: '990e',
    status: 'Working',
    note: 'Automated repository creation and commit sync token',
    usedBy: ['GitHub Sync Engine'],
    createdAt: new Date().toISOString(),
  },
];

// Local Storage helpers with memory cache
export class StorageService {
  private static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage set failed', e);
    }
  }

  static getAppSettings(): AppSettings {
    return this.get<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_APP_SETTINGS);
  }

  static setAppSettings(settings: AppSettings): void {
    this.set(STORAGE_KEYS.SETTINGS, settings);
  }

  static getSites(): SiteDocument[] {
    const list = this.get<SiteDocument[]>(STORAGE_KEYS.SITES, []);
    if (list.length === 0) {
      this.set(STORAGE_KEYS.SITES, STARTER_TEMPLATES);
      return STARTER_TEMPLATES;
    }
    return list;
  }

  static saveSite(site: SiteDocument): void {
    const sites = this.getSites();
    const index = sites.findIndex(s => s.id === site.id);
    if (index >= 0) {
      sites[index] = { ...site, updatedAt: new Date().toISOString() };
    } else {
      sites.unshift({ ...site, updatedAt: new Date().toISOString() });
    }
    this.set(STORAGE_KEYS.SITES, sites);
  }

  static deleteSite(id: string): void {
    const sites = this.getSites().filter(s => s.id !== id);
    this.set(STORAGE_KEYS.SITES, sites);
  }

  static getActiveSiteId(): string {
    return this.get<string>(STORAGE_KEYS.ACTIVE_SITE_ID, STARTER_TEMPLATES[0].id);
  }

  static setActiveSiteId(id: string): void {
    this.set(STORAGE_KEYS.ACTIVE_SITE_ID, id);
  }

  static getSecrets(): SecretItem[] {
    return this.get<SecretItem[]>(STORAGE_KEYS.SECRETS, INITIAL_SECRETS);
  }

  static saveSecrets(secrets: SecretItem[]): void {
    this.set(STORAGE_KEYS.SECRETS, secrets);
  }

  static getProviders(): ProviderConfig[] {
    return this.get<ProviderConfig[]>(STORAGE_KEYS.PROVIDERS, DEFAULT_PROVIDERS);
  }

  static saveProviders(providers: ProviderConfig[]): void {
    this.set(STORAGE_KEYS.PROVIDERS, providers);
  }

  static getModelRoutes(): ModelRouteConfig[] {
    return this.get<ModelRouteConfig[]>(STORAGE_KEYS.ROUTES, DEFAULT_MODEL_ROUTES);
  }

  static saveModelRoutes(routes: ModelRouteConfig[]): void {
    this.set(STORAGE_KEYS.ROUTES, routes);
  }

  static getUsageRecords(): UsageRecord[] {
    return this.get<UsageRecord[]>(STORAGE_KEYS.USAGE, []);
  }

  static recordUsage(record: UsageRecord): void {
    const records = this.getUsageRecords();
    records.unshift(record);
    if (records.length > 500) records.length = 500;
    this.set(STORAGE_KEYS.USAGE, records);
  }

  static getLogs(): LogEvent[] {
    return this.get<LogEvent[]>(STORAGE_KEYS.LOGS, [
      {
        id: 'log-1',
        timestamp: new Date().toLocaleTimeString(),
        level: 'info',
        source: 'System',
        message: 'SiteHub initialized with 3 AI provider slots and Mock engine.',
      },
    ]);
  }

  static addLog(event: Omit<LogEvent, 'id' | 'timestamp'>): void {
    const logs = this.getLogs();
    logs.unshift({
      ...event,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
    });
    if (logs.length > 300) logs.length = 300;
    this.set(STORAGE_KEYS.LOGS, logs);
  }

  static clearLogs(): void {
    this.set(STORAGE_KEYS.LOGS, []);
  }

  static getGitHubConnection(): GitHubConnection {
    return this.get<GitHubConnection>(STORAGE_KEYS.GITHUB, {
      isConnected: false,
      branch: 'main',
      commits: [
        {
          sha: 'init-c87a2',
          message: 'feat: initial site structure from template',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          author: 'SiteHub AI',
        },
      ],
    });
  }

  static setGitHubConnection(conn: GitHubConnection): void {
    this.set(STORAGE_KEYS.GITHUB, conn);
  }

  static getSubmissions(): FormSubmission[] {
    return this.get<FormSubmission[]>(STORAGE_KEYS.SUBMISSIONS, []);
  }

  static addSubmission(sub: Omit<FormSubmission, 'id' | 'createdAt' | 'status'>): void {
    const list = this.getSubmissions();
    list.unshift({
      ...sub,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    });
    this.set(STORAGE_KEYS.SUBMISSIONS, list);
  }

  static getBookings(): BookingItem[] {
    return this.get<BookingItem[]>(STORAGE_KEYS.BOOKINGS, []);
  }

  static addBooking(booking: Omit<BookingItem, 'id' | 'createdAt' | 'status'>): void {
    const list = this.getBookings();
    list.unshift({
      ...booking,
      id: `bk-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    });
    this.set(STORAGE_KEYS.BOOKINGS, list);
  }

  static getOrders(): OrderItem[] {
    return this.get<OrderItem[]>(STORAGE_KEYS.ORDERS, []);
  }

  static addOrder(order: Omit<OrderItem, 'id' | 'createdAt' | 'status'>): void {
    const list = this.getOrders();
    list.unshift({
      ...order,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'paid_test',
    });
    this.set(STORAGE_KEYS.ORDERS, list);
  }
}
