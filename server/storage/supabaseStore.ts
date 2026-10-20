/**
 * SiteHub Supabase Database & Persistence Client
 * Connects to Supabase project omtpzesyovduuubkosxz for atomic persistence across Render deploys.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface FormSubmissionRecord {
  id: string;
  siteId?: string;
  name?: string;
  email?: string;
  message?: string;
  data: Record<string, any>;
  createdAt: string;
}

export interface BookingRecord {
  id: string;
  siteId?: string;
  date: string;
  time: string;
  guests: string;
  name: string;
  email: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  siteId?: string;
  items: any[];
  total: number;
  customerName?: string;
  customerEmail?: string;
  status: 'paid' | 'pending';
  createdAt: string;
}

export interface DeploymentRecord {
  id: string;
  siteId: string;
  slug: string;
  url: string;
  htmlContent: string;
  siteDocument: any;
  publishedAt: string;
}

export class SupabaseStore {
  private static instance: SupabaseStore;
  private client: SupabaseClient | null = null;
  public isConnected: boolean = false;

  // In-memory fallback if Supabase keys are not yet provided in Render env
  private memoryStore = {
    sessions: new Map<string, any>(),
    githubConnections: new Map<string, any>(),
    secrets: new Map<string, any>(),
    sites: new Map<string, any>(),
    submissions: [] as FormSubmissionRecord[],
    bookings: [] as BookingRecord[],
    orders: [] as OrderRecord[],
    deployments: new Map<string, DeploymentRecord>(),
  };

  private constructor() {
    const supabaseUrl =
      process.env.SUPABASE_URL?.trim() ||
      'https://omtpzesyovduuubkosxz.supabase.co';

    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
      process.env.SUPABASE_ANON_KEY?.trim() ||
      process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

    if (supabaseKey) {
      try {
        this.client = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false },
        });
        this.isConnected = true;
        console.log(`[Supabase Store] Connected to Supabase at ${supabaseUrl}`);
      } catch (err: any) {
        console.warn(`[Supabase Store] Initialization warning: ${err.message}. Using memory fallback.`);
      }
    } else {
      console.warn(`[Supabase Store] SUPABASE_ANON_KEY not set; using local memory store.`);
    }
  }

  static getInstance(): SupabaseStore {
    if (!SupabaseStore.instance) {
      SupabaseStore.instance = new SupabaseStore();
    }
    return SupabaseStore.instance;
  }

  // --- Submissions ---
  async saveSubmission(sub: FormSubmissionRecord): Promise<void> {
    this.memoryStore.submissions.push(sub);
    if (this.client) {
      try {
        await this.client.from('form_submissions').insert([
          {
            id: sub.id,
            site_id: sub.siteId,
            name: sub.name,
            email: sub.email,
            message: sub.message,
            data: sub.data,
            created_at: sub.createdAt,
          },
        ]);
      } catch (err) {
        console.warn('[Supabase] Failed to write form submission:', err);
      }
    }
  }

  // --- Bookings ---
  async saveBooking(booking: BookingRecord): Promise<void> {
    this.memoryStore.bookings.push(booking);
    if (this.client) {
      try {
        await this.client.from('bookings').insert([
          {
            id: booking.id,
            site_id: booking.siteId,
            booking_date: booking.date,
            booking_time: booking.time,
            guests: booking.guests,
            customer_name: booking.name,
            customer_email: booking.email,
            status: booking.status,
            created_at: booking.createdAt,
          },
        ]);
      } catch (err) {
        console.warn('[Supabase] Failed to write booking:', err);
      }
    }
  }

  // --- Orders ---
  async saveOrder(order: OrderRecord): Promise<void> {
    this.memoryStore.orders.push(order);
    if (this.client) {
      try {
        await this.client.from('orders').insert([
          {
            id: order.id,
            site_id: order.siteId,
            items: order.items,
            total: order.total,
            customer_name: order.customerName,
            customer_email: order.customerEmail,
            status: order.status,
            created_at: order.createdAt,
          },
        ]);
      } catch (err) {
        console.warn('[Supabase] Failed to write order:', err);
      }
    }
  }

  // --- Deployments ---
  async saveDeployment(deployment: DeploymentRecord): Promise<void> {
    this.memoryStore.deployments.set(deployment.slug, deployment);
    if (this.client) {
      try {
        await this.client.from('deployments').upsert([
          {
            id: deployment.id,
            site_id: deployment.siteId,
            slug: deployment.slug,
            url: deployment.url,
            html_content: deployment.htmlContent,
            site_document: deployment.siteDocument,
            published_at: deployment.publishedAt,
          },
        ]);
      } catch (err) {
        console.warn('[Supabase] Failed to write deployment:', err);
      }
    }
  }

  async getDeployment(slug: string): Promise<DeploymentRecord | null> {
    if (this.client) {
      try {
        const { data } = await this.client
          .from('deployments')
          .select('*')
          .eq('slug', slug)
          .single();
        if (data) {
          return {
            id: data.id,
            siteId: data.site_id,
            slug: data.slug,
            url: data.url,
            htmlContent: data.html_content,
            siteDocument: data.site_document,
            publishedAt: data.published_at,
          };
        }
      } catch {
        // Fall back to memory
      }
    }
    return this.memoryStore.deployments.get(slug) || null;
  }
}

export const supabaseStore = SupabaseStore.getInstance();
